# 🚗 AutoDoc

> App móvil para centralizar documentos y mantenciones de vehículos con alertas proactivas de vencimiento.

---

## 📖 Descripción

AutoDoc resuelve el problema de no saber dónde está un documento cuando se necesita y olvidar mantenciones hasta que algo falla o llega una multa. Permite al propietario registrar múltiples vehículos, adjuntar documentos con fechas de vencimiento y llevar un historial de mantenciones con alertas por fecha y por kilometraje.

El sistema de notificaciones push corre en Supabase (pg_cron + Edge Functions) y envía alertas en 3 niveles (30 / 7 / 3 días antes del vencimiento) sin costo adicional en la capa gratuita de Supabase.

---

## ✨ Características Principales

### 🗂️ Gestión de Documentos
- Adjuntar documentos por foto con cámara o PDF desde archivos
- Tipos: seguro, revisión técnica, permiso de circulación, garantía, factura y otros
- Fechas de vencimiento opcionales con alertas en 3 niveles (30 / 7 / 3 días)
- Reemplazo de archivos adjuntos con eliminación automática del anterior

### 🔧 Mantenciones
- Registro vinculado a 14 categorías predefinidas + categorías personalizadas
- Alertas por fecha y por kilometraje (500 km antes del umbral)
- Historial con costo, taller, km al realizar y notas
- Próxima alerta pre-completada desde la categoría, editable

### 🚘 Multi-Vehículo
- Registro de múltiples vehículos con foto, patente, marca, modelo y km actual
- Vehículo activo seleccionable desde el Dashboard (bottom sheet) o desde Perfil
- Km actualizados automáticamente al registrar cada mantención

### 🔔 Notificaciones Push
- Alertas de documentos: 30 / 7 / 3 días antes del vencimiento
- Alertas de mantenciones: por fecha (mismos niveles) y por km (500 km antes)
- Arquitectura: pg_cron diario → Edge Function (Deno) → Expo Push API

### 🏠 Dashboard
- Resumen del vehículo activo con km actuales
- Top 3 próximos vencimientos y próximas mantenciones
- Últimas actividades registradas
- Estado positivo cuando no hay pendientes: "Podés manejar tranquilo, sin preocupaciones"

---

## 🛠️ Stack Tecnológico

| Categoría | Tecnología | Versión |
|-----------|-----------|---------|
| Framework | React Native + Expo | `0.81.5` / `~54.0.0` |
| Lenguaje | JavaScript | - |
| Backend / DB | Supabase (PostgreSQL + Storage) | `^2.106.2` |
| Auth | Supabase Auth + Google Sign-In | - |
| Estado Global | Zustand | `^5.0.12` |
| Navegación | React Navigation (Stack + Bottom Tabs) | `^7.x` |
| Estilos | NativeWind (Tailwind CSS) | `^4.2.3` |
| Animaciones | react-native-reanimated | `~4.1.1` |
| Gestos | react-native-gesture-handler | `~2.28.0` |
| Iconos | lucide-react-native | `^1.7.0` |
| Notificaciones | expo-notifications | `~0.32.17` |
| Cámara / Archivos | expo-camera + expo-document-picker | `~17.0.10` / `~14.0.8` |

---

## 📁 Estructura del Proyecto

```
AutoDoc/
├── src/
│   ├── features/              # Módulos por dominio (auth, vehiculos, documentos, mantenciones, alertas)
│   │   ├── auth/              # Login con Google Sign-In
│   │   ├── vehiculos/         # CRUD de vehículos y selector activo
│   │   ├── documentos/        # Adjuntar, ver y gestionar documentos
│   │   ├── mantenciones/      # Registrar y consultar mantenciones
│   │   └── alertas/           # Badges y listado de alertas pendientes
│   ├── screens/               # Pantallas principales del tab bar
│   ├── components/
│   │   ├── ui/                # Button, Card, Input, Toast, Skeleton
│   │   └── shared/            # Header, EmptyState, LoadingSpinner, SliderConfirm
│   ├── navigation/            # RootStack y TabNavigator
│   ├── services/              # supabase.js, storage.js, notifications.js
│   ├── constants/             # Categorías predefinidas y colores
│   └── theme/                 # theme.js, ThemeContext, useTheme
├── supabase/
│   └── functions/             # Edge Functions (Deno) para envío de notificaciones
├── .env
└── package.json
```

---

## 🧭 Navegación

```
RootStack
├── AuthStack
│   └── LoginScreen          # Google Sign-In
└── AppStack (autenticado)
    ├── TabNavigator
    │   ├── DashboardScreen   # Resumen del vehículo activo
    │   ├── DocumentosScreen  # Lista de documentos
    │   ├── MantencionesScreen# Historial de mantenciones
    │   └── PerfilScreen      # Vehículos, categorías, config, logout
    ├── AgregarDocumentoScreen
    ├── EditarDocumentoScreen
    ├── AgregarMantencionScreen
    ├── EditarMantencionScreen
    └── EditarVehiculoScreen
```

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js >= 18
- Expo CLI (`npm install -g expo-cli`)
- Cuenta en [Supabase](https://supabase.com) con proyecto creado
- EAS CLI para builds (`npm install -g eas-cli`)

### Pasos

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd AutoDoc

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Completar con los valores del proyecto Supabase

# 4. Iniciar el servidor de desarrollo
npx expo start
```

### Variables de Entorno

```env
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_KEY=
```

---

*Hecho con ❤️ por [matiudev](https://github.com/matiudev)*
