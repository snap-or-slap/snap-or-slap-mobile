export const normalizeFigmaColorValue = (val: string): string => {
  if (!val) return val;
  // This is a basic normalize fallback just in case we missed alpha handling
  return val;
};

export const isTokenReference = (val: unknown): val is string => {
  return typeof val === 'string' && val.startsWith('{') && val.endsWith('}');
};
