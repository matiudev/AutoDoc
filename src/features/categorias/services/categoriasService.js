import { supabase } from "@/services/supabase"

export const fetchCategoriasPredefinidas = async () => {
    const { data, error } = await supabase.from('categoria_mantencion').select('*')
    if (error) throw error
    return data
}