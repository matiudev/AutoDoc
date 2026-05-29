import "./global.css";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "./src/theme/ThemeContext";
import RootStack from "./src/navigation/RootStack";
import { colors } from "./src/theme/theme";

const NavTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bgBase,
    card: colors.bgSurface,
    border: colors.borderDefault,
    text: colors.textPrimary,
    primary: colors.accent,
    notification: colors.danger,
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bgBase }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <NavigationContainer theme={NavTheme}>
            <RootStack />
          </NavigationContainer>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
