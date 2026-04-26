import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import React from 'react';

export type ButtonIntent = 'primary' | 'secondary' | 'positive' | 'negative' | 'subtle';
export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export type ButtonProps = {
  intent?: ButtonIntent;
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
