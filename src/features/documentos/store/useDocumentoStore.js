import { create } from 'zustand';

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

const useDocumentoStore = create((set) => ({
  documentos: [],
  loading: false,
  error: null,

  fetchDocumentos: async (vehiculoId) => {
    // Local state — no async operation needed
  },

  agregarDocumento: ({ vehiculoId, tipo, nombre, fechaEmision, fechaVencimiento, uri, fileName, mimeType, notas }) => {
    const archivo_tipo = mimeType === 'application/pdf' ? 'pdf' : 'imagen';
    const data = {
      id: uid(),
      vehiculo_id: vehiculoId,
      tipo,
      nombre,
      fecha_emision: fechaEmision ?? null,
      fecha_vencimiento: fechaVencimiento ?? null,
      archivo_url: uri,
      archivo_tipo,
      notas: notas ?? null,
      created_at: new Date().toISOString(),
    };
    set((state) => ({ documentos: [data, ...state.documentos] }));
    return data;
  },

  editarDocumento: (id, cambios, nuevoArchivoInfo) => {
    let updateData = { ...cambios };
    if (nuevoArchivoInfo) {
      const { uri, mimeType } = nuevoArchivoInfo;
      updateData.archivo_url = uri;
      updateData.archivo_tipo = mimeType === 'application/pdf' ? 'pdf' : 'imagen';
    }
    let updated;
    set((state) => {
      const documentos = state.documentos.map((d) => {
        if (d.id === id) {
          updated = { ...d, ...updateData };
          return updated;
        }
        return d;
      });
      return { documentos };
    });
    return updated;
  },

  borrarDocumento: (id) => {
    set((state) => ({
      documentos: state.documentos.filter((d) => d.id !== id),
    }));
  },

  reset: () => set({ documentos: [], loading: false, error: null }),
}));

export default useDocumentoStore;
