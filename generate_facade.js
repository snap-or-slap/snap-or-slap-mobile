const fs = require('fs');
const path = require('path');

const tsconfigPath = path.join(__dirname, 'tsconfig.json');

// We are generating files into src/design-system
const dsPath = path.join(__dirname, 'src', 'design-system');
const tokensPath = path.join(dsPath, 'tokens');
const themePath = path.join(dsPath, 'theme');

// A script to write a file, creating directories if needed
function write(filePath, content) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content.trim() + '\n', 'utf-8');
}

// -----------------------------------------
// TASK A & B & C: TOKENS
// -----------------------------------------

write(path.join(tokensPath, 'primitive.tokens.ts'), `
import { primitiveGeneratedTokens } from './generated';

export const primitiveTokens = {
  ...primitiveGeneratedTokens
} as const;
`);

write(path.join(tokensPath, 'semantic.tokens.ts'), `
import { semanticLightGeneratedTokens, semanticDarkGeneratedTokens } from './generated';

export const lightSemanticTokens = {
  ...semanticLightGeneratedTokens
} as const;

export const darkSemanticTokens = {
  ...semanticDarkGeneratedTokens
} as const;
`);

write(path.join(tokensPath, 'component.tokens.ts'), `
import { componentGeneratedTokens } from './generated';

export const componentTokens = {
  ...componentGeneratedTokens
} as const;
`);

write(path.join(tokensPath, 'spacing.tokens.ts'), `
// Fallback spacing scale
export const spacingTokens = {
  0: 0,
  4: 4,
  8: 8,
  12: 12,
  16: 16,
  20: 20,
  24: 24,
  32: 32,
  40: 40,
  48: 48,
  64: 64,
} as const;
`);

write(path.join(tokensPath, 'radius.tokens.ts'), `
// Fallback radius scale
export const radiusTokens = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 999,
} as const;
`);

write(path.join(tokensPath, 'sizing.tokens.ts'), `
// Missing in design system JSONs
export const sizingTokens = {} as const;
`);

write(path.join(tokensPath, 'opacity.tokens.ts'), `
// Missing in design system JSONs
export const opacityTokens = {} as const;
`);

write(path.join(tokensPath, 'typography.tokens.ts'), `
export const typographyTokens = {
  display: {
    large: { fontSize: 57, lineHeight: 64, fontWeight: '400' },
    medium: { fontSize: 45, lineHeight: 52, fontWeight: '400' },
    small: { fontSize: 36, lineHeight: 44, fontWeight: '400' },
  },
  headline: {
    large: { fontSize: 32, lineHeight: 40, fontWeight: '400' },
    medium: { fontSize: 28, lineHeight: 36, fontWeight: '400' },
    small: { fontSize: 24, lineHeight: 32, fontWeight: '400' },
  },
  title: {
    large: { fontSize: 22, lineHeight: 28, fontWeight: '600' },
    medium: { fontSize: 16, lineHeight: 24, fontWeight: '600' },
    small: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
  },
  body: {
    large: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
    medium: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
    small: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
  },
  label: {
    large: { fontSize: 16, lineHeight: 20, fontWeight: '500' },
    medium: { fontSize: 14, lineHeight: 20, fontWeight: '500' },
    small: { fontSize: 12, lineHeight: 16, fontWeight: '500' },
    extraSmall: { fontSize: 11, lineHeight: 16, fontWeight: '500' },
  },
} as const;
`);

write(path.join(tokensPath, 'shadow.tokens.ts'), `
export const shadowTokens = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;
`);

write(path.join(tokensPath, 'token.types.ts'), `
import { lightSemanticTokens } from './semantic.tokens';
import { componentTokens } from './component.tokens';
import { typographyTokens } from './typography.tokens';
import { spacingTokens } from './spacing.tokens';
import { radiusTokens } from './radius.tokens';
import { shadowTokens } from './shadow.tokens';

export type ThemeMode = 'light' | 'dark';
export type SemanticColorTokens = typeof lightSemanticTokens;
export type ComponentTokens = typeof componentTokens;
export type TypographyTokens = typeof typographyTokens;
export type SpacingTokens = typeof spacingTokens;
export type RadiusTokens = typeof radiusTokens;
export type ShadowTokens = typeof shadowTokens;
`);

write(path.join(tokensPath, 'tokenResolver.ts'), `
export const getNestedTokenValue = (path: string, obj: any): any => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export const resolveTokenPath = (path: string, obj: any) => {
  const cleanPath = path.replace(/^{|}$/g, '');
  return getNestedTokenValue(cleanPath, obj);
};
`);

write(path.join(tokensPath, 'index.ts'), `
export * from './generated';
export * from './primitive.tokens';
export * from './semantic.tokens';
export * from './component.tokens';
export * from './typography.tokens';
export * from './spacing.tokens';
export * from './radius.tokens';
export * from './sizing.tokens';
export * from './opacity.tokens';
export * from './shadow.tokens';
export * from './token.types';
export * from './tokenResolver';
`);

// -----------------------------------------
// TASK E: THEME LAYER
// -----------------------------------------

write(path.join(themePath, 'lightTheme.ts'), `
import {
  lightSemanticTokens,
  componentTokens,
  typographyTokens,
  spacingTokens,
  radiusTokens,
  sizingTokens,
  opacityTokens,
  shadowTokens,
} from '../tokens';

export const lightTheme = {
  mode: 'light' as const,
  colors: lightSemanticTokens,
  components: componentTokens,
  typography: typographyTokens,
  spacing: spacingTokens,
  radius: radiusTokens,
  sizing: sizingTokens,
  opacity: opacityTokens,
  shadow: shadowTokens,
} as const;
`);

write(path.join(themePath, 'darkTheme.ts'), `
import {
  darkSemanticTokens,
  componentTokens,
  typographyTokens,
  spacingTokens,
  radiusTokens,
  sizingTokens,
  opacityTokens,
  shadowTokens,
} from '../tokens';

export const darkTheme = {
  mode: 'dark' as const,
  colors: darkSemanticTokens,
  components: componentTokens,
  typography: typographyTokens,
  spacing: spacingTokens,
  radius: radiusTokens,
  sizing: sizingTokens,
  opacity: opacityTokens,
  shadow: shadowTokens,
} as const;
`);

write(path.join(themePath, 'theme.types.ts'), `
import { lightTheme } from './lightTheme';

export type AppTheme = typeof lightTheme;
`);

write(path.join(themePath, 'ThemeProvider.tsx'), `
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { lightTheme } from './lightTheme';
import { darkTheme } from './darkTheme';
import { AppTheme } from './theme.types';

type ThemeContextType = {
  theme: AppTheme;
  setMode: (mode: 'light' | 'dark') => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialMode?: 'light' | 'dark';
}

export const ThemeProvider = ({ children, initialMode = 'light' }: ThemeProviderProps) => {
  const [mode, setMode] = useState<'light' | 'dark'>(initialMode);
  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
`);

write(path.join(themePath, 'useTheme.ts'), `
import { useThemeContext } from './ThemeProvider';
import { lightTheme } from './lightTheme';

export function useTheme() {
  try {
    const { theme } = useThemeContext();
    return theme;
  } catch (error) {
    // Safe fallback if not wrapped in ThemeProvider
    return lightTheme;
  }
}
`);

write(path.join(themePath, 'index.ts'), `
export * from './lightTheme';
export * from './darkTheme';
export * from './theme.types';
export * from './ThemeProvider';
export * from './useTheme';
`);

// -----------------------------------------
// TASK F: ROOT EXPORTS
// -----------------------------------------

write(path.join(dsPath, 'index.ts'), `
export * from './tokens';
export * from './theme';
`);

console.log('Script execution finished successfully.');
