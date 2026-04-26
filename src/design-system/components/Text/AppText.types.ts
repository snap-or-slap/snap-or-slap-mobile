import { TextStyle, TextProps, StyleProp } from 'react-native';

export type AppTextVariant = 
  | 'displayLarge' | 'displayMedium' | 'displaySmall'
  | 'headlineLarge' | 'headlineMedium' | 'headlineSmall'
  | 'titleLarge' | 'titleMedium' | 'titleSmall'
  | 'bodyLarge' | 'bodyMedium' | 'bodySmall'
  | 'labelLarge' | 'labelMedium' | 'labelSmall' | 'labelExtraSmall';

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
