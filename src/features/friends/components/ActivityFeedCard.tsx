import React from 'react';
import { StyleSheet } from 'react-native';
import { AppText, Card } from '@ds/components';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import { formatActivityLabel } from '../utils';

export type ActivityFeedCardProps = {
  activity: unknown;
  testID?: string;
};

export function ActivityFeedCard({ activity, testID }: ActivityFeedCardProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Card style={styles.card} testID={testID}>
      <AppText variant="body" style={styles.text}>
        {formatActivityLabel(activity)}
      </AppText>
    </Card>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: {
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    text: {
      color: theme.colors.text.secondary,
      lineHeight: 20,
    },
  });
}
