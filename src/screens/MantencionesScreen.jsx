import React, { useEffect, useCallback, useState } from 'react';
import { View, FlatList, TouchableOpacity, RefreshControl, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import useMantencionStore from '../features/mantenciones/store/useMantencionStore';
import useVehiculoStore from '../features/vehiculos/store/useVehiculoStore';
import MantencionCard from '../features/mantenciones/components/MantencionCard';
import { SkeletonList } from '../components/ui/Skeleton';
import EmptyState from '../components/shared/EmptyState';
import AppHeader from '../components/shared/AppHeader';
import { Toast } from '../components/ui/CustomToast';
import { colors } from '../theme/theme';

export default function MantencionesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { vehiculoActivo } = useVehiculoStore();
  const { mantenciones, loading, fetchMantenciones } = useMantencionStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (vehiculoActivo) fetchMantenciones(vehiculoActivo.id);
  }, [vehiculoActivo]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (vehiculoActivo) await fetchMantenciones(vehiculoActivo.id);
    setRefreshing(false);
  }, [vehiculoActivo]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgBase, paddingTop: insets.top + 8 }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgBase} />

      <View style={{ paddingHorizontal: 20 }}>
        <AppHeader
          title="Mantenciones"
          subtitle={vehiculoActivo?.nombre_alias}
          rightElement={
            <TouchableOpacity
              onPress={() => navigation.navigate('AgregarMantencion')}
              style={{
                width: 42,
                height: 42,
                borderRadius: 13,
                backgroundColor: colors.accent,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: colors.accent,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              <Plus size={22} color="#fff" />
            </TouchableOpacity>
          }
        />
      </View>

      {loading && !refreshing ? (
        <View style={{ paddingHorizontal: 20 }}>
          <SkeletonList count={4} />
        </View>
      ) : (
        <FlatList
          data={mantenciones}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 100,
            flexGrow: 1,
          }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
          ListEmptyComponent={
            <EmptyState
              icon="Wrench"
              title="Sin mantenciones registradas"
              subtitle="Registrá el cambio de aceite, frenos u otras mantenciones realizadas"
              positive={false}
            />
          }
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(index * 60)}>
              <MantencionCard
                mantencion={item}
                onPress={() => navigation.navigate('EditarMantencion', { mantencion: item })}
              />
            </Animated.View>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
      <Toast />
    </View>
  );
}
