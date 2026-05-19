import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { AppText, Button, Card, Screen } from '@ds/components';

import {
  ChallengeCard,
  ChallengeEmptyState,
  ChallengeSectionIntro,
  ChallengeSegmentTabs,
  ChallengesHeader,
} from '../components';

import type { ChallengeListItem, ChallengeSegment, ChallengeStatus } from '../types';
import { challengesService } from '../services/challenges.service';
import { ApiError } from '@services/api';

type ChallengesScreenProps = {
  onCreateChallenge?: () => void;
  onOpenChallenge?: (challengeId: string) => void;
};

const SEGMENT_CONTENT: Record<
  ChallengeSegment,
  {
    title: string;
    description: string;
  }
> = {
  formation: {
    title: 'Challenges in Formation',
    description:
      'Review upcoming challenges, check member readiness, and wait for them to start.',
  },
  active: {
    title: 'Active Challenges',
    description:
      'Track ongoing challenges, monitor risk, and stay on top of each step.',
  },
  history: {
    title: 'Challenge History',
    description:
      'Look back at completed, failed, and cancelled challenges.',
  },
};

type BackendChallenge = Record<string, unknown>;

function stringValue(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}

function numberValue(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function normalizeStatus(value: unknown): ChallengeStatus {
  const status = String(value ?? '').toLowerCase();
  if (status === 'formation') return 'FORMATION';
  if (status === 'pending' || status === 'invited') return 'INVITED';
  if (status === 'completed' || status === 'success' || status === 'finished') return 'FINISHED';
  if (status === 'failed' || status === 'game_over' || status === 'game-over') return 'GAME_OVER';
  if (status === 'cancelled' || status === 'canceled') return 'CANCELLED';
  return 'ACTIVE';
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

  return {
    id: String(raw.id ?? raw.challengeId ?? raw.challenge_id ?? ''),
    title: String(raw.title ?? 'Untitled challenge'),
    description: stringValue(raw.description),
    status: normalizeStatus(raw.status ?? raw.result),
    heartsLeft: numberValue(raw.heartsLeft) ?? numberValue(raw.hearts_left),
    totalHearts: numberValue(raw.totalHearts) ?? numberValue(raw.total_hearts),
    resetTime: stringValue(raw.resetTime ?? raw.reset_time)?.slice(0, 5),
    startDate: stringValue(raw.startAt ?? raw.start_at ?? raw.startDate ?? raw.start_date),
    endDate: stringValue(raw.endAt ?? raw.end_at ?? raw.endDate ?? raw.end_date),
    memberCount: maxMembers ?? memberCount,
    joinedCount,
    hostName: stringValue(raw.hostName ?? raw.host_name ?? raw.hostUsername ?? raw.host_username),
    progressLabel: stringValue(raw.resultBanner),
    isInvite: normalizeStatus(raw.status) === 'INVITED',
  };
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return 'Could not load challenges.';
}

export function ChallengesScreen({
  onCreateChallenge,
  onOpenChallenge,
}: ChallengesScreenProps) {
  const [segment, setSegment] = useState<ChallengeSegment>('active');
  const [challenges, setChallenges] = useState<ChallengeListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const segmentContent = SEGMENT_CONTENT[segment];

  const loadChallenges = useCallback(async (refreshing = false) => {
    if (refreshing) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const response =
        segment === 'history'
          ? await challengesService.getHistoryList<{ challenges?: BackendChallenge[] }>({ limit: 50 })
          : await challengesService.listChallenges<{ challenges?: BackendChallenge[] }>({
              status: segment,
              limit: 50,
            });
      setChallenges((response.challenges ?? []).map(mapChallengeListItem).filter((item) => item.id));
    } catch (loadError) {
      setChallenges([]);
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [segment]);

  useEffect(() => {
    void loadChallenges();
  }, [loadChallenges]);

  const renderChallengeList = () => {
    if (isLoading && !isRefreshing) {
      return (
        <View style={styles.list} testID="challenges-list">
          <Card style={styles.stateCard}>
            <AppText variant="body" style={styles.stateText}>
              Loading challenges...
            </AppText>
          </Card>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.list} testID="challenges-list">
          <ChallengeEmptyState
            title="Could not load challenges"
            description={error}
            actionLabel="Retry"
            onAction={() => void loadChallenges()}
            testID="challenge-error-state"
          />
        </View>
      );
    }

    if (challenges.length === 0) {
      const emptyTitle =
        segment === 'active'
          ? 'No active challenges yet'
          : segment === 'formation'
            ? 'No pending challenges'
            : 'No challenge history yet';
      return (
        <View style={styles.list} testID="challenges-list">
          <ChallengeEmptyState
            title={emptyTitle}
            description={segmentContent.description}
            actionLabel={segment === 'active' ? 'Create challenge' : undefined}
            onAction={segment === 'active' ? onCreateChallenge : undefined}
            testID={`${segment}-empty-state`}
          />
        </View>
      );
    }

    return (
      <View style={styles.list} testID="challenges-list">
        {challenges.map((challenge) => {
          const mode =
            challenge.status === 'ACTIVE'
              ? 'active'
              : challenge.status === 'FORMATION' || challenge.status === 'INVITED'
                ? 'formation'
                : 'history';
          return (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              mode={mode}
              onPress={() => onOpenChallenge?.(challenge.id)}
              onPrimaryAction={() => onOpenChallenge?.(challenge.id)}
              primaryActionLabel="View"
              testID={`${mode}-challenge-card-${challenge.id}`}
            />
          );
        })}
      </View>
    );
  };

  return (
    <Screen testID="challenges-screen">
      <View style={styles.root}>
        <ChallengesHeader />

        <ChallengeSegmentTabs
          activeSegment={segment}
          onSegmentChange={setSegment}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={() => void loadChallenges(true)} />
          }
        >
          <View style={styles.createAction}>
            <Button
              title="Create challenge"
              variant="primary"
              onPress={onCreateChallenge}
              testID="open-create-challenge-button"
            />
          </View>

          <ChallengeSectionIntro
            title={segmentContent.title}
            description={segmentContent.description}
          />

          {renderChallengeList()}
        </ScrollView>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 120,
  },
  createAction: {
    paddingHorizontal: 24,
    marginBottom: 18,
  },
  list: {
    paddingHorizontal: 24,
    gap: 16,
  },
  stateCard: {
    padding: 24,
    alignItems: 'center',
  },
  stateText: {
    color: '#6B7280',
  },
});
