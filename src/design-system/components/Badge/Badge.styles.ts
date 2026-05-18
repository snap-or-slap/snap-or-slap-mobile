import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';
import { AppTextColor, AppTextVariant } from '../Text/AppText.types';

export const createBadgeStyles = (theme: AppTheme, variant: string, size: string) => {
  const bgColors = theme.colors.bg;
  const radius = theme.radius as any;

  const map: Record<string, string> = {
    neutral: bgColors['surface-pressed'],
    brand: bgColors.brand,
    success: bgColors.success,
    warning: bgColors.warning,
    danger: bgColors.error,
    info: bgColors.info,
  };

  const bg = map[variant] || map.neutral;
  const pad = size === 'sm' ? { px: 6, py: 2 } : { px: 8, py: 4 };

  return StyleSheet.create({
    badge: {
      flexDirection: 'row',
      backgroundColor: bg,
      borderRadius: radius.full || 999,
      paddingHorizontal: pad.px,
      paddingVertical: pad.py,
      alignSelf: 'flex-start',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
    }
  });
};

export const getBadgeTextColor = (variant: string): AppTextColor => {
  if (variant === 'neutral') return 'secondary';
  if (variant === 'danger') return 'on-error' as any;
  return `on-${variant}` as any;
};

export const getBadgeTextVariant = (size: string): AppTextVariant => {
  return size === 'sm' ? 'overline' : 'caption';
};
