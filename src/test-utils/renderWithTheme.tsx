import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '@ds/theme';

type RenderOptions = Parameters<typeof render>[1];

export function renderWithTheme(
  ui: React.ReactElement,
  options?: RenderOptions
) {
  return render(ui, {
    wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    ...options,
  });
}
