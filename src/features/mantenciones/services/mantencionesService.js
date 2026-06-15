import { supabase } from "@/services/supabase"

export const fetchMantenciones = async (vehiculoId) => {
    const { data, error } = await supabase.from('mantenciones').select('*').eq('vehiculo_id', vehiculoId);
    if (error) throw error
    return data
}

export const addMantencion = async (mantencion) => {
    const { data, error } = await supabase.from('mantenciones').insert(mantencion).select().single()
    if (error) throw error
    return data
}

export const updateMantencion = async (mantencion_id, cambios) => {
    const { data, error } = await supabase.from('mantenciones').update(cambios).eq('id', mantencion_id).select().single()
    if (error) throw error
    return data
}

export const deleteMantencion = async (mantencion_id) => {
    const { error } = await supabase.from('mantenciones').delete().eq('id', mantencion_id)
    if (error) throw error
}