import { ViewStyle, StyleProp } from 'react-native';
import { ReactNode } from 'react';

export interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: number | string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
