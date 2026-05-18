import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Card } from '@ds/components';
import { MedalStarIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';

export type BadgeTileProps = {
  label: string;
  testID?: string;
};

export function BadgeTile({ label, testID }: BadgeTileProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Card style={styles.tile} testID={testID}>
      <MedalStarIcon size={28} color={theme.colors.text.brand} variant="bulk" />
      <AppText variant="caption" style={styles.label} align="center">
        {label}
      </AppText>
    </Card>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    tile: {
      alignItems: 'center',
      gap: 6,
      paddingVertical: 16,
      paddingHorizontal: 12,
      minWidth: 90,
    },
    label: {
      color: theme.colors.text.secondary,
      fontWeight: '600',
      textAlign: 'center',
    },
  });
}
