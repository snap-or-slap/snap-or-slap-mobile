import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'subtle';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;

  title?: string;
  children?: React.ReactNode;

  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconOnly?: boolean;

  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;

  onPress?: () => void;

  accessibilityLabel?: string;
  testID?: string;

  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};
