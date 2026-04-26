import React from 'react';
import { AppProvider } from './src/app/AppProvider';
import { AppNavigator } from './src/app/AppNavigator';

export default function App() {
  return (
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );
}
