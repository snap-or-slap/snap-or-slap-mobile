import React from 'react';
import { View } from 'react-native';
import { AppText } from '../Text';
import { useTheme } from '../../theme';
import { BadgeProps } from './Badge.types';
import { createBadgeStyles, getBadgeTextColor, getBadgeTextVariant } from './Badge.styles';

export const Badge: React.FC<BadgeProps> = ({
  tone = 'neutral',
  size = 'md',
  children,
  style,
  testID,
}) => {
  const theme = useTheme();
  const styles = createBadgeStyles(theme, tone, size);
  const textColor = getBadgeTextColor(tone);
  const textVariant = getBadgeTextVariant(size);

  return (
    <View style={[styles.badge, style]} testID={testID}>
      {typeof children === 'string' ? (
        <AppText variant={textVariant} color={textColor}>{children}</AppText>
      ) : children}
    </View>
  );
};
