import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Car, ChevronRight, Gauge } from 'lucide-react-native';
import { colors } from '../../../theme/theme';

export default function VehiculoCard({ vehiculo, activo = false, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        backgroundColor: colors.bgSurface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1.5,
        borderColor: activo ? colors.borderActive : colors.borderDefault,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
      }}
    >
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          backgroundColor: activo ? `${colors.accent}20` : colors.bgElevated,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {vehiculo.foto_url ? (
          <Image source={{ uri: vehiculo.foto_url }} style={{ width: 52, height: 52 }} />
        ) : (
          <Car size={24} color={activo ? colors.accent : colors.textSecondary} />
        )}
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: '700', marginBottom: 4 }}>
          {vehiculo.nombre_alias}
        </Text>
        <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
          {vehiculo.marca} {vehiculo.modelo} · {vehiculo.anio}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
          <Gauge size={12} color={colors.accentSoft} />
          <Text style={{ color: colors.accentSoft, fontSize: 12, fontWeight: '500' }}>
            {vehiculo.km_actual?.toLocaleString('es-CL')} km
          </Text>
        </View>
      </View>

      {activo && (
        <View
          style={{
            backgroundColor: `${colors.accent}20`,
            borderRadius: 8,
            paddingHorizontal: 8,
            paddingVertical: 4,
          }}
        >
          <Text style={{ color: colors.accentSoft, fontSize: 11, fontWeight: '600' }}>ACTIVO</Text>
        </View>
      )}

      <ChevronRight size={16} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}
