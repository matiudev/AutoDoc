import React, { useState } from 'react';
import { View, ScrollView, Modal, Pressable, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import AppHeader from '../../../components/shared/AppHeader';
import VehiculoForm from '../components/VehiculoForm';
import SliderConfirm from '../../../components/shared/SliderConfirm';
import { Toast, ToastManager } from '../../../components/ui/CustomToast';
import useVehiculoStore from '../store/useVehiculoStore';
import { colors } from '../../../theme/theme';
import { Trash2 } from 'lucide-react-native';

export default function EditarVehiculoScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { vehiculo } = route.params;
  const updateVehiculo = useVehiculoStore(s => s.updateVehiculo);
  const borrarVehiculo = useVehiculoStore(s => s.borrarVehiculo);
  const [loading, setLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await updateVehiculo(vehiculo.id, data);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      ToastManager.show({ type: 'success', text1: 'Vehículo actualizado' });
      navigation.goBack();
    } catch (err) {
      ToastManager.show({ type: 'error', text1: 'Error', text2: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await borrarVehiculo(vehiculo.id);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.goBack();
    } catch (err) {
      ToastManager.show({ type: 'error', text1: 'Error', text2: err.message });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgBase, paddingTop: insets.top + 8 }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 40 }}>
        <AppHeader
          title="Editar Vehículo"
          showBack
          rightElement={
            <TouchableOpacity
              onPress={() => setShowDelete(true)}
              style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: `${colors.danger}20`, alignItems: 'center', justifyContent: 'center' }}
            >
              <Trash2 size={18} color={colors.danger} />
            </TouchableOpacity>
          }
        />
        <VehiculoForm initialValues={vehiculo} onSubmit={handleSubmit} loading={loading} />
      </ScrollView>

      <Modal visible={showDelete} transparent animationType="slide" onRequestClose={() => setShowDelete(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }} onPress={() => setShowDelete(false)} />
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.bgSurface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: insets.bottom + 24, borderTopWidth: 1, borderTopColor: colors.borderDefault }}>
          <Text style={{ color: colors.textPrimary, fontSize: 18, fontWeight: '700', marginBottom: 8 }}>Eliminar vehículo</Text>
          <Text style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 24 }}>
            Se eliminarán también todos los documentos y mantenciones asociados.
          </Text>
          <SliderConfirm onConfirm={handleDelete} label="Deslizá para eliminar" loading={loading} />
        </View>
      </Modal>

      <Toast />
    </View>
  );
}
