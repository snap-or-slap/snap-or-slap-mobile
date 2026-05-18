import { ViewStyle, StyleProp } from 'react-native';
import { ReactNode } from 'react';

export interface ScreenProps {
  children: ReactNode;
  scrollable?: boolean;
  safeArea?: 'top' | 'bottom' | 'both' | 'none';
  padding?: 'none' | 'md' | 'lg';
  background?: string;
  keyboardAvoiding?: boolean;
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
  contentStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
