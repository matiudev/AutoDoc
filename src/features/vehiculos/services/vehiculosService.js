import { supabase } from '@/services/supabase';

export const fetchVehiculos = async (userId) => {
  const { data, error } = await supabase.from('vehiculos').select('*').eq('user_id', userId);
  if (error) throw error;
  return data;
};
export const addVehiculo = async (vehiculo) => {
  const { data, error } = await supabase.from('vehiculos').insert(vehiculo).select().single();
  if (error) throw error;
  return data;
};

export const updateVehiculo = async (vehiculo_id, cambios) => {
  const { data, error } = await supabase.from('vehiculos').update(cambios).eq('id', vehiculo_id).select().single();
  if (error) throw error;
  return data;
};

export const deleteVehiculo = async (id) => {
  const { error } = await supabase.from('vehiculos').delete().eq('id', id);
  if (error) throw error;
};