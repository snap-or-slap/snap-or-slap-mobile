export const getNestedTokenValue = (path: string, obj: any): any => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export const resolveTokenPath = (path: string, obj: any) => {
  const cleanPath = path.replace(/^{|}$/g, '');
  return getNestedTokenValue(cleanPath, obj);
};
