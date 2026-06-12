import { create } from 'zustand';
import { addVehiculo, deleteVehiculo, fetchVehiculos, updateVehiculo } from '../services/vehiculosService';
import useAuthStore from '@/features/auth/store/useAuthStore';

const useVehiculoStore = create((set, get) => ({
  vehiculos: [],
  vehiculoActivo: null,
  loading: false,
  error: null,

  fetchVehiculos: async () => {
    const user = useAuthStore.getState().user;

    if (!user) {
      throw new Error("Usuario no autenticado");
    }

    const data = await fetchVehiculos(user.id)

    set({ vehiculos: data })
    if (!get().vehiculoActivo && data.length > 0) set({ vehiculoActivo: data[0] })
  },

  setVehiculoActivo: (vehiculo) => set({ vehiculoActivo: vehiculo }),

  agregarVehiculo: async (vehiculo) => {
    const user = useAuthStore.getState().user;

    if (!user) {
      throw new Error("Usuario no autenticado");
    }

    const nuevo_vehiculo = await addVehiculo({ ...vehiculo, user_id: user.id });

    set((state) => ({ vehiculos: [nuevo_vehiculo, ...state.vehiculos] }));
    if (!get().vehiculoActivo) set({ vehiculoActivo: nuevo_vehiculo });
  },

  updateVehiculo: async (vehiculo_id, cambios) => {
    const user = useAuthStore.getState().user;

    if (!user) {
      throw new Error("Usuario no autenticado");
    }

    const vehiculoUpdate = get().vehiculos.map((vehiculo) => vehiculo_id === vehiculo.id ? { ...vehiculo, ...cambios } : vehiculo);
    await updateVehiculo(vehiculo_id, cambios)

    set((state) => ({
      vehiculos: vehiculoUpdate,
      vehiculoActivo: state.vehiculoActivo?.id === vehiculo_id
        ? { ...state.vehiculoActivo, ...cambios }
        : state.vehiculoActivo,
    }));
  },

  borrarVehiculo: async (id) => {
    await deleteVehiculo(id);

    set(s => {
      const vehiculos = s.vehiculos.filter(v => v.id !== id);
      return {
        vehiculos,
        vehiculoActivo: s.vehiculoActivo?.id === id ? (vehiculos[0] ?? null) : s.vehiculoActivo,
      };
    });
  },

  actualizarKm: (vehiculoId, km_actual) => {
    set((state) => ({
      vehiculos: state.vehiculos.map((v) =>
        v.id === vehiculoId ? { ...v, km_actual } : v
      ),
      vehiculoActivo:
        state.vehiculoActivo?.id === vehiculoId
          ? { ...state.vehiculoActivo, km_actual }
          : state.vehiculoActivo,
    }));
  },
}));

export default useVehiculoStore;
