import { create } from 'zustand';

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

const useVehiculoStore = create((set, get) => ({
  vehiculos: [],
  vehiculoActivo: null,
  loading: false,
  error: null,

  fetchVehiculos: async () => {
    const { vehiculos, vehiculoActivo } = get();
    if (!vehiculoActivo && vehiculos.length > 0) {
      set({ vehiculoActivo: vehiculos[0] });
    }
  },

  setVehiculoActivo: (vehiculo) => set({ vehiculoActivo: vehiculo }),

  agregarVehiculo: (vehiculo) => {
    const data = { id: uid(), created_at: new Date().toISOString(), ...vehiculo };
    set((state) => ({ vehiculos: [data, ...state.vehiculos] }));
    if (!get().vehiculoActivo) set({ vehiculoActivo: data });
    return data;
  },

  editarVehiculo: (id, cambios) => {
    let updated;
    set((state) => {
      const vehiculos = state.vehiculos.map((v) => {
        if (v.id === id) {
          updated = { ...v, ...cambios };
          return updated;
        }
        return v;
      });
      return {
        vehiculos,
        vehiculoActivo: state.vehiculoActivo?.id === id ? updated : state.vehiculoActivo,
      };
    });
    return updated;
  },

  borrarVehiculo: (id) => {
    set((state) => {
      const vehiculos = state.vehiculos.filter((v) => v.id !== id);
      const vehiculoActivo =
        state.vehiculoActivo?.id === id ? (vehiculos[0] ?? null) : state.vehiculoActivo;
      return { vehiculos, vehiculoActivo };
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
