import { Text, View, TouchableOpacity, TextInput } from "react-native";

export const Campo = ({ label, Icon, colors, children }) => (
  <View className="mb-5">
    <Text className="text-base font-semibold mb-2" style={{ color: colors.text }}>{label}</Text>
    <View
      className="flex-row items-center rounded-2xl px-4 py-3 gap-3"
      style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
    >
      <Icon color={colors.iconSecondary} size={20} />
      {children}
    </View>
  </View>
);


// ── Fila de selección (toca para abrir dropdown) ──────────────────────────────
export const FilaSelector = ({ label, Icon, valor, placeholder, onPress, colors }) => (
  <Campo label={label} Icon={Icon} colors={colors}>
    <TouchableOpacity style={{ flex: 1 }} onPress={onPress}>
      <Text
        style={{
          fontSize: 15,
          color: valor ? colors.text : colors.textPlaceHolder,
          paddingVertical: 2,
        }}
      >
        {valor || placeholder}
      </Text>
    </TouchableOpacity>
  </Campo>
);

export const TextInputCampo = ({ label, Icon, colors, onChangeText, ...inputProps }) => (
  <Campo label={label} Icon={Icon} colors={colors}>
    <TextInput
      className="flex-1 text-base w-full"
      style={{ color: colors.text }}
      placeholderTextColor={colors.textPlaceHolder}
      onChangeText={onChangeText}
      {...inputProps}
    />
  </Campo>
)