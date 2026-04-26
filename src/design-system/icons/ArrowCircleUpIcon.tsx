import React from 'react';
import Svg, { Path, Circle, Rect, Line, Polyline, Polygon, G, Defs, ClipPath, Mask } from 'react-native-svg';
import type { IconProps, IconVariant } from './Icon.types';

const DEFAULT_SIZE = 24;

const availableVariants = ['bold', 'broken', 'bulk', 'linear', 'outline', 'twoTone'] as const;
type ArrowCircleUpIconVariant = (typeof availableVariants)[number];

function normalizeVariant(variant?: IconVariant): ArrowCircleUpIconVariant {
  if (variant && availableVariants.includes(variant as any)) {
    return variant as ArrowCircleUpIconVariant;
  }
  return 'outline';
}

function renderBold({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM13.79 15C14.08 15.29 14.08 15.77 13.79 16.06C13.64 16.21 13.45 16.28 13.26 16.28C13.07 16.28 12.88 16.21 12.73 16.06L9.2 12.53C8.91 12.24 8.91 11.76 9.2 11.47L12.73 7.94C13.02 7.65 13.5 7.65 13.79 7.94C14.08 8.23 14.08 8.71 13.79 9L10.79 12L13.79 15Z" fill={color}/>
    </>
  );
}

function renderBroken({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M4.87 4.99C3.09 6.79 2 9.27 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2C11.31 2 10.64 2.07 9.98 2.2" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M13.26 15.53L9.73999 12L10.7 11.03L12.9 8.83L13.26 8.47" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

function renderBulk({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path opacity="0.4" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill={secondaryColor ?? color}/>
<Path d="M13.2599 16.28C13.0699 16.28 12.8799 16.21 12.7299 16.06L9.19992 12.53C8.90992 12.24 8.90992 11.76 9.19992 11.47L12.7299 7.94C13.0199 7.65 13.4999 7.65 13.7899 7.94C14.0799 8.23 14.0799 8.71 13.7899 9L10.7899 12L13.7899 15C14.0799 15.29 14.0799 15.77 13.7899 16.06C13.6499 16.21 13.4599 16.28 13.2599 16.28Z" fill={color}/>
    </>
  );
}

function renderLinear({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M13.26 15.53L9.73999 12L13.26 8.47" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

function renderOutline({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12C1.25 6.07 6.07 1.25 12 1.25C17.93 1.25 22.75 6.07 22.75 12C22.75 17.93 17.93 22.75 12 22.75ZM12 2.75C6.9 2.75 2.75 6.9 2.75 12C2.75 17.1 6.9 21.25 12 21.25C17.1 21.25 21.25 17.1 21.25 12C21.25 6.9 17.1 2.75 12 2.75Z" fill={color}/>
<Path d="M13.2599 16.28C13.0699 16.28 12.8799 16.21 12.7299 16.06L9.19992 12.53C8.90992 12.24 8.90992 11.76 9.19992 11.47L12.7299 7.94C13.0199 7.65 13.4999 7.65 13.7899 7.94C14.0799 8.23 14.0799 8.71 13.7899 9L10.7899 12L13.7899 15C14.0799 15.29 14.0799 15.77 13.7899 16.06C13.6499 16.21 13.4599 16.28 13.2599 16.28Z" fill={color}/>
    </>
  );
}

function renderTwoTone({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path opacity="0.4" d="M13.26 15.53L9.73999 12L13.26 8.47" stroke={secondaryColor ?? color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

export function ArrowCircleUpIcon({
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
