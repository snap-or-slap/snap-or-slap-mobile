import { ViewStyle, StyleProp, TextStyle } from 'react-native';
import { ReactNode } from 'react';

export interface BadgeProps {
  variant?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  leftIcon?: ReactNode;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
}
