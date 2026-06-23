import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Gauge, Calendar } from 'lucide-react-native';
import IconLucide from '../../../components/IconLucide';
import { colors } from '../../../theme/theme';

function formatFecha(fecha) {
  if (!fecha) return null;
  return new Date(fecha).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function MantencionCard({ mantencion, alerta, onPress }) {
  const cat = mantencion.categoria;
  const iconName = cat?.lucide_icon ?? 'Wrench';
  const porKm = alerta?.kmRestantes != null;

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
        borderColor: colors.borderDefault,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 14,
      }}
    >
      <View
        style={{
          width: 46,
          height: 46,
          borderRadius: 13,
          backgroundColor: `${colors.accentSoft}15`,
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <IconLucide name={iconName} size={22} color={colors.accentSoft} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: '600', marginBottom: 4 }}>
          {cat?.nombre ?? 'Mantención'}
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Calendar size={12} color={colors.textSecondary} />
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
              {formatFecha(mantencion.fecha_realizada)}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Gauge size={12} color={colors.textSecondary} />
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
              {mantencion.km_al_realizar?.toLocaleString('es-CL')} km
            </Text>
          </View>
        </View>

        {porKm ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 }}>
            <Text style={{ color: colors.accentSoft, fontSize: 12, fontWeight: '500' }}>
              {alerta.kmRestantes < 0
                ? `Vencido por ${Math.abs(alerta.kmRestantes).toLocaleString('es-CL')} km`
                : `Faltan ${alerta.kmRestantes.toLocaleString('es-CL')} km`}
            </Text>
          </View>
        ) : mantencion.proxima_fecha && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 }}>
            <Text style={{ color: colors.accentSoft, fontSize: 12, fontWeight: '500' }}>
              Próxima: {formatFecha(mantencion.proxima_fecha)}
            </Text>
          </View>
        )}

        {mantencion.costo != null && (
          <Text style={{ color: colors.success, fontSize: 12, fontWeight: '500', marginTop: 4 }}>
            ${mantencion.costo?.toLocaleString('es-CL')}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
