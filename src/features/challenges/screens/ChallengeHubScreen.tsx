import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { AppText, Button, Card, Screen } from '@ds/components';
import { NotificationBingIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import { AppHeader, IconButton } from '@shared/components';
import type { ChallengeSegment } from '../types/challenge.types';
import type { ChallengeListItem, ChallengeStatus } from '../types/challenge.types';
import { ChallengeTabBar } from '../components/ChallengeTabBar';
import { ChallengeCard } from '../components/ChallengeCard';
import { ChallengeEmptyState } from '../components/ChallengeEmptyState';
import { challengesService } from '../services/challenges.service';
import { notificationsService } from '@features/notifications/services';
import { widgetService } from '@features/widget/services';
import { ApiError } from '@services/api';

type ChallengeHubScreenProps = {
  onCreateChallenge?: () => void;
  onOpenChallenge?: (challengeId: string) => void;
  onOpenNotifications?: () => void;
};

type BackendChallenge = Record<string, unknown>;

type ChallengeListResponse = {
  challenges?: BackendChallenge[];
  total?: number;
};

type HistoryListResponse = {
  challenges?: BackendChallenge[];
};

type NotificationsResponse = {
  unreadCount?: number;
};

type WidgetSummaryResponse = {
  currentStreak?: number;
  activeChallenges?: BackendChallenge[];
  unreadNotifications?: number;
};

function stringValue(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}

function numberValue(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function normalizeStatus(value: unknown): ChallengeStatus {
  const status = String(value ?? '').toLowerCase();
  if (status === 'active') return 'ACTIVE';
  if (status === 'formation') return 'FORMATION';
  if (status === 'pending' || status === 'invited') return 'INVITED';
  if (status === 'completed' || status === 'success' || status === 'finished') return 'FINISHED';
  if (status === 'failed' || status === 'game_over' || status === 'game-over') return 'GAME_OVER';
  if (status === 'cancelled' || status === 'canceled') return 'CANCELLED';
  return 'ACTIVE';
}

function formatResetTime(value: unknown): string | undefined {
  const raw = stringValue(value);
  if (!raw) return undefined;
  return raw.length >= 5 ? raw.slice(0, 5) : raw;
}

function mapChallengeListItem(raw: BackendChallenge): ChallengeListItem {
  const members = Array.isArray(raw.members) ? raw.members : undefined;
  const maxMembers = numberValue(raw.maxMembers) ?? numberValue(raw.max_members);
  const memberCount =
    numberValue(raw.memberCount) ??
    numberValue(raw.member_count) ??
    numberValue(raw.membersCount) ??
    members?.length;
  const joinedCount =
    numberValue(raw.joinedCount) ??
    numberValue(raw.acceptedMembersCount) ??
    numberValue(raw.accepted_members_count) ??
    memberCount;
  const currentCycle = numberValue(raw.currentCycle) ?? numberValue(raw.current_step);
  const durationDays = numberValue(raw.durationDays) ?? numberValue(raw.duration_days);

  return {
    id: String(raw.id ?? raw.challengeId ?? raw.challenge_id ?? ''),
    title: String(raw.title ?? 'Untitled challenge'),
    description: stringValue(raw.description),
    status: normalizeStatus(raw.status ?? raw.result),
    heartsLeft: numberValue(raw.heartsLeft) ?? numberValue(raw.hearts_left),
    totalHearts: numberValue(raw.totalHearts) ?? numberValue(raw.total_hearts),
    resetTime: formatResetTime(raw.resetTime ?? raw.reset_time),
    startDate: stringValue(raw.startAt ?? raw.start_at ?? raw.startDate ?? raw.start_date),
    endDate: stringValue(raw.endAt ?? raw.end_at ?? raw.endDate ?? raw.end_date),
    memberCount: maxMembers ?? memberCount,
    joinedCount,
    hostName: stringValue(raw.hostName ?? raw.host_name ?? raw.hostUsername ?? raw.host_username),
    currentStepLabel: currentCycle ? `Cycle ${currentCycle}` : undefined,
    progressLabel: durationDays ? `${durationDays} day challenge` : stringValue(raw.resultBanner),
    isInvite: normalizeStatus(raw.status) === 'INVITED',
  };
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return 'Could not load challenges.';
}

export function ChallengeHubScreen({
  onCreateChallenge,
  onOpenChallenge,
  onOpenNotifications,
}: ChallengeHubScreenProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [segment, setSegment] = useState<ChallengeSegment>('active');
  const [challenges, setChallenges] = useState<ChallengeListItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const loadData = useCallback(
    async (refreshing = false) => {
      if (refreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const listPromise =
          segment === 'history'
            ? challengesService.getHistoryList<HistoryListResponse>({ limit: 50 })
            : challengesService.listChallenges<ChallengeListResponse>({
                status: segment,
                limit: 50,
              });

        const [listResponse, notificationsResponse, widgetResponse] = await Promise.all([
          listPromise,
          notificationsService.listNotifications<NotificationsResponse>({ limit: 1 }),
          widgetService.getSummary<WidgetSummaryResponse>(),
        ]);

        setChallenges((listResponse.challenges ?? []).map(mapChallengeListItem).filter((item) => item.id));
        setUnreadCount(
          notificationsResponse.unreadCount ??
            widgetResponse.unreadNotifications ??
            0,
        );
        setCurrentStreak(widgetResponse.currentStreak);
      } catch (loadError) {
        setError(getErrorMessage(loadError));
        setChallenges([]);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [segment],
  );

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleSegmentChange = useCallback(
    (newSegment: ChallengeSegment) => {
      if (newSegment === segment) return;
      // Fade out → update → fade in
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start(() => {
        setSegment(newSegment);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    },
    [segment, fadeAnim]
  );

  const handleInviteAction = useCallback(
    async (challengeId: string, action: 'accept' | 'decline') => {
      try {
        if (action === 'accept') {
          await challengesService.acceptInvite(challengeId);
          onOpenChallenge?.(challengeId);
        } else {
          await challengesService.declineInvite(challengeId);
        }
        await loadData(true);
      } catch (actionError) {
        setError(getErrorMessage(actionError));
      }
    },
    [loadData, onOpenChallenge],
  );

  const renderContent = () => {
    if (isLoading && !isRefreshing) {
      return (
        <Card style={styles.stateCard}>
          <AppText variant="body" style={styles.stateText}>
            Loading challenges...
          </AppText>
        </Card>
      );
    }

    if (error) {
      return (
        <ChallengeEmptyState
          title="Could not load challenges"
          description={error}
          actionLabel="Retry"
          onAction={() => void loadData()}
          testID="challenge-error-state"
        />
      );
    }

    if (challenges.length === 0) {
      return renderEmptyState();
    }

    return challenges.map((challenge) => {
      const mode =
        challenge.status === 'ACTIVE'
          ? 'active'
          : challenge.status === 'FORMATION' || challenge.status === 'INVITED'
          ? 'formation'
          : 'history';

      const isInvite = challenge.isInvite;

      return (
        <ChallengeCard
          key={challenge.id}
          challenge={challenge}
          mode={mode}
          onPress={() => onOpenChallenge?.(challenge.id)}
          primaryActionLabel={
            mode === 'active' ? 'View' : isInvite ? 'Accept' : 'View'
          }
          secondaryActionLabel={isInvite ? 'Decline' : undefined}
          onPrimaryAction={() =>
            isInvite
              ? void handleInviteAction(challenge.id, 'accept')
              : onOpenChallenge?.(challenge.id)
          }
          onSecondaryAction={
            isInvite
              ? () => void handleInviteAction(challenge.id, 'decline')
              : undefined
          }
          testID={`challenge-card-${challenge.id}`}
        />
      );
    });
  };

  const renderEmptyState = () => {
    switch (segment) {
      case 'active':
        return (
          <ChallengeEmptyState
            title="No active challenges yet"
            description="Start a challenge with your squad and hold each other accountable."
            actionLabel="Create Challenge"
            onAction={onCreateChallenge}
            testID="active-empty-state"
          />
        );
      case 'formation':
        return (
          <ChallengeEmptyState
            title="No pending challenges"
            description="Challenges awaiting members or start confirmation will appear here."
            testID="formation-empty-state"
          />
        );
      case 'history':
        return (
          <ChallengeEmptyState
            title="No challenge history yet"
            description="Completed, failed, and cancelled challenges will appear here."
            testID="history-empty-state"
          />
        );
    }
  };

  return (
    <Screen testID="challenge-hub-screen">
      <View style={styles.root}>
        <View style={styles.headerWrap}>
          <AppHeader
            title="Challenges"
            subtitle="Keep your squad accountable."
            rightAction={
              <View style={styles.notifWrap}>
                <IconButton
                  accessibilityLabel="Challenge notifications"
                  variant="ghost"
                  onPress={onOpenNotifications}
                  icon={
                    <NotificationBingIcon
                      size={24}
                      color={theme.colors.text.brand}
                      variant="outline"
                    />
                  }
                />
                {unreadCount > 0 ? (
                  <View style={[styles.notifDot, { backgroundColor: theme.colors.bg.error }]} />
                ) : null}
              </View>
            }
            testID="challenge-hub-header"
          />
        </View>

        <View style={styles.summaryWrap}>
          <Card style={styles.summaryCard}>
            <AppText variant="caption" style={styles.summaryLabel}>
              Current streak
            </AppText>
            <AppText variant="subtitle" style={styles.summaryValue}>
              {currentStreak ?? 0} days
            </AppText>
          </Card>
          <Card style={styles.summaryCard}>
            <AppText variant="caption" style={styles.summaryLabel}>
              Unread
            </AppText>
            <AppText variant="subtitle" style={styles.summaryValue}>
              {unreadCount}
            </AppText>
          </Card>
        </View>

        {/* ── Create Challenge CTA ── */}
        <View style={styles.ctaWrap}>
          <Button
            title="Create Challenge"
            variant="primary"
            size="md"
            fullWidth
            onPress={onCreateChallenge}
            testID="open-create-challenge-button"
          />
        </View>

        {/* ── Tab Bar ── */}
        <ChallengeTabBar
          activeSegment={segment}
          onSegmentChange={handleSegmentChange}
          testID="challenge-tab-bar"
        />

        {/* ── Tab Content ── */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={() => void loadData(true)} />
          }
        >
          <Animated.View
            style={[styles.cardList, { opacity: fadeAnim }]}
            testID="challenges-list"
          >
            {renderContent()}
          </Animated.View>
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
    notifWrap: {
      position: 'relative',
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    notifDot: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    ctaWrap: {
      paddingHorizontal: theme.spacing[24],
      marginBottom: theme.spacing[16],
    },
    summaryWrap: {
      flexDirection: 'row',
      gap: theme.spacing[12],
      paddingHorizontal: theme.spacing[24],
      marginBottom: theme.spacing[16],
    },
    summaryCard: {
      flex: 1,
      padding: theme.spacing[16],
      gap: theme.spacing[4],
    },
    summaryLabel: {
      color: theme.colors.text.secondary,
      fontWeight: '700',
    },
    summaryValue: {
      color: theme.colors.text.primary,
      fontWeight: '900',
    },
    scrollContent: {
      paddingHorizontal: theme.spacing[24],
      paddingBottom: 120,
    },
    cardList: {
      gap: 16,
    },
    stateCard: {
      padding: theme.spacing[24],
      alignItems: 'center',
    },
    stateText: {
      color: theme.colors.text.secondary,
    },
  });
}
