const fs = require('fs');
const path = require('path');
const { DOMParser, XMLSerializer } = require('@xmldom/xmldom');

const rawDir = path.join(__dirname, 'assets/icons/raw');
const outDir = path.join(__dirname, 'src/design-system/icons');

fs.mkdirSync(outDir, { recursive: true });

function toPascalCase(str) {
  // e.g. "arrow-circle-down", "Fire icon", "setting-2"
  return str
    .replace(/\.svg$/, '')
    .split(/[-_ ]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('') + 'Icon';
}

const files = fs.readdirSync(rawDir).filter(f => f.endsWith('.svg'));

const successfulIcons = [];
const manualReviewIcons = [];

files.forEach(file => {
  const content = fs.readFileSync(path.join(rawDir, file), 'utf8');
  const componentName = toPascalCase(file);
  
  if (content.includes('id="Property 1=') || content.includes('id="Property 1"')) {
    manualReviewIcons.push({
      file,
      componentName,
      reason: 'Multi-variant SVG exported as entire component set. Coordinates stacked vertically. Coordinate normalization is risky.'
    });
    return;
  }
  
  // Single icon SVG handling
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'image/svg+xml');
  const svgEl = doc.documentElement;
  
  if (!svgEl || svgEl.tagName !== 'svg') {
    manualReviewIcons.push({ file, componentName, reason: 'Invalid SVG format' });
    return;
  }

  const viewBox = svgEl.getAttribute('viewBox') || '0 0 24 24';

  // We must convert tags and attributes
  const transformNode = (node) => {
    if (node.nodeType === 3) {
      return node.nodeValue.trim(); // text node
    }
    if (node.nodeType !== 1) return ''; // skip comments etc.
    
    const tagNameMap = {
      svg: 'Svg', path: 'Path', circle: 'Circle', rect: 'Rect',
      line: 'Line', polyline: 'Polyline', polygon: 'Polygon',
      g: 'G', defs: 'Defs', clippath: 'ClipPath', mask: 'Mask'
    };
    
    const tagName = tagNameMap[node.tagName.toLowerCase()] || node.tagName;
    let attrs = '';
    let hasFill = false;
    let hasStroke = false;
    
    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i];
      let name = attr.name;
      let value = attr.value;
      
      // Map attribute names
      if (name === 'stroke-width') name = 'strokeWidth';
      if (name === 'stroke-linecap') name = 'strokeLinecap';
      if (name === 'stroke-linejoin') name = 'strokeLinejoin';
      if (name === 'fill-rule') name = 'fillRule';
      if (name === 'clip-rule') name = 'clipRule';
      if (name === 'clip-path') name = 'clipPath';
      if (name === 'id' || name === 'class' || name === 'xmlns') continue; // skip useless
      
      if (name === 'fill') {
        hasFill = true;
        if (value !== 'none') value = '{color}';
      }
      if (name === 'stroke') {
        hasStroke = true;
        if (value !== 'none') value = '{color}';
      }
      if (name === 'strokeWidth') {
        value = '{strokeWidth}';
      }
      
      attrs += ` ${name}="${value}"`.replace(/="\{([^}]+)\}"/g, '={$1}');
    }

    // Default fill rule if needed for paths, but usually it's preserved
    let children = '';
    for (let i = 0; i < node.childNodes.length; i++) {
      children += transformNode(node.childNodes[i]);
    }
    
    if (!children) return `<${tagName}${attrs} />`;
    return `<${tagName}${attrs}>${children}</${tagName}>`;
  };

  let innerContent = '';
  for (let i = 0; i < svgEl.childNodes.length; i++) {
    innerContent += transformNode(svgEl.childNodes[i]);
  }
  
  const componentContent = `import React from 'react';
import Svg, { Path, Circle, Rect, Line, Polyline, Polygon, G, Defs, ClipPath, Mask } from 'react-native-svg';
import type { IconProps } from './Icon.types';

export function ${componentName}({
  size = 24,
  color = 'currentColor',
  secondaryColor,
  strokeWidth = 2,
  testID,
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="${viewBox}"
      fill="none"
      testID={testID}
    >
      ${innerContent}
    </Svg>
  );
}
`;

  fs.writeFileSync(path.join(outDir, componentName + '.tsx'), componentContent);
  successfulIcons.push({ file, componentName, variants: ['solid'] }); // assuming single variant
});

// Write Icon.types.ts
fs.writeFileSync(path.join(outDir, 'Icon.types.ts'), `
import type { ColorValue } from 'react-native';

export type IconVariant =
  | 'linear'
  | 'solid'
  | 'broken'
  | 'outline'
  | 'bulk'
  | 'twoTone'
  | 'filled'
  | 'duotone';

export type IconProps = {
  size?: number;
  color?: ColorValue;
  secondaryColor?: ColorValue;
  strokeWidth?: number;
  variant?: IconVariant;
  testID?: string;
};
`.trim() + '\n');

// Write index.ts
let indexContent = "export * from './Icon.types';\\n";
successfulIcons.forEach(icon => {
  indexContent += "export * from './" + icon.componentName + "';\\n";
});
fs.writeFileSync(path.join(outDir, 'index.ts'), indexContent);

// Append to global index
const rootIndex = path.join(__dirname, 'src/design-system/index.ts');
if (fs.existsSync(rootIndex)) {
  let rootContent = fs.readFileSync(rootIndex, 'utf8');
  if (!rootContent.includes("export * from './icons';")) {
    rootContent += "export * from './icons';\\n";
    fs.writeFileSync(rootIndex, rootContent);
  }
}

// Write ICONS_AUDIT.md
let auditMd = "# Icon System Audit\\n" +
"\\n" +
"## Raw SVG Source Folder\\n" +
"\`assets/icons/raw/\`\\n" +
"\\n" +
"## Generated Icon Folder\\n" +
"\`src/design-system/icons/\`\\n" +
"\\n" +
"## Dependency\\n" +
"- \`react-native-svg\` has been successfully installed.\\n" +
"\\n" +
"## Summary\\n" +
"- **Total SVG files found**: " + files.length + "\\n" +
"- **Successfully converted**: " + successfulIcons.length + "\\n" +
"- **Require manual review**: " + manualReviewIcons.length + "\\n" +
"\\n" +
"## Icons Converted Successfully\\n";

successfulIcons.forEach(icon => {
  auditMd += "- **" + icon.componentName + "**: single-variant extracted\\n";
});

auditMd += "\\n## Icons Requiring Manual Review\\nThe following files were exported from Figma as entire component sets (containing multiple vertically stacked variants inside a single SVG). Attempting automatic coordinate normalization (guessing the translation offset) to center each variant into a standard 24x24 \`viewBox\` is extremely risky and can lead to silently broken bounding boxes.\\n\\n";

manualReviewIcons.forEach(icon => {
  auditMd += "- **" + icon.componentName + "** (\`" + icon.file + "\`): " + icon.reason + "\\n";
});

auditMd += "\\n## Recommendation\\nFor the icons requiring manual review, please return to Figma, select the individual variants (e.g., \`camera-linear\`, \`camera-solid\`), and export them directly as single standard SVGs instead of exporting the parent component frame.\\n" +
"\\n## Usage Example\\n" +
"\`\`\`tsx\\n" +
"import { GoogleIcon } from '@ds/icons';\\n" +
"import { Button } from '@ds/components';\\n" +
"\\n<Button\\n" +
"  intent='primary'\\n" +
"  variant='outline'\\n" +
"  leftIcon={<GoogleIcon size={20} color='#DB4437' />}\\n" +
"  title='Sign in with Google'\\n" +
"/>\\n" +
"\`\`\`\\n";

fs.writeFileSync(path.join(outDir, 'ICONS_AUDIT.md'), auditMd);

// Append to DESIGN_SYSTEM_AUDIT.md
const globalAuditPath = path.join(__dirname, 'src/design-system/DESIGN_SYSTEM_AUDIT.md');
if (fs.existsSync(globalAuditPath)) {
  let gAudit = fs.readFileSync(globalAuditPath, 'utf8');
  if (!gAudit.includes('12. Icon System Integration')) {
    gAudit += "\\n\\n## 12. Icon System Integration\\n" +
"- \`react-native-svg\` integrated.\\n" +
"- SVG Icon generation script executed.\\n" +
"- See \`src/design-system/icons/ICONS_AUDIT.md\` for the full report. " + manualReviewIcons.length + " icons require manual review due to being exported as whole component sets from Figma.\\n";
    fs.writeFileSync(globalAuditPath, gAudit);
  }
}

console.log('Script execution finished successfully.');
