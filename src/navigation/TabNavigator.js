import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import IconLucide from "../components/IconLucide";
import { useTheme } from "../theme/useTheme";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TabOneScreen from "../screens/TabOneScreen";
import TabTwoScreen from "../screens/TabTwoScreen";


// Crea los navegadores
const Tab = createBottomTabNavigator();

// --- Tabs principales (navbar inferior) ---
function TabNavigator() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.icon,
        tabBarInactiveTintColor: colors.iconSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          paddingTop: 8,
           height: 70 + insets.bottom,
           paddingBottom: insets.bottom,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "TabOneScreen") {
            iconName = focused ? "LayoutDashboard" : "LayoutDashboard";
          } else if (route.name === "TabTwoScreen") {
            iconName = focused ? "ChartNoAxesCombined" : "ChartNoAxesCombined";
          } 
          // else if (route.name === "Productos") {
          //   iconName = focused ? "Archive" : "Archive";
          // } else if (route.name === "Clientes") {
          //   iconName = focused ? "Users" : "Users";
          // }

          return <IconLucide name={iconName} color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen
        name="TabOneScreen"
        component={TabOneScreen}
        options={{ title: "Inicio" }}
      />
        <Tab.Screen
          name="TabTwoScreen"
          component={TabTwoScreen}
          options={{ title: "Two Screen" }}
        />
    </Tab.Navigator>
  );
}

export default TabNavigator;