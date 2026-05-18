import React, { useRef } from 'react';
import { Pressable, View, Animated } from 'react-native';
import { AppText } from '../Text';
import { useTheme } from '../../theme';
import { ButtonProps } from './Button.types';
import { createButtonStyles, getButtonTextVariant } from './Button.styles';
import { motion } from '../../utils/motion';

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  title,
  children,
  leftIcon,
  rightIcon,
  iconOnly = false,
  disabled = false,
  loading = false,
  fullWidth = false,
  onPress,
  accessibilityLabel,
  testID,
  style,
  textStyle,
}) => {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const content = children || title;
  const isInteractive = !disabled && !loading;

  const aLabel = accessibilityLabel || (typeof title === 'string' ? title : typeof children === 'string' ? children : undefined);

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
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityState={{ disabled: !isInteractive, busy: loading }}
        accessibilityLabel={aLabel}
        disabled={!isInteractive}
        onPress={onPress}
        onPressIn={isInteractive ? handlePressIn : undefined}
        onPressOut={isInteractive ? handlePressOut : undefined}
        style={({ pressed }) => [
          createButtonStyles(theme, { variant, size, disabled, loading, fullWidth, iconOnly, pressed }).container
        ]}
      >
        {({ pressed }) => {
          const styles = createButtonStyles(theme, { variant, size, disabled, loading, fullWidth, iconOnly, pressed });
          const textVariant = getButtonTextVariant(size);
          
          if (iconOnly) {
            return <>{leftIcon || rightIcon}</>;
          }

          return (
            <>
              {leftIcon && <View>{leftIcon}</View>}
              {content && (
                 <AppText variant={textVariant} style={[styles.text, textStyle]}>
                   {loading && !children && !title ? 'Loading...' : content}
                 </AppText>
              )}
              {rightIcon && <View>{rightIcon}</View>}
            </>
          );
        }}
      </Pressable>
    </Animated.View>
  );
};
