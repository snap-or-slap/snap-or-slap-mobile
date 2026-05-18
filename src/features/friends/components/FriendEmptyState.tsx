import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Card, Button } from '@ds/components';
import { InfoCircleIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';

export type FriendEmptyStateProps = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  testID?: string;
};

export function FriendEmptyState({
  title,
  description,
  icon,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  testID,
}: FriendEmptyStateProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Card testID={testID} style={styles.card}>
      <View style={styles.iconWrap}>
        {icon ?? (
          <InfoCircleIcon size={40} color={theme.colors.text.tertiary} variant="outline" />
        )}
      </View>
      <AppText variant="subtitle" style={styles.title}>
        {title}
      </AppText>
      {description ? (
        <AppText variant="body" style={styles.description}>
          {description}
        </AppText>
      ) : null}
      {primaryActionLabel && onPrimaryAction ? (
        <Button
          title={primaryActionLabel}
          variant="primary"
          size="sm"
          onPress={onPrimaryAction}
          fullWidth
          style={styles.button}
          testID={testID ? `${testID}-primary` : undefined}
        />
      ) : null}
      {secondaryActionLabel && onSecondaryAction ? (
        <Button
          title={secondaryActionLabel}
          variant="ghost"
          size="sm"
          onPress={onSecondaryAction}
          fullWidth
          testID={testID ? `${testID}-secondary` : undefined}
        />
      ) : null}
    </Card>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: {
      alignItems: 'center',
      gap: 12,
      paddingVertical: 40,
      paddingHorizontal: 24,
    },
    iconWrap: {
      marginBottom: 4,
    },
    title: {
      color: theme.colors.text.secondary,
      fontWeight: '700',
      textAlign: 'center',
    },
    description: {
      color: theme.colors.text.tertiary,
      textAlign: 'center',
      lineHeight: 20,
    },
    button: {
      marginTop: 4,
    },
  });
}
