import React from 'react';
import Svg, { Path, Circle, Rect, Line, Polyline, Polygon, G, Defs, ClipPath, Mask } from 'react-native-svg';
import type { IconProps, IconVariant } from './Icon.types';

const DEFAULT_SIZE = 24;

const availableVariants = ['bold', 'broken', 'bulk', 'linear', 'outline', 'twoTone'] as const;
type EmojiHappyIconVariant = (typeof availableVariants)[number];

function normalizeVariant(variant?: IconVariant): EmojiHappyIconVariant {
  if (variant && availableVariants.includes(variant as any)) {
    return variant as EmojiHappyIconVariant;
  }
  return 'outline';
}

function renderBold({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM8.5 6.38C9.53 6.38 10.38 7.22 10.38 8.26C10.38 9.3 9.54 10.14 8.5 10.14C7.46 10.14 6.62 9.28 6.62 8.25C6.62 7.22 7.47 6.38 8.5 6.38ZM12 19.08C9.31 19.08 7.12 16.89 7.12 14.2C7.12 13.5 7.69 12.92 8.39 12.92H15.59C16.29 12.92 16.86 13.49 16.86 14.2C16.88 16.89 14.69 19.08 12 19.08ZM15.5 10.12C14.47 10.12 13.62 9.28 13.62 8.24C13.62 7.2 14.46 6.36 15.5 6.36C16.54 6.36 17.38 7.2 17.38 8.24C17.38 9.28 16.53 10.12 15.5 10.12Z" fill={color}/>
    </>
  );
}

function renderBroken({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M2 12.96V15C2 20 4 22 9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M15.5 9.75C16.3284 9.75 17 9.07843 17 8.25C17 7.42157 16.3284 6.75 15.5 6.75C14.6716 6.75 14 7.42157 14 8.25C14 9.07843 14.6716 9.75 15.5 9.75Z" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M8.5 9.75C9.32843 9.75 10 9.07843 10 8.25C10 7.42157 9.32843 6.75 8.5 6.75C7.67157 6.75 7 7.42157 7 8.25C7 9.07843 7.67157 9.75 8.5 9.75Z" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M8.4 13.3H15.6C16.1 13.3 16.5 13.7 16.5 14.2C16.5 16.69 14.49 18.7 12 18.7C9.51 18.7 7.5 16.69 7.5 14.2C7.5 13.7 7.9 13.3 8.4 13.3Z" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

function renderBulk({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path opacity="0.4" d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2Z" fill={secondaryColor ?? color}/>
<Path d="M15.5001 10.13C16.5384 10.13 17.3801 9.2883 17.3801 8.25C17.3801 7.21171 16.5384 6.37 15.5001 6.37C14.4618 6.37 13.6201 7.21171 13.6201 8.25C13.6201 9.2883 14.4618 10.13 15.5001 10.13Z" fill={color}/>
<Path d="M8.50012 10.13C9.53841 10.13 10.3801 9.2883 10.3801 8.25C10.3801 7.21171 9.53841 6.37 8.50012 6.37C7.46182 6.37 6.62012 7.21171 6.62012 8.25C6.62012 9.2883 7.46182 10.13 8.50012 10.13Z" fill={color}/>
<Path d="M15.5999 12.92H8.39988C7.69988 12.92 7.12988 13.49 7.12988 14.2C7.12988 16.89 9.31988 19.08 12.0099 19.08C14.6999 19.08 16.8899 16.89 16.8899 14.2C16.8799 13.5 16.2999 12.92 15.5999 12.92Z" fill={color}/>
    </>
  );
}

function renderLinear({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M15.5 9.75C16.3284 9.75 17 9.07843 17 8.25C17 7.42157 16.3284 6.75 15.5 6.75C14.6716 6.75 14 7.42157 14 8.25C14 9.07843 14.6716 9.75 15.5 9.75Z" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M8.5 9.75C9.32843 9.75 10 9.07843 10 8.25C10 7.42157 9.32843 6.75 8.5 6.75C7.67157 6.75 7 7.42157 7 8.25C7 9.07843 7.67157 9.75 8.5 9.75Z" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M8.4 13.3H15.6C16.1 13.3 16.5 13.7 16.5 14.2C16.5 16.69 14.49 18.7 12 18.7C9.51 18.7 7.5 16.69 7.5 14.2C7.5 13.7 7.9 13.3 8.4 13.3Z" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

function renderOutline({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H15C20.43 1.25 22.75 3.57 22.75 9V15C22.75 20.43 20.43 22.75 15 22.75ZM9 2.75C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V9C21.25 4.39 19.61 2.75 15 2.75H9Z" fill={color}/>
<Path d="M15.5 10.5C14.26 10.5 13.25 9.49 13.25 8.25C13.25 7.01 14.26 6 15.5 6C16.74 6 17.75 7.01 17.75 8.25C17.75 9.49 16.74 10.5 15.5 10.5ZM15.5 7.5C15.09 7.5 14.75 7.84 14.75 8.25C14.75 8.66 15.09 9 15.5 9C15.91 9 16.25 8.66 16.25 8.25C16.25 7.84 15.91 7.5 15.5 7.5Z" fill={color}/>
<Path d="M8.5 10.5C7.26 10.5 6.25 9.49 6.25 8.25C6.25 7.01 7.26 6 8.5 6C9.74 6 10.75 7.01 10.75 8.25C10.75 9.49 9.74 10.5 8.5 10.5ZM8.5 7.5C8.09 7.5 7.75 7.84 7.75 8.25C7.75 8.66 8.09 9 8.5 9C8.91 9 9.25 8.66 9.25 8.25C9.25 7.84 8.91 7.5 8.5 7.5Z" fill={color}/>
<Path d="M12 19.45C9.1 19.45 6.75 17.09 6.75 14.2C6.75 13.29 7.49 12.55 8.4 12.55H15.6C16.51 12.55 17.25 13.29 17.25 14.2C17.25 17.09 14.9 19.45 12 19.45ZM8.4 14.05C8.32 14.05 8.25 14.12 8.25 14.2C8.25 16.27 9.93 17.95 12 17.95C14.07 17.95 15.75 16.27 15.75 14.2C15.75 14.12 15.68 14.05 15.6 14.05H8.4Z" fill={color}/>
    </>
  );
}

function renderTwoTone({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path opacity="0.4" d="M15.5 9.75C16.3284 9.75 17 9.07843 17 8.25C17 7.42157 16.3284 6.75 15.5 6.75C14.6716 6.75 14 7.42157 14 8.25C14 9.07843 14.6716 9.75 15.5 9.75Z" stroke={secondaryColor ?? color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path opacity="0.4" d="M8.5 9.75C9.32843 9.75 10 9.07843 10 8.25C10 7.42157 9.32843 6.75 8.5 6.75C7.67157 6.75 7 7.42157 7 8.25C7 9.07843 7.67157 9.75 8.5 9.75Z" stroke={secondaryColor ?? color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path opacity="0.4" d="M8.4 13.3H15.6C16.1 13.3 16.5 13.7 16.5 14.2C16.5 16.69 14.49 18.7 12 18.7C9.51 18.7 7.5 16.69 7.5 14.2C7.5 13.7 7.9 13.3 8.4 13.3Z" stroke={secondaryColor ?? color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

export function EmojiHappyIcon({
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
