import { StyleSheet, TextStyle } from 'react-native';
import { AppTheme } from '../../theme';
import { AppTextVariant, AppTextColor } from './AppText.types';

export const getTextColor = (theme: AppTheme, colorKey: AppTextColor | string): string => {
  const c = theme.colors.text as any;
  
  const map: Record<string, string> = {
    primary: c.primary,
    secondary: c.secondary,
    tertiary: c.tertiary,
    inverse: c.inverse,
    disabled: c.disabled,
    brand: c.brand,
    'on-brand': c['on-brand'],
    danger: c.error,
    'on-error': c['on-error'],
    success: c.success,
    'on-success': c['on-success'],
    warning: c.warning,
    'on-warning': c['on-warning'],
    info: c.info,
    'on-info': c['on-info'],
  };

  return map[colorKey] || colorKey;
};

export const getTypographyStyle = (theme: AppTheme, variant: AppTextVariant): TextStyle => {
  const t = theme.typography as any;

  const map: Record<AppTextVariant, TextStyle> = {
    display: t.display.medium,
    heading: t.headline.medium,
    title: t.title.large,
    subtitle: t.title.medium,
    body: t.body.large,
    bodyStrong: { ...t.body.large, fontWeight: '600' },
    label: t.label.large,
    caption: t.body.medium,
    overline: { ...t.label.small, textTransform: 'uppercase' },
  };
  
  return map[variant] || t.body.large;
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
