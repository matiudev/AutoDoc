import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useAuthStore from '../features/auth/store/useAuthStore';
import LoginScreen from '../features/auth/screens/LoginScreen';
import TabNavigator from './TabNavigator';
import AgregarVehiculoScreen from '../features/vehiculos/screens/AgregarVehiculoScreen';
import EditarVehiculoScreen from '../features/vehiculos/screens/EditarVehiculoScreen';
import AgregarDocumentoScreen from '../features/documentos/screens/AgregarDocumentoScreen';
import EditarDocumentoScreen from '../features/documentos/screens/EditarDocumentoScreen';
import AgregarMantencionScreen from '../features/mantenciones/screens/AgregarMantencionScreen';
import EditarMantencionScreen from '../features/mantenciones/screens/EditarMantencionScreen';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { registerForPushNotifications } from '../services/notifications';
import { colors } from '../theme/theme';
import useCategoriasService from '@/features/categorias/store/useCategoriasService';
import useVehiculoStore from '../features/vehiculos/store/useVehiculoStore';
import useDocumentoStore from '../features/documentos/store/useDocumentoStore';
import useMantencionStore from '../features/mantenciones/store/useMantencionStore';

const Stack = createNativeStackNavigator();

export default function RootStack() {
  const user = useAuthStore(s => s.user);
  const loading = useAuthStore(s => s.loading);
  const initialize = useAuthStore(s => s.initialize);
  const fetchCategoriasPredefinidas = useCategoriasService(s => s.fetchCategoriasPredefinidas)
  const fetchVehiculos = useVehiculoStore(s => s.fetchVehiculos);
  const vehiculoActivo = useVehiculoStore(s => s.vehiculoActivo);
  const fetchDocumentos = useDocumentoStore(s => s.fetchDocumentos);
  const fetchMantenciones = useMantencionStore(s => s.fetchMantenciones);

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (user) {
      fetchCategoriasPredefinidas();
      registerForPushNotifications(user.id);
      fetchVehiculos();
    }
  }, [user?.id]);

  useEffect(() => {
    if (vehiculoActivo) {
      fetchDocumentos(vehiculoActivo.id);
      fetchMantenciones(vehiculoActivo.id);
    }
  }, [vehiculoActivo]);

  if (loading) return <LoadingSpinner />;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bgBase },
        animation: 'slide_from_right',
      }}
    >
      {!user ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="HomeTabs" component={TabNavigator} />
          <Stack.Screen name="AgregarVehiculo" component={AgregarVehiculoScreen} />
          <Stack.Screen name="EditarVehiculo" component={EditarVehiculoScreen} />
          <Stack.Screen name="AgregarDocumento" component={AgregarDocumentoScreen} />
          <Stack.Screen name="EditarDocumento" component={EditarDocumentoScreen} />
          <Stack.Screen name="AgregarMantencion" component={AgregarMantencionScreen} />
          <Stack.Screen name="EditarMantencion" component={EditarMantencionScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
