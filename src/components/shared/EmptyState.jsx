import React from 'react';
import { View, Text } from 'react-native';
import { CheckCircle } from 'lucide-react-native';
import IconLucide from '../IconLucide';
import { colors } from '../../theme/theme';

export default function EmptyState({
  icon = 'CheckCircle',
  title = 'Podés manejar tranquilo',
  subtitle = 'Sin preocupaciones por ahora',
  positive = true,
}) {
  const iconColor = positive ? colors.success : colors.textSecondary;

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 32,
      }}
    >
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 20,
          backgroundColor: positive ? `${colors.success}15` : `${colors.textSecondary}15`,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
        }}
      >
        <IconLucide name={icon} size={32} color={iconColor} />
      </View>
      <Text
        style={{
          color: colors.textPrimary,
          fontSize: 17,
          fontWeight: '600',
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          color: colors.textSecondary,
          fontSize: 14,
          textAlign: 'center',
          lineHeight: 20,
        }}
      >
        {subtitle}
      </Text>
    </View>
  );
}
