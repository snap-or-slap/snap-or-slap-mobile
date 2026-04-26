import React from 'react';
import { render } from '@testing-library/react-native';
import { AppProvider } from '../app/AppProvider';

type RenderOptions = Parameters<typeof render>[1];

export function renderWithProviders(
  ui: React.ReactElement,
  options?: RenderOptions
) {
  return render(
    <AppProvider>
      {ui}
    </AppProvider>,
    options
  );
}