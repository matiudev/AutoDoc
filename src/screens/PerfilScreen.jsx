import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Image, Modal, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LogOut, ChevronRight, Plus, User } from 'lucide-react-native';
import useAuthStore from '../features/auth/store/useAuthStore';
import useVehiculoStore from '../features/vehiculos/store/useVehiculoStore';
import VehiculoCard from '../features/vehiculos/components/VehiculoCard';
import SliderConfirm from '../components/shared/SliderConfirm';
import AppHeader from '../components/shared/AppHeader';
import { ToastManager } from '../components/ui/CustomToast';
import { colors } from '../theme/theme';

function SettingRow({ icon: Icon, label, sublabel, onPress, danger = false }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      className="flex-row items-center gap-[14px] py-[15px] px-4 rounded-[14px] mb-2 border"
      style={{
        backgroundColor: colors.bgSurface,
        borderColor: danger ? `${colors.danger}25` : colors.borderDefault,
      }}
    >
      <View
        className="w-[38px] h-[38px] rounded-[11px] items-center justify-center"
        style={{ backgroundColor: danger ? `${colors.danger}15` : colors.bgElevated }}
      >
        <Icon size={18} color={danger ? colors.danger : colors.textSecondary} />
      </View>
      <View className="flex-1">
        <Text
          className="text-[15px] font-medium"
          style={{ color: danger ? colors.danger : colors.textPrimary }}
        >
          {label}
        </Text>
        {sublabel && (
          <Text className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
            {sublabel}
          </Text>
        )}
      </View>
      <ChevronRight size={16} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

export default function PerfilScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const vehiculos = useVehiculoStore(s => s.vehiculos);
  const vehiculoActivo = useVehiculoStore(s => s.vehiculoActivo);
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      ToastManager.show({ type: 'error', text1: 'Error al cerrar sesión', text2: err.message });
    }
  };

  const avatarUrl = user?.user_metadata?.avatar_url;
  const nombre = user?.user_metadata?.full_name ?? user?.email ?? 'Usuario';

  return (
    <View className="flex-1" style={{ backgroundColor: colors.bgBase, paddingTop: insets.top + 8 }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgBase} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 100 }}
      >
        <AppHeader title="Perfil" />

        {/* User card */}
        <View
          className="rounded-[20px] p-5 flex-row items-center gap-4 border mb-7"
          style={{ backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }}
        >
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} className="w-14 h-14 rounded-2xl" />
          ) : (
            <View
              className="w-14 h-14 rounded-2xl items-center justify-center"
              style={{ backgroundColor: `${colors.accent}20` }}
            >
              <User size={26} color={colors.accentSoft} />
            </View>
          )}
          <View className="flex-1">
            <Text className="text-[17px] font-bold" style={{ color: colors.textPrimary }}>
              {nombre}
            </Text>
            <Text className="text-[13px] mt-[3px]" style={{ color: colors.textSecondary }}>
              {user?.email}
            </Text>
          </View>
        </View>

        {/* Vehículos */}
        <Text
          className="text-xs font-semibold tracking-[0.8px] uppercase mb-3"
          style={{ color: colors.textSecondary }}
        >
          Mis Vehículos
        </Text>

        {vehiculos.map((v) => (
          <VehiculoCard
            key={v.id}
            vehiculo={v}
            activo={v.id === vehiculoActivo?.id}
            onPress={() => navigation.navigate('EditarVehiculo', { vehiculo: v })}
          />
        ))}

        <TouchableOpacity
          onPress={() => navigation.navigate('AgregarVehiculo')}
          className="flex-row items-center justify-center gap-2 mb-7 py-3.5 rounded-[14px] border border-dashed"
          style={{ borderColor: colors.borderDefault }}
        >
          <Plus size={18} color={colors.accentSoft} />
          <Text className="font-semibold text-sm" style={{ color: colors.accentSoft }}>
            Agregar vehículo
          </Text>
        </TouchableOpacity>

        {/* Configuración */}
        <Text
          className="text-xs font-semibold tracking-[0.8px] uppercase mb-3"
          style={{ color: colors.textSecondary }}
        >
          Configuración
        </Text>

        <SettingRow
          icon={LogOut}
          label="Cerrar sesión"
          onPress={() => setShowLogout(true)}
          danger
        />
      </ScrollView>

      {/* Logout confirmation */}
      <Modal visible={showLogout} transparent animationType="slide" onRequestClose={() => setShowLogout(false)}>
        <Pressable className="flex-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onPress={() => setShowLogout(false)} />
        <View
          className="absolute bottom-0 left-0 right-0 rounded-t-3xl p-6 border-t"
          style={{
            backgroundColor: colors.bgSurface,
            paddingBottom: insets.bottom + 24,
            borderTopColor: colors.borderDefault,
          }}
        >
          <Text className="text-lg font-bold mb-2" style={{ color: colors.textPrimary }}>
            Cerrar sesión
          </Text>
          <Text className="text-sm mb-6" style={{ color: colors.textSecondary }}>
            ¿Estás seguro que querés cerrar sesión?
          </Text>
          <SliderConfirm onConfirm={handleLogout} label="Deslizá para cerrar sesión" />
        </View>
      </Modal>
    </View>
  );
}
