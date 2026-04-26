import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';

export const createScreenStyles = (theme: AppTheme, padded: boolean, background?: string) => {
  const bg = theme.colors?.bg || { primary: '#fff' };
  const spacing = theme.spacing as any;
  const pad = padded ? (spacing['16'] || 16) : 0;
  
  let bgColor = (bg as any).page || '#fff';
  if (background) {
     bgColor = (bg as any)[background] || background;
  }

  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: bgColor,
    },
    content: {
      padding: pad,
      flexGrow: 1,
    }
  });
};
