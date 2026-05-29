import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import { useTheme } from "../theme/useTheme";
import DetailsScreen from "../screens/DetailsScreen";

// Crea los navegadores
const Stack = createNativeStackNavigator();

// --- Stack principal (maneja pantallas fuera del tab) ---
function RootStack() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.accent,
        headerTitleStyle: {
          color: colors.text,
        },
      }}
    >
      {/* Navbar principal */}
      <Stack.Screen
        name="HomeTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="DetailsScreen"
        component={DetailsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default RootStack;
