import React from 'react';
import Svg, { Path, Circle, Rect, Line, Polyline, Polygon, G, Defs, ClipPath, Mask } from 'react-native-svg';
import type { IconProps, IconVariant } from './Icon.types';

const DEFAULT_SIZE = 24;

const availableVariants = ['bold', 'broken', 'bulk', 'linear', 'outline', 'twoTone'] as const;
type ArrowCircleDownIconVariant = (typeof availableVariants)[number];

function normalizeVariant(variant?: IconVariant): ArrowCircleDownIconVariant {
  if (variant && availableVariants.includes(variant as any)) {
    return variant as ArrowCircleDownIconVariant;
  }
  return 'outline';
}

function renderBold({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM14.79 12.53L11.26 16.06C11.11 16.21 10.92 16.28 10.73 16.28C10.54 16.28 10.35 16.21 10.2 16.06C9.91 15.77 9.91 15.29 10.2 15L13.2 12L10.2 9C9.91 8.71 9.91 8.23 10.2 7.94C10.49 7.65 10.97 7.65 11.26 7.94L14.79 11.47C15.09 11.76 15.09 12.24 14.79 12.53Z" fill={color}/>
    </>
  );
}

function renderBroken({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M4.87 4.99C3.09 6.79 2 9.27 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2C11.31 2 10.64 2.07 9.98 2.2" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M10.74 15.53L14.26 12L10.74 8.47" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

function renderBulk({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path opacity="0.4" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill={secondaryColor ?? color}/>
<Path d="M10.7399 16.28C10.5499 16.28 10.3599 16.21 10.2099 16.06C9.91993 15.77 9.91993 15.29 10.2099 15L13.2099 12L10.2099 9C9.91993 8.71 9.91993 8.23 10.2099 7.94C10.4999 7.65 10.9799 7.65 11.2699 7.94L14.7999 11.47C15.0899 11.76 15.0899 12.24 14.7999 12.53L11.2699 16.06C11.1199 16.21 10.9299 16.28 10.7399 16.28Z" fill={color}/>
    </>
  );
}

function renderLinear({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M10.74 15.53L14.26 12L10.74 8.47" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

function renderOutline({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12C1.25 6.07 6.07 1.25 12 1.25C17.93 1.25 22.75 6.07 22.75 12C22.75 17.93 17.93 22.75 12 22.75ZM12 2.75C6.9 2.75 2.75 6.9 2.75 12C2.75 17.1 6.9 21.25 12 21.25C17.1 21.25 21.25 17.1 21.25 12C21.25 6.9 17.1 2.75 12 2.75Z" fill={color}/>
<Path d="M10.7399 16.28C10.5499 16.28 10.3599 16.21 10.2099 16.06C9.91993 15.77 9.91993 15.29 10.2099 15L13.2099 12L10.2099 9C9.91993 8.71 9.91993 8.23 10.2099 7.94C10.4999 7.65 10.9799 7.65 11.2699 7.94L14.7999 11.47C15.0899 11.76 15.0899 12.24 14.7999 12.53L11.2699 16.06C11.1199 16.21 10.9299 16.28 10.7399 16.28Z" fill={color}/>
    </>
  );
}

function renderTwoTone({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path opacity="0.4" d="M10.74 15.53L14.26 12L10.74 8.47" stroke={secondaryColor ?? color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

export function ArrowCircleDownIcon({
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
