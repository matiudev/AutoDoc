import React, { useRef, useEffect } from 'react';
import { View, Animated, PanResponder, Dimensions, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ChevronRight } from 'lucide-react-native';
import { colors } from '../../theme/theme';

const THUMB_SIZE = 52;
const SLIDER_HEIGHT = 60;

export default function SliderConfirm({ onConfirm, label = 'Deslizá para eliminar', loading = false, variant = 'danger' }) {
  const { width: SCREEN_WIDTH } = Dimensions.get('window');
  const TRACK_WIDTH = SCREEN_WIDTH - 48;
  const MAX_DRAG = TRACK_WIDTH - THUMB_SIZE - 8;

  const color = variant === 'primary' ? colors.accent : colors.danger;

  const translateX = useRef(new Animated.Value(0)).current;
  const confirmedRef = useRef(false);
  const onConfirmRef = useRef(onConfirm);
  const loadingRef = useRef(loading);

  useEffect(() => { onConfirmRef.current = onConfirm; }, [onConfirm]);
  useEffect(() => { loadingRef.current = loading; }, [loading]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !loadingRef.current,
      onMoveShouldSetPanResponder: (_, gs) => !loadingRef.current && Math.abs(gs.dx) > Math.abs(gs.dy),
      onPanResponderMove: (_, gs) => {
        if (loadingRef.current) return;
        translateX.setValue(Math.max(0, Math.min(gs.dx, MAX_DRAG)));
      },
      onPanResponderRelease: (_, gs) => {
        if (loadingRef.current) return;
        const current = Math.max(0, Math.min(gs.dx, MAX_DRAG));
        if (current >= MAX_DRAG * 0.9) {
          Animated.spring(translateX, { toValue: MAX_DRAG, useNativeDriver: false }).start();
          if (!confirmedRef.current) {
            confirmedRef.current = true;
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            onConfirmRef.current();
          }
        } else {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: false }).start();
          confirmedRef.current = false;
        }
      },
    })
  ).current;

  const labelOpacity = translateX.interpolate({
    inputRange: [0, MAX_DRAG * 0.4],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const progressWidth = translateX.interpolate({
    inputRange: [0, MAX_DRAG],
    outputRange: [THUMB_SIZE + 4, TRACK_WIDTH],
    extrapolate: 'clamp',
  });

  const progressOpacity = translateX.interpolate({
    inputRange: [0, MAX_DRAG],
    outputRange: [0.15, 0.35],
    extrapolate: 'clamp',
  });

  return (
    <View
      style={{
        height: SLIDER_HEIGHT,
        backgroundColor: loading ? `${colors.textSecondary}15` : `${color}20`,
        borderRadius: SLIDER_HEIGHT / 2,
        borderWidth: 1,
        borderColor: loading ? `${colors.textSecondary}30` : `${color}40`,
        overflow: 'hidden',
        justifyContent: 'center',
      }}
    >
      {!loading && (
        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: progressWidth,
            opacity: progressOpacity,
            backgroundColor: color,
            borderRadius: SLIDER_HEIGHT / 2,
          }}
        />
      )}

      {!loading && (
        <Animated.Text
          style={{
            position: 'absolute',
            width: '100%',
            textAlign: 'center',
            color: color,
            fontSize: 13,
            fontWeight: '600',
            letterSpacing: 0.5,
            opacity: labelOpacity,
          }}
        >
          {label}
        </Animated.Text>
      )}

      {loading && (
        <View style={{ position: 'absolute', width: '100%', alignItems: 'center' }}>
          <ActivityIndicator size="small" color={colors.textSecondary} />
        </View>
      )}

      <Animated.View
        {...panResponder.panHandlers}
        style={{
          width: THUMB_SIZE,
          height: THUMB_SIZE,
          borderRadius: THUMB_SIZE / 2,
          backgroundColor: loading ? colors.textSecondary : color,
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 4,
          elevation: 6,
          shadowColor: loading ? colors.textSecondary : color,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 8,
          transform: [{ translateX }],
          opacity: loading ? 0.5 : 1,
        }}
      >
        {loading
          ? <ActivityIndicator size="small" color="#fff" />
          : <ChevronRight size={22} color="#fff" />
        }
      </Animated.View>
    </View>
  );
}
