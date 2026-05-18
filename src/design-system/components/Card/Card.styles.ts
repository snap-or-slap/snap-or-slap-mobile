import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';
import { CardProps } from './Card.types';

export const createCardStyles = (theme: AppTheme, variant: CardProps['variant'] = 'default', padding: CardProps['padding'] = 'md') => {
  const c = theme.colors;
  const radius = theme.radius as any;
  const shadow = theme.shadow as any;
  const spacing = theme.spacing as any;

  let pad = spacing['16'] || 16;
  if (padding === 'none') pad = 0;
  if (padding === 'sm') pad = spacing['12'] || 12;
  if (padding === 'lg') pad = spacing['24'] || 24;

  let bgColor: string = c.bg.surface;
  let shadowStyle = {};
  let borderWidth = 0;
  let borderColor = 'transparent';

  if (variant === 'elevated') {
    bgColor = c.bg['surface-elevated'];
    shadowStyle = shadow.md || { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 };
  } else if (variant === 'outlined') {
    borderWidth = 1;
    borderColor = c.border.subtle;
  } else if (variant === 'subtle') {
    bgColor = c.bg['surface-subtle'];
  }

  return StyleSheet.create({
    card: {
      backgroundColor: bgColor,
      borderRadius: radius.md || 12,
      padding: pad,
      borderWidth,
      borderColor,
      ...shadowStyle,
    }
  });
};
