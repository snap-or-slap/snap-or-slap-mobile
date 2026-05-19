import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Card, Button } from '@ds/components';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import { Avatar } from '@shared/components';
import type { FriendRequest } from '../types';
import { formatMutualCount } from '../utils';

export type FriendRequestPreviewCardProps = {
  request: FriendRequest;
  onAccept?: () => void;
  onDecline?: () => void;
  onPress?: () => void;
  testID?: string;
};

/**
 * Compact horizontal preview card for FriendsHub incoming requests section.
 */
export function FriendRequestPreviewCard({
  request,
  onAccept,
  onDecline,
  onPress,
  testID,
}: FriendRequestPreviewCardProps) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const mutual = formatMutualCount(request.user.mutualCount);

  return (
    <Card
      variant="default"
      pressable={!!onPress}
      onPress={onPress}
      accessibilityLabel={`Friend request from ${request.user.displayName}`}
      testID={testID}
      style={styles.card}
    >
      <Avatar
        name={request.user.displayName}
        avatarUrl={request.user.avatarUrl}
        size={52}
      />
      <AppText variant="subtitle" style={styles.name} numberOfLines={1}>
        {request.user.displayName}
      </AppText>
      {mutual ? (
        <AppText variant="caption" style={styles.mutual} numberOfLines={1}>
          {mutual}
        </AppText>
      ) : null}
      <View style={styles.actions}>
        <Button
          title="Accept"
          variant="primary"
          size="sm"
          fullWidth
          onPress={onAccept}
          testID={testID ? `${testID}-accept` : undefined}
        />
        <Button
          title="Decline"
          variant="secondary"
          size="sm"
          fullWidth
          onPress={onDecline}
          testID={testID ? `${testID}-decline` : undefined}
        />
      </View>
    </Card>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: {
      width: 150,
      alignItems: 'center',
      gap: 8,
      paddingVertical: 16,
      paddingHorizontal: 12,
      backgroundColor: theme.colors.bg['surface-elevated'],
    },
    name: {
      color: theme.colors.text.brand,
      fontWeight: '700',
      textAlign: 'center',
    },
    mutual: {
      color: theme.colors.text.tertiary,
      textAlign: 'center',
    },
    actions: {
      width: '100%',
      gap: 6,
    },
  });
}
