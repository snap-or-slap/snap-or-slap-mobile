import { useThemeContext } from './ThemeProvider';
import { lightTheme } from './lightTheme';

export function useTheme() {
  try {
    const { theme } = useThemeContext();
    return theme;
  } catch (error) {
    // Safe fallback if not wrapped in ThemeProvider
    return lightTheme;
  }
}
