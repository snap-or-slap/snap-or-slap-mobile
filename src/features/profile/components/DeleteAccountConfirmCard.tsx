import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card } from '@ds/components';
import { InfoCircleIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';

type DeleteAccountConfirmCardProps = {
  loading?: boolean;
  error?: string | null;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteAccountConfirmCard({
  loading = false,
  error,
  onCancel,
  onConfirm,
}: DeleteAccountConfirmCardProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Card variant="elevated" style={styles.card} testID="delete-account-confirm-card">
      <View style={styles.header}>
        <InfoCircleIcon size={22} color={theme.colors.text.error} variant="outline" />
        <AppText variant="subtitle" style={styles.title}>
          Delete account?
        </AppText>
      </View>
      <AppText variant="body" style={styles.body}>
        This action cannot be undone. Your profile, friend connections, and challenge history may be removed when backend deletion is enabled.
      </AppText>
      {error ? (
        <AppText variant="caption" style={styles.error}>
          {error}
        </AppText>
      ) : null}
      <View style={styles.actions}>
        <Button
          title="Cancel"
          variant="secondary"
          onPress={onCancel}
          style={styles.actionButton}
          disabled={loading}
        />
        <Button
          title="Confirm delete"
          variant="danger"
          onPress={onConfirm}
          loading={loading}
          style={styles.actionButton}
          testID="delete-account-confirm"
        />
      </View>
    </Card>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: {
      gap: theme.spacing[12],
      borderWidth: 1,
      borderColor: theme.colors.border.error,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[8],
    },
    title: {
      color: theme.colors.text.error,
      fontWeight: '800',
    },
    body: {
      color: theme.colors.text.secondary,
      lineHeight: 20,
    },
    error: {
      color: theme.colors.text.error,
      fontWeight: '700',
    },
    actions: {
      flexDirection: 'row',
      gap: theme.spacing[8],
    },
    actionButton: {
      flex: 1,
    },
  });
}
