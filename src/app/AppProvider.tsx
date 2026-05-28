import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '../design-system/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from '../store';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Provider store={store}>
          {children}
        </Provider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
