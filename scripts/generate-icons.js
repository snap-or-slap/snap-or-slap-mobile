const fs = require('fs');
const path = require('path');

const RAW_DIR = path.join(__dirname, '../assets/icons/raw');
const OUT_DIR = path.join(__dirname, '../src/design-system/icons');

const KNOWN_VARIANTS = [
  'bold', 'outline', 'broken', 'linear', 'bulk', 'solid', 'filled', 'twoTone', 'duotone'
];
const VARIANT_PRIORITY = [
  'outline', 'linear', 'bold', 'solid', 'filled', 'broken', 'bulk', 'twoTone', 'duotone'
];

function normalizeVariant(v) {
  if (v === 'outlined') return 'outline';
  if (v === 'line') return 'linear';
  if (v === 'two-tone' || v === 'twotone') return 'twoTone';
  return v;
}

function toPascalCase(str) {
  return str.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
}

function parseSVG(svgContent, variant) {
  // Extract viewBox
  const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';

  // Remove xml declarations and <svg ...> wrapping
  let innerSVG = svgContent
    .replace(/<\?xml.*?\?>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '') // remove comments
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>/, '')
    .trim();

  // Transform tags
  innerSVG = innerSVG.replace(/<(\/?)(path|circle|rect|line|polyline|polygon|g|defs|clipPath|mask)/g, (match, slash, tag) => {
    return `<${slash}${tag.charAt(0).toUpperCase() + tag.slice(1)}`;
  });

  // Transform attributes
  const attrMap = {
    'stroke-width': 'strokeWidth',
    'stroke-linecap': 'strokeLinecap',
    'stroke-linejoin': 'strokeLinejoin',
    'stroke-miterlimit': 'strokeMiterlimit',
    'fill-rule': 'fillRule',
    'clip-rule': 'clipRule',
    'clip-path': 'clipPath',
    'stop-color': 'stopColor',
    'stop-opacity': 'stopOpacity',
    'fill-opacity': 'fillOpacity',
    'stroke-opacity': 'strokeOpacity'
  };

  for (const [k, v] of Object.entries(attrMap)) {
    innerSVG = innerSVG.replace(new RegExp(`${k}="([^"]+)"`, 'g'), `${v}="$1"`);
  }

  // Handle colors
  // Replace #292D32 or similar hardcoded with {color} or {secondaryColor ?? color}
  // We can just find fill="hex" or stroke="hex" where hex is not none
  innerSVG = innerSVG.replace(/(fill|stroke)="([^"]+)"/g, (match, type, val) => {
    if (val.toLowerCase() === 'none' || val.toLowerCase() === 'transparent') return match;
    return `${type}={color}`;
  });

  // If a tag has opacity="..." or *Opacity="...", and we want to use secondaryColor for them
  // A simpler way: After the above replacement, if a tag has opacity, replace `{color}` with `{secondaryColor ?? color}` inside it.
  // We'll use a regex that matches an entire XML tag and if it contains opacity, we replace {color} with {secondaryColor ?? color}
  innerSVG = innerSVG.replace(/<[^>]+>/g, (tag) => {
    if (tag.includes('opacity="') || tag.includes('Opacity="')) {
      return tag.replace(/\{color\}/g, '{secondaryColor ?? color}');
    }
    return tag;
  });

  // Replace strokeWidth="..." with {strokeWidth}
  innerSVG = innerSVG.replace(/strokeWidth="[^"]+"/g, 'strokeWidth={strokeWidth}');

  return { innerSVG, viewBox };
}

function main() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  const files = fs.readdirSync(RAW_DIR).filter(f => f.endsWith('.svg'));
  
  const iconGroups = {};
  const skippedFiles = [];
  const generatedComponents = [];

  for (const file of files) {
    if (file === 'Fire icon.svg' || file === 'Google Icon.svg' || file.startsWith('Property 1=')) {
      skippedFiles.push({ file, reason: 'Does not match naming pattern' });
      continue;
    }

    let variant = '';
    let baseName = '';
    const possibleSuffixes = [...KNOWN_VARIANTS, 'outlined', 'line', 'two-tone', 'twotone'];
    for (const suffix of possibleSuffixes) {
      if (file.endsWith(`-${suffix}.svg`)) {
        variant = suffix;
        baseName = file.slice(0, -suffix.length - 5);
        break;
      }
    }

    if (!variant) {
      skippedFiles.push({ file, reason: 'Does not match naming pattern' });
      continue;
    }

    variant = normalizeVariant(variant);

    const content = fs.readFileSync(path.join(RAW_DIR, file), 'utf8');
    const parsed = parseSVG(content, variant);

    if (!iconGroups[baseName]) {
      iconGroups[baseName] = {};
    }
    iconGroups[baseName][variant] = parsed;
  }

  const indexExports = [];
  indexExports.push(`export * from './Icon.types';`);

  for (const [baseName, variants] of Object.entries(iconGroups)) {
    const componentName = toPascalCase(baseName) + 'Icon';
    
    const availableVariants = Object.keys(variants);
    let defaultVariant = VARIANT_PRIORITY.find(v => availableVariants.includes(v));
    if (!defaultVariant) defaultVariant = availableVariants[0];

    // Check viewBoxes
    const viewBoxes = new Set(Object.values(variants).map(v => v.viewBox));
    const mainViewBox = Array.from(viewBoxes)[0] || '0 0 24 24';

    let componentContent = `import React from 'react';
import Svg, { Path, Circle, Rect, Line, Polyline, Polygon, G, Defs, ClipPath, Mask } from 'react-native-svg';
import type { IconProps, IconVariant } from './Icon.types';

const DEFAULT_SIZE = 24;

const availableVariants = [${availableVariants.map(v => `'${v}'`).join(', ')}] as const;
type ${componentName}Variant = (typeof availableVariants)[number];

function normalizeVariant(variant?: IconVariant): ${componentName}Variant {
  if (variant && availableVariants.includes(variant as any)) {
    return variant as ${componentName}Variant;
  }
  return '${defaultVariant}';
}

`;

    for (const [vName, vData] of Object.entries(variants)) {
      componentContent += `function render${toPascalCase(vName)}({ color, secondaryColor, strokeWidth }: { color: any; secondaryColor?: any; strokeWidth: number }) {
  return (
    <>
      ${vData.innerSVG}
    </>
  );
}

`;
    }

    componentContent += `export function ${componentName}({
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
      viewBox="${mainViewBox}"
      fill="none"
      testID={testID}
    >
      {${availableVariants.map(v => `resolvedVariant === '${v}' ? render${toPascalCase(v)}({ color, secondaryColor, strokeWidth })`).join(' : \n        ')} : null}
    </Svg>
  );
}
`;

    const outPath = path.join(OUT_DIR, `${componentName}.tsx`);
    fs.writeFileSync(outPath, componentContent);
    indexExports.push(`export * from './${componentName}';`);
    generatedComponents.push({ name: componentName, variants: availableVariants });
  }

  fs.writeFileSync(path.join(OUT_DIR, 'index.ts'), indexExports.join('\n') + '\n');

  // Stats and Audit
  const auditContent = `# Icon System Audit

## Directories
- Raw SVG source folder: \`assets/icons/raw/\`
- Generated icon folder: \`src/design-system/icons/\`

## Dependency Status
- \`react-native-svg\` is installed.

## Summary
- Total raw SVG files parsed: ${files.length}
- Number of icon groups detected: ${Object.keys(iconGroups).length}
- Number of icon components generated: ${generatedComponents.length}

## Default Variant Rule
outline > linear > bold > solid > filled > broken > bulk > twoTone > duotone > first available

## Generated Components
${generatedComponents.map(g => `- **${g.name}**: ${g.variants.join(', ')}`).join('\n')}

## Skipped Files (Manual Review Required)
${skippedFiles.map(s => `- \`${s.file}\`: ${s.reason}`).join('\n')}

## Usage Examples
\`\`\`tsx
import { CameraIcon, HeartIcon } from '@ds/icons';
import { Button } from '@ds/components';

<Button
  intent="primary"
  variant="solid"
  leftIcon={<CameraIcon variant="outline" size={20} />}
  title="Check in"
/>

<HeartIcon variant="bold" size={24} color="#F45D1E" />
\`\`\`
`;

  fs.writeFileSync(path.join(OUT_DIR, 'ICONS_AUDIT.md'), auditContent);

  console.log('Successfully generated icons!');
  console.log(`Groups: ${Object.keys(iconGroups).length}`);
  console.log(`Skipped: ${skippedFiles.length}`);
}

main();
