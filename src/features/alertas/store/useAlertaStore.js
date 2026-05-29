import { create } from 'zustand';
import useDocumentoStore from '../../documentos/store/useDocumentoStore';
import useMantencionStore from '../../mantenciones/store/useMantencionStore';

const useAlertaStore = create((set, get) => ({
  alertas: [],
  proximosVencimientos: [],
  proximasMantenciones: [],
  descartadas: [],
  loading: false,
  error: null,

  fetchTodo: (vehiculoId) => {
    set({ loading: true, error: null });

    const documentos = useDocumentoStore.getState().documentos;
    const mantenciones = useMantencionStore.getState().mantenciones;
    const { descartadas } = get();

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const hoyStr = hoy.toISOString().split('T')[0];
    const en30Str = new Date(hoy.getTime() + 30 * 86400000).toISOString().split('T')[0];

    const proximosVencimientos = documentos
      .filter((d) => d.vehiculo_id === vehiculoId && d.fecha_vencimiento && d.fecha_vencimiento <= en30Str)
      .sort((a, b) => a.fecha_vencimiento.localeCompare(b.fecha_vencimiento))
      .slice(0, 3);

    const proximasMantenciones = mantenciones
      .filter((m) => m.vehiculo_id === vehiculoId && m.proxima_fecha && m.proxima_fecha >= hoyStr)
      .sort((a, b) => a.proxima_fecha.localeCompare(b.proxima_fecha))
      .slice(0, 3);

    const docAlertas = documentos
      .filter((d) => d.vehiculo_id === vehiculoId && d.fecha_vencimiento)
      .flatMap((d) =>
        [30, 7, 3].map((dias) => {
          const fechaAlerta = new Date(d.fecha_vencimiento);
          fechaAlerta.setDate(fechaAlerta.getDate() - dias);
          const fechaStr = fechaAlerta.toISOString().split('T')[0];
          return {
            id: `doc-${d.id}-${dias}`,
            vehiculo_id: vehiculoId,
            tipo_origen: 'documento',
            origen_id: d.id,
            tipo_alerta: `${dias}_dias`,
            fecha_programada: fechaStr,
            nombre: d.nombre,
          };
        })
      )
      .filter((a) => a.fecha_programada <= hoyStr && !descartadas.includes(a.id));

    const mantAlertas = mantenciones
      .filter((m) => m.vehiculo_id === vehiculoId && m.proxima_fecha)
      .flatMap((m) =>
        [30, 7, 3].map((dias) => {
          const fechaAlerta = new Date(m.proxima_fecha);
          fechaAlerta.setDate(fechaAlerta.getDate() - dias);
          const fechaStr = fechaAlerta.toISOString().split('T')[0];
          return {
            id: `mant-${m.id}-${dias}`,
            vehiculo_id: vehiculoId,
            tipo_origen: 'mantencion',
            origen_id: m.id,
            tipo_alerta: `${dias}_dias`,
            fecha_programada: fechaStr,
            nombre: m.categoria?.nombre ?? 'Mantención',
          };
        })
      )
      .filter((a) => a.fecha_programada <= hoyStr && !descartadas.includes(a.id));

    set({
      alertas: [...docAlertas, ...mantAlertas],
      proximosVencimientos,
      proximasMantenciones,
      loading: false,
    });
  },

  descartar: (id) => {
    set((state) => ({
      alertas: state.alertas.filter((a) => a.id !== id),
      descartadas: [...state.descartadas, id],
    }));
  },

  reset: () => set({
    alertas: [],
    proximosVencimientos: [],
    proximasMantenciones: [],
    descartadas: [],
    loading: false,
  }),
}));

export default useAlertaStore;
