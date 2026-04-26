import type { ColorValue } from 'react-native';

export type IconVariant =
  | 'bold'
  | 'outline'
  | 'broken'
  | 'linear'
  | 'bulk'
  | 'solid'
  | 'filled'
  | 'twoTone'
  | 'duotone';

export type IconProps = {
  size?: number;
  color?: ColorValue;
  secondaryColor?: ColorValue;
  strokeWidth?: number;
  variant?: IconVariant;
  testID?: string;
};
