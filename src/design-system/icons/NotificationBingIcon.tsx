import React from 'react';
import Svg, { Path, Circle, Rect, Line, Polyline, Polygon, G, Defs, ClipPath, Mask } from 'react-native-svg';
import type { IconProps, IconVariant } from './Icon.types';

const DEFAULT_SIZE = 24;

const availableVariants = ['bold', 'broken', 'bulk', 'linear', 'outline', 'twoTone'] as const;
type NotificationBingIconVariant = (typeof availableVariants)[number];

function normalizeVariant(variant?: IconVariant): NotificationBingIconVariant {
  if (variant && availableVariants.includes(variant as any)) {
    return variant as NotificationBingIconVariant;
  }
  return 'outline';
}

function renderBold({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M20.19 14.06L19.06 12.18C18.81 11.77 18.59 10.98 18.59 10.5V8.63C18.59 5 15.64 2.05 12.02 2.05C8.38996 2.06 5.43996 5 5.43996 8.63V10.49C5.43996 10.97 5.21996 11.76 4.97996 12.17L3.84996 14.05C3.41996 14.78 3.31996 15.61 3.58996 16.33C3.85996 17.06 4.46996 17.64 5.26996 17.9C6.34996 18.26 7.43996 18.52 8.54996 18.71C8.65996 18.73 8.76996 18.74 8.87996 18.76C9.01996 18.78 9.16996 18.8 9.31996 18.82C9.57996 18.86 9.83996 18.89 10.11 18.91C10.74 18.97 11.38 19 12.02 19C12.65 19 13.28 18.97 13.9 18.91C14.13 18.89 14.36 18.87 14.58 18.84C14.76 18.82 14.94 18.8 15.12 18.77C15.23 18.76 15.34 18.74 15.45 18.72C16.57 18.54 17.68 18.26 18.76 17.9C19.53 17.64 20.12 17.06 20.4 16.32C20.68 15.57 20.6 14.75 20.19 14.06ZM12.75 10C12.75 10.42 12.41 10.76 11.99 10.76C11.57 10.76 11.23 10.42 11.23 10V6.9C11.23 6.48 11.57 6.14 11.99 6.14C12.41 6.14 12.75 6.48 12.75 6.9V10Z" fill={color}/>
<Path d="M14.8299 20.01C14.4099 21.17 13.2999 22 11.9999 22C11.2099 22 10.4299 21.68 9.87993 21.11C9.55993 20.81 9.31993 20.41 9.17993 20C9.30993 20.02 9.43993 20.03 9.57993 20.05C9.80993 20.08 10.0499 20.11 10.2899 20.13C10.8599 20.18 11.4399 20.21 12.0199 20.21C12.5899 20.21 13.1599 20.18 13.7199 20.13C13.9299 20.11 14.1399 20.1 14.3399 20.07C14.4999 20.05 14.6599 20.03 14.8299 20.01Z" fill={color}/>
    </>
  );
}

function renderBroken({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M12 6.44V9.77" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round"/>
<Path d="M20.5899 15.17C21.3199 16.39 20.7399 17.97 19.3899 18.42C14.6099 20.01 9.43993 20.01 4.65993 18.42C3.21993 17.94 2.66993 16.48 3.45993 15.17L4.72993 13.05C5.07993 12.47 5.35993 11.44 5.35993 10.77V8.67C5.35993 4.98 8.33993 2 12.0199 2C15.6799 2 18.6799 5 18.6799 8.66V10.76C18.6799 10.94 18.6999 11.14 18.7299 11.35" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round"/>
<Path d="M15.3299 18.82C15.3299 20.65 13.8299 22.15 11.9999 22.15C11.0899 22.15 10.2499 21.77 9.64992 21.17C9.04992 20.57 8.66992 19.73 8.66992 18.82" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10"/>
    </>
  );
}

function renderBulk({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path opacity="0.4" d="M20.4 16.33C20.12 17.08 19.53 17.65 18.76 17.91C17.68 18.27 16.57 18.54 15.45 18.73C15.34 18.75 15.23 18.77 15.12 18.78C14.94 18.81 14.76 18.83 14.58 18.85C14.36 18.88 14.13 18.9 13.9 18.92C13.27 18.97 12.65 19 12.02 19C11.38 19 10.74 18.97 10.11 18.91C9.83996 18.89 9.57996 18.86 9.31996 18.82C9.16996 18.8 9.01996 18.78 8.87996 18.76C8.76996 18.74 8.65996 18.73 8.54996 18.71C7.43996 18.53 6.33996 18.26 5.26996 17.9C4.46996 17.63 3.85996 17.06 3.58996 16.33C3.31996 15.61 3.41996 14.77 3.84996 14.05L4.97996 12.17C5.21996 11.76 5.43996 10.97 5.43996 10.49V8.63C5.43996 5 8.38996 2.05 12.02 2.05C15.64 2.05 18.59 5 18.59 8.63V10.49C18.59 10.97 18.81 11.76 19.06 12.17L20.19 14.05C20.6 14.75 20.68 15.57 20.4 16.33Z" fill={secondaryColor ?? color}/>
<Path d="M12 10.76C11.58 10.76 11.24 10.42 11.24 10V6.9C11.24 6.48 11.58 6.14 12 6.14C12.42 6.14 12.76 6.48 12.76 6.9V10C12.75 10.42 12.41 10.76 12 10.76Z" fill={color}/>
<Path d="M14.8299 20.01C14.4099 21.17 13.2999 22 11.9999 22C11.2099 22 10.4299 21.68 9.87993 21.11C9.55993 20.81 9.31993 20.41 9.17993 20C9.30993 20.02 9.43993 20.03 9.57993 20.05C9.80993 20.08 10.0499 20.11 10.2899 20.13C10.8599 20.18 11.4399 20.21 12.0199 20.21C12.5899 20.21 13.1599 20.18 13.7199 20.13C13.9299 20.11 14.1399 20.1 14.3399 20.07C14.4999 20.05 14.6599 20.03 14.8299 20.01Z" fill={color}/>
    </>
  );
}

function renderLinear({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M12 6.44V9.77" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round"/>
<Path d="M12.0199 2C8.3399 2 5.3599 4.98 5.3599 8.66V10.76C5.3599 11.44 5.0799 12.46 4.7299 13.04L3.4599 15.16C2.6799 16.47 3.2199 17.93 4.6599 18.41C9.4399 20 14.6099 20 19.3899 18.41C20.7399 17.96 21.3199 16.38 20.5899 15.16L19.3199 13.04C18.9699 12.46 18.6899 11.43 18.6899 10.76V8.66C18.6799 5 15.6799 2 12.0199 2Z" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round"/>
<Path d="M15.3299 18.82C15.3299 20.65 13.8299 22.15 11.9999 22.15C11.0899 22.15 10.2499 21.77 9.64992 21.17C9.04992 20.57 8.66992 19.73 8.66992 18.82" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10"/>
    </>
  );
}

function renderOutline({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M12 10.52C11.59 10.52 11.25 10.18 11.25 9.77V6.44C11.25 6.03 11.59 5.69 12 5.69C12.41 5.69 12.75 6.03 12.75 6.44V9.77C12.75 10.19 12.41 10.52 12 10.52Z" fill={color}/>
<Path d="M12.0201 20.35C9.44011 20.35 6.87011 19.94 4.42011 19.12C3.51011 18.82 2.82011 18.17 2.52011 17.35C2.22011 16.53 2.32011 15.59 2.81011 14.77L4.08011 12.65C4.36011 12.18 4.61011 11.3 4.61011 10.75V8.65001C4.61011 4.56001 7.93011 1.24001 12.0201 1.24001C16.1101 1.24001 19.4301 4.56001 19.4301 8.65001V10.75C19.4301 11.29 19.6801 12.18 19.9601 12.65L21.2301 14.77C21.7001 15.55 21.7801 16.48 21.4701 17.33C21.1601 18.18 20.4801 18.83 19.6201 19.12C17.1701 19.95 14.6001 20.35 12.0201 20.35ZM12.0201 2.75001C8.76011 2.75001 6.11011 5.40001 6.11011 8.66001V10.76C6.11011 11.57 5.79011 12.74 5.37011 13.43L4.10011 15.56C3.84011 15.99 3.78011 16.45 3.93011 16.85C4.08011 17.25 4.42011 17.55 4.90011 17.71C9.50011 19.24 14.5601 19.24 19.1601 17.71C19.5901 17.57 19.9201 17.25 20.0701 16.83C20.2301 16.41 20.1801 15.95 19.9501 15.56L18.6801 13.44C18.2601 12.75 17.9401 11.58 17.9401 10.77V8.67001C17.9301 5.40001 15.2801 2.75001 12.0201 2.75001Z" fill={color}/>
<Path d="M11.9999 22.9C10.9299 22.9 9.87992 22.46 9.11992 21.7C8.35992 20.94 7.91992 19.89 7.91992 18.82H9.41992C9.41992 19.5 9.69992 20.16 10.1799 20.64C10.6599 21.12 11.3199 21.4 11.9999 21.4C13.4199 21.4 14.5799 20.24 14.5799 18.82H16.0799C16.0799 21.07 14.2499 22.9 11.9999 22.9Z" fill={color}/>
    </>
  );
}

function renderTwoTone({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path opacity="0.4" d="M12 6.44V9.77" stroke={secondaryColor ?? color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round"/>
<Path d="M12.0199 2C8.3399 2 5.3599 4.98 5.3599 8.66V10.76C5.3599 11.44 5.0799 12.46 4.7299 13.04L3.4599 15.16C2.6799 16.47 3.2199 17.93 4.6599 18.41C9.4399 20 14.6099 20 19.3899 18.41C20.7399 17.96 21.3199 16.38 20.5899 15.16L19.3199 13.04C18.9699 12.46 18.6899 11.43 18.6899 10.76V8.66C18.6799 5 15.6799 2 12.0199 2Z" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round"/>
<Path opacity="0.4" d="M15.3299 18.82C15.3299 20.65 13.8299 22.15 11.9999 22.15C11.0899 22.15 10.2499 21.77 9.64992 21.17C9.04992 20.57 8.66992 19.73 8.66992 18.82" stroke={secondaryColor ?? color} strokeWidth={strokeWidth} strokeMiterlimit="10"/>
    </>
  );
}

export function NotificationBingIcon({
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
