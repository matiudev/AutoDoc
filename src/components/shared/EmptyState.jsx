import React from 'react';
import { View, Text } from 'react-native';
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
    <View className="flex-1 items-center justify-center py-[60px] px-8">
      <View
        className="w-[72px] h-[72px] rounded-[20px] items-center justify-center mb-5"
        style={{ backgroundColor: positive ? `${colors.success}15` : `${colors.textSecondary}15` }}
      >
        <IconLucide name={icon} size={32} color={iconColor} />
      </View>
      <Text
        className="text-[17px] font-semibold text-center mb-2"
        style={{ color: colors.textPrimary }}
      >
        {title}
      </Text>
      <Text
        className="text-sm text-center leading-5"
        style={{ color: colors.textSecondary }}
      >
        {subtitle}
      </Text>
    </View>
  );
}
