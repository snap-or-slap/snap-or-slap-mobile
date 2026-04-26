import React from 'react';
import Svg, { Path, Circle, Rect, Line, Polyline, Polygon, G, Defs, ClipPath, Mask } from 'react-native-svg';
import type { IconProps, IconVariant } from './Icon.types';

const DEFAULT_SIZE = 24;

const availableVariants = ['bold', 'broken', 'bulk', 'linear', 'outline', 'twoTone'] as const;
type FingerScanIconVariant = (typeof availableVariants)[number];

function normalizeVariant(variant?: IconVariant): FingerScanIconVariant {
  if (variant && availableVariants.includes(variant as any)) {
    return variant as FingerScanIconVariant;
  }
  return 'outline';
}

function renderBold({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M22 9.75C21.59 9.75 21.25 9.41 21.25 9V7C21.25 4.42 19.58 2.75 17 2.75H15C14.59 2.75 14.25 2.41 14.25 2C14.25 1.59 14.59 1.25 15 1.25H17C20.44 1.25 22.75 3.56 22.75 7V9C22.75 9.41 22.41 9.75 22 9.75Z" fill={color}/>
<Path d="M2 9.75C1.59 9.75 1.25 9.41 1.25 9V7C1.25 3.56 3.56 1.25 7 1.25H9C9.41 1.25 9.75 1.59 9.75 2C9.75 2.41 9.41 2.75 9 2.75H7C4.42 2.75 2.75 4.42 2.75 7V9C2.75 9.41 2.41 9.75 2 9.75Z" fill={color}/>
<Path d="M17 22.75H15C14.59 22.75 14.25 22.41 14.25 22C14.25 21.59 14.59 21.25 15 21.25H17C19.58 21.25 21.25 19.58 21.25 17V15C21.25 14.59 21.59 14.25 22 14.25C22.41 14.25 22.75 14.59 22.75 15V17C22.75 20.44 20.44 22.75 17 22.75Z" fill={color}/>
<Path d="M9 22.75H7C3.56 22.75 1.25 20.44 1.25 17V15C1.25 14.59 1.59 14.25 2 14.25C2.41 14.25 2.75 14.59 2.75 15V17C2.75 19.58 4.42 21.25 7 21.25H9C9.41 21.25 9.75 21.59 9.75 22C9.75 22.41 9.41 22.75 9 22.75Z" fill={color}/>
<Path d="M12.0001 9.87C11.5101 9.87 11.1001 10.27 11.1001 10.77V13.24C11.1001 13.74 11.5001 14.14 12.0001 14.14C12.5001 14.14 12.9001 13.74 12.9001 13.24V10.77C12.9001 10.27 12.4901 9.87 12.0001 9.87Z" fill={color}/>
<Path d="M15.53 7.39999C15.19 7.05999 14.8 6.76999 14.38 6.52999C14.24 6.45999 14.09 6.38999 13.94 6.31999C13.79 6.25999 13.64 6.19999 13.48 6.15999C13.32 6.10999 13.16 6.06999 13 6.02999C12.99 6.02999 12.97 6.02999 12.96 6.01999C12.65 5.95999 12.33 5.92999 12.01 5.92999H11.99C11.67 5.92999 11.36 5.95999 11.05 6.01999C11.01 6.02999 10.97 6.02999 10.94 6.04999C10.8 6.07999 10.66 6.10999 10.52 6.15999C10.35 6.19999 10.18 6.26999 10.01 6.33999C9.88001 6.39999 9.75001 6.46999 9.63001 6.52999C9.48001 6.60999 9.35001 6.69999 9.21001 6.78999C8.95001 6.96999 8.70001 7.16999 8.47001 7.39999C8.36001 7.50999 8.25001 7.62999 8.15001 7.74999C8.05001 7.87999 7.95001 7.99999 7.86001 8.13999C7.77001 8.26999 7.69001 8.40999 7.61001 8.54999C7.23001 9.25999 7.01001 10.07 7.01001 10.93V13.07C7.01001 14.8 7.89001 16.32 9.21001 17.21C9.33001 17.3 9.46001 17.37 9.59001 17.45L10.14 17.71C10.42 17.82 10.71 17.91 11 17.97C11.32 18.03 11.65 18.07 11.99 18.07C12 18.07 12 18.07 12.01 18.07C12.35 18.07 12.68 18.03 13 17.97C13.3 17.91 13.59 17.82 13.87 17.71C14.06 17.63 14.24 17.54 14.41 17.45C15.95 16.6 16.99 14.95 16.99 13.07V10.93C16.99 9.54999 16.43 8.29999 15.53 7.39999ZM14.4 13.24C14.4 14.56 13.32 15.64 12 15.64C10.68 15.64 9.60001 14.56 9.60001 13.24V10.77C9.60001 9.44999 10.68 8.36999 12 8.36999C13.32 8.36999 14.4 9.44999 14.4 10.77V13.24Z" fill={color}/>
    </>
  );
}

function renderBroken({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M12.0001 9.12C12.9101 9.12 13.6501 9.86002 13.6501 10.77V13.24C13.6501 14.15 12.9101 14.89 12.0001 14.89C11.0901 14.89 10.3501 14.15 10.3501 13.24" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
<Path d="M16.98 13.47C16.78 16.05 14.62 18.07 12 18.07C9.24 18.07 7 15.83 7 13.07V10.93C7 8.16999 9.24 5.92999 12 5.92999C14.59 5.92999 16.72 7.89998 16.97 10.42" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
<Path d="M15 2H17C20 2 22 4 22 7V9" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M2 9V7C2 4 4 2 7 2H9" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M15 22H17C20 22 22 20 22 17V15" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M2 15V17C2 20 4 22 7 22H9" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

function renderBulk({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path opacity="0.4" d="M16.99 10.93V13.07C16.99 14.95 15.95 16.6 14.41 17.45C14.24 17.54 14.06 17.63 13.87 17.71C13.59 17.82 13.3 17.91 13 17.97C12.68 18.03 12.35 18.07 12.01 18.07C12 18.07 12 18.07 11.99 18.07C11.65 18.07 11.32 18.03 11 17.97C10.71 17.91 10.42 17.82 10.14 17.71L9.59 17.45C9.46 17.37 9.33001 17.3 9.21001 17.21C7.89001 16.32 7.01001 14.8 7.01001 13.07V10.93C7.01001 10.07 7.23001 9.25999 7.61001 8.54999C7.69001 8.40999 7.77001 8.27001 7.86001 8.14001C7.95001 8.00001 8.05001 7.88 8.15001 7.75C8.25001 7.63 8.36001 7.50999 8.47001 7.39999C8.70001 7.16999 8.95001 6.97001 9.21001 6.79001C9.35001 6.70001 9.48 6.61 9.63 6.53C9.75 6.47 9.88001 6.4 10.01 6.34C10.18 6.27 10.35 6.2 10.52 6.16C10.66 6.11 10.8 6.07999 10.94 6.04999C10.97 6.02999 11.01 6.02999 11.05 6.01999C11.36 5.95999 11.67 5.92999 11.99 5.92999H12.01C12.33 5.92999 12.65 5.95999 12.96 6.01999C12.97 6.02999 12.99 6.03 13 6.03C13.16 6.07 13.32 6.11 13.48 6.16C13.64 6.2 13.79 6.26001 13.94 6.32001C14.09 6.39001 14.24 6.46 14.38 6.53C14.8 6.77 15.19 7.05999 15.53 7.39999C16.43 8.29999 16.99 9.54999 16.99 10.93Z" fill={secondaryColor ?? color}/>
<Path d="M22 9.75C21.59 9.75 21.25 9.41 21.25 9V7C21.25 4.42 19.58 2.75 17 2.75H15C14.59 2.75 14.25 2.41 14.25 2C14.25 1.59 14.59 1.25 15 1.25H17C20.44 1.25 22.75 3.56 22.75 7V9C22.75 9.41 22.41 9.75 22 9.75Z" fill={color}/>
<Path d="M2 9.75C1.59 9.75 1.25 9.41 1.25 9V7C1.25 3.56 3.56 1.25 7 1.25H9C9.41 1.25 9.75 1.59 9.75 2C9.75 2.41 9.41 2.75 9 2.75H7C4.42 2.75 2.75 4.42 2.75 7V9C2.75 9.41 2.41 9.75 2 9.75Z" fill={color}/>
<Path d="M17 22.75H15C14.59 22.75 14.25 22.41 14.25 22C14.25 21.59 14.59 21.25 15 21.25H17C19.58 21.25 21.25 19.58 21.25 17V15C21.25 14.59 21.59 14.25 22 14.25C22.41 14.25 22.75 14.59 22.75 15V17C22.75 20.44 20.44 22.75 17 22.75Z" fill={color}/>
<Path d="M9 22.75H7C3.56 22.75 1.25 20.44 1.25 17V15C1.25 14.59 1.59 14.25 2 14.25C2.41 14.25 2.75 14.59 2.75 15V17C2.75 19.58 4.42 21.25 7 21.25H9C9.41 21.25 9.75 21.59 9.75 22C9.75 22.41 9.41 22.75 9 22.75Z" fill={color}/>
<Path d="M12.0001 15.63C10.6801 15.63 9.6001 14.55 9.6001 13.23V10.76C9.6001 9.44001 10.6801 8.35999 12.0001 8.35999C13.3201 8.35999 14.4001 9.44001 14.4001 10.76V13.23C14.4001 14.56 13.3201 15.63 12.0001 15.63ZM12.0001 9.87C11.5101 9.87 11.1001 10.27 11.1001 10.77V13.24C11.1001 13.74 11.5001 14.14 12.0001 14.14C12.5001 14.14 12.9001 13.74 12.9001 13.24V10.77C12.9001 10.27 12.4901 9.87 12.0001 9.87Z" fill={color}/>
    </>
  );
}

function renderLinear({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M12.0001 14.88C11.0901 14.88 10.3501 14.14 10.3501 13.23V10.76C10.3501 9.85001 11.0901 9.10999 12.0001 9.10999C12.9101 9.10999 13.6501 9.85001 13.6501 10.76V13.23C13.6501 14.14 12.9101 14.88 12.0001 14.88Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
<Path d="M16.98 13.47C16.78 16.05 14.62 18.07 12 18.07C9.24 18.07 7 15.83 7 13.07V10.93C7 8.16999 9.24 5.92999 12 5.92999C14.59 5.92999 16.72 7.89998 16.97 10.42" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
<Path d="M15 2H17C20 2 22 4 22 7V9" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M2 9V7C2 4 4 2 7 2H9" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M15 22H17C20 22 22 20 22 17V15" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M2 15V17C2 20 4 22 7 22H9" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

function renderOutline({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M12.0001 15.63C10.6801 15.63 9.6001 14.55 9.6001 13.23V10.76C9.6001 9.44001 10.6801 8.35999 12.0001 8.35999C13.3201 8.35999 14.4001 9.44001 14.4001 10.76V13.23C14.4001 14.56 13.3201 15.63 12.0001 15.63ZM12.0001 9.87C11.5101 9.87 11.1001 10.27 11.1001 10.77V13.24C11.1001 13.74 11.5001 14.14 12.0001 14.14C12.5001 14.14 12.9001 13.74 12.9001 13.24V10.77C12.9001 10.27 12.4901 9.87 12.0001 9.87Z" fill={color}/>
<Path d="M12 18.82C8.83 18.82 6.25 16.24 6.25 13.07V10.93C6.25 7.75999 8.83 5.17999 12 5.17999C14.96 5.17999 17.42 7.40003 17.72 10.34C17.76 10.75 17.46 11.12 17.05 11.16C16.64 11.21 16.27 10.9 16.23 10.49C16.01 8.31999 14.19 6.67999 12 6.67999C9.66 6.67999 7.75 8.58999 7.75 10.93V13.07C7.75 15.41 9.66 17.32 12 17.32C14.2 17.32 16.06 15.6 16.24 13.41C16.27 13 16.63 12.69 17.05 12.72C17.46 12.75 17.77 13.11 17.74 13.53C17.5 16.5 14.98 18.82 12 18.82Z" fill={color}/>
<Path d="M22 9.75C21.59 9.75 21.25 9.41 21.25 9V7C21.25 4.42 19.58 2.75 17 2.75H15C14.59 2.75 14.25 2.41 14.25 2C14.25 1.59 14.59 1.25 15 1.25H17C20.44 1.25 22.75 3.56 22.75 7V9C22.75 9.41 22.41 9.75 22 9.75Z" fill={color}/>
<Path d="M2 9.75C1.59 9.75 1.25 9.41 1.25 9V7C1.25 3.56 3.56 1.25 7 1.25H9C9.41 1.25 9.75 1.59 9.75 2C9.75 2.41 9.41 2.75 9 2.75H7C4.42 2.75 2.75 4.42 2.75 7V9C2.75 9.41 2.41 9.75 2 9.75Z" fill={color}/>
<Path d="M17 22.75H15C14.59 22.75 14.25 22.41 14.25 22C14.25 21.59 14.59 21.25 15 21.25H17C19.58 21.25 21.25 19.58 21.25 17V15C21.25 14.59 21.59 14.25 22 14.25C22.41 14.25 22.75 14.59 22.75 15V17C22.75 20.44 20.44 22.75 17 22.75Z" fill={color}/>
<Path d="M9 22.75H7C3.56 22.75 1.25 20.44 1.25 17V15C1.25 14.59 1.59 14.25 2 14.25C2.41 14.25 2.75 14.59 2.75 15V17C2.75 19.58 4.42 21.25 7 21.25H9C9.41 21.25 9.75 21.59 9.75 22C9.75 22.41 9.41 22.75 9 22.75Z" fill={color}/>
    </>
  );
}

function renderTwoTone({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path opacity="0.4" d="M12.0001 14.88C11.0901 14.88 10.3501 14.14 10.3501 13.23V10.76C10.3501 9.85001 11.0901 9.10999 12.0001 9.10999C12.9101 9.10999 13.6501 9.85001 13.6501 10.76V13.23C13.6501 14.14 12.9101 14.88 12.0001 14.88Z" stroke={secondaryColor ?? color} strokeWidth={strokeWidth} strokeLinecap="round"/>
<Path opacity="0.4" d="M16.98 13.47C16.78 16.05 14.62 18.07 12 18.07C9.24 18.07 7 15.83 7 13.07V10.93C7 8.16999 9.24 5.92999 12 5.92999C14.59 5.92999 16.72 7.89998 16.97 10.42" stroke={secondaryColor ?? color} strokeWidth={strokeWidth} strokeLinecap="round"/>
<Path d="M15 2H17C20 2 22 4 22 7V9" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M2 9V7C2 4 4 2 7 2H9" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M15 22H17C20 22 22 20 22 17V15" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M2 15V17C2 20 4 22 7 22H9" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

export function FingerScanIcon({
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
