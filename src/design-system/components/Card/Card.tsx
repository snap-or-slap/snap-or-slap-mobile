import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme';
import { CardProps } from './Card.types';
import { createCardStyles } from './Card.styles';

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding,
  children,
  style,
  testID,
}) => {
  const theme = useTheme();
  const styles = createCardStyles(theme, variant, padding);

  return (
    <View style={[styles.card, style]} testID={testID}>
      {children}
    </View>
  );
};
