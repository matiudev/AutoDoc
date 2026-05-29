import { create } from 'zustand';

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

const useMantencionStore = create((set) => ({
  mantenciones: [],
  loading: false,
  error: null,

  fetchMantenciones: async (vehiculoId) => {
    // Local state — no async operation needed
  },

  agregarMantencion: (mantencion) => {
    const data = { id: uid(), created_at: new Date().toISOString(), ...mantencion };
    set((state) => ({ mantenciones: [data, ...state.mantenciones] }));
    return data;
  },

  editarMantencion: (id, cambios) => {
    let updated;
    set((state) => {
      const mantenciones = state.mantenciones.map((m) => {
        if (m.id === id) {
          updated = { ...m, ...cambios };
          return updated;
        }
        return m;
      });
      return { mantenciones };
    });
    return updated;
  },

  borrarMantencion: (id) => {
    set((state) => ({
      mantenciones: state.mantenciones.filter((m) => m.id !== id),
    }));
  },

  reset: () => set({ mantenciones: [], loading: false, error: null }),
}));

export default useMantencionStore;
