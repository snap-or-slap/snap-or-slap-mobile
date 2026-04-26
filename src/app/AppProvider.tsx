import React from 'react';
import { ThemeProvider } from '../design-system/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
