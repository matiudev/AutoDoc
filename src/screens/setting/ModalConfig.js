import { Trash, X, CloudDownload, Cog } from "lucide-react-native";
import { View, TouchableOpacity, Text, Alert, Modal } from "react-native";
import { useState } from "react";
import { useTheme } from "../../theme/useTheme";
import * as Updates from "expo-updates";

const ModalConfig = ({ visibleModalConfig, onClose }) => {
  const { colors } = useTheme();
  const [isChecking, setIsChecking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadAndInstallUpdate = async () => {
    try {
      setIsDownloading(true);
      Alert.alert("Descargando...", "Por favor espera");

      await Updates.fetchUpdateAsync();

      Alert.alert(
        "Actualización Descargada",
        "¿Deseas reiniciar la app para aplicarla?",
        [
          { text: "Más tarde", style: "cancel" },
          { text: "Reiniciar", onPress: () => Updates.reloadAsync() },
        ],
      );
    } catch (error) {
      console.error("Error downloading update:", error);
      Alert.alert("Error en descarga", "No se pudo descargar la actualización");
    } finally {
      setIsDownloading(false);
    }
  };

  const checkUpdateOTA = async () => {
    if (!Updates.isEnabled) {
      Alert.alert(
        "Updates no disponibles",
        "Solo funciona en builds de producción",
      );
      return;
    }

    try {
      setIsChecking(true);
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        Alert.alert(
          "Actualización Disponible",
          "Hay una nueva versión disponible. ¿Deseas descargarla?",
          [
            { text: "Cancelar", style: "cancel" },
            { text: "Descargar", onPress: downloadAndInstallUpdate },
          ],
        );
      } else {
        Alert.alert("App actualizada", "Ya tienes la versión más reciente");
      }
    } catch (error) {
      console.error("Error checking for updates:", error);
      Alert.alert("Error al verificar", "No se pudo verificar actualizaciones");
    } finally {
      setIsChecking(false);
    }
  };

  const borrarDatos = () => {
    Alert.alert(
      "Borrar Datos",
      "¿Estás seguro? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Borrar",
          style: "destructive",
          onPress: () => vaciarEstados(),
        },
      ],
    );
  };

  const vaciarEstados = async () => {
  };

  const FUNCIONES = [
    {
      label: isChecking
        ? "Verificando..."
        : isDownloading
          ? "Descargando..."
          : "Buscar Actualización",
      Icon: CloudDownload,
      onPress: checkUpdateOTA,
      disabled: isChecking || isDownloading,
    },
    {
      label: "Borrar Datos",
      Icon: Trash,
      onPress: borrarDatos,
      disabled: false,
    },
  ];

  return (
    <Modal
      visible={visibleModalConfig}
      animationType="slide"
      transparent={true}
    >
      <View
        className="flex-1 justify-end"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      >
        <TouchableOpacity className="flex-1" onPress={onClose} />

        <View
          className="rounded-t-[20px] p-5"
          style={{ backgroundColor: colors.background }}
        >
          {/* Pill */}
          <View
            className="w-10 h-1 rounded-full self-center mb-4 opacity-30"
            style={{ backgroundColor: colors.text }}
          />

          {/* Header */}
          <View className="flex-row justify-between items-center mb-5">
            <View className="flex-row gap-2">
              <Cog color={colors.icon} />
              <Text
                className="text-xl font-semibold"
                style={{ color: colors.text }}
              >
                Configuración
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X color={colors.text} size={22} />
            </TouchableOpacity>
          </View>

          {FUNCIONES.map((item) => (
            <TouchableOpacity
              key={item.label}
              onPress={item.onPress}
              disabled={item.disabled}
              style={{
                paddingVertical: 14,
                borderBottomWidth: 0.5,
                borderBottomColor: colors.text + "20",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                opacity: item.disabled ? 0.5 : 1,
              }}
            >
              <View className="flex-row items-center gap-2">
                <item.Icon size={16} color={colors.textPlaceHolder} />
                <Text style={{ color: colors.text, fontSize: 15 }}>
                  {item.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

export default ModalConfig;
