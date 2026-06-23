import useAuthStore from '@/features/auth/store/useAuthStore';
import { create } from 'zustand';
import { addMantencion, deleteMantencion, fetchMantenciones, updateMantencion } from '../services/mantencionesService';
import useVehiculoStore from '@/features/vehiculos/store/useVehiculoStore';

const useMantencionStore = create((set, get) => ({
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
    const data = await addMantencion({ ...mantencion, vehiculo_id: vehiculoActivo.id })

    set((state) => ({ mantenciones: [...state.mantenciones, data] }))
  },

  editarMantencion: async (mantencion_id, cambios) => {
    const user = useAuthStore.getState().user

    if (!user) {
      throw new Error("Usuario no autenticado");
    }

    const mantencionUpdate = get().mantenciones.map((mantencion) => mantencion.id === mantencion_id ? { ...mantencion, ...cambios } : mantencion);
    await updateMantencion(mantencion_id, cambios)

    set({ mantenciones: mantencionUpdate });
  },

  borrarMantencion: async (id) => {
    await deleteMantencion(id)
    set((state) => ({
      mantenciones: state.mantenciones.filter((m) => m.id !== id),
    }));
  },

  reset: () => set({ mantenciones: [], loading: false, error: null }),
}));

export default useMantencionStore;
