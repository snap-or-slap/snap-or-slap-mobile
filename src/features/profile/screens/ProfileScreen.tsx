import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Modal, StyleSheet, View } from 'react-native';
import { AppText, Button, Card, Screen } from '@ds/components';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import { AppHeader } from '@shared/components';
import { session, type FrontendUser } from '@services/api';
import {
  DangerZoneCard,
  DeleteAccountConfirmCard,
  ProfileBadgeSection,
  ProfileHeaderCard,
  ProfileSettingsSection,
  ProfileStatsGrid,
} from '../components';
import { profileService } from '../services';
import type { UserProfile } from '../types';
import { useLogoutMutation } from '@store/api/authApi';
import { useDeleteAccountMutation, useUpdateSettingsMutation } from '@store/api/userApi';

type ProfileScreenProps = {
  onSignedOut?: () => void;
};

type ProfileOverviewResponse = {
  user?: FrontendUser;
  stats?: Record<string, unknown>;
  badges?: unknown[];
  recentActivities?: unknown[];
};

type ProfileActivitiesResponse = {
  activities?: unknown[];
};

export function ProfileScreen({ onSignedOut }: ProfileScreenProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [logout, { isLoading: logoutLoading }] = useLogoutMutation();
  const [deleteAccountMut] = useDeleteAccountMutation();
  const [updateSettingsMut] = useUpdateSettingsMutation();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteComplete, setDeleteComplete] = useState(false);
  const [privacyLoading, setPrivacyLoading] = useState(false);
  const [logoutConfirmVisible, setLogoutConfirmVisible] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        const nextProfile = await loadProfileOverview();
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
      await deleteAccountMut().unwrap();
      setDeleteComplete(true);
      setConfirmDelete(false);
      onSignedOut?.();
    } catch {
      setDeleteError('Could not delete account. Please try again later.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeletePress = () => {
    Alert.alert(
      'Delete account?',
      'This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', style: 'destructive', onPress: () => setConfirmDelete(true) },
      ],
    );
  };

  const handlePrivacyChange = async (isPrivate: boolean) => {
    if (!profile) return;

    const previous = profile;
    setSettingsError(null);
    setPrivacyLoading(true);
    setProfile({ ...profile, isPrivate });

    try {
      const result = await updateSettingsMut(isPrivate).unwrap();
      await session.setCurrentUser(result.user);
      setProfile((current) => current ? mergeUserIntoProfile(current, result.user) : current);
    } catch {
      setProfile(previous);
      setSettingsError('Could not update privacy. Please try again.');
    } finally {
      setPrivacyLoading(false);
    }
  };

  const handleLogoutPress = () => {
    setLogoutConfirmVisible(true);
  };

  const handleConfirmLogout = async () => {
    try {
      const refreshToken = await session.getRefreshToken();
      await logout(refreshToken ?? undefined).unwrap();
    } catch {
      // Logout mutation already dispatches setGuest even on failure
    } finally {
      setLogoutConfirmVisible(false);
      onSignedOut?.();
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
          {profile.recentActivities?.length ? (
            <Card variant="elevated" style={styles.activitiesCard}>
              <AppText variant="subtitle" style={styles.sectionTitle}>
                Recent activity
              </AppText>
              {profile.recentActivities.slice(0, 3).map((activity, index) => (
                <AppText key={`${activity}-${index}`} variant="body" style={styles.activityText}>
                  {String(activity)}
                </AppText>
              ))}
            </Card>
          ) : null}
          <ProfileSettingsSection
            profile={profile}
            privacyLoading={privacyLoading}
            logoutLoading={logoutLoading}
            onPrivacyChange={handlePrivacyChange}
            onLogout={handleLogoutPress}
          />

          {settingsError ? (
            <AppText variant="caption" style={styles.errorText}>
              {settingsError}
            </AppText>
          ) : null}

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
            <DangerZoneCard onDeletePress={handleDeletePress} />
          )}

          <LogoutConfirmModal
            visible={logoutConfirmVisible}
            loading={logoutLoading}
            onCancel={() => setLogoutConfirmVisible(false)}
            onConfirm={handleConfirmLogout}
          />
        </>
      )}
    </Screen>
  );
}

function LogoutConfirmModal({
  visible,
  loading,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <View style={styles.modalOverlay}>
        <Card variant="elevated" style={styles.logoutModal} testID="logout-confirm-modal">
          <AppText variant="title" style={styles.logoutTitle}>
            Log out?
          </AppText>
          <AppText variant="body" style={styles.logoutMessage}>
            You will need to sign in again to continue using SnapOrSlap.
          </AppText>
          <View style={styles.logoutActions}>
            <Button
              title="Cancel"
              variant="secondary"
              onPress={onCancel}
              disabled={loading}
              style={styles.logoutButton}
              testID="logout-cancel-button"
            />
            <Button
              title="Log out"
              variant="danger"
              onPress={onConfirm}
              loading={loading}
              style={styles.logoutButton}
              testID="logout-confirm-button"
            />
          </View>
        </Card>
      </View>
    </Modal>
  );
}

async function loadProfileOverview(): Promise<UserProfile> {
  const overview = await profileService.getProfileOverview<ProfileOverviewResponse>();
  const activitiesResponse = await profileService
    .getActivities<ProfileActivitiesResponse>({ limit: 3 })
    .catch(() => undefined);
  const user = overview.user ?? await session.getCurrentUser();
  const stats = overview.stats ?? {};
  const badges = Array.isArray(overview.badges) ? overview.badges : [];
  const recentActivities = Array.isArray(activitiesResponse?.activities)
    ? activitiesResponse.activities
    : Array.isArray(overview.recentActivities)
      ? overview.recentActivities
      : [];

  return {
    id: user?.id ?? '',
    username: user?.username ?? '',
    displayName: user?.displayName ?? user?.username ?? 'SnapOrSlap User',
    email: user?.email ?? undefined,
    avatarUrl: user?.avatarUrl ?? undefined,
    bio: user?.bio ?? undefined,
    isPrivate: user?.isPrivate ?? false,
    currentStreak: toNumber(stats.currentStreak),
    challengesJoined: toNumber(stats.challengesJoined ?? stats.challengesCompleted),
    completionRate: toNumber(stats.completionRate),
    friendsCount: toNumber(stats.friendsCount),
    badgesCount: toNumber(stats.badgesCount ?? badges.length),
    badges: badges.map(mapBadge),
    recentActivities: recentActivities.map(formatActivity),
  };
}

function mergeUserIntoProfile(profile: UserProfile, user: FrontendUser): UserProfile {
  return {
    ...profile,
    username: user.username ?? profile.username,
    displayName: user.displayName ?? profile.displayName,
    email: user.email ?? profile.email,
    avatarUrl: user.avatarUrl ?? profile.avatarUrl,
    bio: user.bio ?? profile.bio,
    isPrivate: user.isPrivate ?? profile.isPrivate,
  };
}

function toNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function mapBadge(raw: unknown): { id: string; label: string } {
  if (!raw || typeof raw !== 'object') {
    return { id: String(raw), label: String(raw) };
  }

  const badge = raw as Record<string, unknown>;
  const id = String(badge.id ?? badge.badgeId ?? badge.label ?? badge.name ?? 'badge');
  const label = String(badge.label ?? badge.name ?? badge.title ?? id);
  return { id, label };
}

function formatActivity(raw: unknown): string {
  if (typeof raw === 'string') return raw;
  if (!raw || typeof raw !== 'object') return 'Activity updated';

  const activity = raw as Record<string, unknown>;
  if (typeof activity.label === 'string' && activity.label.trim()) return activity.label;
  if (typeof activity.title === 'string' && activity.title.trim()) return activity.title;
  if (typeof activity.description === 'string' && activity.description.trim()) return activity.description;

  switch (activity.type) {
    case 'friend_added':
      return 'Added a new friend';
    case 'challenge_joined':
      return 'Joined a challenge';
    case 'challenge_completed':
      return 'Completed a challenge';
    case 'checkin_done':
      return 'Completed a check-in';
    case 'badge_earned':
      return 'Earned a badge';
    case 'streak_milestone':
      return 'Reached a streak milestone';
    default:
      return 'Activity updated';
  }
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
    activitiesCard: {
      gap: theme.spacing[8],
    },
    sectionTitle: {
      color: theme.colors.text.primary,
      fontWeight: '800',
    },
    activityText: {
      color: theme.colors.text.secondary,
      lineHeight: 22,
    },
    modalOverlay: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing[24],
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
    },
    logoutModal: {
      width: '100%',
      maxWidth: 360,
      gap: theme.spacing[16],
    },
    logoutTitle: {
      color: theme.colors.text.primary,
      fontWeight: '900',
    },
    logoutMessage: {
      color: theme.colors.text.secondary,
      lineHeight: 22,
    },
    logoutActions: {
      flexDirection: 'row',
      gap: theme.spacing[8],
    },
    logoutButton: {
      flex: 1,
    },
  });
}
