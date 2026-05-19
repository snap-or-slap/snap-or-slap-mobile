import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Screen } from '@ds/components';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import { AppHeader } from '@shared/components';
import {
  DangerZoneCard,
  DeleteAccountConfirmCard,
  ProfileBadgeSection,
  ProfileHeaderCard,
  ProfileSettingsSection,
  ProfileStatsGrid,
} from '../components';
import { deleteAccount, getMyProfile } from '../services';
import type { UserProfile } from '../types';

export function ProfileScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteComplete, setDeleteComplete] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        const nextProfile = await getMyProfile();
        if (mounted) setProfile(nextProfile);
      } catch {
        if (mounted) setError('Could not load your profile. Please try again later.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      mounted = false;
    };
  }, []);

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await deleteAccount();
      setDeleteComplete(true);
      setConfirmDelete(false);
    } catch {
      setDeleteError('Could not delete account. Please try again later.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Screen
      scrollable
      padding="md"
      testID="profile-screen"
      contentStyle={styles.content}
    >
      <AppHeader
        title="Profile"
        subtitle="Your streaks, settings, and account controls"
        testID="profile-header"
      />

      {loading ? (
        <AppText variant="body" style={styles.stateText}>
          Loading profile...
        </AppText>
      ) : error || !profile ? (
        <AppText variant="body" style={styles.errorText}>
          {error ?? 'Profile unavailable.'}
        </AppText>
      ) : (
        <>
          <ProfileHeaderCard profile={profile} />
          <ProfileStatsGrid profile={profile} />
          <ProfileBadgeSection profile={profile} />
          <ProfileSettingsSection profile={profile} />

          {deleteComplete ? (
            <View style={styles.successCard}>
              <AppText variant="subtitle" style={styles.successTitle}>
                Account deletion requested
              </AppText>
              <AppText variant="body" style={styles.successBody}>
                Backend deletion is currently a safe placeholder. Session clearing will be wired when auth persistence is available.
              </AppText>
            </View>
          ) : null}

          {confirmDelete ? (
            <DeleteAccountConfirmCard
              loading={deleteLoading}
              error={deleteError}
              onCancel={() => {
                setConfirmDelete(false);
                setDeleteError(null);
              }}
              onConfirm={handleConfirmDelete}
            />
          ) : (
            <DangerZoneCard onDeletePress={() => setConfirmDelete(true)} />
          )}
        </>
      )}
    </Screen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    content: {
      gap: theme.spacing[16],
      paddingBottom: 112,
    },
    stateText: {
      color: theme.colors.text.tertiary,
      textAlign: 'center',
      paddingVertical: theme.spacing[48],
    },
    errorText: {
      color: theme.colors.text.error,
      textAlign: 'center',
      paddingVertical: theme.spacing[48],
    },
    successCard: {
      borderRadius: theme.radius.md,
      padding: theme.spacing[16],
      backgroundColor: theme.colors.bg.success,
      gap: theme.spacing[8],
    },
    successTitle: {
      color: theme.colors.text['on-success'],
      fontWeight: '800',
    },
    successBody: {
      color: theme.colors.text['on-success'],
      lineHeight: 20,
    },
  });
}
