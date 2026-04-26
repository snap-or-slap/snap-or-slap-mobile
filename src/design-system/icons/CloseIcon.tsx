import React from 'react';
import Svg, { Path, Circle, Rect, Line, Polyline, Polygon, G, Defs, ClipPath, Mask } from 'react-native-svg';
import type { IconProps, IconVariant } from './Icon.types';

const DEFAULT_SIZE = 24;

const availableVariants = ['bold', 'broken', 'bulk', 'linear', 'outline', 'twoTone'] as const;
type CloseIconVariant = (typeof availableVariants)[number];

function normalizeVariant(variant?: IconVariant): CloseIconVariant {
  if (variant && availableVariants.includes(variant as any)) {
    return variant as CloseIconVariant;
  }
  return 'outline';
}

function renderBold({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M16.1904 2C19.83 2.00017 22.0001 4.16997 21.9902 7.80957V16.1904C21.9901 19.8302 19.8195 22 16.1797 22H7.80957C4.16983 21.9998 2 19.8295 2 16.1797V7.80957C2.00017 4.16997 4.16997 2.00017 7.80957 2H16.1904ZM16.7734 7.22656C16.4835 6.93665 16.0018 6.93665 15.7119 7.22656L12 10.9395L8.28809 7.22656C7.99817 6.93665 7.51648 6.93665 7.22656 7.22656C6.93669 7.51648 6.93666 7.99819 7.22656 8.28809L10.9395 12L7.22656 15.7119C6.93687 16.0017 6.93712 16.4825 7.22656 16.7725C7.51648 17.0624 7.99817 17.0624 8.28809 16.7725L12 13.0605L15.7119 16.7725C16.0018 17.0624 16.4835 17.0624 16.7734 16.7725C17.0629 16.4825 17.0631 16.0017 16.7734 15.7119L13.0605 12L16.7734 8.28809C17.0633 7.99819 17.0633 7.51648 16.7734 7.22656Z" fill={color}/>
    </>
  );
}

function renderBroken({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M12 18V6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M16 12H18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M6 12H11.66" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M12 18V6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

function renderBulk({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path opacity="0.4" d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2Z" fill={secondaryColor ?? color}/>
<Path d="M16.773 15.7123L13.0607 12L16.773 8.28769C17.0629 7.99777 17.0629 7.51694 16.773 7.22703C16.4831 6.93711 16.0022 6.93711 15.7123 7.22703L12 10.9393L8.28769 7.22703C7.99778 6.93711 7.51694 6.93711 7.22703 7.22703C6.93712 7.51694 6.93712 7.99777 7.22703 8.28769L10.9393 12L7.22703 15.7123C6.93712 16.0022 6.93712 16.4831 7.22703 16.773C7.51694 17.0629 7.99778 17.0629 8.28769 16.773L12 13.0607L15.7123 16.773C16.0022 17.0629 16.4831 17.0629 16.773 16.773C17.0629 16.4831 17.0629 16.0022 16.773 15.7123Z" fill={color}/>
    </>
  );
}

function renderLinear({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M12 8V13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M11.9946 16H12.0036" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

function renderOutline({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M15.7123 16.773L7.22699 8.28769C6.93708 7.99778 6.93708 7.51694 7.22699 7.22703C7.51691 6.93712 7.99774 6.93712 8.28765 7.22703L16.7729 15.7123C17.0628 16.0022 17.0628 16.4831 16.7729 16.773C16.483 17.0629 16.0022 17.0629 15.7123 16.773Z" fill={color}/>
<Path d="M7.22706 16.773C6.93715 16.4831 6.93715 16.0022 7.22706 15.7123L15.7123 7.22703C16.0023 6.93712 16.4831 6.93712 16.773 7.22703C17.0629 7.51694 17.0629 7.99778 16.773 8.28769L8.28772 16.773C7.99781 17.0629 7.51698 17.0629 7.22706 16.773Z" fill={color}/>
    </>
  );
}

function renderTwoTone({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<G opacity="0.4">
<Path d="M9.16992 14.8299L14.8299 9.16992" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M14.8299 14.8299L9.16992 9.16992" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
</G>
    </>
  );
}

export function CloseIcon({
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
