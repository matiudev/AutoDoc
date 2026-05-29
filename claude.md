# AutoDoc — Especificación del Proyecto

> Documento generado tras entrevista estructurada. Todo lo aquí escrito fue acordado explícitamente.

---

## 1. Problema y Usuario

| Campo | Detalle |
|---|---|
| **Usuario** | Propietario personal, uso individual |
| **Problema principal** | No saber dónde está un documento cuando se necesita y olvidar mantenciones hasta que algo falla o llega una multa |
| **Objetivo** | Centralizar documentos del vehículo con alertas proactivas de vencimiento y mantenciones |
| **Alcance de vehículos** | Multi-vehículo (uno activo a la vez, se cambia desde Perfil) |

---

## 2. Features

### V1 — Indispensable

- Registrar múltiples vehículos
- Adjuntar documentos (foto con cámara o PDF desde galería/archivos)
- Fechas de vencimiento con alertas en 3 niveles (30 / 7 / 3 días antes)
- Registrar mantenciones vinculadas a categorías predefinidas + personalizadas
- Alertas de mantención por fecha y por kilometraje (500 km antes del umbral)
- Notificaciones push via Supabase Edge Functions + Expo
- Dashboard con resumen del vehículo activo
- Google Sign-In como único método de autenticación

### V2 — Puede esperar

- Estadísticas y gráficos de gastos
- Exportar historial en PDF
- Fotos de daños del vehículo
- Versión web

### Casos borde resueltos

| Situación | Comportamiento acordado |
|---|---|
| Documento sin fecha de vencimiento | Se guarda sin alerta. Fecha es opcional. |
| Mantención con solo fecha o solo km | Ambos campos son opcionales e independientes. El que se cumpla primero dispara la alerta. |
| Reemplazar archivo adjunto | Se sube uno nuevo, el anterior se elimina automáticamente. |
| Sin documentos/mantenciones por vencer | Dashboard muestra mensaje positivo: "Podés manejar tranquilo, sin preocupaciones" con ícono verde. |

---

## 3. Entidades del Dominio

### Usuario
```javascript
{
  id: uuid,                 // Supabase Auth uid
  email: string,
  nombre: string | null,
  expo_push_token: string,  // Se registra al abrir la app
  created_at: timestamptz
}
```

### Vehiculo
```javascript
{
  id: uuid,
  user_id: uuid,            // dueño (Supabase Auth)
  nombre_alias: string,     // "Mi Hilux"
  patente: string,
  marca: string,
  modelo: string,
  anio: integer,
  color: string | null,
  km_actual: integer,       // Se actualiza al registrar mantenciones
  foto_url: string | null,
  created_at: timestamptz
}
```

### Documento
```javascript
{
  id: uuid,
  vehiculo_id: uuid,
  tipo: 'seguro' | 'revision_tecnica' | 'permiso_circulacion'
      | 'garantia' | 'factura' | 'otro',
  nombre: string,
  fecha_emision: date | null,
  fecha_vencimiento: date | null,   // null = sin alerta
  archivo_url: string,              // Supabase Storage
  archivo_tipo: 'pdf' | 'imagen',
  notas: string | null,
  created_at: timestamptz
}
```

### Categoria_Mantencion
```javascript
{
  id: uuid,
  nombre: string,           // "Aceite de motor", "Frenos", etc.
  lucide_icon: string,      // nombre del icono, ej: "Droplets"
  intervalo_km: integer | null,
  intervalo_dias: integer | null,
  descripcion: string | null,
  es_predefinida: boolean,  // false = creada por el usuario
  user_id: uuid | null      // null si es predefinida del sistema
}
```

### Mantencion
```javascript
{
  id: uuid,
  vehiculo_id: uuid,
  categoria_id: uuid,       // relación con Categoria_Mantencion
  descripcion: string | null,
  fecha_realizada: date,
  km_al_realizar: integer,
  costo: numeric | null,
  taller: string | null,
  notas: string | null,
  // Próxima alerta — pre-completada desde categoría, editable
  proxima_fecha: date | null,
  proximos_km: integer | null,
  created_at: timestamptz
}
```

### Alerta
```javascript
{
  id: uuid,
  vehiculo_id: uuid,
  tipo_origen: 'documento' | 'mantencion',
  origen_id: uuid,
  tipo_alerta: '30_dias' | '7_dias' | '3_dias' | '500_km',
  fecha_programada: date,
  enviada: boolean,
  descartada: boolean,
  created_at: timestamptz
}
```

---

## 4. Stack Técnico

| Capa | Tecnología | Justificación |
|---|---|---|
| **Framework** | React Native + Expo | Mobile-first, acceso a cámara y notificaciones |
| **Lenguaje** | JavaScript | Familiaridad del desarrollador |
| **Navegación** | React Navigation | Probado, flexible, familiar |
| **Estado global** | Zustand | Sin boilerplate, liviano, suficiente para el dominio |
| **Estilos** | NativeWind (Tailwind) | Velocidad de maquetación, consistencia |
| **Auth** | Supabase Auth + Google Sign-In | 2 taps para entrar, sin contraseñas |
| **Base de datos** | Supabase (PostgreSQL) | RLS nativo, ecosistema completo |
| **Archivos** | Supabase Storage | PDFs e imágenes, integrado con Supabase |
| **Notificaciones** | Supabase Edge Functions + Expo Push | Edge Function envía, Expo recibe en el dispositivo |
| **Jobs programados** | Supabase pg_cron + Edge Functions | Job diario que revisa vencimientos y dispara notificaciones. Costo: $0 en capa gratuita. |
| **Animaciones** | react-native-reanimated | Slider de confirmación, animaciones de entrada |
| **Gestos** | react-native-gesture-handler | Swipe y slider |
| **Iconos** | lucide-react-native | Iconos de categorías predefinidas y UI general |

### Librerías de apoyo

```
expo-camera              # Escaneo de documentos
expo-document-picker     # Subir PDFs desde archivos
expo-notifications       # Token push y notificaciones locales
react-native-pdf         # Visor de PDF en app
@supabase/supabase-js    # Cliente oficial de Supabase
```

### Estructura de carpetas

```
src/
  features/
    auth/
      screens/
        LoginScreen.jsx
      store/
        useAuthStore.js
      services/
        authService.js

    vehiculos/
      components/
        VehiculoCard.jsx
        VehiculoForm.jsx
        VehiculoSelector.jsx
      screens/
        EditarVehiculoScreen.jsx   # navegación interna, no tab
      store/
        useVehiculoStore.js
      services/
        vehiculosService.js

    documentos/
      components/
        DocumentoCard.jsx
        DocumentoForm.jsx
        DocumentoViewer.jsx
      screens/
        AgregarDocumentoScreen.jsx
        EditarDocumentoScreen.jsx
      store/
        useDocumentoStore.js
      services/
        documentosService.js

    mantenciones/
      components/
        MantencionCard.jsx
        MantencionForm.jsx
      screens/
        AgregarMantencionScreen.jsx
        EditarMantencionScreen.jsx
      store/
        useMantencionStore.js
      services/
        mantencionesService.js

    alertas/
      components/
        AlertaBadge.jsx
        AlertaItem.jsx
      store/
        useAlertaStore.js
      services/
        alertasService.js

  screens/                         # Solo las tabs principales del navbar
    DashboardScreen.jsx
    DocumentosScreen.jsx
    MantencionesScreen.jsx
    PerfilScreen.jsx

  components/                      # UI genérico sin dueño de feature
    ui/                            # Button, Card, Input, Toast, Skeleton
    shared/                        # Header, EmptyState, LoadingSpinner, SliderConfirm

  navigation/
    RootStack.jsx
    TabNavigator.jsx

  services/
    supabase.js                    # Config y cliente Supabase
    storage.js                     # Upload/delete archivos
    notifications.js               # Token, permisos, scheduling

  constants/
    categorias.js
    colores.js

  theme/
    theme.js
    ThemeContext.js
    useTheme.js
```

### Configuración de Supabase

```javascript
// services/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})
```

### Store principal — ejemplo con Zustand

```javascript
// stores/useVehiculoStore.js
// features/vehiculos/store/useVehiculoStore.js
import { create } from 'zustand'
import { supabase } from '../../../services/supabase'

const useVehiculoStore = create((set, get) => ({
  vehiculos: [],
  vehiculoActivo: null,
  loading: false,
  error: null,

  fetchVehiculos: async (userId) => {
    set({ loading: true, error: null })
    const { data, error } = await supabase
      .from('vehiculos')
      .select('*')
      .eq('user_id', userId)

    if (error) return set({ error: error.message, loading: false })

    set({ vehiculos: data, loading: false })
    if (!get().vehiculoActivo && data.length > 0) {
      set({ vehiculoActivo: data[0] })
    }
  },

  setVehiculoActivo: (vehiculo) => set({ vehiculoActivo: vehiculo }),

  actualizarKm: async (vehiculoId, km_actual) => {
    const { error } = await supabase
      .from('vehiculos')
      .update({ km_actual })
      .eq('id', vehiculoId)

    if (error) return set({ error: error.message })

    set(state => ({
      vehiculos: state.vehiculos.map(v =>
        v.id === vehiculoId ? { ...v, km_actual } : v
      )
    }))
  },
}))

export default useVehiculoStore
```

---

## 5. Diseño y Experiencia

### Paleta de colores

| Token | Hex | Uso |
|---|---|---|
| `bg-base` | `#08080C` | Fondo principal de la app |
| `bg-surface` | `#101014` | Cards, modales |
| `bg-elevated` | `#18181F` | Inputs, bottom sheets |
| `border-default` | `#1C1C24` | Bordes de cards y separadores |
| `border-active` | `#7C3AED` | Borde de elemento seleccionado/activo |
| `accent` | `#7C3AED` | Botón CTA, tab activo, badge, iconos activos |
| `accent-soft` | `#A78BFA` | Textos de acento, labels secundarios |
| `success` | `#22C55E` | Documentos vigentes, estado OK |
| `warning` | `#F59E0B` | Vence pronto (7-30 días) |
| `danger` | `#EF4444` | Vencido o a 3 días |
| `text-primary` | `#F1F1F3` | Texto principal |
| `text-secondary` | `#71717A` | Subtítulos, metadata |
| `gradient-hero` | `#7C3AED → #4F46E5` | Solo en header de dashboard |

> **Regla de uso del purple**: aparece únicamente en botón CTA, tab activo, borde de card seleccionada, badge de alerta, y dot de notificación. Ningún componente tiene fondo morado.

### Reglas de UX (duras, no deseos)

1. **Máximo 4 taps** desde el dashboard hasta guardar una mantención o documento nuevo.
2. **Skeleton loader siempre** antes de mostrar listas — nunca pantalla en blanco.
3. **Confirmación destructiva por slider** estilo wallet crypto (react-native-reanimated) — eliminar vehículo, documento o mantención requiere deslizar de izquierda a derecha. Si no completa el recorrido, vuelve solo.
4. **Toast informativo** en confirmación de éxito, error y avisos (componente propio ya existente).
5. **Haptic feedback** al guardar exitosamente y al completar el slider de confirmación.
6. **Archivos**: solo PDF e imágenes (JPG, PNG). Límite: 10 MB por archivo. Un archivo por documento.
7. **Estado vacío con personalidad**: cuando no hay alertas pendientes, mostrar "Podés manejar tranquilo, sin preocupaciones" con ícono verde — nunca una pantalla vacía sin mensaje.

### Micro-interacciones

| Momento | Interacción |
|---|---|
| Cargar listas | Skeleton loaders animados |
| Entrada de cards | Fade + translateY sutil con react-native-reanimated |
| Eliminar item | Slider de confirmación estilo crypto wallet |
| Guardar exitosamente | Haptic feedback + Toast de éxito |
| Alerta urgente (≤3 días o vencido) | Badge pulsante |
| Tab activo | Borde/ícono en `#7C3AED` |

### Navegación — Tab Bar inferior

| Tab | Ícono Lucide | Contenido |
|---|---|---|
| Dashboard | `Home` | Vehículo activo + km, próximos vencimientos (top 3), próximas mantenciones (top 3), últimas actividades |
| Documentos | `FileText` | Lista de documentos del vehículo activo |
| Mantenciones | `Wrench` | Historial y registro de mantenciones |
| Perfil | `User` | Cambiar vehículo activo, gestionar vehículos, categorías personalizadas, configuración, logout |

> **Selector rápido de vehículo**: el header del Dashboard muestra el vehículo activo con un chevron. Al tocarlo, abre un bottom sheet con la lista de autos sin necesidad de ir a Perfil.

---

## 6. Notificaciones Push

### Esquema de alertas por niveles

| Tipo | Niveles |
|---|---|
| Documentos (vencimiento) | 30 días antes · 7 días antes · 3 días antes |
| Mantenciones (fecha) | 30 días antes · 7 días antes · 3 días antes |
| Mantenciones (km) | 500 km antes del umbral definido |

### Arquitectura

- **pg_cron (Supabase)**: job diario que recorre la tabla `alertas` con `enviada = false` y `fecha_programada <= hoy`, llama a una Edge Function y marca `enviada = true`.
- **Supabase Edge Function**: recibe las alertas pendientes, consulta el `expo_push_token` del usuario y envía la notificación via Expo Push API.
- **Expo push token**: se registra en la tabla `usuarios` al abrir la app.
- **Costo estimado**: ~30 invocaciones/mes → capa gratuita de Supabase. $0.

### Ejemplo de Edge Function (Deno)

```typescript
// supabase/functions/send-alerts/index.ts
import { serve } from "https://deno.land/std/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js"

serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const hoy = new Date().toISOString().split('T')[0]

  const { data: alertas } = await supabase
    .from('alertas')
    .select('*, vehiculos(user_id, usuarios(expo_push_token))')
    .eq('enviada', false)
    .eq('descartada', false)
    .lte('fecha_programada', hoy)

  for (const alerta of alertas ?? []) {
    const token = alerta.vehiculos?.usuarios?.expo_push_token
    if (!token) continue

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: token,
        title: 'AutoDoc',
        body: `Alerta: ${alerta.tipo_alerta}`,
        data: { origen_id: alerta.origen_id }
      })
    })

    await supabase
      .from('alertas')
      .update({ enviada: true })
      .eq('id', alerta.id)
  }

  return new Response('ok')
})
```

---

## 7. Categorías Predefinidas

```javascript
// constants/categorias.js
export const CATEGORIAS_PREDEFINIDAS = [
  { id: 'aceite',        nombre: 'Aceite de motor',        lucide_icon: 'Droplets',       intervalo_km: 5000,  intervalo_dias: 180  },
  { id: 'frenos',        nombre: 'Frenos',                 lucide_icon: 'CircleStop',     intervalo_km: 20000, intervalo_dias: null },
  { id: 'discos',        nombre: 'Discos de freno',        lucide_icon: 'Disc',           intervalo_km: 40000, intervalo_dias: null },
  { id: 'neumaticos',    nombre: 'Neumáticos',             lucide_icon: 'Circle',         intervalo_km: 40000, intervalo_dias: null },
  { id: 'correa',        nombre: 'Correa de distribución', lucide_icon: 'Link',           intervalo_km: 60000, intervalo_dias: null },
  { id: 'filtro_aire',   nombre: 'Filtro de aire',         lucide_icon: 'Wind',           intervalo_km: 15000, intervalo_dias: 365  },
  { id: 'filtro_aceite', nombre: 'Filtro de aceite',       lucide_icon: 'Filter',         intervalo_km: 5000,  intervalo_dias: 180  },
  { id: 'liquido_frenos',nombre: 'Líquido de frenos',      lucide_icon: 'Beaker',         intervalo_km: null,  intervalo_dias: 730  },
  { id: 'refrigerante',  nombre: 'Refrigerante',           lucide_icon: 'Thermometer',    intervalo_km: null,  intervalo_dias: 730  },
  { id: 'bateria',       nombre: 'Batería',                lucide_icon: 'Battery',        intervalo_km: null,  intervalo_dias: 1460 },
  { id: 'bujias',        nombre: 'Bujías',                 lucide_icon: 'Zap',            intervalo_km: 30000, intervalo_dias: null },
  { id: 'suspension',    nombre: 'Suspensión',             lucide_icon: 'ArrowUpDown',    intervalo_km: 50000, intervalo_dias: null },
  { id: 'revision',      nombre: 'Revisión general',       lucide_icon: 'ClipboardCheck', intervalo_km: null,  intervalo_dias: 365  },
  { id: 'otro',          nombre: 'Otro',                   lucide_icon: 'Wrench',         intervalo_km: null,  intervalo_dias: null },
]
```

---

## 8. Definición de Éxito

| # | Métrica | Cómo se mide |
|---|---|---|
| 1 | **Cero vencimientos sorpresa** | Ningún documento vence sin haber recibido al menos la alerta de 7 días antes |
| 2 | **Registro en menos de 60 segundos** | Tiempo medido desde abrir la app hasta guardar una mantención nueva |
| 3 | **Apertura de notificaciones** | La app se abre dentro de las 24hs de recibir una notificación push de alerta |

---

## 9. Restricciones y Límites

| Restricción | Valor |
|---|---|
| Formatos de archivo | PDF, JPG, PNG |
| Tamaño máximo por archivo | 10 MB |
| Archivos por documento | 1 (reemplazable) |
| Taps máximos para registrar | 4 desde el dashboard |
| Plataforma objetivo V1 | iOS y Android (Expo) |
| Web | V2 |

---