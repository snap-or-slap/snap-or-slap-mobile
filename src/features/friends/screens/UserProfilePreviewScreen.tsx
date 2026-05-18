import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { Screen, AppText, Button } from '@ds/components';
import { ArrowCircleLeftIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import { Pressable } from 'react-native';
import { Avatar } from '@shared/components';
import {
  RelationshipBadge,
  LimitedInformationCard,
  SharedChallengePreviewCard,
  FriendEmptyState,
} from '../components';
import type { UserProfilePreview, RelationshipType } from '../types';
import { getUserProfile, sendFriendRequest } from '../services';
import { getAddFriendLabel, isAddFriendDisabled } from '../utils';

type UserProfilePreviewScreenProps = {
  userId: string;
  /** The known relationship from the caller; if not provided, profile API will supply it */
  initialRelationship?: RelationshipType;
  onBack?: () => void;
};

export function UserProfilePreviewScreen({
  userId,
  initialRelationship,
  onBack,
}: UserProfilePreviewScreenProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [profile, setProfile] = useState<UserProfilePreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    async function load() {
      try {
        const p = await getUserProfile(userId);
        setProfile(p);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }).start();
      }
    }
    load();
  }, [userId]);

  const handleAddFriend = async () => {
    if (!profile) return;
    try {
      await sendFriendRequest(profile.id);
      setRequestSent(true);
    } catch {
      // no-op
    }
  };

  // Determine effective relationship
  const relationship = requestSent
    ? ('pending_outgoing' as RelationshipType)
    : (profile?.relationship ?? initialRelationship ?? 'non_friend');

  const isSquadmate = relationship === 'squadmate';
  const isNonFriend =
    relationship === 'non_friend' ||
    relationship === 'pending_outgoing' ||
    relationship === 'pending_incoming';

  const screenTitle = isSquadmate ? 'Squadmate Preview' : 'Identity Preview';

  const addLabel = getAddFriendLabel(relationship);
  const addDisabled = isAddFriendDisabled(relationship);

  return (
    <Screen scrollable padding="md" testID="user-profile-preview-screen">
      {/* ── Header ────────────────────────────────────────────── */}
      <View style={styles.header}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            style={styles.backButton}
            accessibilityLabel="Go back"
            testID="preview-back"
          >
            <ArrowCircleLeftIcon size={28} color={theme.colors.icon.primary} variant="outline" />
          </Pressable>
        ) : null}
        <AppText variant="heading" style={styles.headerTitle}>
          {screenTitle}
        </AppText>
      </View>

      {loading ? (
        <AppText variant="body" style={styles.loadingText}>
          Loading…
        </AppText>
      ) : error || !profile ? (
        <FriendEmptyState
          title="Could not load profile"
          description="Please try again later."
          testID="preview-error"
        />
      ) : (
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* ── Identity ──────────────────────────────────────── */}
          <View style={styles.identity}>
            <Avatar
              name={profile.displayName}
              avatarUrl={profile.avatarUrl}
              size={80}
            />
            <RelationshipBadge relationship={relationship} testID="preview-relationship-badge" />
            <AppText variant="title" style={styles.displayName}>
              {profile.displayName}
            </AppText>
            <AppText variant="body" style={styles.username}>
              @{profile.username}
            </AppText>
          </View>

          {/* ── Non-Friend: warning card ───────────────────────── */}
          {isNonFriend ? (
            <LimitedInformationCard
              title="Be careful stranger!"
              message="This profile is found because of username matching. Please verify the details before adding."
              testID="preview-stranger-warning"
            />
          ) : null}

          {/* ── Squadmate: shared challenge card ──────────────── */}
          {isSquadmate && profile.sharedChallenge ? (
            <View style={styles.section}>
              <AppText variant="subtitle" style={styles.sectionTitle}>
                Shared Challenge
              </AppText>
              <SharedChallengePreviewCard
                challenge={profile.sharedChallenge}
                testID="preview-shared-challenge"
              />
            </View>
          ) : null}

          {/* ── Squadmate: limited info card ──────────────────── */}
          {isSquadmate ? (
            <LimitedInformationCard
              title="Limited information"
              message="Full profile details and activity feed are hidden until you're friends."
              testID="preview-limited-info"
            />
          ) : null}

          {/* ── CTA ───────────────────────────────────────────── */}
          {relationship !== 'self' ? (
            <Button
              title={addLabel}
              variant="primary"
              size="lg"
              fullWidth
              disabled={addDisabled}
              onPress={!addDisabled ? handleAddFriend : undefined}
              testID="preview-add-friend"
            />
          ) : null}
        </Animated.View>
      )}
    </Screen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 20,
    },
    backButton: {
      padding: 4,
    },
    headerTitle: {
      color: theme.colors.text.primary,
      fontWeight: '800',
    },
    loadingText: {
      color: theme.colors.text.tertiary,
      textAlign: 'center',
      paddingVertical: 48,
    },
    content: {
      gap: 20,
    },
    identity: {
      alignItems: 'center',
      gap: 8,
    },
    displayName: {
      color: theme.colors.text.primary,
      fontWeight: '800',
    },
    username: {
      color: theme.colors.text.secondary,
    },
    section: {
      gap: 10,
    },
    sectionTitle: {
      color: theme.colors.text.primary,
      fontWeight: '800',
    },
  });
}
