import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Card, Button } from '@ds/components';
import { InfoCircleIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';

type ChallengeEmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  testID?: string;
};

export function ChallengeEmptyState({
  title,
  description,
  actionLabel,
  onAction,
  testID,
}: ChallengeEmptyStateProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Card testID={testID} style={styles.card}>
      <View style={styles.iconWrap}>
        <InfoCircleIcon size={40} color={theme.colors.text.tertiary} variant="outline" />
      </View>
      <AppText variant="subtitle" style={styles.title}>
        {title}
      </AppText>
      {description ? (
        <AppText variant="body" style={styles.description}>
          {description}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <Button
          title={actionLabel}
          variant="primary"
          size="sm"
          onPress={onAction}
          style={styles.button}
          testID={`${testID}-action`}
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
      paddingVertical: 36,
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
      marginTop: 8,
      alignSelf: 'stretch',
    },
  });
}
