import { StatusBar } from "expo-status-bar";
import { ContainerTabs } from "../components/ui/Containers";
import Header from "../components/ui/Header";
import { TouchableOpacity, Text } from "react-native";
import { ModalRegistrarGenerico } from "../components/GENERICO/ModalRegistrarGenerico";
import { useState } from "react";

const TabTwoScreen = () => {
  const [visibleRegistrarGenerico, setVisibleRegistrarGenerico] = useState(false);
  return (
    <ContainerTabs>
      <Header titulo="TabTwoScreen" />
      <StatusBar style="auto" />

      <TouchableOpacity onPress={() => setVisibleRegistrarGenerico(true)}>
        <Text>Registrar Genetrico</Text>
      </TouchableOpacity>

      <ModalRegistrarGenerico
        visible={visibleRegistrarGenerico}
        onClose={() => setVisibleRegistrarGenerico(false)}
      />
    </ContainerTabs>
  );
};

export default TabTwoScreen;
