import { View, Text, Modal, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { User } from "lucide-react-native";
import { useTheme } from "../../theme/useTheme";
import ModalConfig from "../../screens/setting/ModalConfig";

const Header = ({ titulo, profile = true }) => {
  const { colors } = useTheme();
  const [modalConfig, setModalConfig] = useState(false);

  return (
    <View className="flex-row items-center justify-between">
      <View className="gap-1">
        <Text
          style={{
            fontSize: 12,
            color: colors.textSecondary2,
          }}
        >
          Buen dia
        </Text>
        <Text
          className="text-xl font-semibold"
          style={{
            color: colors.text,
          }}
        >
          {titulo}
        </Text>
      </View>

      {profile && (
        <TouchableOpacity
          style={{
            backgroundColor: colors.primaryLight,
            borderWidth: 1.5,
            borderColor: colors.primaryMedium,
          }}
          className="w-[42px] h-[42px] rounded-full items-center justify-center"
          onPress={() => setModalConfig(true)}
        >
          <User size={20} color={colors.primary} />
        </TouchableOpacity>
      )}

      <Modal
        visible={modalConfig}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVentas(false)}
      >
        <ModalConfig onClose={() => setModalConfig(false)} />
      </Modal>
    </View>
  );
};

export default Header;
