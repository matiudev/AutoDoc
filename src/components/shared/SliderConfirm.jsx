import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { ChevronRight } from 'lucide-react-native';
import { colors } from '../../theme/theme';

const THUMB_SIZE = 52;
const SLIDER_HEIGHT = 60;

export default function SliderConfirm({ onConfirm, label = 'Deslizá para eliminar' }) {
  const { width: SCREEN_WIDTH } = Dimensions.get('window');
  const TRACK_WIDTH = SCREEN_WIDTH - 48;
  const MAX_DRAG = TRACK_WIDTH - THUMB_SIZE - 8;

  const translateX = useSharedValue(0);
  const confirmed = useSharedValue(false);

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      const next = event.translationX;
      translateX.value = Math.max(0, Math.min(next, MAX_DRAG));
    })
    .onEnd(() => {
      if (translateX.value >= MAX_DRAG * 0.9) {
        translateX.value = withSpring(MAX_DRAG);
        if (!confirmed.value) {
          confirmed.value = true;
          runOnJS(triggerHaptic)();
          runOnJS(onConfirm)();
        }
      } else {
        translateX.value = withSpring(0);
        confirmed.value = false;
      }
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const labelOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, MAX_DRAG * 0.4], [1, 0], Extrapolation.CLAMP),
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: translateX.value + THUMB_SIZE + 4,
    opacity: interpolate(translateX.value, [0, MAX_DRAG], [0.15, 0.35], Extrapolation.CLAMP),
  }));

  return (
    <View
      style={{
        height: SLIDER_HEIGHT,
        backgroundColor: `${colors.danger}20`,
        borderRadius: SLIDER_HEIGHT / 2,
        borderWidth: 1,
        borderColor: `${colors.danger}40`,
        overflow: 'hidden',
        justifyContent: 'center',
      }}
    >
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            backgroundColor: colors.danger,
            borderRadius: SLIDER_HEIGHT / 2,
          },
          progressStyle,
        ]}
      />

      <Animated.Text
        style={[
          {
            position: 'absolute',
            width: '100%',
            textAlign: 'center',
            color: colors.danger,
            fontSize: 13,
            fontWeight: '600',
            letterSpacing: 0.5,
          },
          labelOpacity,
        ]}
      >
        {label}
      </Animated.Text>

      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            {
              width: THUMB_SIZE,
              height: THUMB_SIZE,
              borderRadius: THUMB_SIZE / 2,
              backgroundColor: colors.danger,
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 4,
              shadowColor: colors.danger,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 8,
              elevation: 6,
            },
            thumbStyle,
          ]}
        >
          <ChevronRight size={22} color="#fff" />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
