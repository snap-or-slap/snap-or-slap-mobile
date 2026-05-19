import React from 'react';
import { View } from 'react-native';
import { AppText } from '../Text';
import { useTheme } from '../../theme';
import { BadgeProps } from './Badge.types';
import { createBadgeStyles, getBadgeTextColor, getBadgeTextVariant } from './Badge.styles';

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  leftIcon,
  children,
  style,
  textStyle,
  testID,
}) => {
  const theme = useTheme();
  const styles = createBadgeStyles(theme, variant, size);
  const textColor = getBadgeTextColor(variant);
  const textVariant = getBadgeTextVariant(size);

  return (
    <View style={[styles.badge, style]} testID={testID}>
      {leftIcon && <View>{leftIcon}</View>}
      {typeof children === 'string' || typeof children === 'number' ? (
        <AppText variant={textVariant} color={textColor} style={textStyle}>{String(children)}</AppText>
      ) : children}
    </View>
  );
};
