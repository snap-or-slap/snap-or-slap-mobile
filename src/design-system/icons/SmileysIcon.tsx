import React from 'react';
import Svg, { Path, Circle, Rect, Line, Polyline, Polygon, G, Defs, ClipPath, Mask } from 'react-native-svg';
import type { IconProps, IconVariant } from './Icon.types';

const DEFAULT_SIZE = 24;

const availableVariants = ['bold', 'broken', 'bulk', 'linear', 'outline', 'twoTone'] as const;
type SmileysIconVariant = (typeof availableVariants)[number];

function normalizeVariant(variant?: IconVariant): SmileysIconVariant {
  if (variant && availableVariants.includes(variant as any)) {
    return variant as SmileysIconVariant;
  }
  return 'outline';
}

function renderBold({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M10 1H4C2.34 1 1 2.34 1 4V10C1 11.66 2.34 13 4 13H8.5C8.5 10.52 10.52 8.5 13 8.5V4C13 2.34 11.66 1 10 1ZM3.77 4.27C4.54 3.72 5.59 3.71 6.38 4.25C6.72 4.48 6.81 4.95 6.58 5.29C6.35 5.63 5.88 5.72 5.54 5.49C5.27 5.3 4.9 5.3 4.63 5.5C4.5 5.59 4.35 5.63 4.2 5.63C3.97 5.63 3.73 5.52 3.59 5.32C3.35 4.98 3.43 4.51 3.77 4.27ZM9.27 8.24C9.01 8.57 8.54 8.62 8.22 8.36C7.87 8.08 7.45 7.93 7 7.93C6 7.93 5.17 8.69 5.06 9.67H7.16C7.57 9.67 7.91 10.01 7.91 10.42C7.91 10.83 7.57 11.17 7.16 11.17H4.84C4.13 11.17 3.55 10.59 3.55 9.88C3.55 7.98 5.1 6.43 7 6.43C7.78 6.43 8.55 6.7 9.16 7.19C9.48 7.45 9.53 7.92 9.27 8.24ZM10.58 5.29C10.35 5.63 9.88 5.72 9.54 5.49C9.27 5.3 8.9 5.3 8.63 5.5C8.5 5.59 8.35 5.63 8.2 5.63C7.97 5.63 7.73 5.52 7.59 5.32C7.35 4.98 7.43 4.51 7.77 4.27C8.54 3.72 9.59 3.71 10.38 4.25C10.72 4.48 10.81 4.95 10.58 5.29Z" fill={color}/>
<Path d="M18.22 16.68C18.15 16.6 18.05 16.56 17.94 16.56H14.06C13.95 16.56 13.85 16.6 13.78 16.68C13.71 16.76 13.67 16.87 13.69 16.97C13.82 18.15 14.81 19.05 16 19.05C17.19 19.05 18.18 18.16 18.31 16.97C18.32 16.86 18.29 16.76 18.22 16.68Z" fill={color}/>
<Path d="M19 10H13C11.35 10 10 11.35 10 13V19C10 20.65 11.35 22 13 22H19C20.65 22 22 20.65 22 19V13C22 11.35 20.65 10 19 10ZM12.59 13.17C12.83 12.83 13.3 12.75 13.64 12.99C13.91 13.18 14.27 13.18 14.54 13C14.88 12.76 15.35 12.85 15.58 13.2C15.81 13.54 15.73 14.01 15.38 14.24C14.99 14.5 14.54 14.64 14.09 14.64C13.62 14.64 13.16 14.5 12.77 14.22C12.43 13.97 12.35 13.5 12.59 13.17ZM16 20.17C14.1 20.17 12.55 18.62 12.55 16.72C12.55 16.01 13.13 15.43 13.84 15.43H18.16C18.87 15.43 19.45 16.01 19.45 16.72C19.45 18.62 17.9 20.17 16 20.17ZM19.38 14.23C18.99 14.49 18.54 14.63 18.09 14.63C17.62 14.63 17.16 14.49 16.77 14.21C16.43 13.97 16.35 13.5 16.59 13.16C16.83 12.82 17.3 12.74 17.64 12.98C17.91 13.17 18.27 13.17 18.54 12.99C18.88 12.75 19.35 12.84 19.58 13.19C19.81 13.54 19.72 14 19.38 14.23Z" fill={color}/>
    </>
  );
}

function renderBroken({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M2 6.19995C2 3.19995 3.2 2 6.2 2H9.8C12.8 2 14 3.19995 14 6.19995V10C11.21 10.05 10.05 11.21 10 14H6.2C3.2 14 2 12.8 2 9.80005" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M6.95995 5.86996C6.42995 5.50996 5.72995 5.50998 5.19995 5.88998" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M10.9599 5.86996C10.4299 5.50996 9.72995 5.50998 9.19995 5.88998" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M8.16005 11.42H5.84005C5.54005 11.42 5.30005 11.18 5.30005 10.88C5.30005 9.39 6.51005 8.18005 8.00005 8.18005C8.64005 8.18005 9.23005 8.40002 9.69005 8.77002" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M22 17.8C22 20.8 20.8 22 17.8 22H14.2C11.2 22 10 20.8 10 17.8V14C10.05 11.21 11.21 10.05 14 10H17.8C20.8 10 22 11.2 22 14.2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M14.9599 13.62C14.4299 13.98 13.73 13.98 13.2 13.6" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M18.9599 13.62C18.4299 13.98 17.73 13.98 17.2 13.6" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M13.84 16.1801H18.16C18.46 16.1801 18.7001 16.42 18.7001 16.72C18.7001 18.21 17.49 19.42 16 19.42C14.51 19.42 13.3 18.21 13.3 16.72C13.3 16.42 13.54 16.1801 13.84 16.1801Z" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

function renderBulk({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path opacity="0.4" d="M14 5V10H13C11.35 10 10 11.35 10 13V14H5C3.34 14 2 12.66 2 11V5C2 3.34 3.34 2 5 2H11C12.66 2 14 3.34 14 5Z" fill={secondaryColor ?? color}/>
<Path d="M5.2 6.63002C4.97 6.63002 4.73 6.52001 4.59 6.31001C4.35 5.97001 4.43 5.50002 4.77 5.26002C5.55 4.71002 6.6 4.7 7.39 5.24C7.73 5.47 7.82 5.94004 7.59 6.28004C7.36 6.62004 6.89 6.70999 6.55 6.47999C6.28 6.29999 5.92001 6.3 5.65001 6.49C5.50001 6.59 5.35 6.63002 5.2 6.63002Z" fill={color}/>
<Path d="M9.2 6.63002C8.97 6.63002 8.73 6.52001 8.59 6.31001C8.35 5.97001 8.43 5.50002 8.77 5.26002C9.55 4.71002 10.6 4.7 11.39 5.24C11.73 5.47 11.82 5.94004 11.59 6.28004C11.36 6.62004 10.89 6.70999 10.55 6.47999C10.28 6.29999 9.92001 6.3 9.65001 6.49C9.50001 6.59 9.35 6.63002 9.2 6.63002Z" fill={color}/>
<Path d="M8.16005 12.17H5.84005C5.13005 12.17 4.55005 11.59 4.55005 10.88C4.55005 8.98 6.10005 7.42999 8.00005 7.42999C8.78005 7.42999 9.55005 7.7 10.16 8.19C10.48 8.45 10.54 8.91999 10.28 9.23999C10.02 9.55999 9.55005 9.61999 9.23005 9.35999C8.88005 9.07999 8.46005 8.92999 8.01005 8.92999C7.01005 8.92999 6.18005 9.68998 6.07005 10.67H8.17005C8.58005 10.67 8.92005 11.01 8.92005 11.42C8.92005 11.83 8.57005 12.17 8.16005 12.17Z" fill={color}/>
<Path d="M18.22 16.68C18.15 16.6 18.05 16.56 17.94 16.56H14.06C13.95 16.56 13.85 16.6 13.78 16.68C13.71 16.76 13.67 16.87 13.69 16.97C13.82 18.15 14.81 19.05 16 19.05C17.19 19.05 18.18 18.16 18.31 16.97C18.32 16.86 18.29 16.76 18.22 16.68Z" fill={color}/>
<Path d="M19 10H13C11.35 10 10 11.35 10 13V19C10 20.65 11.35 22 13 22H19C20.65 22 22 20.65 22 19V13C22 11.35 20.65 10 19 10ZM12.59 13.17C12.83 12.83 13.3 12.75 13.64 12.99C13.91 13.18 14.27 13.18 14.54 13C14.88 12.76 15.35 12.85 15.58 13.2C15.81 13.54 15.73 14.01 15.38 14.24C14.99 14.5 14.54 14.64 14.09 14.64C13.62 14.64 13.16 14.5 12.77 14.22C12.43 13.97 12.35 13.5 12.59 13.17ZM16 20.17C14.1 20.17 12.55 18.62 12.55 16.72C12.55 16.01 13.13 15.43 13.84 15.43H18.16C18.87 15.43 19.45 16.01 19.45 16.72C19.45 18.62 17.9 20.17 16 20.17ZM19.38 14.23C18.99 14.49 18.54 14.63 18.09 14.63C17.62 14.63 17.16 14.49 16.77 14.21C16.43 13.97 16.35 13.5 16.59 13.16C16.83 12.82 17.3 12.74 17.64 12.98C17.91 13.17 18.27 13.17 18.54 12.99C18.88 12.75 19.35 12.84 19.58 13.19C19.81 13.54 19.72 14 19.38 14.23Z" fill={color}/>
    </>
  );
}

function renderLinear({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M14 6.19995V10C11.21 10.05 10.05 11.21 10 14H6.2C3.2 14 2 12.8 2 9.80005V6.19995C2 3.19995 3.2 2 6.2 2H9.8C12.8 2 14 3.19995 14 6.19995Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M6.95995 5.86996C6.42995 5.50996 5.72995 5.50998 5.19995 5.88998" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M10.9599 5.86996C10.4299 5.50996 9.72995 5.50998 9.19995 5.88998" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M8.16005 11.42H5.84005C5.54005 11.42 5.30005 11.18 5.30005 10.88C5.30005 9.39 6.51005 8.18005 8.00005 8.18005C8.64005 8.18005 9.23005 8.40002 9.69005 8.77002" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M22 14.2V17.8C22 20.8 20.8 22 17.8 22H14.2C11.2 22 10 20.8 10 17.8V14C10.05 11.21 11.21 10.05 14 10H17.8C20.8 10 22 11.2 22 14.2Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M14.9599 13.62C14.4299 13.98 13.73 13.98 13.2 13.6" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M18.9599 13.62C18.4299 13.98 17.73 13.98 17.2 13.6" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M13.84 16.1801H18.16C18.46 16.1801 18.7001 16.42 18.7001 16.72C18.7001 18.21 17.49 19.42 16 19.42C14.51 19.42 13.3 18.21 13.3 16.72C13.3 16.42 13.54 16.1801 13.84 16.1801Z" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

function renderOutline({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M10 14.75H6.2C2.78 14.75 1.25 13.22 1.25 9.80005V6.19995C1.25 2.77995 2.78 1.25 6.2 1.25H9.8C13.22 1.25 14.75 2.77995 14.75 6.19995V10C14.75 10.41 14.42 10.74 14.01 10.75C11.61 10.79 10.79 11.62 10.75 14.01C10.74 14.42 10.41 14.75 10 14.75ZM6.2 2.75C3.62 2.75 2.75 3.61995 2.75 6.19995V9.80005C2.75 12.38 3.62 13.25 6.2 13.25H9.29C9.53 10.81 10.81 9.54004 13.25 9.29004V6.19995C13.25 3.61995 12.38 2.75 9.8 2.75H6.2Z" fill={color}/>
<Path d="M5.2 6.63002C4.97 6.63002 4.73 6.52007 4.59 6.31007C4.35 5.97007 4.43 5.50002 4.77 5.26002C5.55 4.71002 6.6 4.7 7.39 5.24C7.73 5.47 7.82 5.94004 7.59 6.28004C7.36 6.62004 6.89 6.70999 6.55 6.47999C6.28 6.29999 5.92001 6.3 5.65001 6.49C5.50001 6.59 5.35 6.63002 5.2 6.63002Z" fill={color}/>
<Path d="M9.2 6.63002C8.97 6.63002 8.73 6.52007 8.59 6.31007C8.35 5.97007 8.43 5.50002 8.77 5.26002C9.55 4.71002 10.6 4.7 11.39 5.24C11.73 5.47 11.82 5.94004 11.59 6.28004C11.36 6.62004 10.89 6.70999 10.55 6.47999C10.28 6.29999 9.92001 6.3 9.65001 6.49C9.50001 6.59 9.35 6.63002 9.2 6.63002Z" fill={color}/>
<Path d="M8.15981 12.17H5.83981C5.12981 12.17 4.5498 11.59 4.5498 10.88C4.5498 8.98 6.09981 7.43005 7.99981 7.43005C8.77981 7.43005 9.54981 7.69994 10.1598 8.18994C10.4798 8.44994 10.5398 8.91999 10.2798 9.23999C10.0198 9.55999 9.54981 9.60999 9.2298 9.35999C8.87981 9.07999 8.4598 8.93005 8.0098 8.93005C7.0098 8.93005 6.17981 9.69004 6.06981 10.67H8.1698C8.5798 10.67 8.9198 11.01 8.9198 11.42C8.9198 11.83 8.56981 12.17 8.15981 12.17Z" fill={color}/>
<Path d="M17.8 22.75H14.2C10.78 22.75 9.25 21.22 9.25 17.8V14C9.31 10.81 10.81 9.31 13.99 9.25H17.8C21.22 9.25 22.75 10.78 22.75 14.2V17.8C22.75 21.22 21.22 22.75 17.8 22.75ZM14 10.75C11.62 10.79 10.79 11.62 10.75 14.01V17.8C10.75 20.38 11.62 21.25 14.2 21.25H17.8C20.38 21.25 21.25 20.38 21.25 17.8V14.2C21.25 11.62 20.38 10.75 17.8 10.75H14Z" fill={color}/>
<Path d="M14.09 14.63C13.62 14.63 13.16 14.49 12.77 14.21C12.43 13.97 12.35 13.5001 12.59 13.1601C12.83 12.8201 13.3 12.74 13.64 12.98C13.91 13.17 14.27 13.17 14.54 12.99C14.88 12.76 15.35 12.84 15.58 13.19C15.81 13.53 15.73 14 15.38 14.23C14.99 14.5 14.54 14.63 14.09 14.63Z" fill={color}/>
<Path d="M18.09 14.63C17.62 14.63 17.16 14.49 16.77 14.21C16.43 13.97 16.35 13.5001 16.59 13.1601C16.83 12.8201 17.3 12.74 17.64 12.98C17.91 13.17 18.27 13.17 18.54 12.99C18.88 12.76 19.35 12.84 19.58 13.19C19.81 13.53 19.73 14 19.38 14.23C18.99 14.5 18.54 14.63 18.09 14.63Z" fill={color}/>
<Path d="M15.9998 20.17C14.0998 20.17 12.5498 18.62 12.5498 16.72C12.5498 16.01 13.1298 15.4301 13.8398 15.4301H18.1598C18.8698 15.4301 19.4498 16.01 19.4498 16.72C19.4498 18.62 17.8998 20.17 15.9998 20.17ZM14.0598 16.9301C14.1598 17.9101 14.9898 18.67 15.9998 18.67C17.0098 18.67 17.8298 17.9101 17.9398 16.9301H14.0598Z" fill={color}/>
    </>
  );
}

function renderTwoTone({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path opacity="0.4" d="M14 6.19995V10C11.21 10.05 10.05 11.21 10 14H6.2C3.2 14 2 12.8 2 9.80005V6.19995C2 3.19995 3.2 2 6.2 2H9.8C12.8 2 14 3.19995 14 6.19995Z" stroke={secondaryColor ?? color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path opacity="0.4" d="M6.95995 5.86996C6.42995 5.50996 5.72995 5.50998 5.19995 5.88998" stroke={secondaryColor ?? color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path opacity="0.4" d="M10.9599 5.86996C10.4299 5.50996 9.72995 5.50998 9.19995 5.88998" stroke={secondaryColor ?? color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path opacity="0.4" d="M8.16005 11.42H5.84005C5.54005 11.42 5.30005 11.18 5.30005 10.88C5.30005 9.39 6.51005 8.18005 8.00005 8.18005C8.64005 8.18005 9.23005 8.40002 9.69005 8.77002" stroke={secondaryColor ?? color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M22 14.2V17.8C22 20.8 20.8 22 17.8 22H14.2C11.2 22 10 20.8 10 17.8V14C10.05 11.21 11.21 10.05 14 10H17.8C20.8 10 22 11.2 22 14.2Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M14.9599 13.62C14.4299 13.98 13.73 13.98 13.2 13.6" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M18.9599 13.62C18.4299 13.98 17.73 13.98 17.2 13.6" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M13.84 16.1801H18.16C18.46 16.1801 18.7001 16.42 18.7001 16.72C18.7001 18.21 17.49 19.42 16 19.42C14.51 19.42 13.3 18.21 13.3 16.72C13.3 16.42 13.54 16.1801 13.84 16.1801Z" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

export function SmileysIcon({
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
