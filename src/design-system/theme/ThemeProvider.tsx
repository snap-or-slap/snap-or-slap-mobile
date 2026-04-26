import React, { createContext, useContext, useState, ReactNode } from 'react';
import { lightTheme } from './lightTheme';
import { darkTheme } from './darkTheme';
import { AppTheme } from './theme.types';

type ThemeContextType = {
  theme: AppTheme;
  setMode: (mode: 'light' | 'dark') => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialMode?: 'light' | 'dark';
}

export const ThemeProvider = ({ children, initialMode = 'light' }: ThemeProviderProps) => {
  const [mode, setMode] = useState<'light' | 'dark'>(initialMode);
  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
