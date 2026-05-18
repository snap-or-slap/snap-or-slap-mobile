import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button } from '@ds/components';
import { ProfileCircleIcon, TickCircleIcon, ClockIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import type { ChallengeMember, ChallengeMemberStatus } from '../types/challenge.types';

type ChallengeMemberRowProps = {
  member: ChallengeMember;
  onSlap?: (memberId: string) => void;
  onAccept?: (memberId: string) => void;
  onDecline?: (memberId: string) => void;
  showActions?: boolean;
  testID?: string;
};

function getStatusIcon(status: ChallengeMemberStatus, theme: AppTheme) {
  switch (status) {
    case 'DONE':
      return <TickCircleIcon size={20} color={theme.colors.text.success} variant="bold" />;
    case 'PENDING':
      return <ClockIcon size={20} color={theme.colors.text.secondary} variant="outline" />;
    default:
      return <ProfileCircleIcon size={20} color={theme.colors.text.tertiary} variant="outline" />;
  }
}

function getStatusLabel(status: ChallengeMemberStatus): string {
  switch (status) {
    case 'DONE': return 'Done';
    case 'PENDING': return 'Pending';
    case 'REJECTED': return 'Rejected';
    case 'JOINED': return 'Joined';
    case 'INVITED': return 'Invited';
    case 'DECLINED': return 'Declined';
    case 'LEFT': return 'Left';
    default: return status;
  }
}

export function ChallengeMemberRow({
  member,
  onSlap,
  onAccept,
  onDecline,
  showActions = true,
  testID,
}: ChallengeMemberRowProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View testID={testID} style={styles.row}>
      <View style={styles.avatar}>
        <AppText variant="body" style={styles.avatarText}>
          {(member.name ?? '?')[0].toUpperCase()}
        </AppText>
      </View>

      <View style={styles.info}>
        <AppText variant="subtitle" style={styles.name}>
          {member.name}
          {member.isCurrentUser ? ' (You)' : ''}
        </AppText>
        {member.username ? (
          <AppText variant="caption" style={styles.meta}>
            @{member.username}
          </AppText>
        ) : null}
      </View>

      <View style={styles.right}>
        {getStatusIcon(member.status, theme)}
        <AppText variant="caption" style={styles.statusText}>
          {getStatusLabel(member.status)}
        </AppText>
      </View>

      {showActions && !member.isCurrentUser && member.status === 'PENDING' && onSlap ? (
        <Button
          title="Slap"
          variant="secondary"
          size="sm"
          onPress={() => onSlap(member.id)}
          testID={`slap-${member.id}`}
        />
      ) : null}

      {showActions && member.isCurrentUser && member.status === 'INVITED' ? (
        <View style={styles.actionRow}>
          {onAccept ? (
            <Button
              title="Accept"
              variant="primary"
              size="sm"
              onPress={() => onAccept(member.id)}
            />
          ) : null}
          {onDecline ? (
            <Button
              title="Decline"
              variant="ghost"
              size="sm"
              onPress={() => onDecline(member.id)}
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 8,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 999,
      backgroundColor: theme.colors.bg['surface-inverse'],
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    avatarText: {
      color: theme.colors.text.inverse,
      fontSize: 16,
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
    meta: {
      color: theme.colors.text.secondary,
    },
    right: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    statusText: {
      color: theme.colors.text.secondary,
      fontSize: 13,
    },
    actionRow: {
      flexDirection: 'row',
      gap: 8,
    },
  });
}
