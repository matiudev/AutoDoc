import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Bell, X } from 'lucide-react-native';
import { colors } from '../../../theme/theme';

function getAlertaColor(tipo) {
  if (tipo === '3_dias') return colors.danger;
  if (tipo === '7_dias') return colors.warning;
  return colors.accentSoft;
}

function getAlertaLabel(tipo) {
  if (tipo === '30_dias') return '30 días';
  if (tipo === '7_dias') return '7 días';
  if (tipo === '3_dias') return '3 días';
  if (tipo === '500_km') return '500 km';
  return tipo;
}

export default function AlertaItem({ alerta, onDescartar }) {
  const alertColor = getAlertaColor(alerta.tipo_alerta);

  return (
    <View
      style={{
        backgroundColor: colors.bgSurface,
        borderRadius: 14,
        padding: 14,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: `${alertColor}30`,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: `${alertColor}20`,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Bell size={16} color={alertColor} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.textPrimary, fontSize: 13, fontWeight: '600' }}>
          {alerta.tipo_origen === 'documento' ? 'Documento' : 'Mantención'}
        </Text>
        <Text style={{ color: alertColor, fontSize: 12, marginTop: 2 }}>
          Vence en {getAlertaLabel(alerta.tipo_alerta)}
        </Text>
      </View>

      {onDescartar && (
        <TouchableOpacity
          onPress={() => onDescartar(alerta.id)}
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            backgroundColor: colors.bgElevated,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={14} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
}
