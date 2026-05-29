import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors } from '../../theme/theme';

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  secureTextEntry = false,
  keyboardType = 'default',
  editable = true,
  rightElement,
  error,
  style,
}) {
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <View style={style}>
      {label && (
        <Text
          style={{
            color: colors.textSecondary,
            fontSize: 12,
            fontWeight: '500',
            marginBottom: 6,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
          }}
        >
          {label}
        </Text>
      )}
      <View
        style={{
          backgroundColor: colors.bgElevated,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: focused ? colors.borderActive : colors.borderDefault,
          flexDirection: 'row',
          alignItems: multiline ? 'flex-start' : 'center',
          paddingHorizontal: 14,
          paddingVertical: multiline ? 12 : 0,
        }}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={secureTextEntry && !showPass}
          keyboardType={keyboardType}
          editable={editable}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            color: colors.textPrimary,
            fontSize: 15,
            paddingVertical: multiline ? 0 : 15,
            textAlignVertical: multiline ? 'top' : 'center',
          }}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPass(!showPass)}>
            {showPass ? (
              <EyeOff size={18} color={colors.textSecondary} />
            ) : (
              <Eye size={18} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
        )}
        {rightElement && !secureTextEntry && rightElement}
      </View>
      {error && (
        <Text style={{ color: colors.danger, fontSize: 12, marginTop: 4 }}>{error}</Text>
      )}
    </View>
  );
}
