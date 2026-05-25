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

type NotificationActionState = {
  loadingAction?: 'accept' | 'decline' | 'delete' | 'open';
  error?: string;
};

const FILTERS: NotificationCategory[] = ['all', 'challenge', 'social', 'system'];

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

function getFilterLabel(category: NotificationCategory): string {
  switch (category) {
    case 'all':
      return 'All';
    case 'challenge':
      return 'Challenges';
    case 'social':
      return 'Social';
    case 'system':
      return 'System';
    default:
      return category;
  }
}

function getCategoryLabel(notification: NotificationItem): string {
  if (notification.category === 'challenge') return 'Challenge';
  if (notification.category === 'social') return 'Social';
  if (notification.category === 'system') return 'System';
  return 'Update';
}

function isChallengeInviteNotification(notification: NotificationItem): boolean {
  return (
    notification.type === 'challenge_invite' &&
    notification.category === 'challenge' &&
    !notification.action &&
    Boolean(notification.challengeId)
  );
}

function isReadOnlyInviteNotification(notification: NotificationItem): boolean {
  return notification.type === 'challenge_invite' && !notification.challengeId;
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
  const [actionStateById, setActionStateById] = useState<Record<string, NotificationActionState>>({});

  const hasNotifications = notifications.length > 0;

  const visibleSummary = useMemo(() => {
    const unreadVisible = notifications.filter((item) => !item.isRead).length;
    const challengeVisible = notifications.filter((item) => item.category === 'challenge').length;

    return {
      unreadVisible,
      challengeVisible,
      totalVisible: notifications.length,
    };
  }, [notifications]);

  const updateNotificationActionState = useCallback(
    (notificationId: string, nextState: NotificationActionState) => {
      setActionStateById((current) => ({
        ...current,
        [notificationId]: nextState,
      }));
    },
    [],
  );

  const clearNotificationActionState = useCallback((notificationId: string) => {
    setActionStateById((current) => {
      const next = { ...current };
      delete next[notificationId];
      return next;
    });
  }, []);

  const loadNotifications = useCallback(
    async (refreshing = false) => {
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

        const nextNotifications = (response.notifications ?? [])
          .map(mapNotification)
          .filter((item) => item.id);

        setNotifications(nextNotifications);

        const nextUnreadCount = response.unreadCount ?? 0;
        setUnreadCount(nextUnreadCount);
        onUnreadCountChange?.(nextUnreadCount);
      } catch (loadError) {
        setError(getErrorMessage(loadError));
        setNotifications([]);
        setUnreadCount(0);
        onUnreadCountChange?.(0);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [category, onUnreadCountChange],
  );

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  const handleOpen = async (notification: NotificationItem) => {
    clearNotificationActionState(notification.id);
    updateNotificationActionState(notification.id, { loadingAction: 'open' });

    try {
      if (!notification.isRead) {
        await notificationsService.markRead([notification.id]).catch(() => undefined);
      }

      if (notification.challengeId) {
        onOpenChallenge?.(notification.challengeId);
        return;
      }

      await loadNotifications(true);
    } catch (openError) {
      updateNotificationActionState(notification.id, {
        error: getErrorMessage(openError),
      });
    } finally {
      updateNotificationActionState(notification.id, {});
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsService.markAllRead();
      await loadNotifications(true);
    } catch (markError) {
      setError(getErrorMessage(markError));
    }
  };

  const handleInviteAction = async (
    notification: NotificationItem,
    action: 'accept' | 'decline',
  ) => {
    if (!notification.challengeId) return;

    clearNotificationActionState(notification.id);
    updateNotificationActionState(notification.id, { loadingAction: action });

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
      updateNotificationActionState(notification.id, {
        error: getErrorMessage(inviteError),
      });
    } finally {
      setActionStateById((current) => {
        const currentItem = current[notification.id];

        if (currentItem?.error) {
          return current;
        }

        return {
          ...current,
          [notification.id]: {},
        };
      });
    }
  };

  const handleDelete = (notification: NotificationItem) => {
    Alert.alert(
      'Delete notification',
      'This notification will be removed from your inbox.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            clearNotificationActionState(notification.id);
            updateNotificationActionState(notification.id, { loadingAction: 'delete' });

            void notificationsService
              .deleteNotification(notification.id)
              .then(() => loadNotifications(true))
              .catch((deleteError) => {
                updateNotificationActionState(notification.id, {
                  error: getErrorMessage(deleteError),
                });
              });
          },
        },
      ],
    );
  };

  return (
    <Screen testID="notifications-screen">
      <View style={styles.root}>
        <View style={styles.headerWrap}>
          <AppHeader
            title="Notifications"
            subtitle={
              unreadCount > 0
                ? `${unreadCount} unread update${unreadCount > 1 ? 's' : ''}`
                : 'You are all caught up'
            }
            leftAction={
              onBack ? (
                <IconButton
                  accessibilityLabel="Go back"
                  onPress={onBack}
                  icon={
                    <ArrowCircleLeftIcon
                      size={26}
                      color={theme.colors.text.brand}
                      variant="outline"
                    />
                  }
                  testID="notifications-back-button"
                />
              ) : undefined
            }
          />
        </View>

        {/* <View style={styles.summaryWrap}>
          <Card style={styles.summaryCard}>
            <View style={styles.summaryStats}>
              <View style={styles.statPill}>
                <AppText variant="subtitle" style={styles.statValue}>
                  {visibleSummary.totalVisible}
                </AppText>
                <AppText variant="caption" style={styles.statLabel}>
                  shown
                </AppText>
              </View>

              <View style={styles.statPill}>
                <AppText variant="subtitle" style={styles.statValue}>
                  {visibleSummary.unreadVisible}
                </AppText>
                <AppText variant="caption" style={styles.statLabel}>
                  unread
                </AppText>
              </View>
            </View>
          </Card>
        </View> */}

        <View style={styles.filterSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {FILTERS.map((item) => {
              const isActive = category === item;

              return (
                <Button
                  key={item}
                  title={getFilterLabel(item)}
                  variant={isActive ? 'primary' : 'secondary'}
                  size="sm"
                  onPress={() => setCategory(item)}
                  testID={`notification-filter-${item}`}
                />
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.toolbar}>
          <View style={styles.toolbarText}>
            <AppText variant="caption" style={styles.toolbarLabel}>
              {hasNotifications
                ? `${visibleSummary.totalVisible} notification${visibleSummary.totalVisible > 1 ? 's' : ''}`
                : 'No notification in this view'}
            </AppText>
          </View>

          <Button
            title="Mark all read"
            variant="secondary"
            size="sm"
            disabled={unreadCount === 0}
            onPress={() => void handleMarkAllRead()}
            testID="notifications-mark-all-read"
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
              <AppText variant="subtitle" style={styles.stateTitle}>
                Loading notifications
              </AppText>
              <AppText variant="body" style={styles.stateText}>
                We are checking your latest challenge, social, and system updates.
              </AppText>
            </Card>
          ) : null}

          {error ? (
            <Card style={styles.stateCard}>
              <AppText variant="subtitle" style={styles.stateTitle}>
                Could not load notifications
              </AppText>
              <AppText variant="body" style={styles.stateText}>
                {error}
              </AppText>
              <Button
                title="Retry"
                variant="primary"
                size="sm"
                onPress={() => void loadNotifications()}
                testID="notifications-retry-button"
              />
            </Card>
          ) : null}

          {!isLoading && !error && notifications.length === 0 ? (
            <Card style={styles.stateCard}>
              <AppText variant="subtitle" style={styles.stateTitle}>
                No notifications yet
              </AppText>
              <AppText variant="body" style={styles.stateText}>
                Challenge invitations, friend activity, and system messages will appear here.
              </AppText>
            </Card>
          ) : null}

          {!error
            ? notifications.map((notification) => {
                const isChallengeInvite = isChallengeInviteNotification(notification);
                const isReadOnlyInvite = isReadOnlyInviteNotification(notification);
                const actionState = actionStateById[notification.id] ?? {};
                const isActionLoading = Boolean(actionState.loadingAction);

                return (
                  <Card
                    key={notification.id}
                    pressable={!isChallengeInvite}
                    onPress={!isChallengeInvite ? () => void handleOpen(notification) : undefined}
                    style={[
                      styles.notificationCard,
                      !notification.isRead && styles.unreadCard,
                    ]}
                    testID={`notification-card-${notification.id}`}
                  >
                    <View style={styles.notificationTopRow}>
                      <View style={styles.notificationIdentity}>
                        <View
                          style={[
                            styles.unreadDot,
                            notification.isRead && styles.readDot,
                          ]}
                        />
                        <View style={styles.notificationText}>
                          <View style={styles.titleRow}>
                            <AppText variant="subtitle" style={styles.title}>
                              {notification.title}
                            </AppText>
                          </View>

                          <View style={styles.metaRow}>
                            <View style={styles.categoryChip}>
                              <AppText variant="caption" style={styles.categoryText}>
                                {getCategoryLabel(notification)}
                              </AppText>
                            </View>

                            {notification.createdAt ? (
                              <AppText variant="caption" style={styles.metaText}>
                                {notification.createdAt}
                              </AppText>
                            ) : null}

                            {!notification.isRead ? (
                              <AppText variant="caption" style={styles.unreadText}>
                                New
                              </AppText>
                            ) : null}
                          </View>
                        </View>
                      </View>

                      <Button
                        title="Delete"
                        variant="ghost"
                        size="sm"
                        disabled={actionState.loadingAction === 'delete'}
                        onPress={() => handleDelete(notification)}
                        testID={`notification-delete-${notification.id}`}
                      />
                    </View>

                    <AppText variant="body" style={styles.bodyText}>
                      {notification.message}
                    </AppText>

                    {isReadOnlyInvite ? (
                      <View style={styles.warningBox}>
                        <AppText variant="caption" style={styles.warningText}>
                          This invitation cannot be opened because the backend did not include a challenge ID.
                        </AppText>
                      </View>
                    ) : null}

                    {actionState.error ? (
                      <View style={styles.inlineError}>
                        <AppText variant="caption" style={styles.inlineErrorText}>
                          {actionState.error}
                        </AppText>
                      </View>
                    ) : null}

                    {isChallengeInvite ? (
                      <View style={styles.actionArea}>
                        <AppText variant="caption" style={styles.actionHint}>
                          Choose what to do with this invitation.
                        </AppText>

                        <View style={styles.inviteActions}>
                          <Button
                            title={
                              actionState.loadingAction === 'accept'
                                ? 'Accepting...'
                                : 'Accept'
                            }
                            variant="primary"
                            size="sm"
                            disabled={isActionLoading}
                            onPress={() => void handleInviteAction(notification, 'accept')}
                            testID={`notification-accept-${notification.id}`}
                          />

                          <Button
                            title={
                              actionState.loadingAction === 'decline'
                                ? 'Declining...'
                                : 'Decline'
                            }
                            variant="secondary"
                            size="sm"
                            disabled={isActionLoading}
                            onPress={() => void handleInviteAction(notification, 'decline')}
                            testID={`notification-decline-${notification.id}`}
                          />

                          <Button
                            title="View Detail"
                            variant="ghost"
                            size="sm"
                            disabled={isActionLoading}
                            onPress={() => {
                              void notificationsService
                                .markRead([notification.id])
                                .catch(() => undefined);
                              onOpenChallenge?.(notification.challengeId!);
                            }}
                            testID={`notification-view-${notification.id}`}
                          />
                        </View>
                      </View>
                    ) : notification.challengeId ? (
                      <View style={styles.actionArea}>
                        <Button
                          title={
                            actionState.loadingAction === 'open'
                              ? 'Opening...'
                              : 'View Challenge'
                          }
                          variant="secondary"
                          size="sm"
                          disabled={isActionLoading}
                          onPress={() => void handleOpen(notification)}
                          testID={`notification-view-${notification.id}`}
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
    summaryWrap: {
      paddingHorizontal: theme.spacing[24],
      marginTop: theme.spacing[8],
      marginBottom: theme.spacing[12],
    },
    summaryCard: {
      padding: theme.spacing[16],
      gap: theme.spacing[16],
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.bg['page-subtle'],
      borderColor: theme.colors.border.brand,
    },
    summaryMain: {
      flex: 1,
      gap: theme.spacing[4],
      paddingRight: theme.spacing[12],
    },
    summaryTitle: {
      color: theme.colors.text.primary,
      fontWeight: '900',
    },
    summaryText: {
      color: theme.colors.text.secondary,
      lineHeight: 20,
    },
    summaryStats: {
      flexDirection: 'row',
      gap: theme.spacing[8],
    },
    statPill: {
      minWidth: 64,
      paddingVertical: theme.spacing[8],
      paddingHorizontal: theme.spacing[12],
      borderRadius: theme.radius.lg,
      alignItems: 'center',
      backgroundColor: theme.colors.bg['page-subtle'],
      borderWidth: 1,
      borderColor: theme.colors.border.brand,
    },
    statValue: {
      color: theme.colors.text.brand,
      fontWeight: '900',
    },
    statLabel: {
      color: theme.colors.text.tertiary,
      fontWeight: '700',
    },
    filterSection: {
      marginBottom: theme.spacing[12],
    },
    filterRow: {
      gap: theme.spacing[8],
      paddingHorizontal: theme.spacing[24],
      paddingRight: theme.spacing[32],
    },
    toolbar: {
      paddingHorizontal: theme.spacing[24],
      marginBottom: theme.spacing[12],
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing[12],
    },
    toolbarText: {
      flex: 1,
    },
    toolbarLabel: {
      color: theme.colors.text.tertiary,
      fontWeight: '700',
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
    notificationTopRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: theme.spacing[12],
    },
    notificationIdentity: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing[12],
    },
    unreadDot: {
      width: 10,
      height: 10,
      borderRadius: 999,
      marginTop: theme.spacing[8],
      backgroundColor: theme.colors.text.brand,
    },
    readDot: {
      opacity: 0.2,
    },
    notificationText: {
      flex: 1,
      gap: theme.spacing[8],
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[8],
    },
    title: {
      flex: 1,
      color: theme.colors.text.primary,
      fontWeight: '900',
      lineHeight: 22,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: theme.spacing[8],
    },
    categoryChip: {
      paddingHorizontal: theme.spacing[8],
      paddingVertical: theme.spacing[4],
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.bg['page-subtle'],
      borderWidth: 1,
      borderColor: theme.colors.border.brand,
    },
    categoryText: {
      color: theme.colors.text.brand,
      fontWeight: '800',
    },
    metaText: {
      color: theme.colors.text.tertiary,
      fontWeight: '600',
    },
    unreadText: {
      color: theme.colors.text.brand,
      fontWeight: '900',
    },
    bodyText: {
      color: theme.colors.text.secondary,
      lineHeight: 21,
    },
    actionArea: {
      gap: theme.spacing[8],
      paddingTop: theme.spacing[4],
    },
    actionHint: {
      color: theme.colors.text.tertiary,
      fontWeight: '700',
    },
    inviteActions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing[8],
    },
    warningBox: {
      padding: theme.spacing[12],
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.bg['page-subtle'],
      borderWidth: 1,
      borderColor: theme.colors.border.brand,
    },
    warningText: {
      color: theme.colors.text.secondary,
      lineHeight: 18,
    },
    inlineError: {
      padding: theme.spacing[12],
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.bg['page-subtle'],
      borderWidth: 1,
      borderColor: theme.colors.border.brand,
    },
    inlineErrorText: {
      color: theme.colors.text.primary,
      fontWeight: '700',
      lineHeight: 18,
    },
    stateCard: {
      padding: theme.spacing[24],
      gap: theme.spacing[12],
      alignItems: 'center',
    },
    stateTitle: {
      color: theme.colors.text.primary,
      fontWeight: '900',
      textAlign: 'center',
    },
    stateText: {
      color: theme.colors.text.secondary,
      lineHeight: 20,
      textAlign: 'center',
    },
  });
}