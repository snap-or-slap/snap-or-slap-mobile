import React from 'react';
import Svg, { Path, Circle, Rect, Line, Polyline, Polygon, G, Defs, ClipPath, Mask } from 'react-native-svg';
import type { IconProps, IconVariant } from './Icon.types';

const DEFAULT_SIZE = 24;

const availableVariants = ['bold', 'broken', 'bulk', 'linear', 'outline', 'twoTone'] as const;
type LockIconVariant = (typeof availableVariants)[number];

function normalizeVariant(variant?: IconVariant): LockIconVariant {
  if (variant && availableVariants.includes(variant as any)) {
    return variant as LockIconVariant;
  }
  return 'outline';
}

function renderBold({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M12.0001 17.35C12.9003 17.35 13.6301 16.6202 13.6301 15.72C13.6301 14.8198 12.9003 14.09 12.0001 14.09C11.0999 14.09 10.3701 14.8198 10.3701 15.72C10.3701 16.6202 11.0999 17.35 12.0001 17.35Z" fill={color}/>
<Path d="M18.28 9.53V8.28C18.28 5.58 17.63 2 12 2C6.37 2 5.72 5.58 5.72 8.28V9.53C2.92 9.88 2 11.3 2 14.79V16.65C2 20.75 3.25 22 7.35 22H16.65C20.75 22 22 20.75 22 16.65V14.79C22 11.3 21.08 9.88 18.28 9.53ZM12 18.74C10.33 18.74 8.98 17.38 8.98 15.72C8.98 14.05 10.34 12.7 12 12.7C13.66 12.7 15.02 14.06 15.02 15.72C15.02 17.39 13.67 18.74 12 18.74ZM7.35 9.44C7.27 9.44 7.2 9.44 7.12 9.44V8.28C7.12 5.35 7.95 3.4 12 3.4C16.05 3.4 16.88 5.35 16.88 8.28V9.45C16.8 9.45 16.73 9.45 16.65 9.45H7.35V9.44Z" fill={color}/>
    </>
  );
}

function renderBroken({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M6 10V8C6 4.69 7 2 12 2C17 2 18 4.69 18 8V10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M9.5 16C9.5 17.38 10.62 18.5 12 18.5C13.38 18.5 14.5 17.38 14.5 16C14.5 14.62 13.38 13.5 12 13.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M22 17V15C22 11 21 10 17 10H7C3 10 2 11 2 15V17C2 21 3 22 7 22H17C18.76 22 19.94 21.81 20.71 21.25" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

function renderBulk({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path opacity="0.4" d="M12.0001 17.35C12.9003 17.35 13.6301 16.6202 13.6301 15.72C13.6301 14.8198 12.9003 14.09 12.0001 14.09C11.0999 14.09 10.3701 14.8198 10.3701 15.72C10.3701 16.6202 11.0999 17.35 12.0001 17.35Z" fill={secondaryColor ?? color}/>
<Path d="M16.65 9.44H7.35C3.25 9.44 2 10.69 2 14.79V16.65C2 20.75 3.25 22 7.35 22H16.65C20.75 22 22 20.75 22 16.65V14.79C22 10.69 20.75 9.44 16.65 9.44ZM12 18.74C10.33 18.74 8.98 17.38 8.98 15.72C8.98 14.06 10.33 12.7 12 12.7C13.67 12.7 15.02 14.06 15.02 15.72C15.02 17.38 13.67 18.74 12 18.74Z" fill={color}/>
<Path opacity="0.4" d="M7.11997 9.45V8.28C7.11997 5.35 7.94997 3.4 12 3.4C16.05 3.4 16.88 5.35 16.88 8.28V9.45C17.39 9.46 17.85 9.48 18.28 9.54V8.28C18.28 5.58 17.63 2 12 2C6.36997 2 5.71997 5.58 5.71997 8.28V9.53C6.13997 9.48 6.60997 9.45 7.11997 9.45Z" fill={secondaryColor ?? color}/>
    </>
  );
}

function renderLinear({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M15.7099 15.18L12.6099 13.33C12.0699 13.01 11.6299 12.24 11.6299 11.61V7.50999" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

function renderOutline({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M18 10.75C17.59 10.75 17.25 10.41 17.25 10V8C17.25 4.85 16.36 2.75 12 2.75C7.64 2.75 6.75 4.85 6.75 8V10C6.75 10.41 6.41 10.75 6 10.75C5.59 10.75 5.25 10.41 5.25 10V8C5.25 5.1 5.95 1.25 12 1.25C18.05 1.25 18.75 5.1 18.75 8V10C18.75 10.41 18.41 10.75 18 10.75Z" fill={color}/>
<Path d="M12 19.25C10.21 19.25 8.75 17.79 8.75 16C8.75 14.21 10.21 12.75 12 12.75C13.79 12.75 15.25 14.21 15.25 16C15.25 17.79 13.79 19.25 12 19.25ZM12 14.25C11.04 14.25 10.25 15.04 10.25 16C10.25 16.96 11.04 17.75 12 17.75C12.96 17.75 13.75 16.96 13.75 16C13.75 15.04 12.96 14.25 12 14.25Z" fill={color}/>
<Path d="M17 22.75H7C2.59 22.75 1.25 21.41 1.25 17V15C1.25 10.59 2.59 9.25 7 9.25H17C21.41 9.25 22.75 10.59 22.75 15V17C22.75 21.41 21.41 22.75 17 22.75ZM7 10.75C3.42 10.75 2.75 11.43 2.75 15V17C2.75 20.57 3.42 21.25 7 21.25H17C20.58 21.25 21.25 20.57 21.25 17V15C21.25 11.43 20.58 10.75 17 10.75H7Z" fill={color}/>
    </>
  );
}

function renderTwoTone({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path opacity="0.4" d="M6 10V8C6 4.69 7 2 12 2C17 2 18 4.69 18 8V10" stroke={secondaryColor ?? color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path opacity="0.4" d="M12 18.5C13.3807 18.5 14.5 17.3807 14.5 16C14.5 14.6193 13.3807 13.5 12 13.5C10.6193 13.5 9.5 14.6193 9.5 16C9.5 17.3807 10.6193 18.5 12 18.5Z" stroke={secondaryColor ?? color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M17 22H7C3 22 2 21 2 17V15C2 11 3 10 7 10H17C21 10 22 11 22 15V17C22 21 21 22 17 22Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

export function LockIcon({
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
