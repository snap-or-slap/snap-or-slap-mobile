import { StyleSheet, ViewStyle } from 'react-native';
import { AppTheme } from '../../theme';
import { ButtonIntent, ButtonVariant, ButtonSize } from './Button.types';

const getButtonSizeStyle = (theme: AppTheme, size: ButtonSize, iconOnly: boolean): ViewStyle => {
  const spacing = theme.spacing as Record<string, number>;
  
  if (iconOnly) {
    const dimMap = { xs: 32, sm: 36, md: 44, lg: 52 };
    const dim = dimMap[size];
    return { width: dim, height: dim, justifyContent: 'center', alignItems: 'center' };
  }

  const map: Record<ButtonSize, ViewStyle> = {
    xs: { minHeight: 32, paddingHorizontal: spacing['12'] || 12, gap: spacing['4'] || 6 },
    sm: { minHeight: 36, paddingHorizontal: spacing['16'] || 14, gap: spacing['8'] || 8 },
    md: { minHeight: 44, paddingHorizontal: spacing['16'] || 16, gap: spacing['8'] || 8 },
    lg: { minHeight: 52, paddingHorizontal: spacing['20'] || 20, gap: spacing['8'] || 10 },
  };
  return map[size];
};

const getButtonRadius = (theme: AppTheme, size: ButtonSize, variant: ButtonVariant): number => {
  if (variant === 'link') return 0;
  const map: Record<ButtonSize, number> = { xs: 4, sm: 6, md: 8, lg: 12 };
  return map[size];
};

export const getButtonTextVariant = (size: ButtonSize) => {
  const map: Record<ButtonSize, any> = { xs: 'labelSmall', sm: 'labelMedium', md: 'labelLarge', lg: 'labelLarge' };
  return map[size];
};

const getButtonColorScheme = (theme: AppTheme, intent: ButtonIntent, variant: ButtonVariant, disabled: boolean) => {
  const c = theme.colors?.text || ({} as any);
  const palette = (theme.colors as any)?.brand || c.brand || '#007AFF';
  const success = c.success || '#34C759';
  const danger = c.error || '#FF3B30';
  const secondary = c.secondary || '#666';
  
  const map: Record<ButtonIntent, any> = {
    primary: { main: palette, text: '#fff' },
    secondary: { main: '#E5E5EA', text: secondary },
    positive: { main: success, text: '#fff' },
    negative: { main: danger, text: '#fff' },
    subtle: { main: '#F2F2F7', text: secondary }
  };
  
  const scheme = map[intent];

  if (variant === 'solid') {
    return { bg: scheme.main, text: scheme.text, border: 'transparent' };
  }
  if (variant === 'outline') {
    return { bg: 'transparent', text: scheme.main === '#E5E5EA' || scheme.main === '#F2F2F7' ? secondary : scheme.main, border: scheme.main === '#E5E5EA' || scheme.main === '#F2F2F7' ? '#C7C7CC' : scheme.main };
  }
  return { bg: 'transparent', text: scheme.main === '#E5E5EA' || scheme.main === '#F2F2F7' ? secondary : scheme.main, border: 'transparent' };
};

export const createButtonStyles = (
  theme: AppTheme,
  options: { intent: ButtonIntent; variant: ButtonVariant; size: ButtonSize; disabled: boolean; loading: boolean; fullWidth: boolean; iconOnly: boolean; pressed: boolean }
) => {
  const { intent, variant, size, disabled, loading, fullWidth, iconOnly, pressed } = options;
  const colors = getButtonColorScheme(theme, intent, variant, disabled);
  const sizeStyle = getButtonSizeStyle(theme, size, iconOnly);
  const radius = getButtonRadius(theme, size, variant);

  let opacity = 1;
  if (disabled || loading) opacity = 0.5;
  else if (pressed) opacity = variant === 'solid' ? 0.8 : 0.6;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.bg,
      borderColor: colors.border,
      borderWidth: variant === 'outline' ? 1 : 0,
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
