import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { useTheme } from '@ds/theme';
import { WaveBackgroundSvg } from './WaveBackgroundSvg';

interface AnimatedWaveBackgroundProps {
  currentIndex: number;
  slideCount?: number;
  testID?: string;
}

const WAVE_HEIGHT = 230;
const WAVE_WIDTH_MULTIPLIER = 5;
const ANIMATION_DURATION = 420;

export function AnimatedWaveBackground({
  currentIndex,
  slideCount = 5,
  testID = 'onboarding-wave-background',
}: AnimatedWaveBackgroundProps) {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();

  const translateX = useRef(new Animated.Value(0)).current;

  const waveWidth = useMemo(
    () => screenWidth * WAVE_WIDTH_MULTIPLIER,
    [screenWidth]
  );

  const safeSlideCount = Math.max(slideCount, 1);
  const safeIndex = Math.min(
    Math.max(currentIndex, 0),
    safeSlideCount - 1
  );

  const intervals = Math.max(safeSlideCount - 1, 1);
  const maxShift = waveWidth - screenWidth;
  const shiftPerSlide = maxShift / intervals;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: -(safeIndex * shiftPerSlide),
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();
  }, [safeIndex, shiftPerSlide, translateX]);

  const waveColor = theme.colors?.bg?.['brand-subtle'] ?? '#FFEDE7';

  const secondaryWaveColor = theme.colors?.bg?.['brand-subtle-hover'];

  return (
    <View style={styles.container} testID={testID} pointerEvents="none">
      <Animated.View
        style={[
          styles.waveLayer,
          {
            width: waveWidth,
            height: WAVE_HEIGHT,
            transform: [{ translateX }],
          },
        ]}
      >
        <WaveBackgroundSvg
          width={waveWidth}
          height={WAVE_HEIGHT}
          color={waveColor}
          secondaryColor={secondaryWaveColor}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: WAVE_HEIGHT,
    overflow: 'hidden',
    zIndex: 0,
  },
  waveLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});