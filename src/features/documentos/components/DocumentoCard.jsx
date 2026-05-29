import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FileText, Shield, ClipboardCheck, BadgeCheck, Receipt, File, AlertTriangle, Clock } from 'lucide-react-native';
import { colors } from '../../../theme/theme';

const TIPO_ICONS = {
  seguro: Shield,
  revision_tecnica: ClipboardCheck,
  permiso_circulacion: FileText,
  garantia: BadgeCheck,
  factura: Receipt,
  otro: File,
};

const TIPO_LABELS = {
  seguro: 'Seguro',
  revision_tecnica: 'Revisión Técnica',
  permiso_circulacion: 'Permiso Circulación',
  garantia: 'Garantía',
  factura: 'Factura',
  otro: 'Otro',
};

function getEstadoVencimiento(fechaVencimiento) {
  if (!fechaVencimiento) return null;
  const hoy = new Date();
  const vence = new Date(fechaVencimiento);
  const diffDias = Math.ceil((vence - hoy) / 86400000);

  if (diffDias < 0) return { label: 'Vencido', color: colors.danger };
  if (diffDias <= 3) return { label: `Vence en ${diffDias}d`, color: colors.danger };
  if (diffDias <= 7) return { label: `Vence en ${diffDias}d`, color: colors.warning };
  if (diffDias <= 30) return { label: `Vence en ${diffDias}d`, color: colors.warning };
  return { label: `Vigente`, color: colors.success };
}

export default function DocumentoCard({ documento, onPress }) {
  const Icon = TIPO_ICONS[documento.tipo] ?? File;
  const estado = getEstadoVencimiento(documento.fecha_vencimiento);
  const urgente = estado && (estado.color === colors.danger || estado.color === colors.warning);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        backgroundColor: colors.bgSurface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: urgente ? `${estado.color}30` : colors.borderDefault,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
      }}
    >
      <View
        style={{
          width: 46,
          height: 46,
          borderRadius: 13,
          backgroundColor: urgente ? `${estado.color}15` : `${colors.accentSoft}15`,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={22} color={urgente ? estado.color : colors.accentSoft} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: '600', marginBottom: 3 }}>
          {documento.nombre}
        </Text>
        <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
          {TIPO_LABELS[documento.tipo] ?? documento.tipo}
        </Text>
      </View>

      {estado && (
        <View
          style={{
            backgroundColor: `${estado.color}20`,
            borderRadius: 8,
            paddingHorizontal: 8,
            paddingVertical: 4,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {urgente && <AlertTriangle size={10} color={estado.color} />}
          <Text style={{ color: estado.color, fontSize: 11, fontWeight: '700' }}>
            {estado.label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
