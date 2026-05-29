import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Image, Modal, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LogOut, ChevronRight, Car, Plus, Settings, User } from 'lucide-react-native';
import useAuthStore from '../features/auth/store/useAuthStore';
import useVehiculoStore from '../features/vehiculos/store/useVehiculoStore';
import VehiculoCard from '../features/vehiculos/components/VehiculoCard';
import SliderConfirm from '../components/shared/SliderConfirm';
import AppHeader from '../components/shared/AppHeader';
import { Toast, ToastManager } from '../components/ui/CustomToast';
import { colors } from '../theme/theme';

function SettingRow({ icon: Icon, label, sublabel, onPress, danger = false }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingVertical: 15,
        paddingHorizontal: 16,
        backgroundColor: colors.bgSurface,
        borderRadius: 14,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: danger ? `${colors.danger}25` : colors.borderDefault,
      }}
    >
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: 11,
          backgroundColor: danger ? `${colors.danger}15` : colors.bgElevated,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={18} color={danger ? colors.danger : colors.textSecondary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: danger ? colors.danger : colors.textPrimary, fontSize: 15, fontWeight: '500' }}>
          {label}
        </Text>
        {sublabel && (
          <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 2 }}>{sublabel}</Text>
        )}
      </View>
      <ChevronRight size={16} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

export default function PerfilScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const { vehiculos, vehiculoActivo, setVehiculoActivo } = useVehiculoStore();
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
    <View style={{ flex: 1, backgroundColor: colors.bgBase, paddingTop: insets.top + 8 }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgBase} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 100 }}
      >
        <AppHeader title="Perfil" />

        {/* User card */}
        <View
          style={{
            backgroundColor: colors.bgSurface,
            borderRadius: 20,
            padding: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
            borderWidth: 1,
            borderColor: colors.borderDefault,
            marginBottom: 28,
          }}
        >
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={{ width: 56, height: 56, borderRadius: 16 }} />
          ) : (
            <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: `${colors.accent}20`, alignItems: 'center', justifyContent: 'center' }}>
              <User size={26} color={colors.accentSoft} />
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.textPrimary, fontSize: 17, fontWeight: '700' }}>{nombre}</Text>
            <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 3 }}>{user?.email}</Text>
          </View>
        </View>

        {/* Vehículos */}
        <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12 }}>
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
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 28,
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

        {/* Settings */}
        <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12 }}>
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
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }} onPress={() => setShowLogout(false)} />
        <View
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            backgroundColor: colors.bgSurface,
            borderTopLeftRadius: 24, borderTopRightRadius: 24,
            padding: 24, paddingBottom: insets.bottom + 24,
            borderTopWidth: 1, borderTopColor: colors.borderDefault,
          }}
        >
          <Text style={{ color: colors.textPrimary, fontSize: 18, fontWeight: '700', marginBottom: 8 }}>
            Cerrar sesión
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 24 }}>
            ¿Estás seguro que querés cerrar sesión?
          </Text>
          <SliderConfirm onConfirm={handleLogout} label="Deslizá para cerrar sesión" />
        </View>
      </Modal>

      <Toast />
    </View>
  );
}
