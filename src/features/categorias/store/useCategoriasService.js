import useAuthStore from "@/features/auth/store/useAuthStore";
import { create } from "zustand";
import { fetchCategoriasPredefinidas } from "../services/categoriasService";

const useCategoriasService = create((set, get) => ({
    categorias_predefinidas: [],

    fetchCategoriasPredefinidas: async () => {
        const user = useAuthStore.getState().user;

        if (!user) {
            throw new Error("Usuario no autenticado");
        }

        const data = await fetchCategoriasPredefinidas()        

        set({ categorias_predefinidas: data })
    },
}))

export default useCategoriasService