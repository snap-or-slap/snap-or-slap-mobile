import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Card, Button } from '@ds/components';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import { Avatar } from '@shared/components';
import { Pressable } from 'react-native';
import type { FriendUser } from '../types';
import { formatMutualCount, getAddFriendLabel, isAddFriendDisabled } from '../utils';

export type FriendSearchResultCardProps = {
  user: FriendUser;
  onPress?: () => void;
  onAddFriend?: () => void;
  disabled?: boolean;
  testID?: string;
};

export function FriendSearchResultCard({
  user,
  onPress,
  onAddFriend,
  disabled = false,
  testID,
}: FriendSearchResultCardProps) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const mutual = formatMutualCount(user.mutualCount);
  const addLabel = getAddFriendLabel(user.relationship);
  const addDisabled = disabled || isAddFriendDisabled(user.relationship);

  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={`View ${user.displayName}`}
      testID={testID}
    >
      <Card style={styles.card}>
        <Avatar
          name={user.displayName}
          avatarUrl={user.avatarUrl}
          size={48}
        />
        <View style={styles.info}>
          <AppText variant="subtitle" style={styles.name}>
            {user.displayName}
          </AppText>
          <AppText variant="caption" style={styles.username}>
            @{user.username}
            {mutual ? `  ·  ${mutual}` : ''}
          </AppText>
        </View>
        <Button
          title={addLabel}
          variant={user.relationship === 'friend' ? 'secondary' : 'primary'}
          size="sm"
          disabled={addDisabled}
          onPress={!addDisabled ? onAddFriend : undefined}
          testID={testID ? `${testID}-add` : undefined}
        />
      </Card>
    </Pressable>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 14,
      paddingHorizontal: 16,
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
  });
}
