import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Badge, Card } from '@ds/components';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import { Avatar } from '@shared/components';
import type { UserProfile } from '../types';

type ProfileHeaderCardProps = {
  profile: UserProfile;
};

export function ProfileHeaderCard({ profile }: ProfileHeaderCardProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Card variant="elevated" style={styles.card}>
      <Avatar name={profile.displayName} avatarUrl={profile.avatarUrl} size={88} />
      <View style={styles.identity}>
        <Badge variant="brand" size="sm">You</Badge>
        <AppText variant="title" style={styles.displayName}>
          {profile.displayName}
        </AppText>
        <AppText variant="body" style={styles.username}>
          @{profile.username}
        </AppText>
      </View>
    </Card>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: {
      alignItems: 'center',
      gap: theme.spacing[12],
    },
    identity: {
      alignItems: 'center',
      gap: theme.spacing[4],
    },
    displayName: {
      color: theme.colors.text.primary,
      fontWeight: '800',
      textAlign: 'center',
    },
    username: {
      color: theme.colors.text.secondary,
      textAlign: 'center',
    },
  });
}
