import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ScrollView, Animated } from 'react-native';
import { Screen, AppText, Button } from '@ds/components';
import { ArrowCircleLeftIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import { motion } from '@ds/utils';
import { Pressable } from 'react-native';
import {
  RelationshipBadge,
  ProfileStatCard,
  BadgeTile,
  ActivityFeedCard,
  FriendEmptyState,
} from '../components';
import { Avatar } from '@shared/components';
import type { UserProfilePreview } from '../types';
import { getUserProfile } from '../services';
import { formatStreak, formatCompletionRate } from '../utils';

type FriendProfileScreenProps = {
  userId: string;
  onBack?: () => void;
};

export function FriendProfileScreen({ userId, onBack }: FriendProfileScreenProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [profile, setProfile] = useState<UserProfilePreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    async function loadProfile() {
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
    loadProfile();
  }, [userId]);

  return (
    <Screen scrollable padding="md" testID="friend-profile-screen">
      {/* ── Header ────────────────────────────────────────────── */}
      <View style={styles.header}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            style={styles.backButton}
            accessibilityLabel="Go back"
            testID="friend-profile-back"
          >
            <ArrowCircleLeftIcon size={28} color={theme.colors.icon.primary} variant="outline" />
          </Pressable>
        ) : null}
        <AppText variant="heading" style={styles.headerTitle}>
          Friend Profile
        </AppText>
      </View>

      {loading ? (
        <AppText variant="body" style={styles.loading}>
          Loading profile…
        </AppText>
      ) : error || !profile ? (
        <FriendEmptyState
          title="Could not load profile"
          description="Please try again later."
          testID="friend-profile-error"
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
            <RelationshipBadge relationship={profile.relationship} testID="friend-profile-badge" />
            <AppText variant="title" style={styles.displayName}>
              {profile.displayName}
            </AppText>
            <AppText variant="body" style={styles.username}>
              @{profile.username}
            </AppText>
          </View>

          {/* ── Stats ─────────────────────────────────────────── */}
          <View style={styles.statsSection}>
            <AppText variant="subtitle" style={styles.sectionTitle}>
              Stats
            </AppText>
            <View style={styles.statsRow}>
              <ProfileStatCard
                label="Current Streak"
                value={formatStreak(profile.currentStreak)}
                testID="stat-streak"
              />
              <ProfileStatCard
                label="Challenges"
                value={profile.challengesJoined ?? '—'}
                testID="stat-challenges"
              />
              <ProfileStatCard
                label="Completion"
                value={formatCompletionRate(profile.completionRate)}
                testID="stat-completion"
              />
            </View>
          </View>

          {/* ── Badges ────────────────────────────────────────── */}
          {profile.badges && profile.badges.length > 0 ? (
            <View style={styles.section}>
              <AppText variant="subtitle" style={styles.sectionTitle}>
                Badges
              </AppText>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.badgesScroll}
              >
                {profile.badges.map((badge) => (
                  <BadgeTile key={badge.id} label={badge.label} testID={`badge-${badge.id}`} />
                ))}
              </ScrollView>
            </View>
          ) : null}

          {/* ── Latest Activities ─────────────────────────────── */}
          {profile.latestActivities && profile.latestActivities.length > 0 ? (
            <View style={styles.section}>
              <AppText variant="subtitle" style={styles.sectionTitle}>
                Latest Activities
              </AppText>
              <View style={styles.activityList}>
                {profile.latestActivities.map((activity, idx) => (
                  <ActivityFeedCard
                    key={`activity-${idx}`}
                    activity={activity}
                    testID={`activity-${idx}`}
                  />
                ))}
              </View>
            </View>
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
    loading: {
      color: theme.colors.text.tertiary,
      textAlign: 'center',
      paddingVertical: 48,
    },
    content: {
      gap: 24,
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
    statsSection: {
      gap: 12,
    },
    statsRow: {
      flexDirection: 'row',
      gap: 8,
    },
    section: {
      gap: 12,
    },
    sectionTitle: {
      color: theme.colors.text.primary,
      fontWeight: '800',
    },
    badgesScroll: {
      gap: 8,
    },
    activityList: {
      gap: 8,
    },
  });
}
