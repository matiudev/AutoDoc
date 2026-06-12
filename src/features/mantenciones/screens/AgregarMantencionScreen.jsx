import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import AppHeader from '../../../components/shared/AppHeader';
import MantencionForm from '../components/MantencionForm';
import { Toast, ToastManager } from '../../../components/ui/CustomToast';
import useMantencionStore from '../store/useMantencionStore';
import useVehiculoStore from '../../vehiculos/store/useVehiculoStore';
import { colors } from '../../../theme/theme';

export default function AgregarMantencionScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const vehiculoActivo = useVehiculoStore(s => s.vehiculoActivo);
  const actualizarKm = useVehiculoStore(s => s.actualizarKm);
  const addMantencion = useMantencionStore(s => s.addMantencion);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await addMantencion(data);

      if (data.km_al_realizar > (vehiculoActivo.km_actual ?? 0)) {
        await actualizarKm(vehiculoActivo.id, data.km_al_realizar);
      }

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      ToastManager.show({ type: 'success', text1: 'Mantención registrada' });
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
        <AppHeader title="Nueva Mantención" showBack />
        <MantencionForm vehiculoKm={vehiculoActivo?.km_actual ?? 0} onSubmit={handleSubmit} loading={loading} />
      </ScrollView>
      <Toast />
    </View>
  );
}
