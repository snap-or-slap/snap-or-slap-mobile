import { StyleSheet, ViewStyle } from 'react-native';
import { AppTheme } from '../../theme';
import { ButtonVariant, ButtonSize } from './Button.types';
import { motion } from '../../utils/motion';

const getButtonSizeStyle = (theme: AppTheme, size: ButtonSize, iconOnly: boolean): ViewStyle => {
  const spacing = theme.spacing as Record<string, number>;
  
  if (iconOnly) {
    const dimMap = { sm: 36, md: 44, lg: 52 };
    const dim = dimMap[size] || 44;
    return { width: dim, height: dim, justifyContent: 'center', alignItems: 'center' };
  }

  const map: Record<ButtonSize, ViewStyle> = {
    sm: { minHeight: 36, paddingHorizontal: spacing['16'] || 16, gap: spacing['8'] || 8 },
    md: { minHeight: 44, paddingHorizontal: spacing['20'] || 20, gap: spacing['8'] || 8 },
    lg: { minHeight: 52, paddingHorizontal: spacing['24'] || 24, gap: spacing['8'] || 10 },
  };
  return map[size] || map.md;
};

const getButtonRadius = (theme: AppTheme): number => {
  return (theme.radius as any).full || 999;
};

export const getButtonTextVariant = (size: ButtonSize) => {
  const map: Record<ButtonSize, any> = { sm: 'labelMedium', md: 'labelLarge', lg: 'labelLarge' };
  return map[size] || 'labelLarge';
};

const getButtonColorScheme = (theme: AppTheme, variant: ButtonVariant, disabled: boolean) => {
  const c = theme.colors;
  
  const map: Record<ButtonVariant, any> = {
    primary: { bg: c.bg.brand, text: c.text['on-brand'], border: 'transparent' },
    secondary: { bg: 'transparent', text: c.text.primary, border: c.border.strong },
    ghost: { bg: 'transparent', text: c.text.primary, border: 'transparent' },
    danger: { bg: c.bg.error, text: c.text['on-error'], border: 'transparent' },
    subtle: { bg: c.bg['surface-pressed'], text: c.text.primary, border: 'transparent' }
  };
  
  return map[variant] || map.primary;
};

export const createButtonStyles = (
  theme: AppTheme,
  options: { variant: ButtonVariant; size: ButtonSize; disabled: boolean; loading: boolean; fullWidth: boolean; iconOnly: boolean; pressed: boolean }
) => {
  const { variant, size, disabled, loading, fullWidth, iconOnly, pressed } = options;
  const colors = getButtonColorScheme(theme, variant, disabled);
  const sizeStyle = getButtonSizeStyle(theme, size, iconOnly);
  const radius = getButtonRadius(theme);
  const c = theme.colors;

  let opacity = 1;
  if (disabled || loading) opacity = motion.opacity.disabled;
  else if (pressed && variant !== 'primary' && variant !== 'danger') opacity = motion.opacity.pressed;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: pressed && (variant === 'primary' || variant === 'danger') ? (c.bg as any)[`${variant === 'primary' ? 'brand' : 'error'}-pressed`] || colors.bg : colors.bg,
      borderColor: colors.border,
      borderWidth: variant === 'secondary' ? 1 : 0,
      borderRadius: radius,
      opacity,
      width: fullWidth ? '100%' : undefined,
      ...sizeStyle,
    },
    text: {
      color: colors.text,
    }
  });
};
