import React from 'react';
import Svg, { Path, Circle, Rect, Line, Polyline, Polygon, G, Defs, ClipPath, Mask } from 'react-native-svg';
import type { IconProps, IconVariant } from './Icon.types';

const DEFAULT_SIZE = 24;

const availableVariants = ['bold', 'broken', 'bulk', 'linear', 'outline', 'twoTone'] as const;
type CameraIconVariant = (typeof availableVariants)[number];

function normalizeVariant(variant?: IconVariant): CameraIconVariant {
  if (variant && availableVariants.includes(variant as any)) {
    return variant as CameraIconVariant;
  }
  return 'outline';
}

function renderBold({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M17.9999 6C17.3899 6 16.8299 5.65 16.5499 5.11L15.8299 3.66C15.3699 2.75 14.1699 2 13.1499 2H10.8599C9.82992 2 8.62992 2.75 8.16992 3.66L7.44992 5.11C7.16992 5.65 6.60992 6 5.99992 6C3.82992 6 2.10992 7.83 2.24992 9.99L2.76992 18.25C2.88992 20.31 3.99992 22 6.75992 22H17.2399C19.9999 22 21.0999 20.31 21.2299 18.25L21.7499 9.99C21.8899 7.83 20.1699 6 17.9999 6ZM10.4999 7.25H13.4999C13.9099 7.25 14.2499 7.59 14.2499 8C14.2499 8.41 13.9099 8.75 13.4999 8.75H10.4999C10.0899 8.75 9.74992 8.41 9.74992 8C9.74992 7.59 10.0899 7.25 10.4999 7.25ZM11.9999 18.12C10.1399 18.12 8.61992 16.61 8.61992 14.74C8.61992 12.87 10.1299 11.36 11.9999 11.36C13.8699 11.36 15.3799 12.87 15.3799 14.74C15.3799 16.61 13.8599 18.12 11.9999 18.12Z" fill={color}/>
    </>
  );
}

function renderBroken({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M2.77017 18.25C2.89017 20.31 4.00017 22 6.76017 22H17.2402C20.0002 22 21.1002 20.31 21.2302 18.25L21.7502 9.99C21.8902 7.83 20.1702 6 18.0002 6C17.3902 6 16.8302 5.65 16.5502 5.11L15.8302 3.66C15.3702 2.75 14.1702 2 13.1502 2H10.8602C9.83017 2 8.63017 2.75 8.17017 3.66L7.45017 5.11C7.17017 5.65 6.61017 6 6.00017 6C3.83017 6 2.11017 7.83 2.25017 9.99L2.51017 14.06" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M10.5002 8H13.5002" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M12.0002 18C13.7902 18 15.2502 16.54 15.2502 14.75C15.2502 12.96 13.7902 11.5 12.0002 11.5C10.2102 11.5 8.75024 12.96 8.75024 14.75C8.75024 16.54 10.2102 18 12.0002 18Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

function renderBulk({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path opacity="0.4" d="M6.75992 22H17.2399C19.9999 22 21.0999 20.31 21.2299 18.25L21.7499 9.99C21.8899 7.83 20.1699 6 17.9999 6C17.3899 6 16.8299 5.65 16.5499 5.11L15.8299 3.66C15.3699 2.75 14.1699 2 13.1499 2H10.8599C9.82992 2 8.62992 2.75 8.16992 3.66L7.44992 5.11C7.16992 5.65 6.60992 6 5.99992 6C3.82992 6 2.10992 7.83 2.24992 9.99L2.76992 18.25C2.88992 20.31 3.99992 22 6.75992 22Z" fill={secondaryColor ?? color}/>
<Path d="M13.5 8.75H10.5C10.09 8.75 9.75 8.41 9.75 8C9.75 7.59 10.09 7.25 10.5 7.25H13.5C13.91 7.25 14.25 7.59 14.25 8C14.25 8.41 13.91 8.75 13.5 8.75Z" fill={color}/>
<Path d="M12.0001 18.13C13.8668 18.13 15.3801 16.6167 15.3801 14.75C15.3801 12.8833 13.8668 11.37 12.0001 11.37C10.1334 11.37 8.62012 12.8833 8.62012 14.75C8.62012 16.6167 10.1334 18.13 12.0001 18.13Z" fill={color}/>
    </>
  );
}

function renderLinear({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M6.75992 22H17.2399C19.9999 22 21.0999 20.31 21.2299 18.25L21.7499 9.99C21.8899 7.83 20.1699 6 17.9999 6C17.3899 6 16.8299 5.65 16.5499 5.11L15.8299 3.66C15.3699 2.75 14.1699 2 13.1499 2H10.8599C9.82992 2 8.62992 2.75 8.16992 3.66L7.44992 5.11C7.16992 5.65 6.60992 6 5.99992 6C3.82992 6 2.10992 7.83 2.24992 9.99L2.76992 18.25C2.88992 20.31 3.99992 22 6.75992 22Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M10.5 8H13.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M12 18C13.79 18 15.25 16.54 15.25 14.75C15.25 12.96 13.79 11.5 12 11.5C10.21 11.5 8.75 12.96 8.75 14.75C8.75 16.54 10.21 18 12 18Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

function renderOutline({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M17.2399 22.75H6.75993C3.95993 22.75 2.17993 21.08 2.01993 18.29L1.49993 10.04C1.41993 8.79 1.84993 7.59 2.70993 6.68C3.55993 5.77 4.75993 5.25 5.99993 5.25C6.31993 5.25 6.62993 5.06 6.77993 4.76L7.49993 3.33C8.08993 2.16 9.56993 1.25 10.8599 1.25H13.1499C14.4399 1.25 15.9099 2.16 16.4999 3.32L17.2199 4.78C17.3699 5.06 17.6699 5.25 17.9999 5.25C19.2399 5.25 20.4399 5.77 21.2899 6.68C22.1499 7.6 22.5799 8.79 22.4999 10.04L21.9799 18.3C21.7999 21.13 20.0699 22.75 17.2399 22.75ZM10.8599 2.75C10.1199 2.75 9.17993 3.33 8.83993 4L8.11993 5.44C7.69993 6.25 6.88993 6.75 5.99993 6.75C5.15993 6.75 4.37993 7.09 3.79993 7.7C3.22993 8.31 2.93993 9.11 2.99993 9.94L3.51993 18.2C3.63993 20.22 4.72993 21.25 6.75993 21.25H17.2399C19.2599 21.25 20.3499 20.22 20.4799 18.2L20.9999 9.94C21.0499 9.11 20.7699 8.31 20.1999 7.7C19.6199 7.09 18.8399 6.75 17.9999 6.75C17.1099 6.75 16.2999 6.25 15.8799 5.46L15.1499 4C14.8199 3.34 13.8799 2.76 13.1399 2.76H10.8599V2.75Z" fill={color}/>
<Path d="M13.5 8.75H10.5C10.09 8.75 9.75 8.41 9.75 8C9.75 7.59 10.09 7.25 10.5 7.25H13.5C13.91 7.25 14.25 7.59 14.25 8C14.25 8.41 13.91 8.75 13.5 8.75Z" fill={color}/>
<Path d="M12 18.75C9.79 18.75 8 16.96 8 14.75C8 12.54 9.79 10.75 12 10.75C14.21 10.75 16 12.54 16 14.75C16 16.96 14.21 18.75 12 18.75ZM12 12.25C10.62 12.25 9.5 13.37 9.5 14.75C9.5 16.13 10.62 17.25 12 17.25C13.38 17.25 14.5 16.13 14.5 14.75C14.5 13.37 13.38 12.25 12 12.25Z" fill={color}/>
    </>
  );
}

function renderTwoTone({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M6.75992 22H17.2399C19.9999 22 21.0999 20.31 21.2299 18.25L21.7499 9.99C21.8899 7.83 20.1699 6 17.9999 6C17.3899 6 16.8299 5.65 16.5499 5.11L15.8299 3.66C15.3699 2.75 14.1699 2 13.1499 2H10.8599C9.82992 2 8.62992 2.75 8.16992 3.66L7.44992 5.11C7.16992 5.65 6.60992 6 5.99992 6C3.82992 6 2.10992 7.83 2.24992 9.99L2.76992 18.25C2.88992 20.31 3.99992 22 6.75992 22Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path opacity="0.4" d="M10.5 8H13.5" stroke={secondaryColor ?? color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path opacity="0.4" d="M12 18C13.79 18 15.25 16.54 15.25 14.75C15.25 12.96 13.79 11.5 12 11.5C10.21 11.5 8.75 12.96 8.75 14.75C8.75 16.54 10.21 18 12 18Z" stroke={secondaryColor ?? color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

export function CameraIcon({
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
