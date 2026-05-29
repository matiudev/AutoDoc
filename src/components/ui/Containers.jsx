import React from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from "../../theme/useTheme";
import { View } from "react-native";

export const ContainerWithTopBar = ({ children }) => {
  const { colors } = useTheme()
  return (
    <View
      className={`flex-1 px-5`}
      style={{ backgroundColor: colors.background, paddingTop: 16 }}
    >
      {children}
    </View>
  );
};

export const ContainerTabs = ({ children }) => {
  const { colors } = useTheme()

  return (
    <SafeAreaView
      className={`flex-1 px-10 pt-8`}
      style={{
        backgroundColor: colors.background
      }}
    >
      {children}
    </SafeAreaView>
  );
};

export const ContainerStack = ({ children }) => {
  const { colors } = useTheme()

  return (
    <SafeAreaView
      className={`flex-1 px-5 pt-8`}
      style={{ backgroundColor: colors.background }}
    >
      {children}
    </SafeAreaView>
  );
};

export const ContainerModal = ({ children }) => {
  const { colors } = useTheme()

  return (
    <SafeAreaView
      className={`flex-1 px-5 pt-8`}
      style={{ backgroundColor: colors.background }}
    >
      {children}
    </SafeAreaView>
  );
};
