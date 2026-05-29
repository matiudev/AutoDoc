import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import AppHeader from '../../../components/shared/AppHeader';
import VehiculoForm from '../components/VehiculoForm';
import { Toast, ToastManager } from '../../../components/ui/CustomToast';
import useVehiculoStore from '../store/useVehiculoStore';
import useAuthStore from '../../auth/store/useAuthStore';
import { colors } from '../../../theme/theme';

export default function AgregarVehiculoScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { agregarVehiculo } = useVehiculoStore();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await agregarVehiculo({ ...data, user_id: user.id });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      ToastManager.show({ type: 'success', text1: 'Vehículo agregado', text2: data.nombre_alias });
      navigation.goBack();
    } catch (err) {
      ToastManager.show({ type: 'error', text1: 'Error', text2: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgBase, paddingTop: insets.top + 8 }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 40 }}>
        <AppHeader title="Nuevo Vehículo" showBack />
        <VehiculoForm onSubmit={handleSubmit} loading={loading} />
      </ScrollView>
      <Toast />
    </View>
  );
}
