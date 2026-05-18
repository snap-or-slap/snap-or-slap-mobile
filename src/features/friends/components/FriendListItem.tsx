import React from 'react';
import { StyleSheet, View, Pressable, Animated } from 'react-native';
import { AppText, Card } from '@ds/components';
import { FireIcon, CupIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import { Avatar } from '@shared/components';
import { motion } from '@ds/utils';
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
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: motion.scale.cardPressed,
      duration: motion.duration.fast,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: motion.duration.normal,
      useNativeDriver: true,
    }).start();
  };

  const streakLabel = formatStreak(friend.currentStreak);
  const challengeLabel = formatActiveChallenges(friend.activeChallengesCount);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={onPress ? handlePressIn : undefined}
        onPressOut={onPress ? handlePressOut : undefined}
        style={styles.row}
        accessibilityRole="button"
        accessibilityLabel={`View ${friend.displayName}'s profile`}
        testID={testID}
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
                {friend.activeChallengesCount}
              </AppText>
            </View>
          ) : null}
        </View>
      </Pressable>
    </Animated.View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.bg['surface-elevated'],
      borderRadius: theme.radius.lg,
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
    },
    info: {
      flex: 1,
      gap: 2,
    },
    name: {
      color: theme.colors.text.primary,
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
