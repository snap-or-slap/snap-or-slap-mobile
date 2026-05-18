import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@ds/components';
import { HomeTrendUpIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';

type ChallengeProgressSummaryProps = {
  currentStepLabel?: string;
  progressLabel?: string;
  testID?: string;
};

export function ChallengeProgressSummary({
  currentStepLabel,
  progressLabel,
  testID,
}: ChallengeProgressSummaryProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  if (!currentStepLabel && !progressLabel) return null;

  return (
    <View testID={testID} style={styles.root}>
      <HomeTrendUpIcon size={16} color={theme.colors.text.secondary} variant="outline" />
      <View style={styles.text}>
        {currentStepLabel ? (
          <AppText variant="body" style={styles.step}>
            {currentStepLabel}
          </AppText>
        ) : null}
        {progressLabel ? (
          <AppText variant="caption" style={styles.progress}>
            {progressLabel}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    root: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
    },
    text: {
      flex: 1,
      gap: 2,
    },
    step: {
      color: theme.colors.text.secondary,
      fontSize: 14,
      fontWeight: '600',
    },
    progress: {
      color: theme.colors.text.tertiary,
      fontSize: 13,
    },
  });
}
