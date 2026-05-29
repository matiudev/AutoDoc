import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { colors } from '../../theme/theme';

function SkeletonBox({ width, height, borderRadius = 8, style }) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.6] });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.bgElevated,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function SkeletonCard() {
  return (
    <View
      style={{
        backgroundColor: colors.bgSurface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.borderDefault,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <SkeletonBox width={40} height={40} borderRadius={10} />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <SkeletonBox width="60%" height={14} style={{ marginBottom: 6 }} />
          <SkeletonBox width="40%" height={11} />
        </View>
      </View>
      <SkeletonBox width="80%" height={11} style={{ marginBottom: 6 }} />
      <SkeletonBox width="50%" height={11} />
    </View>
  );
}

export function SkeletonList({ count = 3 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </>
  );
}

export default SkeletonBox;
