import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@ds/components';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';

type JoinedMembersBarProps = {
  joinedText: string;
  extraMembersText?: string;
  testID?: string;
};

export function JoinedMembersBar({
  joinedText,
  extraMembersText = '+1',
  testID,
}: JoinedMembersBarProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View testID={testID} style={styles.root}>
      <View style={styles.avatarStack}>
        <View style={styles.avatar}>
          <AppText variant="bodyLarge" style={styles.avatarText}>
            S
          </AppText>
        </View>

        <View style={styles.extraAvatar}>
          <AppText variant="bodyLarge" style={styles.extraAvatarText}>
            {extraMembersText}
          </AppText>
        </View>
      </View>

      <AppText variant="bodyLarge" style={styles.joinedText}>
        {joinedText}
      </AppText>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    root: {
      marginTop: 22,
      minHeight: 66,
      borderRadius: 999,
      paddingHorizontal: 18,
      paddingVertical: 12,
      backgroundColor: theme.colors.bg['brand-subtle'],
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    avatarStack: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 999,
      backgroundColor: theme.colors.bg['surface-inverse'],
      borderWidth: 3,
      borderColor: theme.colors.bg['surface-elevated'],
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      color: theme.colors.text.inverse,
      fontSize: 16,
      lineHeight: 20,
      fontWeight: '800',
    },
    extraAvatar: {
      width: 48,
      height: 48,
      marginLeft: -8,
      borderRadius: 999,
      backgroundColor: theme.colors.bg['brand-subtle-hover'],
      borderWidth: 3,
      borderColor: theme.colors.bg['surface-elevated'],
      alignItems: 'center',
      justifyContent: 'center',
    },
    extraAvatarText: {
      color: theme.colors.text.secondary,
      fontSize: 15,
      lineHeight: 20,
      fontWeight: '700',
    },
    joinedText: {
      color: theme.colors.text.error,
      fontSize: 18,
      lineHeight: 24,
      fontWeight: '800',
    },
  });
}