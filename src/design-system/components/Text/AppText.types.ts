import { TextStyle, TextProps, StyleProp } from 'react-native';

export type AppTextVariant = 
  | 'display' | 'heading' | 'title' | 'subtitle' 
  | 'body' | 'bodyStrong' | 'label' | 'caption' | 'overline';

export type AppTextColor = 
  | 'primary' | 'secondary' | 'tertiary' | 'inverse' 
  | 'disabled' | 'brand' | 'on-brand' | 'danger' | 'on-error'
  | 'success' | 'on-success' | 'warning' | 'on-warning'
  | 'info' | 'on-info';

export interface AppTextProps extends TextProps {
  variant?: AppTextVariant;
  color?: AppTextColor | string;
  align?: 'left' | 'center' | 'right' | 'auto' | 'justify';
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  testID?: string;
}
