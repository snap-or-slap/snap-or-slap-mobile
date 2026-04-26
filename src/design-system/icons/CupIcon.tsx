import React from 'react';
import Svg, { Path, Circle, Rect, Line, Polyline, Polygon, G, Defs, ClipPath, Mask } from 'react-native-svg';
import type { IconProps, IconVariant } from './Icon.types';

const DEFAULT_SIZE = 24;

const availableVariants = ['bold', 'broken', 'bulk', 'linear', 'outline', 'twoTone'] as const;
type CupIconVariant = (typeof availableVariants)[number];

function normalizeVariant(variant?: IconVariant): CupIconVariant {
  if (variant && availableVariants.includes(variant as any)) {
    return variant as CupIconVariant;
  }
  return 'outline';
}

function renderBold({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M11.25 18.25H9C7.9 18.25 7 19.15 7 20.25V20.5H6C5.59 20.5 5.25 20.84 5.25 21.25C5.25 21.66 5.59 22 6 22H18C18.41 22 18.75 21.66 18.75 21.25C18.75 20.84 18.41 20.5 18 20.5H17V20.25C17 19.15 16.1 18.25 15 18.25H12.75V15.96C12.5 15.99 12.25 16 12 16C11.75 16 11.5 15.99 11.25 15.96V18.25Z" fill={color}/>
<Path d="M18.4798 11.64C19.1398 11.39 19.7198 10.98 20.1798 10.52C21.1098 9.49 21.7198 8.26 21.7198 6.82C21.7198 5.38 20.5898 4.25 19.1498 4.25H18.5898C17.9398 2.92 16.5798 2 14.9998 2H8.99979C7.41979 2 6.05978 2.92 5.40979 4.25H4.84979C3.40979 4.25 2.27979 5.38 2.27979 6.82C2.27979 8.26 2.88979 9.49 3.81979 10.52C4.27979 10.98 4.85979 11.39 5.51979 11.64C6.55978 14.2 9.05979 16 11.9998 16C14.9398 16 17.4398 14.2 18.4798 11.64ZM14.8398 8.45L14.2198 9.21C14.1198 9.32 14.0498 9.54 14.0598 9.69L14.1198 10.67C14.1598 11.27 13.7298 11.58 13.1698 11.36L12.2598 11C12.1198 10.95 11.8798 10.95 11.7398 11L10.8298 11.36C10.2698 11.58 9.83979 11.27 9.87979 10.67L9.93979 9.69C9.94979 9.54 9.87979 9.32 9.77979 9.21L9.15979 8.45C8.76979 7.99 8.93979 7.48 9.51979 7.33L10.4698 7.09C10.6198 7.05 10.7998 6.91 10.8798 6.78L11.4098 5.96C11.7398 5.45 12.2598 5.45 12.5898 5.96L13.1198 6.78C13.1998 6.91 13.3798 7.05 13.5298 7.09L14.4798 7.33C15.0598 7.48 15.2298 7.99 14.8398 8.45Z" fill={color}/>
    </>
  );
}

function renderBroken({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M12.1499 16.5V18.6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M7.1499 22H17.1499V21C17.1499 19.9 16.2499 19 15.1499 19H9.1499C8.0499 19 7.1499 19.9 7.1499 21V22V22Z" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10"/>
<Path d="M6.1499 22H18.1499" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M8.51 15.07C6.41 13.86 5 11.6 5 9V6C5 3.79 6.79 2 9 2H15C17.21 2 19 3.79 19 6V9C19 12.82 15.95 15.92 12.15 16C12.1 16 12 16 12 16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M5.47004 11.65C4.72004 11.41 4.06004 10.97 3.54004 10.45C2.64004 9.45 2.04004 8.25 2.04004 6.85C2.04004 5.45 3.14004 4.35 4.54004 4.35H5.19004C4.99004 4.81 4.89004 5.32 4.89004 5.85V8.85C4.89004 9.85 5.10004 10.79 5.47004 11.65Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M18.5298 11.65C19.2798 11.41 19.9398 10.97 20.4598 10.45C21.3598 9.45 21.9598 8.25 21.9598 6.85C21.9598 5.45 20.8598 4.35 19.4598 4.35H18.8098C19.0098 4.81 19.1098 5.32 19.1098 5.85V8.85C19.1098 9.85 18.8998 10.79 18.5298 11.65Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

function renderBulk({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path opacity="0.4" d="M18 20.5H17V20.25C17 19.15 16.1 18.25 15 18.25H12.75V15.96C12.5 15.99 12.25 16 12 16C11.75 16 11.5 15.99 11.25 15.96V18.25H9C7.9 18.25 7 19.15 7 20.25V20.5H6C5.59 20.5 5.25 20.84 5.25 21.25C5.25 21.66 5.59 22 6 22H18C18.41 22 18.75 21.66 18.75 21.25C18.75 20.84 18.41 20.5 18 20.5Z" fill={secondaryColor ?? color}/>
<Path opacity="0.4" d="M5.51979 11.64C4.85979 11.39 4.27979 10.98 3.81979 10.52C2.88979 9.49 2.27979 8.26 2.27979 6.82C2.27979 5.38 3.40979 4.25 4.84979 4.25H5.40979C5.14979 4.78 4.99979 5.37 4.99979 6V9C4.99979 9.94 5.17979 10.83 5.51979 11.64Z" fill={secondaryColor ?? color}/>
<Path opacity="0.4" d="M21.72 6.82C21.72 8.26 21.11 9.49 20.18 10.52C19.72 10.98 19.14 11.39 18.48 11.64C18.82 10.83 19 9.94 19 9V6C19 5.37 18.85 4.78 18.59 4.25H19.15C20.59 4.25 21.72 5.38 21.72 6.82Z" fill={secondaryColor ?? color}/>
<Path d="M15 2H9C6.79 2 5 3.79 5 6V9C5 12.87 8.13 16 12 16C15.87 16 19 12.87 19 9V6C19 3.79 17.21 2 15 2ZM14.84 8.45L14.22 9.21C14.12 9.32 14.05 9.54 14.06 9.69L14.12 10.67C14.16 11.27 13.73 11.58 13.17 11.36L12.26 11C12.12 10.95 11.88 10.95 11.74 11L10.83 11.36C10.27 11.58 9.84 11.27 9.88 10.67L9.94 9.69C9.95 9.54 9.88 9.32 9.78 9.21L9.16 8.45C8.77 7.99 8.94 7.48 9.52 7.33L10.47 7.09C10.62 7.05 10.8 6.91 10.88 6.78L11.41 5.96C11.74 5.45 12.26 5.45 12.59 5.96L13.12 6.78C13.2 6.91 13.38 7.05 13.53 7.09L14.48 7.33C15.06 7.48 15.23 7.99 14.84 8.45Z" fill={color}/>
<Path opacity="0.4" d="M14.8402 8.45L14.2202 9.21C14.1202 9.32 14.0502 9.54 14.0602 9.69L14.1202 10.67C14.1602 11.27 13.7302 11.58 13.1702 11.36L12.2602 11C12.1202 10.95 11.8802 10.95 11.7402 11L10.8302 11.36C10.2702 11.58 9.84024 11.27 9.88024 10.67L9.94023 9.69C9.95023 9.54 9.88023 9.32 9.78023 9.21L9.16023 8.45C8.77024 7.99 8.94024 7.48 9.52024 7.33L10.4702 7.09C10.6202 7.05 10.8002 6.91 10.8802 6.78L11.4102 5.96C11.7402 5.45 12.2602 5.45 12.5902 5.96L13.1202 6.78C13.2002 6.91 13.3802 7.05 13.5302 7.09L14.4802 7.33C15.0602 7.48 15.2302 7.99 14.8402 8.45Z" fill={secondaryColor ?? color}/>
    </>
  );
}

function renderLinear({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M8.37988 12L10.7899 14.42L15.6199 9.57999" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M10.7499 2.45001C11.4399 1.86001 12.5699 1.86001 13.2699 2.45001L14.8499 3.81001C15.1499 4.07001 15.7099 4.28001 16.1099 4.28001H17.8099C18.8699 4.28001 19.7399 5.15001 19.7399 6.21001V7.91001C19.7399 8.30001 19.9499 8.87001 20.2099 9.17001L21.5699 10.75C22.1599 11.44 22.1599 12.57 21.5699 13.27L20.2099 14.85C19.9499 15.15 19.7399 15.71 19.7399 16.11V17.81C19.7399 18.87 18.8699 19.74 17.8099 19.74H16.1099C15.7199 19.74 15.1499 19.95 14.8499 20.21L13.2699 21.57C12.5799 22.16 11.4499 22.16 10.7499 21.57L9.16988 20.21C8.86988 19.95 8.30988 19.74 7.90988 19.74H6.17988C5.11988 19.74 4.24988 18.87 4.24988 17.81V16.1C4.24988 15.71 4.03988 15.15 3.78988 14.85L2.43988 13.26C1.85988 12.57 1.85988 11.45 2.43988 10.76L3.78988 9.17001C4.03988 8.87001 4.24988 8.31001 4.24988 7.92001V6.20001C4.24988 5.14001 5.11988 4.27001 6.17988 4.27001H7.90988C8.29988 4.27001 8.86988 4.06001 9.16988 3.80001L10.7499 2.45001Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

function renderOutline({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path d="M12.1499 19.35C11.7399 19.35 11.3999 19.01 11.3999 18.6V16.5C11.3999 16.09 11.7399 15.75 12.1499 15.75C12.5599 15.75 12.8999 16.09 12.8999 16.5V18.6C12.8999 19.01 12.5599 19.35 12.1499 19.35Z" fill={color}/>
<Path d="M17.8999 22.75H6.3999V21C6.3999 19.48 7.6299 18.25 9.1499 18.25H15.1499C16.6699 18.25 17.8999 19.48 17.8999 21V22.75ZM7.8999 21.25H16.3999V21C16.3999 20.31 15.8399 19.75 15.1499 19.75H9.1499C8.4599 19.75 7.8999 20.31 7.8999 21V21.25Z" fill={color}/>
<Path d="M18.1499 22.75H6.1499C5.7399 22.75 5.3999 22.41 5.3999 22C5.3999 21.59 5.7399 21.25 6.1499 21.25H18.1499C18.5599 21.25 18.8999 21.59 18.8999 22C18.8999 22.41 18.5599 22.75 18.1499 22.75Z" fill={color}/>
<Path d="M18.4302 12.44C18.2202 12.44 18.0102 12.35 17.8602 12.18C17.6702 11.96 17.6202 11.65 17.7402 11.39C18.0802 10.61 18.2502 9.78 18.2502 8.91V5.91C18.2502 5.56 18.1902 5.22 18.0702 4.86C18.0602 4.83 18.0502 4.79 18.0402 4.75C18.0102 4.6 18.0002 4.45 18.0002 4.31C18.0002 3.9 18.3402 3.56 18.7502 3.56H19.3502C21.1402 3.56 22.6002 5.06 22.6002 6.91C22.6002 8.44 21.9702 9.95 20.8802 11.04C20.8602 11.06 20.8002 11.11 20.7902 11.12C20.2002 11.61 19.5302 12.16 18.6302 12.41C18.5602 12.43 18.5002 12.44 18.4302 12.44ZM19.6802 5.09C19.7302 5.36 19.7502 5.64 19.7502 5.91V8.91C19.7502 9.32 19.7202 9.71 19.6602 10.11C19.7202 10.06 19.7702 10.02 19.8302 9.97C20.6302 9.17 21.1002 8.05 21.1002 6.91C21.1002 6.01 20.4902 5.25 19.6802 5.09Z" fill={color}/>
<Path d="M5.5799 12.4C5.4999 12.4 5.4299 12.39 5.3499 12.36C4.5299 12.1 3.7599 11.62 3.1199 10.98C1.9699 9.71001 1.3999 8.32001 1.3999 6.85001C1.3999 5.03001 2.8299 3.60001 4.6499 3.60001H5.2999C5.5499 3.60001 5.7899 3.73001 5.9299 3.94001C6.0699 4.15001 6.0899 4.42001 5.9899 4.65001C5.8299 5.01001 5.7499 5.42001 5.7499 5.85001V8.85001C5.7499 9.71001 5.9199 10.55 6.2699 11.35C6.3899 11.62 6.3299 11.93 6.1399 12.15C5.9899 12.31 5.7899 12.4 5.5799 12.4ZM4.2999 5.13001C3.4899 5.29001 2.8999 5.99001 2.8999 6.85001C2.8999 7.94001 3.3399 8.99001 4.2099 9.95001C4.2499 10 4.2999 10.04 4.3499 10.08C4.2799 9.67001 4.2499 9.26001 4.2499 8.85001V5.85001C4.2499 5.61001 4.2699 5.37001 4.2999 5.13001Z" fill={color}/>
<Path d="M12 16.75C7.73 16.75 4.25 13.27 4.25 9V6C4.25 3.38 6.38 1.25 9 1.25H15C17.62 1.25 19.75 3.38 19.75 6V9C19.75 13.27 16.27 16.75 12 16.75ZM9 2.75C7.21 2.75 5.75 4.21 5.75 6V9C5.75 12.45 8.55 15.25 12 15.25C15.45 15.25 18.25 12.45 18.25 9V6C18.25 4.21 16.79 2.75 15 2.75H9Z" fill={color}/>
    </>
  );
}

function renderTwoTone({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      <Path opacity="0.34" d="M12.1499 16.5V18.6" stroke={secondaryColor ?? color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M7.1499 22H17.1499V21C17.1499 19.9 16.2499 19 15.1499 19H9.1499C8.0499 19 7.1499 19.9 7.1499 21V22V22Z" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10"/>
<Path d="M6.1499 22H18.1499" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path d="M12 16C8.13 16 5 12.87 5 9V6C5 3.79 6.79 2 9 2H15C17.21 2 19 3.79 19 6V9C19 12.87 15.87 16 12 16Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path opacity="0.34" d="M5.47004 11.65C4.72004 11.41 4.06004 10.97 3.54004 10.45C2.64004 9.45001 2.04004 8.25001 2.04004 6.85001C2.04004 5.45001 3.14004 4.35001 4.54004 4.35001H5.19004C4.99004 4.81001 4.89004 5.32001 4.89004 5.85001V8.85001C4.89004 9.85001 5.10004 10.79 5.47004 11.65Z" stroke={secondaryColor ?? color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
<Path opacity="0.34" d="M18.5298 11.65C19.2798 11.41 19.9398 10.97 20.4598 10.45C21.3598 9.45001 21.9598 8.25001 21.9598 6.85001C21.9598 5.45001 20.8598 4.35001 19.4598 4.35001H18.8098C19.0098 4.81001 19.1098 5.32001 19.1098 5.85001V8.85001C19.1098 9.85001 18.8998 10.79 18.5298 11.65Z" stroke={secondaryColor ?? color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

export function CupIcon({
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
