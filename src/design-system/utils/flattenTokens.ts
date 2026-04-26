export const flattenTokenObject = (
  obj: Record<string, any>,
  prefix = ''
): Record<string, any> => {
  const result: Record<string, any> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
      ) {
        Object.assign(result, flattenTokenObject(value, newKey));
      } else {
        result[newKey] = value;
      }
    }
  }

  return result;
};

export const getTokenValue = (path: string, flattenedTokens: Record<string, any>) => {
  const cleanPath = path.replace(/^{|}$/g, ''); // remove '{' and '}'
  return flattenedTokens[cleanPath];
};
