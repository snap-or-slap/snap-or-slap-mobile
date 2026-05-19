import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { AppText, Button, Card, Screen } from '@ds/components';
import { ArrowCircleLeftIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import { AppHeader, IconButton } from '@shared/components';
import { notificationsService } from '../services';
import { challengesService } from '@features/challenges/services';
import { ApiError } from '@services/api';

type NotificationsScreenProps = {
  onBack?: () => void;
  onOpenChallenge?: (challengeId: string) => void;
  onUnreadCountChange?: (count: number) => void;
};

type NotificationCategory = 'all' | 'social' | 'challenge' | 'system';

type BackendNotification = Record<string, unknown>;

type NotificationsResponse = {
  notifications?: BackendNotification[];
  unreadCount?: number;
};

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  category?: string;
  type?: string;
  isRead: boolean;
  createdAt?: string;
  challengeId?: string;
  challengeTitle?: string;
  inviterId?: string;
  action?: string;
};

function stringValue(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}

function boolValue(value: unknown): boolean {
  return typeof value === 'boolean' ? value : false;
}

function formatDate(value: unknown): string | undefined {
  const raw = stringValue(value);
  if (!raw) return undefined;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function extractChallengeId(raw: BackendNotification): string | undefined {
  const payload = (raw.payload ?? raw.data ?? raw.metadata ?? {}) as BackendNotification;
  return stringValue(
    raw.challengeId ??
      raw.challenge_id ??
      payload.challengeId ??
      payload.challenge_id,
  );
}

function metadataValue(raw: BackendNotification, key: string): unknown {
  const payload = (raw.payload ?? raw.data ?? raw.metadata ?? {}) as BackendNotification;
  return raw[key] ?? payload[key];
}

function mapNotification(raw: BackendNotification): NotificationItem {
  const type = stringValue(raw.type);
  const challengeTitle = stringValue(
    metadataValue(raw, 'challengeTitle') ?? metadataValue(raw, 'challenge_title'),
  );
  return {
    id: String(raw.id ?? raw.notificationId ?? raw.notification_id ?? ''),
    title:
      stringValue(raw.title) ??
      (type === 'challenge_invite' ? 'Challenge invitation' : undefined) ??
      type ??
      'Notification',
    message:
      stringValue(raw.message ?? raw.body ?? raw.description) ??
      (challengeTitle ? `You were invited to ${challengeTitle}.` : 'You have a new update.'),
    category: stringValue(raw.category),
    type,
    isRead: boolValue(raw.isRead ?? raw.is_read),
    createdAt: formatDate(raw.createdAt ?? raw.created_at),
    challengeId: extractChallengeId(raw),
    challengeTitle,
    inviterId: stringValue(
      metadataValue(raw, 'inviterId') ??
        metadataValue(raw, 'inviter_id') ??
        metadataValue(raw, 'invited_by'),
    ),
    action: stringValue(metadataValue(raw, 'action')),
  };
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return 'Could not load notifications.';
}

export function NotificationsScreen({
  onBack,
  onOpenChallenge,
  onUnreadCountChange,
}: NotificationsScreenProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [category, setCategory] = useState<NotificationCategory>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(async (refreshing = false) => {
    if (refreshing) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      await notificationsService.syncOverlays().catch(() => undefined);
      const response = await notificationsService.listNotifications<NotificationsResponse>({
        limit: 50,
        category: category === 'all' ? undefined : category,
      });
      setNotifications(
        (response.notifications ?? []).map(mapNotification).filter((item) => item.id),
      );
      const nextUnreadCount = response.unreadCount ?? 0;
      setUnreadCount(nextUnreadCount);
      onUnreadCountChange?.(nextUnreadCount);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [category, onUnreadCountChange]);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  const handleOpen = async (notification: NotificationItem) => {
    if (!notification.isRead) {
      await notificationsService.markRead([notification.id]).catch(() => undefined);
    }
    if (notification.challengeId) {
      onOpenChallenge?.(notification.challengeId);
      return;
    }
    await loadNotifications(true);
  };

  const handleMarkAllRead = async () => {
    await notificationsService.markAllRead();
    await loadNotifications(true);
  };

  const handleInviteAction = async (
    notification: NotificationItem,
    action: 'accept' | 'decline',
  ) => {
    if (!notification.challengeId) return;

    try {
      if (action === 'accept') {
        await challengesService.acceptInvite(notification.challengeId);
        await notificationsService.markRead([notification.id]).catch(() => undefined);
        await loadNotifications(true);
        onOpenChallenge?.(notification.challengeId);
        return;
      }

      await challengesService.declineInvite(notification.challengeId);
      await notificationsService.markRead([notification.id]).catch(() => undefined);
      await loadNotifications(true);
    } catch (inviteError) {
      setError(getErrorMessage(inviteError));
    }
  };

  const handleDelete = (notification: NotificationItem) => {
    Alert.alert('Delete', 'Delete this notification?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          void notificationsService
            .deleteNotification(notification.id)
            .then(() => loadNotifications(true))
            .catch((deleteError) => setError(getErrorMessage(deleteError)));
        },
      },
    ]);
  };

  return (
    <Screen testID="notifications-screen">
      <View style={styles.root}>
        <View style={styles.headerWrap}>
          <AppHeader
            title="Notifications"
            subtitle={`${unreadCount} unread`}
            leftAction={
              onBack ? (
                <IconButton
                  accessibilityLabel="Go back"
                  onPress={onBack}
                  icon={<ArrowCircleLeftIcon size={26} color={theme.colors.text.brand} variant="outline" />}
                  testID="notifications-back-button"
                />
              ) : undefined
            }
          />
        </View>

        <View style={styles.filterRow}>
          {(['all', 'challenge', 'social', 'system'] as NotificationCategory[]).map((item) => (
            <Button
              key={item}
              title={item === 'all' ? 'All' : item[0].toUpperCase() + item.slice(1)}
              variant={category === item ? 'primary' : 'secondary'}
              size="sm"
              onPress={() => setCategory(item)}
            />
          ))}
        </View>

        <View style={styles.actionWrap}>
          <Button
            title="Mark all read"
            variant="secondary"
            size="sm"
            disabled={unreadCount === 0}
            onPress={() => void handleMarkAllRead()}
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => void loadNotifications(true)}
            />
          }
        >
          {isLoading && !isRefreshing ? (
            <Card style={styles.stateCard}>
              <AppText variant="body" style={styles.bodyText}>
                Loading notifications...
              </AppText>
            </Card>
          ) : null}

          {error ? (
            <Card style={styles.stateCard}>
              <AppText variant="subtitle" style={styles.title}>
                Could not load notifications
              </AppText>
              <AppText variant="body" style={styles.bodyText}>
                {error}
              </AppText>
              <Button title="Retry" variant="primary" size="sm" onPress={() => void loadNotifications()} />
            </Card>
          ) : null}

          {!isLoading && !error && notifications.length === 0 ? (
            <Card style={styles.stateCard}>
              <AppText variant="subtitle" style={styles.title}>
                No notifications
              </AppText>
              <AppText variant="body" style={styles.bodyText}>
                Challenge, social, and system updates will appear here.
              </AppText>
            </Card>
          ) : null}

          {!error
            ? notifications.map((notification) => {
                const isChallengeInvite =
                  notification.type === 'challenge_invite' &&
                  notification.category === 'challenge' &&
                  !notification.action &&
                  Boolean(notification.challengeId);
                const isReadOnlyInvite =
                  notification.type === 'challenge_invite' && !notification.challengeId;

                return (
                <Card
                  key={notification.id}
                  pressable={!isChallengeInvite}
                  onPress={!isChallengeInvite ? () => void handleOpen(notification) : undefined}
                  style={[
                    styles.notificationCard,
                    !notification.isRead && styles.unreadCard,
                  ]}
                >
                  <View style={styles.notificationHeader}>
                    <View style={styles.notificationText}>
                      <AppText variant="subtitle" style={styles.title}>
                        {notification.title}
                      </AppText>
                      <AppText variant="caption" style={styles.metaText}>
                        {notification.category ?? 'update'}
                        {notification.createdAt ? ` · ${notification.createdAt}` : ''}
                      </AppText>
                    </View>
                    <Button
                      title="Delete"
                      variant="ghost"
                      size="sm"
                      onPress={() => handleDelete(notification)}
                    />
                  </View>
                  <AppText variant="body" style={styles.bodyText}>
                    {notification.message}
                  </AppText>
                  {isReadOnlyInvite ? (
                    <AppText variant="caption" style={styles.metaText}>
                      TODO: backend should include challengeId in challenge invitation notification payload.
                    </AppText>
                  ) : null}
                  {isChallengeInvite ? (
                    <View style={styles.inviteActions}>
                      <Button
                        title="Accept"
                        variant="primary"
                        size="sm"
                        onPress={() => void handleInviteAction(notification, 'accept')}
                      />
                      <Button
                        title="Decline"
                        variant="secondary"
                        size="sm"
                        onPress={() => void handleInviteAction(notification, 'decline')}
                      />
                      <Button
                        title="View Detail"
                        variant="ghost"
                        size="sm"
                        onPress={() => {
                          void notificationsService.markRead([notification.id]).catch(() => undefined);
                          onOpenChallenge?.(notification.challengeId!);
                        }}
                      />
                    </View>
                  ) : notification.challengeId ? (
                    <View style={styles.inviteActions}>
                      <Button
                        title="View Detail"
                        variant="secondary"
                        size="sm"
                        onPress={() => void handleOpen(notification)}
                      />
                    </View>
                  ) : null}
                </Card>
                );
              })
            : null}
        </ScrollView>
      </View>
    </Screen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    root: {
      flex: 1,
    },
    headerWrap: {
      paddingHorizontal: theme.spacing[24],
      paddingTop: theme.spacing[16],
    },
    filterRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing[8],
      paddingHorizontal: theme.spacing[24],
      marginBottom: theme.spacing[12],
    },
    actionWrap: {
      paddingHorizontal: theme.spacing[24],
      marginBottom: theme.spacing[12],
      alignItems: 'flex-start',
    },
    list: {
      paddingHorizontal: theme.spacing[24],
      paddingBottom: 120,
      gap: theme.spacing[12],
    },
    notificationCard: {
      padding: theme.spacing[16],
      gap: theme.spacing[12],
    },
    unreadCard: {
      borderColor: theme.colors.border.brand,
    },
    notificationHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing[12],
    },
    notificationText: {
      flex: 1,
      gap: theme.spacing[4],
    },
    stateCard: {
      padding: theme.spacing[24],
      gap: theme.spacing[12],
      alignItems: 'center',
    },
    title: {
      color: theme.colors.text.primary,
      fontWeight: '800',
    },
    bodyText: {
      color: theme.colors.text.secondary,
      lineHeight: 20,
    },
    metaText: {
      color: theme.colors.text.tertiary,
    },
    inviteActions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing[8],
    },
  });
}
