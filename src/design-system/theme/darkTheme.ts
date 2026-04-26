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
