import React, { useRef } from 'react';
import { View, Pressable, Animated } from 'react-native';
import { useTheme } from '../../theme';
import { CardProps } from './Card.types';
import { createCardStyles } from './Card.styles';
import { motion } from '../../utils/motion';

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  pressable = false,
  onPress,
  disabled = false,
  children,
  style,
  accessibilityLabel,
  testID,
}) => {
  const theme = useTheme();
  const styles = createCardStyles(theme, variant, padding);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const isInteractive = (pressable || !!onPress) && !disabled;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: motion.scale.cardPressed,
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

  const cardContent = (
    <View style={[styles.card, style]} testID={testID} accessibilityLabel={accessibilityLabel}>
      {children}
    </View>
  );

  if (isInteractive) {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          onPress={onPress}
          disabled={disabled}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          accessibilityRole="button"
          accessibilityState={{ disabled }}
        >
          {cardContent}
        </Pressable>
      </Animated.View>
    );
  }

  return cardContent;
};
