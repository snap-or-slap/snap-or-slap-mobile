import React from 'react';
import Svg, { Path, Circle, Rect, Line, Polyline, Polygon, G, Defs, ClipPath, Mask } from 'react-native-svg';
import type { IconProps, IconVariant } from './Icon.types';

const DEFAULT_SIZE = 24;

const availableVariants = ['bold', 'broken', 'bulk', 'linear', 'outline', 'twoTone'] as const;
type EyeSlashIconVariant = (typeof availableVariants)[number];

function normalizeVariant(variant?: IconVariant): EyeSlashIconVariant {
  if (variant && availableVariants.includes(variant as any)) {
    return variant as EyeSlashIconVariant;
  }
  return 'outline';
}

function renderBold({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M21.25 9.14999C18.94 5.51999 15.56 3.42999 12 3.42999C10.22 3.42999 8.49 3.94999 6.91 4.91999C5.33 5.89999 3.91 7.32999 2.75 9.14999C1.75 10.72 1.75 13.27 2.75 14.84C5.06 18.48 8.44 20.56 12 20.56C13.78 20.56 15.51 20.04 17.09 19.07C18.67 18.09 20.09 16.66 21.25 14.84C22.25 13.28 22.25 10.72 21.25 9.14999ZM12 16.04C9.76 16.04 7.96 14.23 7.96 12C7.96 9.76999 9.76 7.95999 12 7.95999C14.24 7.95999 16.04 9.76999 16.04 12C16.04 14.23 14.24 16.04 12 16.04Z" fill={color}/>
<Path d="M11.9999 9.14C10.4299 9.14 9.1499 10.42 9.1499 12C9.1499 13.57 10.4299 14.85 11.9999 14.85C13.5699 14.85 14.8599 13.57 14.8599 12C14.8599 10.43 13.5699 9.14 11.9999 9.14Z" fill={color}/>
    </>
  );
}

function renderBroken({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M9.02992 14C8.63992 13.43 8.41992 12.74 8.41992 12C8.41992 10.02 10.0199 8.42 11.9999 8.42C13.9799 8.42 15.5799 10.02 15.5799 12C15.5799 13.98 13.9799 15.58 11.9999 15.58" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M17.5601 5.58C15.8701 4.38 13.9701 3.73 12.0001 3.73C8.47009 3.73 5.18009 5.81 2.89009 9.41C1.99009 10.82 1.99009 13.19 2.89009 14.6C5.18009 18.2 8.47009 20.28 12.0001 20.28C15.5301 20.28 18.8201 18.2 21.1101 14.6C22.0101 13.19 22.0101 10.82 21.1101 9.41" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

function renderBulk({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path opacity="0.4" d="M21.25 9.15C18.94 5.52 15.56 3.43 12 3.43C10.22 3.43 8.49 3.95 6.91 4.92C5.33 5.9 3.91 7.33 2.75 9.15C1.75 10.72 1.75 13.27 2.75 14.84C5.06 18.48 8.44 20.56 12 20.56C13.78 20.56 15.51 20.04 17.09 19.07C18.67 18.09 20.09 16.66 21.25 14.84C22.25 13.28 22.25 10.72 21.25 9.15ZM12 16.04C9.76 16.04 7.96 14.23 7.96 12C7.96 9.77 9.76 7.96 12 7.96C14.24 7.96 16.04 9.77 16.04 12C16.04 14.23 14.24 16.04 12 16.04Z" fill={secondaryColor ?? color}/>
<Path d="M11.9999 9.14C10.4299 9.14 9.1499 10.42 9.1499 12C9.1499 13.57 10.4299 14.85 11.9999 14.85C13.5699 14.85 14.8599 13.57 14.8599 12C14.8599 10.43 13.5699 9.14 11.9999 9.14Z" fill={color}/>
    </>
  );
}

function renderLinear({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M15.5799 12C15.5799 13.98 13.9799 15.58 11.9999 15.58C10.0199 15.58 8.41992 13.98 8.41992 12C8.41992 10.02 10.0199 8.42001 11.9999 8.42001C13.9799 8.42001 15.5799 10.02 15.5799 12Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M12.0001 20.27C15.5301 20.27 18.8201 18.19 21.1101 14.59C22.0101 13.18 22.0101 10.81 21.1101 9.4C18.8201 5.8 15.5301 3.72 12.0001 3.72C8.47009 3.72 5.18009 5.8 2.89009 9.4C1.99009 10.81 1.99009 13.18 2.89009 14.59C5.18009 18.19 8.47009 20.27 12.0001 20.27Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

function renderOutline({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M11.9999 16.33C9.60992 16.33 7.66992 14.39 7.66992 12C7.66992 9.61 9.60992 7.67 11.9999 7.67C14.3899 7.67 16.3299 9.61 16.3299 12C16.3299 14.39 14.3899 16.33 11.9999 16.33ZM11.9999 9.17C10.4399 9.17 9.16992 10.44 9.16992 12C9.16992 13.56 10.4399 14.83 11.9999 14.83C13.5599 14.83 14.8299 13.56 14.8299 12C14.8299 10.44 13.5599 9.17 11.9999 9.17Z" fill={color}/>
<Path d="M12.0001 21.02C8.24008 21.02 4.69008 18.82 2.25008 15C1.19008 13.35 1.19008 10.66 2.25008 9C4.70008 5.18 8.25008 2.98 12.0001 2.98C15.7501 2.98 19.3001 5.18 21.7401 9C22.8001 10.65 22.8001 13.34 21.7401 15C19.3001 18.82 15.7501 21.02 12.0001 21.02ZM12.0001 4.48C8.77008 4.48 5.68008 6.42 3.52008 9.81C2.77008 10.98 2.77008 13.02 3.52008 14.19C5.68008 17.58 8.77008 19.52 12.0001 19.52C15.2301 19.52 18.3201 17.58 20.4801 14.19C21.2301 13.02 21.2301 10.98 20.4801 9.81C18.3201 6.42 15.2301 4.48 12.0001 4.48Z" fill={color}/>
    </>
  );
}

function renderTwoTone({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path opacity="0.4" d="M15.5799 12C15.5799 13.98 13.9799 15.58 11.9999 15.58C10.0199 15.58 8.41992 13.98 8.41992 12C8.41992 10.02 10.0199 8.42 11.9999 8.42C13.9799 8.42 15.5799 10.02 15.5799 12Z" stroke={secondaryColor ?? color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M12.0001 20.27C15.5301 20.27 18.8201 18.19 21.1101 14.59C22.0101 13.18 22.0101 10.81 21.1101 9.4C18.8201 5.8 15.5301 3.72 12.0001 3.72C8.47009 3.72 5.18009 5.8 2.89009 9.4C1.99009 10.81 1.99009 13.18 2.89009 14.59C5.18009 18.19 8.47009 20.27 12.0001 20.27Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

export function EyeSlashIcon({
  size = DEFAULT_SIZE,
  color = 'currentColor',
  secondaryColor,
  strokeWidth = 2,
  variant,
  testID,
}: IconProps) {
  const resolvedVariant = normalizeVariant(variant);

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      testID={testID}
    >
      {resolvedVariant === 'bold' ? renderBold({ color, secondaryColor, strokeWidth }) : 
        resolvedVariant === 'broken' ? renderBroken({ color, secondaryColor, strokeWidth }) : 
        resolvedVariant === 'bulk' ? renderBulk({ color, secondaryColor, strokeWidth }) : 
        resolvedVariant === 'linear' ? renderLinear({ color, secondaryColor, strokeWidth }) : 
        resolvedVariant === 'outline' ? renderOutline({ color, secondaryColor, strokeWidth }) : 
        resolvedVariant === 'twoTone' ? renderTwoTone({ color, secondaryColor, strokeWidth }) : null}
    </Svg>
  );
}
