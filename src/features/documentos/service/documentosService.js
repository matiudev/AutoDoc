import { supabase } from "@/services/supabase"

export const fetchDocumentos = async (vehiculoId) => {
    const { data, error } = await supabase.from('documentos').select('*').eq('vehiculo_id', vehiculoId);
    if (error) throw error
    return data
}

export const addDocumento = async (documento) => {
    const { data, error } = await supabase.from('documentos').insert(documento).select().single()
    if (error) throw error
    return data
}

export const updateDocumento = async (id, cambios) => {
    const { data, error } = await supabase.from('documentos').update(cambios).eq('id', id).select().single()
    if (error) throw error
    return data
}

export const deleteDocumento = async (id) => {
    const { error } = await supabase.from('documentos').delete().eq('id', id)
    if (error) throw error
}
