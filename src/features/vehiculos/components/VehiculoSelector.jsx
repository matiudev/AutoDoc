import React from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, Pressable } from 'react-native';
import { X, Plus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import useVehiculoStore from '../store/useVehiculoStore';
import VehiculoCard from './VehiculoCard';
import { colors } from '../../../theme/theme';

export default function VehiculoSelector({ visible, onClose }) {
  const navigation = useNavigation();
  const vehiculos = useVehiculoStore(s => s.vehiculos);
  const vehiculoActivo = useVehiculoStore(s => s.vehiculoActivo);
  const setVehiculoActivo = useVehiculoStore(s => s.setVehiculoActivo);

  const seleccionar = (vehiculo) => {
    setVehiculoActivo(vehiculo);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }} onPress={onClose} />
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colors.bgSurface,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingTop: 12,
          paddingBottom: 40,
          paddingHorizontal: 20,
          borderTopWidth: 1,
          borderTopColor: colors.borderDefault,
          maxHeight: '70%',
        }}
      >
        <View
          style={{
            width: 36,
            height: 4,
            borderRadius: 2,
            backgroundColor: colors.borderDefault,
            alignSelf: 'center',
            marginBottom: 20,
          }}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ color: colors.textPrimary, fontSize: 18, fontWeight: '700' }}>
            Mis Vehículos
          </Text>
          <TouchableOpacity onPress={onClose}>
            <X size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={vehiculos}
          keyExtractor={(v) => v.id}
          renderItem={({ item }) => (
            <VehiculoCard
              vehiculo={item}
              activo={item.id === vehiculoActivo?.id}
              onPress={() => seleccionar(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
        />

        <TouchableOpacity
          onPress={() => { onClose(); navigation.navigate('AgregarVehiculo'); }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginTop: 8,
            paddingVertical: 14,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: colors.borderDefault,
            borderStyle: 'dashed',
          }}
        >
          <Plus size={18} color={colors.accentSoft} />
          <Text style={{ color: colors.accentSoft, fontWeight: '600', fontSize: 14 }}>
            Agregar vehículo
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
