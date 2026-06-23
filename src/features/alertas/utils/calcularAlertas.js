export function evaluarDocumento(documento, hoy) {
    if (!documento.fecha_vencimiento) return null

    const vencimiento = new Date(documento.fecha_vencimiento)
    const dias = Math.ceil((vencimiento - hoy) / 86400000)

    if (dias < 0) return { urgencia: 'vencido', dias }
    if (dias <= 3) return { urgencia: '3', dias }
    if (dias <= 7) return { urgencia: '7', dias }
    if (dias <= 30) return { urgencia: '30', dias }

    return null
}

function evaluarMantencionPorFecha(mantencion, hoy) {
    if (!mantencion.proxima_fecha) return null

    const vencimiento = new Date(mantencion.proxima_fecha)
    const dias = Math.ceil((vencimiento - hoy) / 86400000)

    if (dias < 0) return { urgencia: 'vencido', dias }
    if (dias <= 3) return { urgencia: '3', dias }
    if (dias <= 7) return { urgencia: '7', dias }
    if (dias <= 30) return { urgencia: '30', dias }

    return null
}

function evaluarMantencionPorKm(mantencion, kmActual) {
    if (mantencion.proximos_km == null) return null

    const kmRestantes = mantencion.proximos_km - kmActual

    if (kmRestantes < 0) return { urgencia: 'vencido', kmRestantes }
    if (kmRestantes <= 500) return { urgencia: 'urgente', kmRestantes }
    if (kmRestantes <= 1500) return { urgencia: 'atencion', kmRestantes }

    return null
}

export const RANGO_URGENCIA = { vencido: 0, '3': 1, urgente: 1, '7': 2, atencion: 2, '30': 3 }

export function evaluarMantencion(mantencion, kmActual) {
    const porFecha = evaluarMantencionPorFecha(mantencion, new Date())
    const porKm = evaluarMantencionPorKm(mantencion, kmActual)

    if (!porFecha) return porKm
    if (!porKm) return porFecha

    return RANGO_URGENCIA[porKm.urgencia] <= RANGO_URGENCIA[porFecha.urgencia] ? porKm : porFecha
}