import { StatusBar } from "expo-status-bar";
import { ContainerTabs } from "../components/ui/Containers";
import Header from "../components/ui/Header";
import { TouchableOpacity, Text } from "react-native";
import { ModalSelectorGenerico } from "../components/GENERICO/ModalSelectorGenerico";
import { useState } from "react";

const TabOneScreen = () => {
  const [visibleModalGenerico, setVisibleModalGenerico] = useState(false);
  const [selectGenerico, setSelectGenerico] = useState(null);

  return (
    <ContainerTabs>
      <Header titulo="TabOneScreen" />
      <StatusBar style="auto" />

      <TouchableOpacity onPress={() => setVisibleModalGenerico(true)}>
        <Text>Selecionar Generico</Text>
      </TouchableOpacity>

      <ModalSelectorGenerico
        visible={visibleModalGenerico}
        onSelect={(item) => setSelectGenerico(item.nombre)}
        onClose={() => setVisibleModalGenerico(false)}
      />
    </ContainerTabs>
  );
};

export default TabOneScreen;