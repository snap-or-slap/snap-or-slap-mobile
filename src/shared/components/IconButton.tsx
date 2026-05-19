import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import { motion } from '@ds/utils';

type IconButtonSize = 'sm' | 'md' | 'lg';
type IconButtonVariant = 'ghost' | 'surface' | 'brand' | 'subtle' | 'filled';

type IconButtonProps = {
  icon: React.ReactNode;
  onPress?: () => void;
  accessibilityLabel: string;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
  disabled?: boolean;
  testID?: string;
};

const sizeMap: Record<IconButtonSize, number> = { sm: 32, md: 40, lg: 48 };

export function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  size = 'md',
  variant = 'surface',
  disabled = false,
  testID,
}: IconButtonProps) {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const dim = sizeMap[size];

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: motion.scale.pressed,
      duration: motion.duration.fast,
      useNativeDriver: true,
    }).start();
  };
  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: motion.duration.normal,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={!disabled ? handlePressIn : undefined}
        onPressOut={!disabled ? handlePressOut : undefined}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        testID={testID}
        style={[
          styles.base,
          {
            width: dim,
            height: dim,
            borderRadius: dim / 2,
            backgroundColor:
              variant === 'brand' || variant === 'filled'
                ? theme.colors.bg.brand
                : variant === 'surface' || variant === 'subtle'
                  ? theme.colors.bg['surface-elevated']
                  : 'transparent',
            opacity: disabled ? motion.opacity.disabled : 1,
          },
        ]}
      >
        {icon}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
