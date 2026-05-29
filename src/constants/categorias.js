export const CATEGORIAS_PREDEFINIDAS = [
  // Originales
  { id: 'aceite',              nombre: 'Aceite de motor',            lucide_icon: 'Droplets',       intervalo_km: 10000, intervalo_dias: 365  },
  { id: 'frenos',              nombre: 'Frenos',                     lucide_icon: 'CircleStop',     intervalo_km: 20000, intervalo_dias: null },
  { id: 'discos',              nombre: 'Discos de freno',            lucide_icon: 'Disc3',          intervalo_km: 40000, intervalo_dias: null },
  { id: 'neumaticos',          nombre: 'Neumáticos',                 lucide_icon: 'Circle',         intervalo_km: 40000, intervalo_dias: null },
  { id: 'correa',              nombre: 'Correa de distribución',     lucide_icon: 'Link',           intervalo_km: 60000, intervalo_dias: null },
  { id: 'filtro_aire',         nombre: 'Filtro de aire',             lucide_icon: 'Wind',           intervalo_km: 15000, intervalo_dias: 365  },
  { id: 'filtro_aceite',       nombre: 'Filtro de aceite',           lucide_icon: 'Filter',         intervalo_km: 10000, intervalo_dias: 365  },
  { id: 'liquido_frenos',      nombre: 'Líquido de frenos',          lucide_icon: 'Droplets',       intervalo_km: null,  intervalo_dias: 730  },
  { id: 'refrigerante',        nombre: 'Refrigerante',               lucide_icon: 'Thermometer',    intervalo_km: null,  intervalo_dias: 730  },
  { id: 'bateria',             nombre: 'Batería',                    lucide_icon: 'Battery',        intervalo_km: null,  intervalo_dias: 1460 },
  { id: 'bujias',              nombre: 'Bujías',                     lucide_icon: 'Zap',            intervalo_km: 30000, intervalo_dias: null },
  { id: 'suspension',          nombre: 'Suspensión',                 lucide_icon: 'ArrowUpDown',    intervalo_km: 50000, intervalo_dias: null },
  { id: 'revision',            nombre: 'Revisión general',           lucide_icon: 'ClipboardCheck', intervalo_km: null,  intervalo_dias: 365  },
  // Aceleración / Motor
  { id: 'cuerpo_aceleracion',  nombre: 'Cuerpo de aceleración',      lucide_icon: 'Gauge',          intervalo_km: 40000, intervalo_dias: null },
  { id: 'sensor_map_maf',      nombre: 'Sensor MAP / MAF',           lucide_icon: 'Activity',       intervalo_km: 40000, intervalo_dias: null },
  { id: 'sensor_lambda',       nombre: 'Sensor de oxígeno (Lambda)', lucide_icon: 'Radar',          intervalo_km: 60000, intervalo_dias: null },
  { id: 'sensor_temperatura',  nombre: 'Sensor de temperatura',      lucide_icon: 'Thermometer',    intervalo_km: null,  intervalo_dias: null },
  { id: 'sensor_ckp',          nombre: 'Sensor de cigüeñal (CKP)',   lucide_icon: 'RotateCcw',      intervalo_km: 60000, intervalo_dias: null },
  { id: 'inyectores',          nombre: 'Inyectores',                 lucide_icon: 'Droplets',       intervalo_km: 40000, intervalo_dias: null },
  // Transmisión
  { id: 'aceite_transmision',  nombre: 'Aceite de transmisión',      lucide_icon: 'Droplets',       intervalo_km: 40000, intervalo_dias: null },
  { id: 'embrague',            nombre: 'Embrague',                   lucide_icon: 'CircleDot',      intervalo_km: 80000, intervalo_dias: null },
  { id: 'caja_cambios',        nombre: 'Caja de cambios',            lucide_icon: 'Settings',       intervalo_km: null,  intervalo_dias: null },
  // Eléctrico
  { id: 'alternador',          nombre: 'Alternador',                 lucide_icon: 'Zap',            intervalo_km: null,  intervalo_dias: null },
  { id: 'fusibles',            nombre: 'Fusibles',                   lucide_icon: 'Shield',         intervalo_km: null,  intervalo_dias: null },
  { id: 'luces',               nombre: 'Luces / Focos',              lucide_icon: 'Lightbulb',      intervalo_km: null,  intervalo_dias: 365  },
  // Otros
  { id: 'aire_acondicionado',  nombre: 'Aire acondicionado',         lucide_icon: 'Wind',           intervalo_km: null,  intervalo_dias: 365  },
  { id: 'direccion',           nombre: 'Dirección asistida',         lucide_icon: 'Navigation',     intervalo_km: null,  intervalo_dias: null },
  { id: 'amortiguadores',      nombre: 'Amortiguadores',             lucide_icon: 'ArrowUpDown',    intervalo_km: 60000, intervalo_dias: null },
  { id: 'limpiaparabrisas',    nombre: 'Limpiabrisas',               lucide_icon: 'Droplets',       intervalo_km: null,  intervalo_dias: 365  },
  // Comodín
  { id: 'otro',                nombre: 'Otro',                       lucide_icon: 'Wrench',         intervalo_km: null,  intervalo_dias: null },
];

export const TIPOS_DOCUMENTO = [
  { value: 'seguro',              label: 'Seguro',              icon: 'Shield' },
  { value: 'revision_tecnica',    label: 'Revisión Técnica',    icon: 'ClipboardCheck' },
  { value: 'permiso_circulacion', label: 'Permiso Circulación', icon: 'FileText' },
  { value: 'garantia',            label: 'Garantía',            icon: 'BadgeCheck' },
  { value: 'factura',             label: 'Factura',             icon: 'Receipt' },
  { value: 'otro',                label: 'Otro',                icon: 'File' },
];
