import { useThemeContext } from './ThemeProvider';
import type { AppTheme } from './theme.types';

export function useTheme(): AppTheme {
  return useThemeContext().theme;
}

export function useThemeMode() {
  const { mode, resolvedMode, setMode } = useThemeContext();
  return { mode, resolvedMode, setMode };
}
