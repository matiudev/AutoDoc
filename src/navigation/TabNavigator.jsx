import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, FileText, Wrench, User } from 'lucide-react-native';
import DashboardScreen from '../screens/DashboardScreen';
import DocumentosScreen from '../screens/DocumentosScreen';
import MantencionesScreen from '../screens/MantencionesScreen';
import PerfilScreen from '../screens/PerfilScreen';
import { colors } from '../theme/theme';

const Tab = createBottomTabNavigator();

const TABS = [
  { name: 'Dashboard', label: 'Inicio', icon: Home, component: DashboardScreen },
  { name: 'Documentos', label: 'Documentos', icon: FileText, component: DocumentosScreen },
  { name: 'Mantenciones', label: 'Mantenciones', icon: Wrench, component: MantencionesScreen },
  { name: 'Perfil', label: 'Perfil', icon: User, component: PerfilScreen },
];

export default function TabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.bgSurface,
          borderTopWidth: 1,
          borderTopColor: colors.borderDefault,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
          letterSpacing: 0.2,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const tab = TABS.find((t) => t.name === route.name);
          const Icon = tab?.icon ?? Home;

          return (
            <View
              style={focused ? {
                backgroundColor: `${colors.accent}20`,
                borderRadius: 10,
                padding: 4,
              } : { padding: 4 }}
            >
              <Icon size={22} color={color} strokeWidth={focused ? 2.5 : 1.8} />
            </View>
          );
        },
      })}
    >
      {TABS.map(({ name, label, component }) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={{ title: label }}
        />
      ))}
    </Tab.Navigator>
  );
}
