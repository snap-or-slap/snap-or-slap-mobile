import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Badge, Card } from '@ds/components';
import { ClockIcon, HeartIcon, UserAddIcon, InfoCircleIcon, CameraIcon, LockIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import type { CreateChallengeFormValues } from '../types/createChallenge.types';
import type { FriendOption } from '../data/challenges.mock';

type CreateChallengeReviewCardProps = {
  values: CreateChallengeFormValues;
  friends: FriendOption[];
  testID?: string;
};

type ReviewRowProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  theme: AppTheme;
};

function ReviewRow({ icon, label, value, theme }: ReviewRowProps) {
  const styles = createStyles(theme);
  return (
    <View style={styles.reviewRow}>
      <View style={styles.reviewIcon}>{icon}</View>
      <View style={styles.reviewText}>
        <AppText variant="caption" style={styles.reviewLabel}>
          {label}
        </AppText>
        <AppText variant="body" style={styles.reviewValue}>
          {value}
        </AppText>
      </View>
    </View>
  );
}

function formatDateTime(date: Date | null): string {
  if (!date) return 'Starts when the host launches it';
  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function CreateChallengeReviewCard({
  values,
  friends,
  testID,
}: CreateChallengeReviewCardProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const invitedFriends = friends.filter((f) =>
    values.invitedFriendIds.includes(f.id)
  );

  return (
    <Card testID={testID} style={styles.card}>
      {/* Title preview */}
      <AppText variant="heading" style={styles.challengeTitle}>
        {values.title || '(Untitled)'}
      </AppText>

      {values.description ? (
        <AppText variant="body" style={styles.description}>
          {values.description}
        </AppText>
      ) : null}

      <View style={styles.divider} />

      <ReviewRow
        icon={<ClockIcon size={18} color={theme.colors.text.secondary} variant="outline" />}
        label="Start"
        value={formatDateTime(values.startAt)}
        theme={theme}
      />
      <ReviewRow
        icon={<ClockIcon size={18} color={theme.colors.text.secondary} variant="outline" />}
        label="Reset time"
        value={values.resetTime || '—'}
        theme={theme}
      />
      <ReviewRow
        icon={<InfoCircleIcon size={18} color={theme.colors.text.secondary} variant="outline" />}
        label="Duration"
        value={`${values.durationDays} day${values.durationDays !== 1 ? 's' : ''}`}
        theme={theme}
      />
      <ReviewRow
        icon={<InfoCircleIcon size={18} color={theme.colors.text.secondary} variant="outline" />}
        label="Frequency"
        value={values.frequency === 'daily' ? 'Daily' : `${values.frequencyDays.length} custom days`}
        theme={theme}
      />
      <ReviewRow
        icon={<HeartIcon size={18} color={theme.colors.text.secondary} variant="outline" />}
        label="Hearts"
        value={`${values.totalHearts} total`}
        theme={theme}
      />
      <ReviewRow
        icon={<UserAddIcon size={18} color={theme.colors.text.secondary} variant="outline" />}
        label="Max members"
        value={`${values.maxMembers}`}
        theme={theme}
      />
      <ReviewRow
        icon={<LockIcon size={18} color={theme.colors.text.secondary} variant="outline" />}
        label="Privacy"
        value={values.isPrivate ? 'Private' : 'Public'}
        theme={theme}
      />
      {values.coverUrl?.trim() ? (
        <ReviewRow
          icon={<CameraIcon size={18} color={theme.colors.text.secondary} variant="outline" />}
          label="Cover"
          value={values.coverUrl.trim()}
          theme={theme}
        />
      ) : null}

      {invitedFriends.length > 0 ? (
        <>
          <View style={styles.divider} />
          <AppText variant="caption" style={styles.sectionLabel}>
            Invited friends
          </AppText>
          <View style={styles.friendChips}>
            {invitedFriends.map((f) => (
              <Badge key={f.id} variant="brand" size="sm">
                @{f.username}
              </Badge>
            ))}
          </View>
        </>
      ) : null}
    </Card>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: {
      gap: 12,
      padding: 16,
    },
    challengeTitle: {
      color: theme.colors.text.primary,
      fontWeight: '800',
    },
    description: {
      color: theme.colors.text.secondary,
      lineHeight: 20,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border.subtle,
      marginVertical: 4,
    },
    reviewRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },
    reviewIcon: {
      width: 22,
      alignItems: 'center',
      paddingTop: 2,
    },
    reviewText: {
      flex: 1,
      gap: 2,
    },
    reviewLabel: {
      color: theme.colors.text.tertiary,
      fontWeight: '600',
    },
    reviewValue: {
      color: theme.colors.text.primary,
      fontWeight: '600',
    },
    sectionLabel: {
      color: theme.colors.text.tertiary,
      fontWeight: '600',
    },
    friendChips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
  });
}
