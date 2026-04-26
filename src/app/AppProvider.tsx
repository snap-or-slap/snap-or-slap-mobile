import React from 'react';
import { ThemeProvider } from '../design-system/theme';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}
