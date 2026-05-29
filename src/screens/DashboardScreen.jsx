import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronDown, Gauge, Plus, FileText, Wrench, Bell } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import useVehiculoStore from '../features/vehiculos/store/useVehiculoStore';
import useAlertaStore from '../features/alertas/store/useAlertaStore';
import useAuthStore from '../features/auth/store/useAuthStore';
import VehiculoSelector from '../features/vehiculos/components/VehiculoSelector';
import AlertaItem from '../features/alertas/components/AlertaItem';
import { SkeletonList } from '../components/ui/Skeleton';
import EmptyState from '../components/shared/EmptyState';
import { colors } from '../theme/theme';
import DocumentoCard from '../features/documentos/components/DocumentoCard';
import MantencionCard from '../features/mantenciones/components/MantencionCard';
import { Toast } from '../components/ui/CustomToast';

function SectionTitle({ title, action, onAction }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, marginTop: 24 }}>
      <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: '700' }}>{title}</Text>
      {action && (
        <TouchableOpacity onPress={onAction}>
          <Text style={{ color: colors.accentSoft, fontSize: 13, fontWeight: '600' }}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function DashboardScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { vehiculoActivo, fetchVehiculos } = useVehiculoStore();
  const { proximosVencimientos, proximasMantenciones, alertas, loading, fetchTodo, descartar } = useAlertaStore();
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
    <View style={{ flex: 1, backgroundColor: colors.bgBase }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgBase} />

      {/* Header hero */}
      <LinearGradient
        colors={[colors.gradientHeroStart, colors.gradientHeroEnd, colors.bgBase]}
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 20,
          paddingBottom: 32,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <View>
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, letterSpacing: 0.8, textTransform: 'uppercase' }}>
              Bienvenido
            </Text>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700', marginTop: 2 }}>
              {user?.user_metadata?.name?.split(' ')[0] ?? 'AutoDoc'}
            </Text>
          </View>

          {totalAlertas > 0 && (
            <View style={{ backgroundColor: `${colors.danger}25`, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: `${colors.danger}40` }}>
              <Text style={{ color: colors.danger, fontSize: 12, fontWeight: '700' }}>
                {totalAlertas} alerta{totalAlertas !== 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>

        {vehiculoActivo ? (
          <TouchableOpacity
            onPress={() => setShowSelector(true)}
            style={{
              backgroundColor: 'rgba(255,255,255,0.12)',
              borderRadius: 18,
              padding: 18,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.15)',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 }}>
                Vehículo activo
              </Text>
              <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800', letterSpacing: -0.5, marginBottom: 6 }}>
                {vehiculoActivo.nombre_alias}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Gauge size={13} color="rgba(255,255,255,0.7)" />
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                  {vehiculoActivo.km_actual?.toLocaleString('es-CL')} km · {vehiculoActivo.marca} {vehiculoActivo.modelo} {vehiculoActivo.anio}
                </Text>
              </View>
            </View>
            <ChevronDown size={22} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => navigation.navigate('AgregarVehiculo')}
            style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: 18,
              padding: 20,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.2)',
              borderStyle: 'dashed',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Plus size={24} color="rgba(255,255,255,0.7)" />
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontWeight: '600', fontSize: 15 }}>
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
