import React from 'react';
import { StyleSheet } from 'react-native';
import { AppText, Button, Card } from '@ds/components';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';

type DangerZoneCardProps = {
  onDeletePress: () => void;
};

export function DangerZoneCard({ onDeletePress }: DangerZoneCardProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Card variant="outlined" style={styles.card}>
      <AppText variant="subtitle" style={styles.title}>
        Danger zone
      </AppText>
      <AppText variant="body" style={styles.body}>
        Delete your account and remove your local profile session from this device.
      </AppText>
      <Button
        title="Delete account"
        variant="danger"
        fullWidth
        onPress={onDeletePress}
        testID="delete-account-open"
      />
    </Card>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: {
      gap: theme.spacing[12],
      borderColor: theme.colors.border.error,
    },
    title: {
      color: theme.colors.text.error,
      fontWeight: '800',
    },
    body: {
      color: theme.colors.text.secondary,
      lineHeight: 20,
    },
  });
}
