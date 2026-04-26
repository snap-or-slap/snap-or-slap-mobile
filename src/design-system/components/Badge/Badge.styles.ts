import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';
import { AppTextColor, AppTextVariant } from '../Text';

export const createBadgeStyles = (theme: AppTheme, tone: string, size: string) => {
  const textColors = theme.colors?.text || ({} as any);
  const radius = theme.radius as any;
  const spacing = theme.spacing as any;

  const map: Record<string, string> = {
    neutral: '#E5E5EA',
    brand: textColors.brand || '#007AFF',
    success: textColors.success || '#34C759',
    warning: textColors.warning || '#FF9500',
    danger: textColors.error || '#FF3B30',
    info: textColors.info || '#5856D6',
  };

  const bg = map[tone] || map.neutral;
  const pad = size === 'sm' ? { px: 6, py: 2 } : { px: 8, py: 4 };

  return StyleSheet.create({
    badge: {
      backgroundColor: bg,
      borderRadius: radius?.full || 999,
      paddingHorizontal: pad.px,
      paddingVertical: pad.py,
      alignSelf: 'flex-start',
      alignItems: 'center',
      justifyContent: 'center',
    }
  });
};

export const getBadgeTextColor = (tone: string): AppTextColor => {
  return tone === 'neutral' ? 'secondary' : 'inverse';
};

export const getBadgeTextVariant = (size: string): AppTextVariant => {
  return size === 'sm' ? 'labelExtraSmall' : 'labelSmall';
};
