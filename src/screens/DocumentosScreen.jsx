import React, { useEffect, useCallback, useState } from 'react';
import { View, FlatList, TouchableOpacity, RefreshControl, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import useDocumentoStore from '../features/documentos/store/useDocumentoStore';
import useVehiculoStore from '../features/vehiculos/store/useVehiculoStore';
import DocumentoCard from '../features/documentos/components/DocumentoCard';
import { SkeletonList } from '../components/ui/Skeleton';
import EmptyState from '../components/shared/EmptyState';
import AppHeader from '../components/shared/AppHeader';
import { Toast } from '../components/ui/CustomToast';
import { colors } from '../theme/theme';

export default function DocumentosScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const vehiculoActivo = useVehiculoStore(s => s.vehiculoActivo);
  const documentos = useDocumentoStore(s => s.documentos);
  const loading = useDocumentoStore(s => s.loading);
  const fetchDocumentos = useDocumentoStore(s => s.fetchDocumentos);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (vehiculoActivo) fetchDocumentos(vehiculoActivo.id);
  }, [vehiculoActivo]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (vehiculoActivo) await fetchDocumentos(vehiculoActivo.id);
    setRefreshing(false);
  }, [vehiculoActivo]);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.bgBase, paddingTop: insets.top + 8 }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgBase} />

      <View className="px-5">
        <AppHeader
          title="Documentos"
          subtitle={vehiculoActivo?.nombre_alias}
          rightElement={
            <TouchableOpacity
              onPress={() => navigation.navigate('AgregarDocumento')}
              className="w-[42px] h-[42px] rounded-[13px] items-center justify-center"
              style={{
                backgroundColor: colors.accent,
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
        <View className="px-5">
          <SkeletonList count={4} />
        </View>
      ) : (
        <FlatList
          data={documentos}
          keyExtractor={(d) => d.id}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 100,
            flexGrow: 1,
          }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
          ListEmptyComponent={
            <EmptyState
              icon="FileText"
              title="Sin documentos"
              subtitle="Agregá el seguro, la revisión técnica u otros documentos de tu vehículo"
              positive={false}
            />
          }
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(index * 60)}>
              <DocumentoCard
                documento={item}
                onPress={() => navigation.navigate('EditarDocumento', { documento: item })}
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
