import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';

export const createCardStyles = (theme: AppTheme, variant: 'default' | 'elevated' | 'outlined', padding: number | string | undefined) => {
  const bg = theme.colors?.bg || { primary: '#fff' };
  const border = theme.colors?.border || { subtle: '#E5E5EA' };
  const radius = theme.radius as any;
  const shadow = theme.shadow as any;
  const spacing = theme.spacing as any;

  const pad = padding ? (typeof padding === 'number' ? padding : spacing[padding] || 16) : (spacing['16'] || 16);

  let shadowStyle = {};
  if (variant === 'elevated') {
     shadowStyle = shadow?.md || { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 };
  }

  return StyleSheet.create({
    card: {
      backgroundColor: (bg as any).surface || '#fff',
      borderRadius: radius?.md || 12,
      padding: pad,
      borderWidth: variant === 'outlined' ? 1 : 0,
      borderColor: variant === 'outlined' ? border.subtle || '#E5E5EA' : 'transparent',
      ...shadowStyle,
    }
  });
};
