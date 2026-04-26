import { StyleSheet, TextStyle } from 'react-native';
import { AppTheme } from '../../theme';
import { AppTextVariant, AppTextColor } from './AppText.types';

export const getTextColor = (theme: AppTheme, colorKey: AppTextColor | string): string => {
  const textColors = theme.colors?.text || ({} as any);
  
  const map: Record<string, string> = {
    primary: textColors.primary || '#000',
    secondary: textColors.secondary || '#666',
    tertiary: textColors.tertiary || '#999',
    inverse: textColors.inverse || '#fff',
    disabled: textColors.disabled || '#ccc',
    brand: textColors.brand || (theme.colors as any)?.brand || '#007AFF',
    danger: textColors.error || '#FF3B30',
    success: textColors.success || '#34C759',
    warning: textColors.warning || '#FF9500',
    info: textColors.info || '#5856D6',
  };

  return map[colorKey] || colorKey;
};

export const getTypographyStyle = (theme: AppTheme, variant: AppTextVariant): TextStyle => {
  const [category, sizeRaw] = variant.split(/(?=[A-Z])/);
  const size = sizeRaw ? sizeRaw.toLowerCase() : 'medium';
  
  const typographyGroup = (theme.typography as any)[category];
  if (typographyGroup && typographyGroup[size]) {
    return typographyGroup[size] as TextStyle;
  }
  
  return theme.typography?.body?.medium as TextStyle || {};
};

export const createAppTextStyles = (theme: AppTheme, variant: AppTextVariant, colorKey: AppTextColor | string, align: 'left' | 'center' | 'right' | 'auto' | 'justify') => {
  return StyleSheet.create({
    text: {
      ...getTypographyStyle(theme, variant),
      color: getTextColor(theme, colorKey),
      textAlign: align,
    }
  });
};
