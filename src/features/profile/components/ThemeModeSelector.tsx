import React from 'react';
import { useThemeMode } from '@ds/theme';
import type { ThemeMode } from '@ds/theme';
import { SegmentedTabs } from '@shared/components';

const themeItems: Array<{ key: ThemeMode; label: string }> = [
  { key: 'light', label: 'Light' },
  { key: 'dark', label: 'Dark' },
  { key: 'system', label: 'System' },
];

export function ThemeModeSelector() {
  const { mode, setMode } = useThemeMode();

  return (
    <SegmentedTabs
      items={themeItems}
      activeKey={mode}
      onChange={setMode}
      testID="theme-mode-selector"
    />
  );
}
