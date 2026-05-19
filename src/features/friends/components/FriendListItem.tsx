import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Card } from '@ds/components';
import { FireIcon, CupIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import { Avatar } from '@shared/components';
import type { FriendUser } from '../types';
import { formatStreak, formatActiveChallenges } from '../utils';

export type FriendListItemProps = {
  friend: FriendUser;
  onPress?: () => void;
  testID?: string;
};

export function FriendListItem({ friend, onPress, testID }: FriendListItemProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const streakLabel = formatStreak(friend.currentStreak);
  const challengeLabel = formatActiveChallenges(friend.activeChallengesCount);

  return (
    <Card
      variant="default"
      pressable={!!onPress}
      onPress={onPress}
      accessibilityLabel={`View ${friend.displayName}'s profile`}
      testID={testID}
      style={styles.row}
    >
      <Avatar name={friend.displayName} avatarUrl={friend.avatarUrl} size={48} />
      <View style={styles.info}>
        <AppText variant="subtitle" style={styles.name}>
          {friend.displayName}
        </AppText>
        <AppText variant="caption" style={styles.username}>
          @{friend.username}
        </AppText>
      </View>
      <View style={styles.meta}>
        {friend.currentStreak ? (
          <View style={styles.metaRow}>
            <FireIcon size={14} color={theme.colors.text.brand} variant="bulk" />
            <AppText variant="caption" style={styles.metaText}>
              {streakLabel}
            </AppText>
          </View>
        ) : null}
        {friend.activeChallengesCount !== undefined && friend.activeChallengesCount > 0 ? (
          <View style={styles.metaRow}>
            <CupIcon size={14} color={theme.colors.text.secondary} variant="outline" />
            <AppText variant="caption" style={styles.metaSecondary}>
              {challengeLabel}
            </AppText>
          </View>
        ) : null}
      </View>
    </Card>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
      backgroundColor: theme.colors.bg['surface-elevated'],
    },
    info: {
      flex: 1,
      gap: 2,
    },
    name: {
      color: theme.colors.text.brand,
      fontWeight: '700',
    },
    username: {
      color: theme.colors.text.secondary,
    },
    meta: {
      alignItems: 'flex-end',
      gap: 4,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    metaText: {
      color: theme.colors.text.brand,
      fontWeight: '700',
    },
    metaSecondary: {
      color: theme.colors.text.secondary,
    },
  });
}
