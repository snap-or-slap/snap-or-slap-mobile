import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Card } from '@ds/components';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import type { UserProfile } from '../types';
import { ProfileStatCard } from './ProfileStatCard';

type ProfileStatsGridProps = {
  profile: UserProfile;
};

export function ProfileStatsGrid({ profile }: ProfileStatsGridProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const stats = [
    { label: 'Current streak', value: profile.currentStreak ?? 0 },
    { label: 'Challenges', value: profile.challengesJoined ?? 0 },
    { label: 'Completion', value: `${profile.completionRate ?? 0}%` },
    { label: 'Badges', value: profile.badgesCount ?? profile.badges?.length ?? 0 },
  ];

  return (
    <Card variant="elevated" style={styles.card}>
      <AppText variant="subtitle" style={styles.title}>
        Stats
      </AppText>
      <View style={styles.grid}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.item}>
            <ProfileStatCard label={stat.label} value={stat.value} />
          </View>
        ))}
      </View>
    </Card>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: {
      gap: theme.spacing[16],
    },
    title: {
      color: theme.colors.text.primary,
      fontWeight: '800',
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing[8],
    },
    item: {
      width: '48%',
      flexGrow: 1,
    },
  });
}
