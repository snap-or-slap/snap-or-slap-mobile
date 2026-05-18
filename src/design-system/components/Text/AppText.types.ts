import { TextStyle, TextProps, StyleProp } from 'react-native';

export type AppTextVariant = 
  | 'display' | 'heading' | 'title' | 'subtitle' 
  | 'body' | 'bodyStrong' | 'label' | 'caption' | 'overline';

export type AppTextColor = 
  | 'primary' | 'secondary' | 'tertiary' | 'inverse' 
  | 'disabled' | 'brand' | 'danger' | 'success' | 'warning' | 'info';

export interface AppTextProps extends TextProps {
  variant?: AppTextVariant;
  color?: AppTextColor | string;
  align?: 'left' | 'center' | 'right' | 'auto' | 'justify';
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  testID?: string;
}
