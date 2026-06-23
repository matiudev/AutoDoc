import useDocumentoStore from "@/features/documentos/store/useDocumentoStore";
import useMantencionStore from "@/features/mantenciones/store/useMantencionStore";
import useVehiculoStore from "@/features/vehiculos/store/useVehiculoStore";
import { useMemo } from "react";
import { evaluarDocumento, evaluarMantencion, RANGO_URGENCIA } from "../utils/calcularAlertas";

export default function useAlertas(vehiculoId) {
    const documentos = useDocumentoStore((s => s.documentos))
    const mantenciones = useMantencionStore((s => s.mantenciones))
    const kmActual = useVehiculoStore(s => s.vehiculos.find(v => v.id === vehiculoId)?.km_actual ?? 0);

    return useMemo(() => {
        const hoy = new Date()
        const porUrgencia = (a, b) => RANGO_URGENCIA[a.alerta.urgencia] - RANGO_URGENCIA[b.alerta.urgencia];

        const documentosPorVencer = documentos.filter(d => d.vehiculo_id === vehiculoId).map(d => ({ documento: d, alerta: evaluarDocumento(d, hoy) })).filter(x => x.alerta).sort(porUrgencia);
        const mantencionesPorVencer = mantenciones.filter(m => m.vehiculo_id === vehiculoId).map(m => ({ mantencion: m, alerta: evaluarMantencion(m, kmActual)})).filter(x => x.alerta).sort(porUrgencia);

        return { documentosPorVencer, mantencionesPorVencer };
    }, [documentos, mantenciones, vehiculoId, kmActual])
}