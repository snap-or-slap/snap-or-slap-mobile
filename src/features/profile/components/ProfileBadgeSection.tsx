import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Badge, Card } from '@ds/components';
import { LockIcon, MedalStarIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import type { UserProfile } from '../types';

type ProfileBadgeSectionProps = {
  profile: UserProfile;
};

const lockedBadges = ['Consistency', 'Squad MVP'];

export function ProfileBadgeSection({ profile }: ProfileBadgeSectionProps) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const earnedBadges = profile.badges ?? [];

  return (
    <Card variant="elevated" style={styles.card}>
      <View style={styles.header}>
        <AppText variant="subtitle" style={styles.title}>
          Badges and trophies
        </AppText>
        <Badge variant="neutral" size="sm">
          {earnedBadges.length} earned
        </Badge>
      </View>
      <View style={styles.grid}>
        {earnedBadges.map((badge) => (
          <View key={badge.id} style={styles.badgeTile}>
            <MedalStarIcon size={26} color={theme.colors.text.brand} variant="bold" />
            <AppText variant="caption" style={styles.badgeLabel}>
              {badge.label}
            </AppText>
          </View>
        ))}
        {lockedBadges.map((label) => (
          <View key={label} style={[styles.badgeTile, styles.lockedTile]}>
            <LockIcon size={24} color={theme.colors.text.tertiary} variant="outline" />
            <AppText variant="caption" style={styles.lockedLabel}>
              {label}
            </AppText>
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
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing[12],
    },
    title: {
      color: theme.colors.text.primary,
      fontWeight: '800',
      flex: 1,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing[8],
    },
    badgeTile: {
      width: '30%',
      minWidth: 94,
      flexGrow: 1,
      minHeight: 92,
      borderRadius: theme.radius.md,
      padding: theme.spacing[12],
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.bg['brand-subtle'],
      borderWidth: 1,
      borderColor: theme.colors.border.subtle,
      gap: theme.spacing[4],
    },
    lockedTile: {
      backgroundColor: theme.colors.bg['surface-subtle'],
    },
    badgeLabel: {
      color: theme.colors.text.primary,
      fontWeight: '700',
      textAlign: 'center',
    },
    lockedLabel: {
      color: theme.colors.text.tertiary,
      fontWeight: '700',
      textAlign: 'center',
    },
  });
}
