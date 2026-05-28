import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { AppText, Button, Card, Screen } from '@ds/components';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import { AppHeader } from '@shared/components';
import type { ChallengeSegment } from '../types/challenge.types';
import type { ChallengeListItem, ChallengeStatus } from '../types/challenge.types';
import { ChallengeTabBar } from '../components/ChallengeTabBar';
import { ChallengeCard } from '../components/ChallengeCard';
import { ChallengeEmptyState } from '../components/ChallengeEmptyState';
import { useListChallengesQuery, useGetHistoryListQuery, useAcceptInviteMutation, useDeclineInviteMutation } from '@store/api/challengeApi';
import { useGetWidgetSummaryQuery } from '@store/api/widgetApi';
import { ApiError } from '@services/api';

type ChallengeHubScreenProps = {
  onCreateChallenge?: () => void;
  onOpenChallenge?: (challengeId: string) => void;
};

type BackendChallenge = Record<string, unknown>;

type ChallengeListResponse = {
  challenges?: BackendChallenge[];
  total?: number;
};

type HistoryListResponse = {
  challenges?: BackendChallenge[];
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
  if (typeof error === 'object' && error !== null && 'error' in error) {
    return String((error as { error: unknown }).error);
  }
  return 'Could not load challenges.';
}

// ── Memoized list item renderer ──────────────────────────────────

const MemoizedChallengeCard = React.memo(ChallengeCard);

// ── Component ────────────────────────────────────────────────────

export function ChallengeHubScreen({
  onCreateChallenge,
  onOpenChallenge,
}: ChallengeHubScreenProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [segment, setSegment] = useState<ChallengeSegment>('active');
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // ── RTK Query hooks ──────────────────────────────────────────
  const isHistorySegment = segment === 'history';

  const {
    data: challengeListData,
    isLoading: isListLoading,
    isFetching: isListFetching,
    error: listError,
    refetch: refetchList,
  } = useListChallengesQuery(
    { status: segment, limit: 50 },
    { skip: isHistorySegment },
  );

  const {
    data: historyData,
    isLoading: isHistoryLoading,
    isFetching: isHistoryFetching,
    error: historyError,
    refetch: refetchHistory,
  } = useGetHistoryListQuery(
    { limit: 50 },
    { skip: !isHistorySegment },
  );

  const {
    data: widgetData,
  } = useGetWidgetSummaryQuery();

  const [acceptInvite] = useAcceptInviteMutation();
  const [declineInvite] = useDeclineInviteMutation();

  // ── Derived state ──────────────────────────────────────────
  const rawData = isHistorySegment ? historyData : challengeListData;
  const isLoading = isHistorySegment ? isHistoryLoading : isListLoading;
  const isFetching = isHistorySegment ? isHistoryFetching : isListFetching;
  const error = isHistorySegment ? historyError : listError;
  const isRefreshing = isFetching && !isLoading;

  const challenges = useMemo(() => {
    const response = rawData as ChallengeListResponse | HistoryListResponse | undefined;
    return (response?.challenges ?? []).map(mapChallengeListItem).filter((item) => item.id);
  }, [rawData]);

  const currentStreak = (widgetData as WidgetSummaryResponse | undefined)?.currentStreak;

  // ── Handlers ───────────────────────────────────────────────
  const handleRefresh = useCallback(() => {
    if (isHistorySegment) {
      refetchHistory();
    } else {
      refetchList();
    }
  }, [isHistorySegment, refetchHistory, refetchList]);

  const handleSegmentChange = useCallback(
    (newSegment: ChallengeSegment) => {
      if (newSegment === segment) return;
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
          await acceptInvite(challengeId).unwrap();
          onOpenChallenge?.(challengeId);
        } else {
          await declineInvite(challengeId).unwrap();
        }
        // RTK Query automatically refetches due to tag invalidation
      } catch {
        // Error handled by RTK Query
      }
    },
    [acceptInvite, declineInvite, onOpenChallenge],
  );

  // ── FlatList renderItem ────────────────────────────────────
  const renderItem = useCallback(
    ({ item: challenge }: { item: ChallengeListItem }) => {
      const mode =
        challenge.status === 'ACTIVE'
          ? 'active'
          : challenge.status === 'FORMATION' || challenge.status === 'INVITED'
          ? 'formation'
          : 'history';
      const isInvite = challenge.isInvite;

      return (
        <MemoizedChallengeCard
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
    },
    [onOpenChallenge, handleInviteAction],
  );

  const keyExtractor = useCallback((item: ChallengeListItem) => item.id, []);

  // ── Render helpers ─────────────────────────────────────────
  const renderListHeader = useCallback(() => {
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
          description={getErrorMessage(error)}
          actionLabel="Retry"
          onAction={handleRefresh}
          testID="challenge-error-state"
        />
      );
    }

    if (challenges.length === 0) {
      return renderEmptyState();
    }

    return null;
  }, [isLoading, isRefreshing, error, challenges.length, handleRefresh, styles]);

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

  // ── Show empty state in header when no challenges ──────────
  const showListItems = !isLoading && !error && challenges.length > 0;

  return (
    <Screen testID="challenge-hub-screen">
      <View style={styles.root}>
        <View style={styles.headerWrap}>
          <AppHeader
            title="Challenges"
            subtitle="Keep your squad accountable."
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
              Showing
            </AppText>
            <AppText variant="subtitle" style={styles.summaryValue}>
              {challenges.length}
            </AppText>
          </Card>
        </View>

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

        <ChallengeTabBar
          activeSegment={segment}
          onSegmentChange={handleSegmentChange}
          testID="challenge-tab-bar"
        />

        <Animated.View style={[styles.listWrapper, { opacity: fadeAnim }]}>
          <FlatList
            data={showListItems ? challenges : []}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ListHeaderComponent={renderListHeader}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
            }
            initialNumToRender={10}
            maxToRenderPerBatch={5}
            windowSize={5}
            testID="challenges-list"
          />
        </Animated.View>
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
    listWrapper: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: theme.spacing[24],
      paddingBottom: 120,
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
