import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { colors } from '../../theme/theme';

export default function Button({
  onPress,
  label,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  style,
}) {
  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';
  const isGhost = variant === 'ghost';

  const bg = isDanger
    ? colors.danger
    : isGhost
    ? 'transparent'
    : colors.accent;

  const textColor = isGhost ? colors.accentSoft : colors.textPrimary;
  const borderColor = isGhost ? colors.borderDefault : 'transparent';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[
        {
          backgroundColor: bg,
          borderRadius: 14,
          paddingVertical: 15,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: isGhost ? 1 : 0,
          borderColor,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.textPrimary} size="small" />
      ) : (
        <>
          {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
          <Text
            style={{
              color: textColor,
              fontSize: 15,
              fontWeight: '600',
              letterSpacing: 0.3,
            }}
          >
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
