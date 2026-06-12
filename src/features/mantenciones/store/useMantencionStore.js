import useAuthStore from '@/features/auth/store/useAuthStore';
import { create } from 'zustand';
import { addMantencion, fetchMantenciones } from '../services/mantencionesService';
import useVehiculoStore from '@/features/vehiculos/store/useVehiculoStore';

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

const useMantencionStore = create((set) => ({
  mantenciones: [],
  loading: false,
  error: null,

  fetchMantenciones: async (vehiculoId) => {
    const user = useAuthStore.getState().user

    if (!user) {
      throw new Error("Usuario no autenticado");
    }

    const data = await fetchMantenciones(vehiculoId)

    set({ mantenciones: data })
  },

  addMantencion: async (mantencion) => {
    const user = useAuthStore.getState().user

    if (!user) {
      throw new Error("Usuario no autenticado");
    }

    const vehiculoActivo = useVehiculoStore.getState().vehiculoActivo
    const data = await addMantencion({...mantencion, vehiculo_id: vehiculoActivo.id})

    set((state) => ({ mantenciones: [...state.mantenciones, data]}))
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
