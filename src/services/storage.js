import * as FileSystem from 'expo-file-system/legacy'
import { supabase } from './supabase'

export const uploadDocumento = async ({ uri, mimeType, fileName, userId, vehiculoId }) => {
  const ext = mimeType === 'application/pdf' ? 'pdf' : (fileName?.split('.').pop() ?? 'jpg')
  const path = `${userId}/${vehiculoId}/${Date.now()}.${ext}`

  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: 'base64',
  })

  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  const { error } = await supabase.storage
    .from('documentos')
    .upload(path, bytes, { contentType: mimeType })

  if (error) throw error
  return path
}

export const getSignedUrl = async (path) => {
  const { data, error } = await supabase.storage
    .from('documentos')
    .createSignedUrl(path, 60 * 60) // 1 hora
  if (error) throw error
  return data.signedUrl
}

export const deleteArchivoDocumento = async (path) => {
  const { error } = await supabase.storage.from('documentos').remove([path])
  if (error) throw error
}
