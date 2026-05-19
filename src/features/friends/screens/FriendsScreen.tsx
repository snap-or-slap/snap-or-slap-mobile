
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Screen, AppText, Badge, Card, Button } from '@ds/components';
import { UserAddIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import { Avatar } from '@shared/components';

const friends = [
  {
    id: 'friend-anna',
    displayName: 'Anna Pham',
    username: 'anna',
    subtitle: 'In 2 active challenges with you',
  },
  {
    id: 'friend-khoa',
    displayName: 'Khoa Le',
    username: 'khoa',
    subtitle: 'Last check-in 2 hours ago',
  },
  {
    id: 'friend-linh',
    displayName: 'Linh Dao',
    username: 'linh',
    subtitle: 'Morning run squad',
  },
];

const pendingRequests = [
  {
    id: 'request-minh',
    displayName: 'Minh Tran',
    username: 'minh',
  },
  {
    id: 'request-ngan',
    displayName: 'Ngan Vo',
    username: 'ngan',
  },
];

export function FriendsScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Screen
      scrollable
      padding="md"
      testID="friends-screen"
      keyboardShouldPersistTaps="handled"
      contentStyle={styles.content}
    >
      <View style={styles.header}>
        <AppText variant="heading" style={styles.title}>
          Friends
        </AppText>
        <AppText variant="body" style={styles.subtitle}>
          Manage squadmates, pending requests, and quick invites.
        </AppText>
      </View>

      <Card style={styles.card}>
        <AppText variant="subtitle" style={styles.sectionTitle}>
          Search or add
        </AppText>
        <TextInput
          placeholder="Username or phone number"
          placeholderTextColor={theme.colors.text.tertiary}
          style={styles.input}
          autoCapitalize="none"
        />
        <Button
          title="Send request"
          variant="primary"
          leftIcon={<UserAddIcon size={18} color={theme.colors.text['on-brand']} variant="outline" />}
          onPress={() => undefined}
        />
      </Card>

      <Card style={styles.card}>
        <View style={styles.sectionHeader}>
          <AppText variant="subtitle" style={styles.sectionTitle}>
            Pending requests
          </AppText>
          <Badge variant="neutral" size="sm" textStyle={styles.countText}>
            {pendingRequests.length}
          </Badge>
        </View>
        <View style={styles.list}>
          {pendingRequests.map((request) => (
            <View key={request.id} style={styles.requestRow}>
              <Avatar name={request.displayName} size={44} />
              <View style={styles.friendText}>
                <AppText variant="subtitle" style={styles.friendName}>
                  {request.displayName}
                </AppText>
                <AppText variant="caption" style={styles.friendMeta}>
                  @{request.username}
                </AppText>
              </View>
              <View style={styles.requestActions}>
                <Button
                  title="Accept"
                  size="sm"
                  variant="primary"
                  onPress={() => undefined}
                />
                <Button
                  title="Decline"
                  size="sm"
                  variant="secondary"
                  onPress={() => undefined}
                />
              </View>
            </View>
          ))}
        </View>
      </Card>

      <Card style={styles.card}>
        <View style={styles.sectionHeader}>
          <AppText variant="subtitle" style={styles.sectionTitle}>
            Your friends
          </AppText>
          <Badge variant="neutral" size="sm" textStyle={styles.countText}>
            {friends.length}
          </Badge>
        </View>
        <View style={styles.list}>
          {friends.map((friend) => (
            <View key={friend.id} style={styles.friendRow}>
              <Avatar name={friend.displayName} size={48} />
              <View style={styles.friendText}>
                <AppText variant="subtitle" style={styles.friendName}>
                  {friend.displayName}
                </AppText>
                <AppText variant="caption" style={styles.friendMeta}>
                  @{friend.username} | {friend.subtitle}
                </AppText>
              </View>
              <Button
                title="Invite"
                size="sm"
                variant="secondary"
                onPress={() => undefined}
              />
            </View>
          ))}
        </View>
      </Card>
    </Screen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    content: {
      gap: 16,
      paddingBottom: 120,
    },
    header: {
      gap: 8,
    },
    title: {
      color: theme.colors.text.brand,
      fontWeight: '800',
    },
    subtitle: {
      color: theme.colors.text.secondary,
    },
    card: {
      padding: 16,
      gap: 14,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    sectionTitle: {
      color: theme.colors.text.primary,
      fontWeight: '800',
    },
    countText: {
      color: theme.colors.text.secondary,
      fontWeight: '700',
    },
    input: {
      minHeight: 48,
      borderRadius: 16,
      paddingHorizontal: 14,
      backgroundColor: theme.colors.bg.surface,
      borderWidth: 1,
      borderColor: theme.colors.border.subtle,
      color: theme.colors.text.primary,
    },
    list: {
      gap: 12,
    },
    requestRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    friendRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    friendText: {
      flex: 1,
      gap: 2,
    },
    friendName: {
      color: theme.colors.text.primary,
      fontWeight: '800',
    },
    friendMeta: {
      color: theme.colors.text.secondary,
      lineHeight: 18,
    },
    requestActions: {
      gap: 8,
    },
  });
}
