import { TextInputCampo } from "../ui/CamposFormulario";
import ModalFormulario from "../modals/ModalFormulario";
import { Radiation } from "lucide-react-native";
import { useTheme } from "../../theme/useTheme";
import { useState } from "react";

export const ModalRegistrarGenerico = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");
  const [loading, setLoading] = useState(false);

  const formularioValido = !!(producto && cantidad && precio);

  const handleGuardar = async () => {
    setLoading(true);
    try {
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const limparInputs = () => {
    setProducto("")
    setCantidad("")
    setPrecio("")
    setLoading(false)
  }

  return (
    <ModalFormulario
      visible={visible}
      onClose={() => {limparInputs(); onClose();}}
      titulo="Nueva GENERICO"
      onGuardar={handleGuardar}
      formularioValido={formularioValido}
      loading={loading}
    >
      <TextInputCampo
        label="Hola"
        Icon={Radiation}
        colors={colors}
        onChangeText={(v) => setCantidad(v.replace(/[^0-9.]/g, ""))}
        placeholder="0"
        keyboardType="numeric"
        value={cantidad}
      />
    </ModalFormulario>
  );
};
