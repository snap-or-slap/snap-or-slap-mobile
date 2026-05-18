import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

interface AnimatedIllustrationProps {
  /** Key that triggers a re-animation when changed (e.g. current slide index) */
  animKey: string | number;
  children: React.ReactNode;
}

const DURATION_IN = 240;
const DURATION_TRANSLATE = 220;
const TRANSLATE_START = 10;

/**
 * Wraps onboarding illustration content and plays a subtle
 * fade-in + upward translate animation whenever `animKey` changes.
 *
 * Motion values follow design-system utils/motion.ts guidelines:
 * - duration 160–280 ms
 * - translateY 6–12 px
 * - opacity 0 → 1
 */
export function AnimatedIllustration({
  animKey,
  children,
}: AnimatedIllustrationProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(TRANSLATE_START)).current;

  useEffect(() => {
    // Reset to initial state
    opacity.setValue(0);
    translateY.setValue(TRANSLATE_START);

    // Animate in
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: DURATION_IN,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: DURATION_TRANSLATE,
        useNativeDriver: true,
      }),
    ]).start();
  }, [animKey]);

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});
