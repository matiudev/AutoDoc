import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/theme';

export default function AppHeader({ title, subtitle, showBack = false, rightElement }) {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 16,
        gap: 12,
      }}
    >
      {showBack && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: colors.bgElevated,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: colors.borderDefault,
          }}
        >
          <ArrowLeft size={18} color={colors.textPrimary} />
        </TouchableOpacity>
      )}

      <View style={{ flex: 1 }}>
        {subtitle && (
          <Text
            style={{ color: colors.textSecondary, fontSize: 11, fontWeight: '500', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 2 }}
          >
            {subtitle}
          </Text>
        )}
        <Text
          style={{ color: colors.textPrimary, fontSize: 22, fontWeight: '700', letterSpacing: -0.3 }}
        >
          {title}
        </Text>
      </View>

      {rightElement}
    </View>
  );
}
