import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Card } from '@ds/components';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';

export type ProfileStatCardProps = {
  label: string;
  value: string | number;
  testID?: string;
};

export function ProfileStatCard({ label, value, testID }: ProfileStatCardProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Card style={styles.card} testID={testID}>
      <AppText variant="heading" style={styles.value}>
        {String(value)}
      </AppText>
      <AppText variant="caption" style={styles.label}>
        {label}
      </AppText>
    </Card>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: {
      flex: 1,
      alignItems: 'center',
      gap: 4,
      paddingVertical: 16,
      paddingHorizontal: 8,
    },
    value: {
      color: theme.colors.text.primary,
      fontWeight: '800',
    },
    label: {
      color: theme.colors.text.secondary,
      textAlign: 'center',
    },
  });
}
