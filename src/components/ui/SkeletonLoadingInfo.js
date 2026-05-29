import React from "react";
import { View, Animated, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { useTheme } from "../../theme/useTheme";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

export const SkeletonLoadingInfo = () => {
  const { colors, theme } = useTheme();

  // refs shimmer
  const avatarRef = React.useRef();
  const firstLineRef = React.useRef();
  const secondLineRef = React.useRef();

  // animación de "latido"
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    // shimmer animación secuencial
    if (avatarRef.current && firstLineRef.current && secondLineRef.current) {
      const shimmerAnim = Animated.stagger(400, [
        avatarRef.current.getAnimated(),
        Animated.parallel([
          firstLineRef.current.getAnimated(),
          secondLineRef.current.getAnimated(),
        ]),
      ]);
      Animated.loop(shimmerAnim).start();
    }

    // animación de latido
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.03,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Colores para shimmer según tema
  const shimmerColors =
    theme === "light"
      ? ["#fafafa", "#f5f5f5", "#fafafa"]
      : ["#262626", "#2a2a2a", "#262626"];

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      padding: 16,
      marginTop: 16,
      borderRadius: 16,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    line: {
      width: 125,
      height: 15,
      marginVertical: 4,
      borderRadius: 4,
    },
    line2: {
      width: 50,
      height: 15,
      marginVertical: 4,
      borderRadius: 4,
    },
  });

  return (
    <Animated.View
      style={[styles.container, { transform: [{ scale: scaleAnim }] }]}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <ShimmerPlaceholder
          ref={avatarRef}
          stopAutoRun
          shimmerColors={shimmerColors}
          style={styles.avatar}
        />
        <View style={{ marginLeft: 10 }}>
          <ShimmerPlaceholder
            ref={firstLineRef}
            stopAutoRun
            shimmerColors={shimmerColors}
            style={styles.line}
          />
          <ShimmerPlaceholder
            ref={secondLineRef}
            stopAutoRun
            shimmerColors={shimmerColors}
            style={styles.line2}
          />
        </View>
      </View>
    </Animated.View>
  );
};
