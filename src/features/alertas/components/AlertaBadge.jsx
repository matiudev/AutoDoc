import React, { useEffect, useRef } from 'react';
import { Animated, View, Text } from 'react-native';
import { colors } from '../../../theme/theme';

export default function AlertaBadge({ count }) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (count > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.2, duration: 700, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        ])
      ).start();
    }
    return () => pulse.stopAnimation();
  }, [count]);

  if (!count) return null;

  return (
    <Animated.View
      style={{
        transform: [{ scale: pulse }],
        backgroundColor: colors.danger,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5,
        position: 'absolute',
        top: -5,
        right: -5,
      }}
    >
      <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>
        {count > 9 ? '9+' : count}
      </Text>
    </Animated.View>
  );
}
