import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Card, Badge } from '@ds/components';
import { CupIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';

type SharedChallenge = {
  id: string;
  title: string;
  status: 'ACTIVE' | 'FORMATION' | 'FINISHED' | 'GAME_OVER' | 'CANCELLED';
  progressLabel?: string;
  coSquadmatesCount?: number;
};

export type SharedChallengePreviewCardProps = {
  challenge: SharedChallenge;
  testID?: string;
};

function getStatusVariant(status: SharedChallenge['status']): 'success' | 'info' | 'neutral' | 'warning' | 'danger' {
  switch (status) {
    case 'ACTIVE': return 'success';
    case 'FORMATION': return 'info';
    case 'FINISHED': return 'neutral';
    case 'GAME_OVER': return 'danger';
    case 'CANCELLED': return 'warning';
    default: return 'neutral';
  }
}

export function SharedChallengePreviewCard({ challenge, testID }: SharedChallengePreviewCardProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Card style={styles.card} testID={testID}>
      <View style={styles.titleRow}>
        <CupIcon size={20} color={theme.colors.text.brand} variant="outline" />
        <AppText variant="subtitle" style={styles.title} numberOfLines={2}>
          {challenge.title}
        </AppText>
        <Badge variant={getStatusVariant(challenge.status)} size="sm">
          {challenge.status}
        </Badge>
      </View>
      {challenge.progressLabel ? (
        <AppText variant="caption" style={styles.progress}>
          {challenge.progressLabel}
        </AppText>
      ) : null}
      {challenge.coSquadmatesCount !== undefined ? (
        <AppText variant="caption" style={styles.squadmates}>
          {challenge.coSquadmatesCount} other squadmates
        </AppText>
      ) : null}
    </Card>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: {
      gap: 8,
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    title: {
      flex: 1,
      color: theme.colors.text.primary,
      fontWeight: '700',
    },
    progress: {
      color: theme.colors.text.secondary,
    },
    squadmates: {
      color: theme.colors.text.tertiary,
    },
  });
}
