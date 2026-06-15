import useAuthStore from '@/features/auth/store/useAuthStore';
import { create } from 'zustand';
import { addDocumento, deleteDocumento, fetchDocumentos, updateDocumento } from '../service/documentosService';
import { deleteArchivoDocumento, uploadDocumento } from '@/services/storage';

const useDocumentoStore = create((set, get) => ({
  documentos: [],
  loading: false,
  error: null,

  fetchDocumentos: async (vehiculoId) => {
    const user = useAuthStore.getState().user
    if (!user) throw new Error("Usuario no autenticado");

    const data = await fetchDocumentos(vehiculoId)
    set({ documentos: data })
  },

  agregarDocumento: async ({ vehiculoId, tipo, nombre, fechaEmision, fechaVencimiento, uri, fileName, mimeType, notas }) => {
    const user = useAuthStore.getState().user
    if (!user) throw new Error("Usuario no autenticado");

    const path = await uploadDocumento({ uri, mimeType, fileName, userId: user.id, vehiculoId })

    const data = await addDocumento({
      vehiculo_id: vehiculoId,
      tipo,
      nombre,
      fecha_emision: fechaEmision ?? null,
      fecha_vencimiento: fechaVencimiento ?? null,
      archivo_url: path,
      archivo_tipo: mimeType === 'application/pdf' ? 'pdf' : 'imagen',
      notas: notas ?? null,
    });

    set((state) => ({ documentos: [data, ...state.documentos] }));
    return data;
  },

  editarDocumento: async (id, cambios, nuevoArchivoInfo) => {
    const user = useAuthStore.getState().user
    let updateData = { ...cambios };

    if (nuevoArchivoInfo) {
      const docActual = get().documentos.find((d) => d.id === id)

      if (docActual?.archivo_url) await deleteArchivoDocumento(docActual.archivo_url)

      const path = await uploadDocumento({
        uri: nuevoArchivoInfo.uri,
        mimeType: nuevoArchivoInfo.mimeType,
        fileName: nuevoArchivoInfo.name,
        userId: user.id,
        vehiculoId: docActual.vehiculo_id,
      })

      updateData.archivo_url = path
      updateData.archivo_tipo = nuevoArchivoInfo.mimeType === 'application/pdf' ? 'pdf' : 'imagen'
    }

    const data = await updateDocumento(id, updateData)
    set((state) => ({
      documentos: state.documentos.map((d) => d.id === id ? data : d),
    }));
    return data;
  },

  borrarDocumento: async (id) => {
    const doc = get().documentos.find((d) => d.id === id)
    if (doc?.archivo_url) await deleteArchivoDocumento(doc.archivo_url)

    await deleteDocumento(id)
    set((state) => ({
      documentos: state.documentos.filter((d) => d.id !== id),
    }));
  },

  reset: () => set({ documentos: [], loading: false, error: null }),
}));

export default useDocumentoStore;
