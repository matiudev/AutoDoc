import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { colors } from '../../theme/theme';

export default function LoadingSpinner({ size = 'large', style }) {
  return (
    <View className="flex-1 items-center justify-center" style={[{ backgroundColor: colors.bgBase }, style]}>
      <ActivityIndicator size={size} color={colors.accent} />
    </View>
  );
}
