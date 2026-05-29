// store/useClientesStore.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Objeto cliente: { id, nombre }

export const useClientesStore = create(
  persist(
    (set, get) => ({
      clientes: [],

      addCliente: (cliente) =>
        set((state) => ({ clientes: [...state.clientes, { ...cliente, id: state.clientes.length + 1 },] })),

      removeCliente: (id) =>
        set((state) => ({
          clientes: state.clientes.filter((c) => c.id !== id),
        })),

      getClienteById: (id) =>
        get().clientes.find((c) => c.id === id),

      removeAllClientes: () => set({ clientes: [] }),
    }),
    {
      name: "clientes-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
