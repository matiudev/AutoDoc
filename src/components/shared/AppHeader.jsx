import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/theme';

export default function AppHeader({ title, subtitle, showBack = false, rightElement }) {
  const navigation = useNavigation();

  return (
    <View className="flex-row items-center pb-4 gap-3">
      {showBack && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-xl items-center justify-center border"
          style={{ backgroundColor: colors.bgElevated, borderColor: colors.borderDefault }}
        >
          <ArrowLeft size={18} color={colors.textPrimary} />
        </TouchableOpacity>
      )}

      <View className="flex-1">
        {subtitle && (
          <Text
            className="text-[11px] font-medium tracking-[0.8px] uppercase mb-0.5"
            style={{ color: colors.textSecondary }}
          >
            {subtitle}
          </Text>
        )}
        <Text
          className="text-[22px] font-bold tracking-[-0.3px]"
          style={{ color: colors.textPrimary }}
        >
          {title}
        </Text>
      </View>

      {rightElement}
    </View>
  );
}
