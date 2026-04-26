
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Screen, AppText, Card, Badge } from '@ds/components';
import { useTheme } from '@ds/theme';
import { ProfileCircleIcon } from '@ds/icons';

export function ProfileScreen() {
  const theme = useTheme();

  return (
    <Screen testID="profile-screen"  >
      <AppText variant="headlineLarge" style={{ color: theme.colors.text.primary, marginBottom: 8 }}>
        Profile
      </AppText>
      <AppText variant="bodyMedium" style={{ color: theme.colors.text.secondary, marginBottom: 24 }}>
        Track your streaks, trophies, and challenge history.
      </AppText>
      
      <View style={styles.profileHeader}>
        <ProfileCircleIcon variant="bold" color={theme.colors.text.primary} size={64} />
        <View style={styles.profileInfo}>
          <AppText variant="titleLarge" style={{ color: theme.colors.text.primary }}>SnapOrSlap User</AppText>
          <Badge tone="neutral">Newcomer</Badge>
        </View>
      </View>

      <Card style={styles.card}>
        <AppText variant="titleMedium" style={{ color: theme.colors.text.primary }}>Stats</AppText>
        <AppText variant="bodyMedium" style={{ color: theme.colors.text.secondary }}>Current streak: 12</AppText>
        <AppText variant="bodyMedium" style={{ color: theme.colors.text.secondary }}>Completed: 8</AppText>
        <AppText variant="bodyMedium" style={{ color: theme.colors.text.secondary }}>Badges: 3</AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileInfo: {
    marginLeft: 16,
    alignItems: 'flex-start',
  },
  card: {
    padding: 16,
    marginBottom: 16,
  },
});
