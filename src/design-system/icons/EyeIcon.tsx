import React from 'react';
import Svg, { Path, Circle, Rect, Line, Polyline, Polygon, G, Defs, ClipPath, Mask } from 'react-native-svg';
import type { IconProps, IconVariant } from './Icon.types';

const DEFAULT_SIZE = 24;

const availableVariants = ['bold', 'broken', 'bulk', 'linear', 'outline', 'twoTone'] as const;
type EyeIconVariant = (typeof availableVariants)[number];

function normalizeVariant(variant?: IconVariant): EyeIconVariant {
  if (variant && availableVariants.includes(variant as any)) {
    return variant as EyeIconVariant;
  }
  return 'outline';
}

function renderBold({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M21.2699 9.18C20.9799 8.72 20.6699 8.29 20.3499 7.89C19.9799 7.42 19.2799 7.38 18.8599 7.8L15.8599 10.8C16.0799 11.46 16.1199 12.22 15.9199 13.01C15.5699 14.42 14.4299 15.56 13.0199 15.91C12.2299 16.11 11.4699 16.07 10.8099 15.85C10.8099 15.85 9.37995 17.28 8.34995 18.31C7.84995 18.81 8.00995 19.69 8.67995 19.95C9.74995 20.36 10.8599 20.57 11.9999 20.57C13.7799 20.57 15.5099 20.05 17.0899 19.08C18.6999 18.08 20.1499 16.61 21.3199 14.74C22.2699 13.23 22.2199 10.69 21.2699 9.18Z" fill={color}/>
<Path d="M14.0199 9.98L9.97989 14.02C9.46989 13.5 9.13989 12.78 9.13989 12C9.13989 10.43 10.4199 9.14 11.9999 9.14C12.7799 9.14 13.4999 9.47 14.0199 9.98Z" fill={color}/>
<Path d="M18.25 5.74999L14.86 9.13999C14.13 8.39999 13.12 7.95999 12 7.95999C9.76 7.95999 7.96 9.76999 7.96 12C7.96 13.12 8.41 14.13 9.14 14.86L5.76 18.25H5.75C4.64 17.35 3.62 16.2 2.75 14.84C1.75 13.27 1.75 10.72 2.75 9.14999C3.91 7.32999 5.33 5.89999 6.91 4.91999C8.49 3.95999 10.22 3.42999 12 3.42999C14.23 3.42999 16.39 4.24999 18.25 5.74999Z" fill={color}/>
<Path d="M14.8601 12C14.8601 13.57 13.5801 14.86 12.0001 14.86C11.9401 14.86 11.8901 14.86 11.8301 14.84L14.8401 11.83C14.8601 11.89 14.8601 11.94 14.8601 12Z" fill={color}/>
<Path d="M21.7699 2.23C21.4699 1.93 20.9799 1.93 20.6799 2.23L2.22988 20.69C1.92988 20.99 1.92988 21.48 2.22988 21.78C2.37988 21.92 2.56988 22 2.76988 22C2.96988 22 3.15988 21.92 3.30988 21.77L21.7699 3.31C22.0799 3.01 22.0799 2.53 21.7699 2.23Z" fill={color}/>
    </>
  );
}

function renderBroken({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M14.5299 9.47L9.46992 14.53C8.81992 13.88 8.41992 12.99 8.41992 12C8.41992 10.02 10.0199 8.42 11.9999 8.42C12.9899 8.42 13.8799 8.82 14.5299 9.47Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M5.60009 17.76C4.60009 16.9 3.69009 15.84 2.89009 14.59C1.99009 13.18 1.99009 10.81 2.89009 9.4C4.07009 7.55 5.51009 6.1 7.12009 5.13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M17.82 5.77C16.07 4.45 14.07 3.73 12 3.73" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M8.41992 19.53C9.55992 20.01 10.7699 20.27 11.9999 20.27C15.5299 20.27 18.8199 18.19 21.1099 14.59C22.0099 13.18 22.0099 10.81 21.1099 9.4C20.7799 8.88 20.4199 8.39 20.0499 7.93" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M15.5099 12.7C15.2499 14.11 14.0999 15.26 12.6899 15.52" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M9.47 14.53L2 22" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M22 2L14.53 9.47" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

function renderBulk({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path opacity="0.4" d="M21.2501 9.15C20.7601 8.37 20.2001 7.67 19.6201 7.04L15.8501 10.81C15.9701 11.18 16.0401 11.58 16.0401 12C16.0401 14.24 14.2301 16.04 12.0001 16.04C11.5801 16.04 11.1801 15.97 10.8101 15.85L7.3501 19.31C8.8101 20.13 10.3901 20.56 12.0001 20.56C13.7801 20.56 15.5101 20.04 17.0901 19.07C18.6701 18.09 20.0901 16.66 21.2501 14.84C22.2501 13.28 22.2501 10.72 21.2501 9.15Z" fill={secondaryColor ?? color}/>
<Path d="M14.0199 9.98L9.97989 14.02C9.46989 13.5 9.13989 12.78 9.13989 12C9.13989 10.43 10.4199 9.14 11.9999 9.14C12.7799 9.14 13.4999 9.47 14.0199 9.98Z" fill={color}/>
<Path opacity="0.4" d="M18.25 5.75L14.86 9.14C14.13 8.4 13.12 7.96 12 7.96C9.76 7.96 7.96 9.77 7.96 12C7.96 13.12 8.41 14.13 9.14 14.86L5.76 18.25H5.75C4.64 17.35 3.62 16.2 2.75 14.84C1.75 13.27 1.75 10.72 2.75 9.15C3.91 7.33 5.33 5.9 6.91 4.92C8.49 3.96 10.22 3.43 12 3.43C14.23 3.43 16.39 4.25 18.25 5.75Z" fill={secondaryColor ?? color}/>
<Path d="M14.8601 12C14.8601 13.57 13.5801 14.86 12.0001 14.86C11.9401 14.86 11.8901 14.86 11.8301 14.84L14.8401 11.83C14.8601 11.89 14.8601 11.94 14.8601 12Z" fill={color}/>
<Path d="M21.7699 2.23C21.4699 1.93 20.9799 1.93 20.6799 2.23L2.22988 20.69C1.92988 20.99 1.92988 21.48 2.22988 21.78C2.37988 21.92 2.56988 22 2.76988 22C2.96988 22 3.15988 21.92 3.30988 21.77L21.7699 3.31C22.0799 3.01 22.0799 2.53 21.7699 2.23Z" fill={color}/>
    </>
  );
}

function renderLinear({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M14.5299 9.47001L9.46992 14.53C8.81992 13.88 8.41992 12.99 8.41992 12C8.41992 10.02 10.0199 8.42001 11.9999 8.42001C12.9899 8.42001 13.8799 8.82001 14.5299 9.47001Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M17.8201 5.77001C16.0701 4.45001 14.0701 3.73001 12.0001 3.73001C8.47009 3.73001 5.18009 5.81001 2.89009 9.41001C1.99009 10.82 1.99009 13.19 2.89009 14.6C3.68009 15.84 4.60009 16.91 5.60009 17.77" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M8.41992 19.53C9.55992 20.01 10.7699 20.27 11.9999 20.27C15.5299 20.27 18.8199 18.19 21.1099 14.59C22.0099 13.18 22.0099 10.81 21.1099 9.39999C20.7799 8.87999 20.4199 8.38999 20.0499 7.92999" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M15.5099 12.7C15.2499 14.11 14.0999 15.26 12.6899 15.52" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M9.47 14.53L2 22" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M22 2L14.53 9.47" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

function renderOutline({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M9.46992 15.28C9.27992 15.28 9.08992 15.21 8.93992 15.06C8.11992 14.24 7.66992 13.15 7.66992 12C7.66992 9.61 9.60992 7.67 11.9999 7.67C13.1499 7.67 14.2399 8.12 15.0599 8.94C15.1999 9.08 15.2799 9.27 15.2799 9.47C15.2799 9.67 15.1999 9.86 15.0599 10L9.99992 15.06C9.84992 15.21 9.65992 15.28 9.46992 15.28ZM11.9999 9.17C10.4399 9.17 9.16992 10.44 9.16992 12C9.16992 12.5 9.29992 12.98 9.53992 13.4L13.3999 9.54C12.9799 9.3 12.4999 9.17 11.9999 9.17Z" fill={color}/>
<Path d="M5.60009 18.51C5.43009 18.51 5.25009 18.45 5.11009 18.33C4.04009 17.42 3.08009 16.3 2.26009 15C1.20009 13.35 1.20009 10.66 2.26009 9C4.70009 5.18 8.25009 2.98 12.0001 2.98C14.2001 2.98 16.3701 3.74 18.2701 5.17C18.6001 5.42 18.6701 5.89 18.4201 6.22C18.1701 6.55 17.7001 6.62 17.3701 6.37C15.7301 5.13 13.8701 4.48 12.0001 4.48C8.77009 4.48 5.68009 6.42 3.52009 9.81C2.77009 10.98 2.77009 13.02 3.52009 14.19C4.27009 15.36 5.13009 16.37 6.08009 17.19C6.39009 17.46 6.43009 17.93 6.16009 18.25C6.02009 18.42 5.81009 18.51 5.60009 18.51Z" fill={color}/>
<Path d="M12.0001 21.02C10.6701 21.02 9.37006 20.75 8.12006 20.22C7.74006 20.06 7.56006 19.62 7.72006 19.24C7.88006 18.86 8.32006 18.68 8.70006 18.84C9.76006 19.29 10.8701 19.52 11.9901 19.52C15.2201 19.52 18.3101 17.58 20.4701 14.19C21.2201 13.02 21.2201 10.98 20.4701 9.81C20.1601 9.32 19.8201 8.85 19.4601 8.41C19.2001 8.09 19.2501 7.62 19.5701 7.35C19.8901 7.09 20.3601 7.13 20.6301 7.46C21.0201 7.94 21.4001 8.46 21.7401 9C22.8001 10.65 22.8001 13.34 21.7401 15C19.3001 18.82 15.7501 21.02 12.0001 21.02Z" fill={color}/>
<Path d="M12.6901 16.27C12.3401 16.27 12.0201 16.02 11.9501 15.66C11.8701 15.25 12.1401 14.86 12.5501 14.79C13.6501 14.59 14.5701 13.67 14.7701 12.57C14.8501 12.16 15.2401 11.9 15.6501 11.97C16.0601 12.05 16.3301 12.44 16.2501 12.85C15.9301 14.58 14.5501 15.95 12.8301 16.27C12.7801 16.26 12.7401 16.27 12.6901 16.27Z" fill={color}/>
<Path d="M1.99994 22.75C1.80994 22.75 1.61994 22.68 1.46994 22.53C1.17994 22.24 1.17994 21.76 1.46994 21.47L8.93994 14C9.22994 13.71 9.70994 13.71 9.99994 14C10.2899 14.29 10.2899 14.77 9.99994 15.06L2.52994 22.53C2.37994 22.68 2.18994 22.75 1.99994 22.75Z" fill={color}/>
<Path d="M14.53 10.22C14.34 10.22 14.15 10.15 14 10C13.71 9.71 13.71 9.23 14 8.94L21.47 1.47C21.76 1.18 22.24 1.18 22.53 1.47C22.82 1.76 22.82 2.24 22.53 2.53L15.06 10C14.91 10.15 14.72 10.22 14.53 10.22Z" fill={color}/>
    </>
  );
}

function renderTwoTone({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M14.5299 9.47L9.46992 14.53C8.81992 13.88 8.41992 12.99 8.41992 12C8.41992 10.02 10.0199 8.42 11.9999 8.42C12.9899 8.42 13.8799 8.82 14.5299 9.47Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M17.8201 5.77C16.0701 4.45 14.0701 3.73 12.0001 3.73C8.47009 3.73 5.18009 5.81 2.89009 9.41C1.99009 10.82 1.99009 13.19 2.89009 14.6C3.68009 15.84 4.60009 16.91 5.60009 17.77" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path opacity="0.4" d="M8.41992 19.53C9.55992 20.01 10.7699 20.27 11.9999 20.27C15.5299 20.27 18.8199 18.19 21.1099 14.59C22.0099 13.18 22.0099 10.81 21.1099 9.39999C20.7799 8.87999 20.4199 8.38999 20.0499 7.92999" stroke={secondaryColor ?? color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path opacity="0.4" d="M15.5099 12.7C15.2499 14.11 14.0999 15.26 12.6899 15.52" stroke={secondaryColor ?? color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M9.47 14.53L2 22" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M22 2L14.53 9.47" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

export function EyeIcon({
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
