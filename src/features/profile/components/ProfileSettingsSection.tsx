import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Card } from '@ds/components';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import type { UserProfile } from '../types';
import { ProfileSettingRow } from './ProfileSettingRow';
import { ThemeModeSelector } from './ThemeModeSelector';

type ProfileSettingsSectionProps = {
  profile: UserProfile;
};

export function ProfileSettingsSection({ profile }: ProfileSettingsSectionProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Card variant="elevated" style={styles.card}>
      <AppText variant="subtitle" style={styles.title}>
        Settings
      </AppText>
      <View style={styles.group}>
        <ProfileSettingRow label="Theme mode" />
        <ThemeModeSelector />
      </View>
      <View style={styles.divider} />
      <View style={styles.group}>
        <AppText variant="label" style={styles.groupTitle}>
          Account information
        </AppText>
        <ProfileSettingRow label="Email" value={profile.email ?? 'Not provided'} />
        <ProfileSettingRow label="Username" value={`@${profile.username}`} />
        <ProfileSettingRow label="Display name" value={profile.displayName} />
        <ProfileSettingRow
          label="Privacy"
          value="Friend-only profile details"
          helperText="Full stats, badges, and activity stay hidden from non-friends."
        />
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
    group: {
      gap: theme.spacing[8],
    },
    groupTitle: {
      color: theme.colors.text.brand,
      fontWeight: '800',
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border.subtle,
    },
  });
}
