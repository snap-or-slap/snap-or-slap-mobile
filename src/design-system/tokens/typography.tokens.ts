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
