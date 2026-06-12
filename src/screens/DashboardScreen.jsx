import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronDown, Gauge, Plus } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import useVehiculoStore from '../features/vehiculos/store/useVehiculoStore';
import useAlertaStore from '../features/alertas/store/useAlertaStore';
import useAuthStore from '../features/auth/store/useAuthStore';
import VehiculoSelector from '../features/vehiculos/components/VehiculoSelector';
import AlertaItem from '../features/alertas/components/AlertaItem';
import { SkeletonList } from '../components/ui/Skeleton';
import EmptyState from '../components/shared/EmptyState';
import DocumentoCard from '../features/documentos/components/DocumentoCard';
import MantencionCard from '../features/mantenciones/components/MantencionCard';
import { Toast } from '../components/ui/CustomToast';
import { colors } from '../theme/theme';

function SectionTitle({ title, action, onAction }) {
  return (
    <View className="flex-row items-center justify-between mb-3 mt-6">
      <Text className="text-base font-bold" style={{ color: colors.textPrimary }}>{title}</Text>
      {action && (
        <TouchableOpacity onPress={onAction}>
          <Text className="text-[13px] font-semibold" style={{ color: colors.accentSoft }}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function DashboardScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const user = useAuthStore(s => s.user);
  const vehiculoActivo = useVehiculoStore(s => s.vehiculoActivo);
  const fetchVehiculos = useVehiculoStore(s => s.fetchVehiculos);
  const proximosVencimientos = useAlertaStore(s => s.proximosVencimientos);
  const proximasMantenciones = useAlertaStore(s => s.proximasMantenciones);
  const alertas = useAlertaStore(s => s.alertas);
  const loading = useAlertaStore(s => s.loading);
  const fetchTodo = useAlertaStore(s => s.fetchTodo);
  const descartar = useAlertaStore(s => s.descartar);
  const [showSelector, setShowSelector] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) fetchVehiculos(user.id);
  }, [user]);

  useEffect(() => {
    if (vehiculoActivo) fetchTodo(vehiculoActivo.id);
  }, [vehiculoActivo]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (vehiculoActivo) await fetchTodo(vehiculoActivo.id);
    setRefreshing(false);
  }, [vehiculoActivo]);

  const totalAlertas = alertas.length;
  const sinProblemas = !loading && proximosVencimientos.length === 0 && proximasMantenciones.length === 0;

  return (
    <View className="flex-1" style={{ backgroundColor: colors.bgBase }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgBase} />

      {/* Header hero */}
      <LinearGradient
        colors={[colors.gradientHeroStart, colors.gradientHeroEnd, colors.bgBase]}
        style={{ paddingTop: insets.top + 16, paddingHorizontal: 20, paddingBottom: 32 }}
      >
        <View className="flex-row items-center justify-between mb-5">
          <View>
            <Text className="text-xs tracking-[0.8px] uppercase" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Bienvenido
            </Text>
            <Text className="text-lg font-bold mt-0.5" style={{ color: '#fff' }}>
              {user?.user_metadata?.name?.split(' ')[0] ?? 'AutoDoc'}
            </Text>
          </View>

          {totalAlertas > 0 && (
            <View
              className="rounded-xl px-3 py-1.5 border"
              style={{ backgroundColor: `${colors.danger}25`, borderColor: `${colors.danger}40` }}
            >
              <Text className="text-xs font-bold" style={{ color: colors.danger }}>
                {totalAlertas} alerta{totalAlertas !== 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>

        {vehiculoActivo ? (
          <TouchableOpacity
            onPress={() => setShowSelector(true)}
            className="rounded-[18px] p-[18px] border flex-row items-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.15)' }}
          >
            <View className="flex-1">
              <Text className="text-[11px] tracking-[0.8px] uppercase mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Vehículo activo
              </Text>
              <Text className="text-[22px] font-extrabold tracking-[-0.5px] mb-1.5" style={{ color: '#fff' }}>
                {vehiculoActivo.nombre_alias}
              </Text>
              <View className="flex-row items-center gap-[5px]">
                <Gauge size={13} color="rgba(255,255,255,0.7)" />
                <Text className="text-[13px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {vehiculoActivo.km_actual?.toLocaleString('es-CL')} km · {vehiculoActivo.marca} {vehiculoActivo.modelo} {vehiculoActivo.anio}
                </Text>
              </View>
            </View>
            <ChevronDown size={22} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => navigation.navigate('AgregarVehiculo')}
            className="rounded-[18px] p-5 border border-dashed items-center gap-2"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }}
          >
            <Plus size={24} color="rgba(255,255,255,0.7)" />
            <Text className="font-semibold text-[15px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Agregar tu primer vehículo
            </Text>
          </TouchableOpacity>
        )}
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
      >
        {loading ? (
          <SkeletonList count={3} />
        ) : sinProblemas ? (
          <Animated.View entering={FadeInDown.delay(200)}>
            <EmptyState
              icon="CheckCircle"
              title="Podés manejar tranquilo"
              subtitle="Sin vencimientos ni mantenciones pendientes por ahora"
              positive
            />
          </Animated.View>
        ) : (
          <>
            {proximosVencimientos.length > 0 && (
              <Animated.View entering={FadeInDown.delay(100)}>
                <SectionTitle
                  title="Documentos por vencer"
                  action="Ver todos"
                  onAction={() => navigation.navigate('Documentos')}
                />
                {proximosVencimientos.map((doc) => (
                  <DocumentoCard
                    key={doc.id}
                    documento={doc}
                    onPress={() => navigation.navigate('EditarDocumento', { documento: doc })}
                  />
                ))}
              </Animated.View>
            )}

            {proximasMantenciones.length > 0 && (
              <Animated.View entering={FadeInDown.delay(200)}>
                <SectionTitle
                  title="Próximas mantenciones"
                  action="Ver todas"
                  onAction={() => navigation.navigate('Mantenciones')}
                />
                {proximasMantenciones.map((m) => (
                  <MantencionCard
                    key={m.id}
                    mantencion={m}
                    onPress={() => navigation.navigate('EditarMantencion', { mantencion: m })}
                  />
                ))}
              </Animated.View>
            )}

            {alertas.length > 0 && (
              <Animated.View entering={FadeInDown.delay(300)}>
                <SectionTitle title="Alertas activas" />
                {alertas.map((alerta) => (
                  <AlertaItem key={alerta.id} alerta={alerta} onDescartar={descartar} />
                ))}
              </Animated.View>
            )}
          </>
        )}
      </ScrollView>

      <VehiculoSelector visible={showSelector} onClose={() => setShowSelector(false)} />
      <Toast />
    </View>
  );
}
