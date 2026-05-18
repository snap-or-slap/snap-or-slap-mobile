
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Screen, AppText, Card, Badge } from '@ds/components';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import { Avatar } from '@shared/components';

const stats = [
  { label: 'Streak', value: '12' },
  { label: 'Completed', value: '8' },
  { label: 'Friends', value: '24' },
];

const badges = ['Newcomer', 'Early riser', 'Team player'];

export function ProfileScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Screen
      scrollable
      padding="md"
      testID="profile-screen"
      contentStyle={styles.content}
    >
      <View style={styles.header}>
        <AppText variant="heading" style={styles.title}>
          Profile
        </AppText>
        <AppText variant="body" style={styles.subtitle}>
          Track your streaks, trophies, and challenge history.
        </AppText>
      </View>

      <View style={styles.profileHeader}>
        <Avatar name="SnapOrSlap User" size={96} />
        <View style={styles.profileInfo}>
          <AppText variant="heading" style={styles.displayName}>
            SnapOrSlap User
          </AppText>
          <AppText variant="body" style={styles.username}>
            @snapstarter
          </AppText>
          <Badge variant="neutral">Newcomer</Badge>
        </View>
      </View>

      <Card style={styles.card}>
        <AppText variant="subtitle" style={styles.sectionTitle}>
          Stats
        </AppText>
        <View style={styles.statsGrid}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <AppText variant="heading" style={styles.statValue}>
                {stat.value}
              </AppText>
              <AppText variant="caption" style={styles.statLabel}>
                {stat.label}
              </AppText>
            </View>
          ))}
        </View>
      </Card>

      <Card style={styles.card}>
        <AppText variant="subtitle" style={styles.sectionTitle}>
          Badges and trophies
        </AppText>
        <View style={styles.badgeGrid}>
          {badges.map((badge) => (
            <View key={badge} style={styles.trophyCard}>
              <AppText variant="subtitle" style={styles.trophyIcon}>
                *
              </AppText>
              <AppText variant="caption" style={styles.trophyLabel}>
                {badge}
              </AppText>
            </View>
          ))}
        </View>
        <AppText variant="caption" style={styles.helper}>
          Trophy rules and earned-state sync are reserved for backend integration.
        </AppText>
      </Card>
    </Screen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    content: {
      gap: 16,
      paddingBottom: 120,
    },
    header: {
      gap: 8,
    },
    title: {
      color: theme.colors.text.primary,
      fontWeight: '800',
    },
    subtitle: {
      color: theme.colors.text.secondary,
    },
    profileHeader: {
      alignItems: 'center',
      gap: 14,
      paddingVertical: 10,
    },
    profileInfo: {
      alignItems: 'center',
      gap: 6,
    },
    displayName: {
      color: theme.colors.text.primary,
      fontWeight: '800',
      textAlign: 'center',
    },
    username: {
      color: theme.colors.text.secondary,
      textAlign: 'center',
    },
    card: {
      padding: 16,
      gap: 14,
    },
    sectionTitle: {
      color: theme.colors.text.primary,
      fontWeight: '800',
    },
    statsGrid: {
      flexDirection: 'row',
      gap: 10,
    },
    statCard: {
      flex: 1,
      minHeight: 88,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.bg['brand-subtle'],
      gap: 4,
    },
    statValue: {
      color: theme.colors.text.brand,
      fontWeight: '800',
    },
    statLabel: {
      color: theme.colors.text.secondary,
      fontWeight: '700',
    },
    badgeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    trophyCard: {
      width: '30%',
      minWidth: 96,
      borderRadius: 18,
      padding: 12,
      alignItems: 'center',
      backgroundColor: theme.colors.bg.surface,
      borderWidth: 1,
      borderColor: theme.colors.border.subtle,
      gap: 6,
    },
    trophyIcon: {
      color: theme.colors.text.brand,
      fontWeight: '800',
      fontSize: 26,
      lineHeight: 30,
    },
    trophyLabel: {
      color: theme.colors.text.primary,
      textAlign: 'center',
      fontWeight: '700',
    },
    helper: {
      color: theme.colors.text.secondary,
      lineHeight: 18,
    },
  });
}
