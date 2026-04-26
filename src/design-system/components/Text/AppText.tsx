import React from 'react';
import { Text } from 'react-native';
import { useTheme } from '../../theme';
import { AppTextProps } from './AppText.types';
import { createAppTextStyles } from './AppText.styles';

export const AppText: React.FC<AppTextProps> = ({
  variant = 'bodyMedium',
  color = 'primary',
  align = 'auto',
  children,
  style,
  testID,
  ...rest
}) => {
  const theme = useTheme();
  const styles = createAppTextStyles(theme, variant, color, align);

  return (
    <Text style={[styles.text, style]} testID={testID} {...rest}>
      {children}
    </Text>
  );
};
