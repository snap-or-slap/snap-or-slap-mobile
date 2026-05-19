import React from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { AppText, Button, Card } from '@ds/components';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import type { UserProfile } from '../types';
import { ProfileSettingRow } from './ProfileSettingRow';
import { ThemeModeSelector } from './ThemeModeSelector';

type ProfileSettingsSectionProps = {
  profile: UserProfile;
  privacyLoading?: boolean;
  logoutLoading?: boolean;
  onPrivacyChange?: (isPrivate: boolean) => void;
  onLogout?: () => void;
};

export function ProfileSettingsSection({
  profile,
  privacyLoading = false,
  logoutLoading = false,
  onPrivacyChange,
  onLogout,
}: ProfileSettingsSectionProps) {
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
        <View style={styles.privacyRow}>
          <View style={styles.privacyText}>
            <ProfileSettingRow
              label="Privacy"
              value={profile.isPrivate ? 'Private profile' : 'Public profile'}
              helperText="Private profiles hide full stats, badges, and activity from non-friends."
            />
          </View>
          <Switch
            value={profile.isPrivate ?? false}
            disabled={privacyLoading}
            onValueChange={onPrivacyChange}
            testID="profile-privacy-switch"
          />
        </View>
        <Button
          title="Log out"
          variant="secondary"
          fullWidth
          loading={logoutLoading}
          disabled={logoutLoading}
          onPress={onLogout}
          testID="profile-logout-button"
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
    privacyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[12],
    },
    privacyText: {
      flex: 1,
    },
  });
}
