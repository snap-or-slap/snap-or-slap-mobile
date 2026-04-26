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
