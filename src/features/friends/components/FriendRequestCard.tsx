import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Card, Button } from '@ds/components';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import { Avatar } from '@shared/components';
import { Pressable } from 'react-native';
import type { FriendRequest } from '../types';
import { formatMutualCount } from '../utils';

export type FriendRequestCardProps = {
  request: FriendRequest;
  mode: 'incoming' | 'outgoing';
  onAccept?: () => void;
  onDecline?: () => void;
  onUnsend?: () => void;
  onPress?: () => void;
  testID?: string;
};

/**
 * Full-width request card for incoming/outgoing tabs in FriendRequestsScreen.
 */
export function FriendRequestCard({
  request,
  mode,
  onAccept,
  onDecline,
  onUnsend,
  onPress,
  testID,
}: FriendRequestCardProps) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const mutual = formatMutualCount(request.user.mutualCount);

  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={`${request.user.displayName} friend request`}
      testID={testID}
    >
      <Card style={styles.card}>
        <Avatar
          name={request.user.displayName}
          avatarUrl={request.user.avatarUrl}
          size={48}
        />
        <View style={styles.info}>
          <AppText variant="subtitle" style={styles.name}>
            {request.user.displayName}
          </AppText>
          <AppText variant="caption" style={styles.username}>
            @{request.user.username}
            {mutual ? `  ·  ${mutual}` : ''}
          </AppText>
        </View>
        <View style={styles.actions}>
          {mode === 'incoming' ? (
            <>
              <Button
                title="Accept"
                variant="primary"
                size="sm"
                onPress={onAccept}
                testID={testID ? `${testID}-accept` : undefined}
              />
              <Button
                title="Decline"
                variant="secondary"
                size="sm"
                onPress={onDecline}
                testID={testID ? `${testID}-decline` : undefined}
              />
            </>
          ) : (
            <Button
              title="Unsend"
              variant="secondary"
              size="sm"
              onPress={onUnsend}
              testID={testID ? `${testID}-unsend` : undefined}
            />
          )}
        </View>
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
    actions: {
      flexDirection: 'column',
      gap: 6,
    },
  });
}
