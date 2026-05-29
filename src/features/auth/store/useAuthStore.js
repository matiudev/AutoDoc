import { create } from 'zustand';
import { supabase } from '../../../services/supabase';
import { signIn, signUp, signOut } from '../services/authService';
import { registerForPushNotifications } from '../../../services/notifications';

const useAuthStore = create((set) => ({
  user: null,
  session: null,
  loading: true,
  error: null,

  initialize: async () => {
    set({ loading: true });
    const { data: { session } } = await supabase.auth.getSession();
    set({ session, user: session?.user ?? null, loading: false });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null });
    });
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await signIn(email, password);
      await registerForPushNotifications(data.user.id);
      set({ session: data.session, user: data.user, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  register: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await signUp(email, password);
      // Si no hay sesión, Supabase requiere confirmación de email.
      // No metemos al usuario a la app sin sesión activa.
      if (data.session) {
        await registerForPushNotifications(data.user.id);
        set({ session: data.session, user: data.user, loading: false });
      } else {
        set({ session: null, user: null, loading: false });
      }
      return data;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  logout: async () => {
    set({ loading: true });
    await signOut();
    set({ user: null, session: null, loading: false });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
