import { semanticLightGeneratedTokens, semanticDarkGeneratedTokens } from './generated';

export const lightSemanticTokens = {
  ...semanticLightGeneratedTokens
} as const;

export const darkSemanticTokens = {
  ...semanticDarkGeneratedTokens
} as const;
