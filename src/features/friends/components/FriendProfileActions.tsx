import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card } from '@ds/components';
import { InfoCircleIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';

type FriendProfileActionsProps = {
  confirming: boolean;
  loading?: boolean;
  error?: string | null;
  onStartRemove: () => void;
  onCancelRemove: () => void;
  onConfirmRemove: () => void;
};

export function FriendProfileActions({
  confirming,
  loading = false,
  error,
  onStartRemove,
  onCancelRemove,
  onConfirmRemove,
}: FriendProfileActionsProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  if (confirming) {
    return (
      <Card variant="outlined" style={styles.confirmCard} testID="remove-friend-confirm-card">
        <View style={styles.header}>
          <InfoCircleIcon size={22} color={theme.colors.text.error} variant="outline" />
          <AppText variant="subtitle" style={styles.dangerTitle}>
            Remove friend?
          </AppText>
        </View>
        <AppText variant="body" style={styles.body}>
          You will no longer see each other's full profile or invite each other directly.
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
            onPress={onCancelRemove}
            disabled={loading}
            style={styles.actionButton}
          />
          <Button
            title="Remove Friend"
            variant="danger"
            onPress={onConfirmRemove}
            loading={loading}
            style={styles.actionButton}
            testID="remove-friend-confirm"
          />
        </View>
      </Card>
    );
  }

  return (
    <Card variant="outlined" style={styles.confirmCard}>
      <AppText variant="subtitle" style={styles.dangerTitle}>
        Friend actions
      </AppText>
      <Button
        title="Remove Friend"
        variant="danger"
        fullWidth
        onPress={onStartRemove}
        testID="remove-friend-open"
      />
    </Card>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    confirmCard: {
      gap: theme.spacing[12],
      borderColor: theme.colors.border.error,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[8],
    },
    dangerTitle: {
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
