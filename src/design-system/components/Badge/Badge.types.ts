import { ViewStyle, StyleProp } from 'react-native';
import { ReactNode } from 'react';

export interface BadgeProps {
  tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
