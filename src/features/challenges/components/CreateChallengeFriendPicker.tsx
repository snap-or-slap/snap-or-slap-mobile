import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, Badge } from '@ds/components';
import { TickCircleIcon, SearchNormalIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import type { FriendOption } from '../data/challenges.mock';

type CreateChallengeFriendPickerProps = {
  friends: FriendOption[];
  selectedIds: string[];
  onToggle: (friendId: string) => void;
  testID?: string;
};

export function CreateChallengeFriendPicker({
  friends,
  selectedIds,
  onToggle,
  testID,
}: CreateChallengeFriendPickerProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  if (friends.length === 0) {
    return (
      <View testID={testID} style={styles.emptyState}>
        <SearchNormalIcon size={32} color={theme.colors.text.tertiary} variant="outline" />
        <AppText variant="body" style={styles.emptyText}>
          No friends to invite yet.
        </AppText>
        <AppText variant="caption" style={styles.emptyHint}>
          Add friends to invite them to a challenge.
        </AppText>
      </View>
    );
  }

  return (
    <View testID={testID} style={styles.root}>
      {friends.map((friend) => {
        const isSelected = selectedIds.includes(friend.id);
        return (
          <Pressable
            key={friend.id}
            onPress={() => onToggle(friend.id)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isSelected }}
            style={styles.row}
            testID={`friend-row-${friend.id}`}
          >
            <View style={styles.avatar}>
              <AppText variant="body" style={styles.avatarText}>
                {friend.name[0].toUpperCase()}
              </AppText>
            </View>
            <View style={styles.info}>
              <AppText variant="subtitle" style={styles.name}>
                {friend.name}
              </AppText>
              <AppText variant="caption" style={styles.username}>
                @{friend.username}
              </AppText>
            </View>
            <View
              style={[
                styles.checkCircle,
                isSelected && styles.checkCircleSelected,
              ]}
            >
              {isSelected ? (
                <TickCircleIcon size={22} color={theme.colors.text['on-brand']} variant="bold" />
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    root: {
      gap: 2,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 10,
      paddingHorizontal: 4,
      borderRadius: 12,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 999,
      backgroundColor: theme.colors.bg['surface-inverse'],
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    avatarText: {
      color: theme.colors.text.inverse,
      fontSize: 17,
      fontWeight: '800',
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
    checkCircle: {
      width: 28,
      height: 28,
      borderRadius: 999,
      borderWidth: 2,
      borderColor: theme.colors.border.subtle,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkCircleSelected: {
      backgroundColor: theme.colors.bg.brand,
      borderColor: theme.colors.bg.brand,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 32,
      gap: 8,
    },
    emptyText: {
      color: theme.colors.text.secondary,
      fontWeight: '600',
    },
    emptyHint: {
      color: theme.colors.text.tertiary,
      textAlign: 'center',
    },
  });
}
