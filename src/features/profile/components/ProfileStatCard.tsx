import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Card } from '@ds/components';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';

type ProfileStatCardProps = {
  label: string;
  value: string | number;
};

export function ProfileStatCard({ label, value }: ProfileStatCardProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Card variant="outlined" padding="sm" style={styles.card}>
      <AppText variant="heading" style={styles.value}>
        {value}
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
      minHeight: 88,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.bg['brand-subtle'],
      gap: theme.spacing[4],
    },
    value: {
      color: theme.colors.text.brand,
      fontWeight: '800',
    },
    label: {
      color: theme.colors.text.secondary,
      fontWeight: '700',
      textAlign: 'center',
    },
  });
}
