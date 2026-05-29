import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { colors } from '../../theme/theme';

export default function LoadingSpinner({ size = 'large', style }) {
  return (
    <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bgBase }, style]}>
      <ActivityIndicator size={size} color={colors.accent} />
    </View>
  );
}
