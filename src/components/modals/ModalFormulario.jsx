import { X } from "lucide-react-native";
import {
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Modal,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { useTheme } from "../../theme/useTheme";

const ModalFormulario = ({
  visible,
  onClose,
  titulo = "Nuevo registro",
  onGuardar,
  formularioValido = true, // el padre decide si el formulario está completo
  labelGuardar = "Guardar",
  loading = false,
  children, // los campos van aquí como children normales
  
}) => {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          justifyContent: "flex-end",
        }}
      >
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            backgroundColor: colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <ScrollView
            contentContainerStyle={{ padding: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Pill decorativo */}
            <View
              style={{
                width: 40, height: 4,
                backgroundColor: colors.text, opacity: 0.3,
                borderRadius: 2, alignSelf: "center", marginBottom: 16,
              }}
            />

            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text style={{ color: colors.text, fontSize: 20, fontWeight: "600" }}>
                {titulo}
              </Text>
              <TouchableOpacity onPress={onClose}>
                <X color={colors.text} size={22} />
              </TouchableOpacity>
            </View>

            {/* ── Campos: los pone quien usa este componente ── */}
            {children}

            {/* Botón Guardar */}
            <TouchableOpacity
              onPress={onGuardar}
              disabled={loading || !formularioValido}
              style={{
                backgroundColor: formularioValido
                  ? colors.button_accent
                  : colors.button_accent + "66",
                borderRadius: 14,
                padding: 16,
                alignItems: "center",
                marginTop: 8,
                marginBottom: 20,
              }}
            >
              {loading ? (
                <ActivityIndicator color={colors.button_icon} />
              ) : (
                <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
                  {labelGuardar}
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default ModalFormulario;