import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@ds/components';
import { ProfileCircleIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import type { ChallengeMember } from '../types/challenge.types';

type ChallengeMemberPreviewProps = {
  members?: ChallengeMember[];
  memberCount?: number;
  testID?: string;
};

export function ChallengeMemberPreview({
  members,
  memberCount,
  testID,
}: ChallengeMemberPreviewProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const displayMembers = members?.slice(0, 3) ?? [];
  const count = memberCount ?? members?.length ?? 0;
  const extraCount = count - displayMembers.length;

  if (count === 0) return null;

  return (
    <View testID={testID} style={styles.root}>
      <View style={styles.avatarStack}>
        {displayMembers.map((member, index) => (
          <View
            key={member.id}
            style={[styles.avatar, { marginLeft: index === 0 ? 0 : -10 }]}
          >
            <AppText variant="caption" style={styles.avatarText}>
              {(member.name ?? '?')[0].toUpperCase()}
            </AppText>
          </View>
        ))}
        {extraCount > 0 ? (
          <View style={[styles.extraAvatar, { marginLeft: displayMembers.length > 0 ? -10 : 0 }]}>
            <AppText variant="caption" style={styles.extraAvatarText}>
              +{extraCount}
            </AppText>
          </View>
        ) : null}
      </View>

      <View style={styles.countRow}>
        <ProfileCircleIcon size={16} color={theme.colors.text.secondary} variant="outline" />
        <AppText variant="caption" style={styles.countText}>
          {count} member{count === 1 ? '' : 's'}
        </AppText>
      </View>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    root: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    avatarStack: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 999,
      backgroundColor: theme.colors.bg['surface-inverse'],
      borderWidth: 2,
      borderColor: theme.colors.bg['surface-elevated'],
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      color: theme.colors.text.inverse,
      fontSize: 13,
      fontWeight: '800',
    },
    extraAvatar: {
      width: 32,
      height: 32,
      borderRadius: 999,
      backgroundColor: theme.colors.bg['brand-subtle-hover'],
      borderWidth: 2,
      borderColor: theme.colors.bg['surface-elevated'],
      alignItems: 'center',
      justifyContent: 'center',
    },
    extraAvatarText: {
      color: theme.colors.text.secondary,
      fontSize: 12,
      fontWeight: '700',
    },
    countRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    countText: {
      color: theme.colors.text.secondary,
      fontSize: 14,
      fontWeight: '500',
    },
  });
}
