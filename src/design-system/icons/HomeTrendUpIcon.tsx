import React from 'react';
import Svg, { Path, Circle, Rect, Line, Polyline, Polygon, G, Defs, ClipPath, Mask } from 'react-native-svg';
import type { IconProps, IconVariant } from './Icon.types';

const DEFAULT_SIZE = 24;

const availableVariants = ['bold', 'broken', 'bulk', 'linear', 'outline', 'twoTone'] as const;
type HomeTrendUpIconVariant = (typeof availableVariants)[number];

function normalizeVariant(variant?: IconVariant): HomeTrendUpIconVariant {
  if (variant && availableVariants.includes(variant as any)) {
    return variant as HomeTrendUpIconVariant;
  }
  return 'outline';
}

function renderBold({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M20.04 6.82L14.28 2.79C12.71 1.69 10.3 1.75 8.78999 2.92L3.77999 6.83C2.77999 7.61 1.98999 9.21 1.98999 10.47V17.37C1.98999 19.92 4.05999 22 6.60999 22H17.39C19.94 22 22.01 19.93 22.01 17.38V10.6C22.01 9.25 21.14 7.59 20.04 6.82ZM16.88 13.4C16.88 13.79 16.57 14.1 16.18 14.1C15.79 14.1 15.48 13.79 15.48 13.4V13.22L12.76 15.94C12.61 16.09 12.41 16.16 12.2 16.14C12 16.12 11.81 16 11.7 15.83L10.68 14.31L8.29999 16.69C8.15999 16.83 7.98999 16.89 7.80999 16.89C7.62999 16.89 7.44999 16.82 7.31999 16.69C7.04999 16.42 7.04999 15.98 7.31999 15.7L10.3 12.72C10.45 12.57 10.65 12.5 10.86 12.52C11.07 12.54 11.26 12.65 11.37 12.83L12.39 14.35L14.5 12.24H14.32C13.93 12.24 13.62 11.93 13.62 11.54C13.62 11.15 13.93 10.84 14.32 10.84H16.18C16.27 10.84 16.36 10.86 16.45 10.89C16.62 10.96 16.76 11.1 16.83 11.27C16.87 11.36 16.88 11.45 16.88 11.54V13.4Z" fill={color}/>
    </>
  );
}

function renderBroken({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M22 10.5C22 9.29 21.19 7.74 20.2 7.05L14.02 2.72C12.62 1.74 10.37 1.79 9.02 2.84L3.63 7.04C2.73 7.74 2 9.23 2 10.36V17.77C2 20.09 3.89 21.99 6.21 21.99H17.79C20.11 21.99 22 20.09 22 17.78V14.68" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M11.17 14L10.7 13.3L7.5 16.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M16.5 11.5L14.99 13.01L14 14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M14.5 11.5H16.5V13.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

function renderBulk({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path opacity="0.4" d="M20.04 6.82L14.28 2.79C12.71 1.69 10.3 1.75 8.78999 2.92L3.77999 6.83C2.77999 7.61 1.98999 9.21 1.98999 10.47V17.37C1.98999 19.92 4.05999 22 6.60999 22H17.39C19.94 22 22.01 19.93 22.01 17.38V10.6C22.01 9.25 21.14 7.59 20.04 6.82Z" fill={secondaryColor ?? color}/>
<Path d="M16.8299 11.27C16.7599 11.1 16.6199 10.96 16.4499 10.89C16.3599 10.85 16.2699 10.84 16.1799 10.84H14.3199C13.9299 10.84 13.6199 11.15 13.6199 11.54C13.6199 11.93 13.9299 12.24 14.3199 12.24H14.4999L12.3899 14.35L11.3699 12.83C11.2499 12.66 11.0699 12.54 10.8599 12.52C10.6399 12.5 10.4499 12.57 10.2999 12.72L7.31993 15.7C7.04993 15.97 7.04993 16.41 7.31993 16.69C7.45993 16.83 7.62993 16.89 7.80993 16.89C7.98993 16.89 8.16993 16.82 8.29993 16.69L10.6799 14.31L11.6999 15.83C11.8199 16 11.9999 16.12 12.2099 16.14C12.4299 16.16 12.6199 16.09 12.7699 15.94L15.4899 13.22V13.4C15.4899 13.79 15.7999 14.1 16.1899 14.1C16.5799 14.1 16.8899 13.79 16.8899 13.4V11.54C16.8799 11.44 16.8699 11.35 16.8299 11.27Z" fill={color}/>
    </>
  );
}

function renderLinear({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M9.02 2.84001L3.63 7.04001C2.73 7.74001 2 9.23001 2 10.36V17.77C2 20.09 3.89 21.99 6.21 21.99H17.79C20.11 21.99 22 20.09 22 17.78V10.5C22 9.29001 21.19 7.74001 20.2 7.05001L14.02 2.72001C12.62 1.74001 10.37 1.79001 9.02 2.84001Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M16.5 11.5L12.3 15.7L10.7 13.3L7.5 16.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M14.5 11.5H16.5V13.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

function renderOutline({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M17.79 22.74H6.21C3.47 22.74 1.25 20.51 1.25 17.77V10.36C1.25 8.99999 2.09 7.28999 3.17 6.44999L8.56 2.24999C10.18 0.989995 12.77 0.929995 14.45 2.10999L20.63 6.43999C21.82 7.26999 22.75 9.05 22.75 10.5V17.78C22.75 20.51 20.53 22.74 17.79 22.74ZM9.48 3.42999L4.09 7.62999C3.38 8.18999 2.75 9.46 2.75 10.36V17.77C2.75 19.68 4.3 21.24 6.21 21.24H17.79C19.7 21.24 21.25 19.69 21.25 17.78V10.5C21.25 9.54 20.56 8.20999 19.77 7.66999L13.59 3.33999C12.45 2.53999 10.57 2.57999 9.48 3.42999Z" fill={color}/>
<Path d="M7.49994 17.25C7.30994 17.25 7.11994 17.18 6.96994 17.03C6.67994 16.74 6.67994 16.26 6.96994 15.97L10.1699 12.77C10.3299 12.61 10.5399 12.53 10.7699 12.55C10.9899 12.57 11.1899 12.69 11.3199 12.88L12.4099 14.52L15.9599 10.97C16.2499 10.68 16.7299 10.68 17.0199 10.97C17.3099 11.26 17.3099 11.74 17.0199 12.03L12.8199 16.23C12.6599 16.39 12.4499 16.47 12.2199 16.45C11.9999 16.43 11.7999 16.31 11.6699 16.12L10.5799 14.48L8.02994 17.03C7.87994 17.18 7.68994 17.25 7.49994 17.25Z" fill={color}/>
<Path d="M16.5 14.25C16.09 14.25 15.75 13.91 15.75 13.5V12.25H14.5C14.09 12.25 13.75 11.91 13.75 11.5C13.75 11.09 14.09 10.75 14.5 10.75H16.5C16.91 10.75 17.25 11.09 17.25 11.5V13.5C17.25 13.91 16.91 14.25 16.5 14.25Z" fill={color}/>
    </>
  );
}

function renderTwoTone({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M9.02 2.83999L3.63 7.03999C2.73 7.73999 2 9.22999 2 10.36V17.77C2 20.09 3.89 21.99 6.21 21.99H17.79C20.11 21.99 22 20.09 22 17.78V10.5C22 9.28999 21.19 7.73999 20.2 7.04999L14.02 2.71999C12.62 1.73999 10.37 1.78999 9.02 2.83999Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<G opacity="0.4">
<Path d="M16.5 11.5L12.3 15.7L10.7 13.3L7.5 16.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M14.5 11.5H16.5V13.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
</G>
    </>
  );
}

export function HomeTrendUpIcon({
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
