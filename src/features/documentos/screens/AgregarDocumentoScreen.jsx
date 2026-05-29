import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import AppHeader from '../../../components/shared/AppHeader';
import DocumentoForm from '../components/DocumentoForm';
import { Toast, ToastManager } from '../../../components/ui/CustomToast';
import useDocumentoStore from '../store/useDocumentoStore';
import useVehiculoStore from '../../vehiculos/store/useVehiculoStore';
import { colors } from '../../../theme/theme';

export default function AgregarDocumentoScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { vehiculoActivo } = useVehiculoStore();
  const { agregarDocumento } = useDocumentoStore();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async ({ form, archivo }) => {
    if (!archivo) {
      ToastManager.show({ type: 'error', text1: 'Adjuntá un archivo' });
      return;
    }
    setLoading(true);
    try {
      await agregarDocumento({
        vehiculoId: vehiculoActivo.id,
        tipo: form.tipo,
        nombre: form.nombre,
        fechaEmision: form.fecha_emision,
        fechaVencimiento: form.fecha_vencimiento,
        uri: archivo.uri,
        fileName: archivo.name,
        mimeType: archivo.mimeType,
        notas: form.notas,
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      ToastManager.show({ type: 'success', text1: 'Documento guardado' });
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
        <AppHeader title="Nuevo Documento" showBack />
        <DocumentoForm onSubmit={handleSubmit} loading={loading} />
      </ScrollView>
      <Toast />
    </View>
  );
}
