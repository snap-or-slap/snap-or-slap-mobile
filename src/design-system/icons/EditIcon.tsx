import React from 'react';
import Svg, { Path, Circle, Rect, Line, Polyline, Polygon, G, Defs, ClipPath, Mask } from 'react-native-svg';
import type { IconProps, IconVariant } from './Icon.types';

const DEFAULT_SIZE = 24;

const availableVariants = ['bold', 'broken', 'bulk', 'linear', 'outline', 'twoTone'] as const;
type EditIconVariant = (typeof availableVariants)[number];

function normalizeVariant(variant?: IconVariant): EditIconVariant {
  if (variant && availableVariants.includes(variant as any)) {
    return variant as EditIconVariant;
  }
  return 'outline';
}

function renderBold({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM10.95 17.51C10.66 17.8 10.11 18.08 9.71 18.14L7.25 18.49C7.16 18.5 7.07 18.51 6.98 18.51C6.57 18.51 6.19 18.37 5.92 18.1C5.59 17.77 5.45 17.29 5.53 16.76L5.88 14.3C5.94 13.89 6.21 13.35 6.51 13.06L10.97 8.6C11.05 8.81 11.13 9.02 11.24 9.26C11.34 9.47 11.45 9.69 11.57 9.89C11.67 10.06 11.78 10.22 11.87 10.34C11.98 10.51 12.11 10.67 12.19 10.76C12.24 10.83 12.28 10.88 12.3 10.9C12.55 11.2 12.84 11.48 13.09 11.69C13.16 11.76 13.2 11.8 13.22 11.81C13.37 11.93 13.52 12.05 13.65 12.14C13.81 12.26 13.97 12.37 14.14 12.46C14.34 12.58 14.56 12.69 14.78 12.8C15.01 12.9 15.22 12.99 15.43 13.06L10.95 17.51ZM17.37 11.09L16.45 12.02C16.39 12.08 16.31 12.11 16.23 12.11C16.2 12.11 16.16 12.11 16.14 12.1C14.11 11.52 12.49 9.9 11.91 7.87C11.88 7.76 11.91 7.64 11.99 7.57L12.92 6.64C14.44 5.12 15.89 5.15 17.38 6.64C18.14 7.4 18.51 8.13 18.51 8.89C18.5 9.61 18.13 10.33 17.37 11.09Z" fill={color}/>
    </>
  );
}

function renderBroken({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M22 13V15C22 20 20 22 15 22H9C4 22 2 20 2 15V13.48" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M11 2H9C4 2 2 4 2 9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M19.9299 9.01L20.9799 7.96C22.3399 6.6 22.9799 5.02 20.9799 3.02C18.9799 1.02 17.3999 1.66 16.0399 3.02L8.15988 10.9C7.85988 11.2 7.55988 11.79 7.49988 12.22L7.06988 15.23C6.90988 16.32 7.67988 17.08 8.76988 16.93L11.7799 16.5C12.1999 16.44 12.7899 16.14 13.0999 15.84L16.2799 12.66L17.0099 11.93" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M14.9099 4.15C15.5799 6.54 17.4499 8.41 19.8499 9.09" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

function renderBulk({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path opacity="0.4" d="M15.48 3H7.52C4.07 3 2 5.06 2 8.52V16.47C2 19.94 4.07 22 7.52 22H15.47C18.93 22 20.99 19.94 20.99 16.48V8.52C21 5.06 18.93 3 15.48 3Z" fill={secondaryColor ?? color}/>
<Path d="M21.02 2.98C19.23 1.18 17.48 1.14 15.64 2.98L14.51 4.1C14.41 4.2 14.38 4.34 14.42 4.47C15.12 6.92 17.08 8.88 19.53 9.58C19.56 9.59 19.61 9.59 19.64 9.59C19.74 9.59 19.84 9.55 19.91 9.48L21.02 8.36C21.93 7.45 22.38 6.58 22.38 5.69C22.38 4.79 21.93 3.9 21.02 2.98Z" fill={color}/>
<Path d="M17.8601 10.42C17.5901 10.29 17.3301 10.16 17.0901 10.01C16.8901 9.89 16.6901 9.76 16.5001 9.62C16.3401 9.52 16.1601 9.37 15.9801 9.22C15.9601 9.21 15.9001 9.16 15.8201 9.08C15.5101 8.83 15.1801 8.49 14.8701 8.12C14.8501 8.1 14.7901 8.04 14.7401 7.95C14.6401 7.84 14.4901 7.65 14.3601 7.44C14.2501 7.3 14.1201 7.1 14.0001 6.89C13.8501 6.64 13.7201 6.39 13.6001 6.13C13.4701 5.85 13.3701 5.59 13.2801 5.34L7.9001 10.72C7.5501 11.07 7.2101 11.73 7.1401 12.22L6.7101 15.2C6.6201 15.83 6.7901 16.42 7.1801 16.81C7.5101 17.14 7.9601 17.31 8.4601 17.31C8.5701 17.31 8.6801 17.3 8.7901 17.29L11.7601 16.87C12.2501 16.8 12.9101 16.47 13.2601 16.11L18.6401 10.73C18.3901 10.65 18.1401 10.54 17.8601 10.42Z" fill={color}/>
    </>
  );
}

function renderLinear({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M16.0399 3.02001L8.15988 10.9C7.85988 11.2 7.55988 11.79 7.49988 12.22L7.06988 15.23C6.90988 16.32 7.67988 17.08 8.76988 16.93L11.7799 16.5C12.1999 16.44 12.7899 16.14 13.0999 15.84L20.9799 7.96001C22.3399 6.60001 22.9799 5.02001 20.9799 3.02001C18.9799 1.02001 17.3999 1.66001 16.0399 3.02001Z" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M14.9099 4.14999C15.5799 6.53999 17.4499 8.40999 19.8499 9.08999" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

function renderOutline({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H11C11.41 1.25 11.75 1.59 11.75 2C11.75 2.41 11.41 2.75 11 2.75H9C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V13C21.25 12.59 21.59 12.25 22 12.25C22.41 12.25 22.75 12.59 22.75 13V15C22.75 20.43 20.43 22.75 15 22.75Z" fill={color}/>
<Path d="M8.50008 17.69C7.89008 17.69 7.33008 17.47 6.92008 17.07C6.43008 16.58 6.22008 15.87 6.33008 15.12L6.76008 12.11C6.84008 11.53 7.22008 10.78 7.63008 10.37L15.5101 2.49C17.5001 0.499998 19.5201 0.499998 21.5101 2.49C22.6001 3.58 23.0901 4.69 22.9901 5.8C22.9001 6.7 22.4201 7.58 21.5101 8.48L13.6301 16.36C13.2201 16.77 12.4701 17.15 11.8901 17.23L8.88008 17.66C8.75008 17.69 8.62008 17.69 8.50008 17.69ZM16.5701 3.55L8.69008 11.43C8.50008 11.62 8.28008 12.06 8.24008 12.32L7.81008 15.33C7.77008 15.62 7.83008 15.86 7.98008 16.01C8.13008 16.16 8.37008 16.22 8.66008 16.18L11.6701 15.75C11.9301 15.71 12.3801 15.49 12.5601 15.3L20.4401 7.42C21.0901 6.77 21.4301 6.19 21.4801 5.65C21.5401 5 21.2001 4.31 20.4401 3.54C18.8401 1.94 17.7401 2.39 16.5701 3.55Z" fill={color}/>
<Path d="M19.8501 9.83C19.7801 9.83 19.7101 9.82 19.6501 9.8C17.0201 9.06 14.9301 6.97 14.1901 4.34C14.0801 3.94 14.3101 3.53 14.7101 3.41C15.1101 3.3 15.5201 3.53 15.6301 3.93C16.2301 6.06 17.9201 7.75 20.0501 8.35C20.4501 8.46 20.6801 8.88 20.5701 9.28C20.4801 9.62 20.1801 9.83 19.8501 9.83Z" fill={color}/>
    </>
  );
}

function renderTwoTone({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path opacity="0.4" d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke={secondaryColor ?? color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M16.0399 3.01999L8.15988 10.9C7.85988 11.2 7.55988 11.79 7.49988 12.22L7.06988 15.23C6.90988 16.32 7.67988 17.08 8.76988 16.93L11.7799 16.5C12.1999 16.44 12.7899 16.14 13.0999 15.84L20.9799 7.95999C22.3399 6.59999 22.9799 5.01999 20.9799 3.01999C18.9799 1.01999 17.3999 1.65999 16.0399 3.01999Z" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path opacity="0.4" d="M14.9099 4.14999C15.5799 6.53999 17.4499 8.40999 19.8499 9.08999" stroke={secondaryColor ?? color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

export function EditIcon({
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
