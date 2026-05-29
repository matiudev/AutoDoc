import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme/useTheme';

export const ModalSelector = ({
  visible,
  onClose,
  titulo = "Seleccionar",
  data = [],
  keyExtractor,
  renderItem,
  ListEmptyComponent,
}) => {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" }}>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />
        <View style={{
          backgroundColor: colors.background,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 20,
          maxHeight: "60%"
        }}>
          {/* Pill */}
          <View style={{ width: 40, height: 4, backgroundColor: colors.text, opacity: 0.3, borderRadius: 2, alignSelf: "center", marginBottom: 16 }} />

          <Text style={{ color: colors.text, fontSize: 17, fontWeight: "600", marginBottom: 14 }}>
            {titulo}
          </Text>

          <FlatList
            data={data}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListEmptyComponent={ListEmptyComponent}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ModalSelector;