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
