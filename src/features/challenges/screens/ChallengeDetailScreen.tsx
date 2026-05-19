import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { AppText, Button, Card, Screen } from '@ds/components';
import { ArrowCircleLeftIcon, ClockIcon, CupIcon, MedalStarIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import { AppHeader, Avatar, IconButton } from '@shared/components';
import { ChallengeStatusBadge } from '../components/ChallengeStatusBadge';
import { ChallengeHearts } from '../components/ChallengeHearts';
import { ChallengeMetaRow } from '../components/ChallengeMetaRow';
import { challengesService } from '../services/challenges.service';
import { checkinService } from '../services/checkin.service';
import { friendsService } from '@features/friends/services';
import { ApiError } from '@services/api';
import type { FriendUser } from '@features/friends/types';

type ChallengeDetailScreenProps = {
  challengeId?: string;
  onBack?: () => void;
  onCheckIn?: (challengeId: string) => void;
};

type BackendRecord = Record<string, unknown>;

type DetailResponse = {
  challenge?: BackendRecord;
  members?: BackendRecord[];
  myMembership?: BackendRecord | null;
};

type TodayStatus = {
  cycleNumber?: number;
  durationDays?: number;
  heartsLeft?: number;
  resetAt?: string;
  timeUntilReset?: number;
  members?: BackendRecord[];
};

type StatsResponse = {
  elapsedCycles?: number;
  durationDays?: number;
  heartsLeft?: number;
  totalCheckins?: number;
  completionRate?: number;
};

type CheckinsResponse = {
  checkins?: BackendRecord[];
};

type DetailMember = {
  id: string;
  userId?: string;
  displayName: string;
  username: string;
  role: 'host' | 'member';
  status?: string;
  isReady?: boolean;
  avatarUrl?: string;
  checkedInToday?: boolean;
};

type CheckinItem = {
  id: string;
  caption?: string;
  evidenceUrl?: string;
  createdAt?: string;
  memberName?: string;
};

type LoadedDetail = {
  id: string;
  title: string;
  description?: string;
  status: 'formation' | 'active' | 'success' | 'game-over' | 'cancelled';
  statusLabel: string;
  heartsText: string;
  resetTimeText: string;
  dateRangeText: string;
  hostUsername: string;
  currentCycleText?: string;
  statsText?: string;
  members: DetailMember[];
  myMembership: BackendRecord | null;
  todayStatus?: TodayStatus;
  checkins: CheckinItem[];
};

function stringValue(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}

function numberValue(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function boolValue(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined;
}

function formatDate(value: unknown): string {
  const raw = stringValue(value);
  if (!raw) return 'TBD';
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(value: unknown): string {
  const raw = stringValue(value);
  if (!raw) return 'TBD';
  if (/^\d{2}:\d{2}/.test(raw)) return raw.slice(0, 5);
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function normalizeStatus(value: unknown): LoadedDetail['status'] {
  const status = String(value ?? '').toLowerCase();
  if (status === 'formation') return 'formation';
  if (status === 'completed' || status === 'success' || status === 'finished') return 'success';
  if (status === 'failed' || status === 'game_over' || status === 'game-over') return 'game-over';
  if (status === 'cancelled' || status === 'canceled') return 'cancelled';
  return 'active';
}

function statusLabel(status: LoadedDetail['status']): string {
  switch (status) {
    case 'formation':
      return 'Formation';
    case 'active':
      return 'Active';
    case 'success':
      return 'Finished';
    case 'game-over':
      return 'Game Over';
    case 'cancelled':
      return 'Cancelled';
  }
}

function isCheckedIn(raw: BackendRecord): boolean {
  return Boolean(
    raw.checkedIn ??
    raw.checked_in ??
    raw.hasCheckedIn ??
    raw.has_checked_in ??
    raw.checkinId ??
    raw.checkin_id,
  );
}

function mapMember(raw: BackendRecord, todayMembers: BackendRecord[]): DetailMember {
  const user = (raw.user ?? {}) as BackendRecord;
  const userId = stringValue(raw.userId ?? raw.user_id ?? user.id);
  const today = todayMembers.find((entry) => {
    const todayUserId = stringValue(entry.userId ?? entry.user_id);
    const todayMemberId = stringValue(entry.memberId ?? entry.member_id ?? entry.id);
    return (userId && todayUserId === userId) || todayMemberId === stringValue(raw.id);
  });

  return {
    id: String(raw.id ?? raw.memberId ?? raw.member_id ?? userId ?? ''),
    userId,
    displayName:
      stringValue(raw.displayName ?? raw.display_name ?? user.displayName ?? user.display_name) ??
      stringValue(raw.username ?? user.username) ??
      'Member',
    username: stringValue(raw.username ?? user.username) ?? 'member',
    role: String(raw.role ?? '').toLowerCase() === 'host' ? 'host' : 'member',
    status: stringValue(raw.status),
    isReady: boolValue(raw.isReady ?? raw.is_ready),
    avatarUrl: stringValue(raw.avatarUrl ?? raw.avatar_url ?? user.avatarUrl ?? user.avatar_url),
    checkedInToday: today ? isCheckedIn(today) : undefined,
  };
}

function mapCheckin(raw: BackendRecord): CheckinItem {
  const user = (raw.user ?? raw.member ?? {}) as BackendRecord;
  return {
    id: String(raw.id ?? raw.checkinId ?? raw.checkin_id ?? ''),
    caption: stringValue(raw.caption),
    evidenceUrl: stringValue(raw.evidenceUrl ?? raw.evidence_url),
    createdAt: stringValue(raw.createdAt ?? raw.created_at),
    memberName:
      stringValue(raw.memberName ?? raw.member_name) ??
      stringValue(user.displayName ?? user.display_name ?? user.username),
  };
}

function mapLoadedDetail(
  detail: DetailResponse,
  todayStatus?: TodayStatus,
  stats?: StatsResponse,
  checkins: BackendRecord[] = [],
): LoadedDetail {
  const challenge = detail.challenge ?? {};
  const status = normalizeStatus(challenge.status);
  const todayMembers = todayStatus?.members ?? [];
  const members = (detail.members ?? []).map((member) => mapMember(member, todayMembers));
  const host = members.find((member) => member.role === 'host');
  const totalHearts = numberValue(challenge.totalHearts ?? challenge.total_hearts);
  const heartsLeft =
    todayStatus?.heartsLeft ??
    stats?.heartsLeft ??
    numberValue(challenge.heartsLeft ?? challenge.hearts_left) ??
    totalHearts;
  const durationDays =
    todayStatus?.durationDays ??
    stats?.durationDays ??
    numberValue(challenge.durationDays ?? challenge.duration_days);

  return {
    id: String(challenge.id ?? challenge.challengeId ?? challenge.challenge_id ?? ''),
    title: String(challenge.title ?? 'Untitled challenge'),
    description: stringValue(challenge.description),
    status,
    statusLabel: statusLabel(status),
    heartsText:
      heartsLeft != null && totalHearts != null
        ? `${heartsLeft}/${totalHearts}`
        : totalHearts != null
          ? `${totalHearts} total`
          : 'No hearts',
    resetTimeText: todayStatus?.resetAt
      ? formatTime(todayStatus.resetAt)
      : formatTime(challenge.resetTime ?? challenge.reset_time),
    dateRangeText: `${formatDate(challenge.startAt ?? challenge.start_at)} - ${durationDays ?? '?'} days`,
    hostUsername: host?.username ?? stringValue(challenge.hostUsername ?? challenge.host_username) ?? 'host',
    currentCycleText:
      todayStatus?.cycleNumber != null
        ? `Cycle ${todayStatus.cycleNumber}`
        : stats?.elapsedCycles != null
          ? `Cycle ${stats.elapsedCycles}`
          : undefined,
    statsText:
      stats?.completionRate != null
        ? `${Math.round(stats.completionRate)}% completion · ${stats.totalCheckins ?? 0} check-ins`
        : undefined,
    members,
    myMembership: detail.myMembership ?? null,
    todayStatus,
    checkins: checkins.map(mapCheckin).filter((item) => item.id),
  };
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 409) return error.message;
    if (error.status === 403) return 'You do not have access to this challenge.';
    if (error.status === 404) return 'Challenge not found.';
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return 'Could not load challenge.';
}

export function ChallengeDetailScreen({
  challengeId,
  onBack,
  onCheckIn,
}: ChallengeDetailScreenProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [challenge, setChallenge] = useState<LoadedDetail | null>(null);
  const [friends, setFriends] = useState<FriendUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadChallenge = useCallback(async () => {
    if (!challengeId) {
      setError('Missing challenge id.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [detailResult, todayResult, statsResult, checkinsResult, friendsResult] =
        await Promise.allSettled([
          challengesService.getChallenge<DetailResponse>(challengeId),
          checkinService.getTodayStatus<TodayStatus>(challengeId),
          challengesService.getChallengeStats<StatsResponse>(challengeId),
          checkinService.listCheckins<CheckinsResponse>(challengeId, { limit: 30 }),
          friendsService.listFriends({ limit: 50 }),
        ]);

      if (detailResult.status === 'rejected') {
        throw detailResult.reason;
      }

      const todayStatus = todayResult.status === 'fulfilled' ? todayResult.value : undefined;
      const stats = statsResult.status === 'fulfilled' ? statsResult.value : undefined;
      const checkins = checkinsResult.status === 'fulfilled' ? checkinsResult.value.checkins ?? [] : [];
      setChallenge(mapLoadedDetail(detailResult.value, todayStatus, stats, checkins));
      setFriends(friendsResult.status === 'fulfilled' ? friendsResult.value.friends : []);
    } catch (loadError) {
      setChallenge(null);
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [challengeId]);

  useEffect(() => {
    void loadChallenge();
  }, [loadChallenge]);

  const isHistory =
    challenge?.status === 'success' ||
    challenge?.status === 'game-over' ||
    challenge?.status === 'cancelled';
  const isFormation = challenge?.status === 'formation';
  const isActive = challenge?.status === 'active';
  const myMembership = challenge?.myMembership;
  const myRole = String(myMembership?.role ?? '').toLowerCase();
  const myStatus = String(myMembership?.status ?? '').toLowerCase();
  const isHost = myRole === 'host';
  const isAcceptedMember = myStatus === 'accepted';
  const isPendingInvite = myStatus === 'pending';
  const myReady = Boolean(myMembership?.isReady ?? myMembership?.is_ready);

  const pendingTodayMembers = useMemo(
    () => challenge?.members.filter((member) => member.checkedInToday === false) ?? [],
    [challenge?.members],
  );

  const runMutation = useCallback(
    async (action: () => Promise<unknown>, successMessage?: string) => {
      setIsMutating(true);
      setActionMessage(null);
      try {
        await action();
        if (successMessage) setActionMessage(successMessage);
        await loadChallenge();
      } catch (mutationError) {
        setActionMessage(getErrorMessage(mutationError));
      } finally {
        setIsMutating(false);
      }
    },
    [loadChallenge],
  );

  const handleInviteFriends = () => {
    if (!challenge) return;
    const memberUserIds = new Set(challenge.members.map((member) => member.userId).filter(Boolean));
    const inviteeIds = friends
      .filter((friend) => !memberUserIds.has(friend.id))
      .map((friend) => friend.id)
      .slice(0, Math.max(0, 50 - challenge.members.length));

    if (inviteeIds.length === 0) {
      setActionMessage('No eligible friends to invite.');
      return;
    }

    void runMutation(
      () => challengesService.inviteUsers(challenge.id, inviteeIds),
      'Invites sent.',
    );
  };

  const confirmDestructive = (title: string, message: string, action: () => Promise<unknown>) => {
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: title,
        style: 'destructive',
        onPress: () => {
          void runMutation(action).then(() => onBack?.());
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <Screen padding="md" testID="challenge-detail-screen">
        <AppText variant="body" style={styles.bodyText}>
          Loading challenge...
        </AppText>
      </Screen>
    );
  }

  if (error || !challenge) {
    return (
      <Screen padding="md" testID="challenge-detail-screen" contentStyle={styles.content}>
        <AppHeader
          title="Challenge Detail"
          leftAction={
            onBack ? (
              <IconButton
                accessibilityLabel="Go back"
                onPress={onBack}
                icon={<ArrowCircleLeftIcon size={26} color={theme.colors.text.brand} variant="outline" />}
                testID="challenge-detail-back-button"
              />
            ) : undefined
          }
        />
        <Card style={styles.card}>
          <AppText variant="subtitle" style={styles.sectionTitle}>
            Could not load challenge
          </AppText>
          <AppText variant="body" style={styles.bodyText}>
            {error ?? 'Challenge not found.'}
          </AppText>
          <Button title="Retry" variant="primary" onPress={() => void loadChallenge()} />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen testID="challenge-detail-screen">
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppHeader
          title="Challenge Detail"
          leftAction={
            onBack ? (
              <IconButton
                accessibilityLabel="Go back"
                onPress={onBack}
                icon={<ArrowCircleLeftIcon size={26} color={theme.colors.text.brand} variant="outline" />}
                testID="challenge-detail-back-button"
              />
            ) : undefined
          }
          testID="challenge-detail-header"
        />

        <Card padding="none" style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <ChallengeStatusBadge tone={challenge.status} label={challenge.statusLabel} />
            <ChallengeHearts label={challenge.heartsText} tone="brand" />
          </View>

          <AppText variant="heading" style={styles.heroTitle}>
            {challenge.title}
          </AppText>

          {challenge.description ? (
            <AppText variant="body" style={styles.heroMeta}>
              {challenge.description}
            </AppText>
          ) : null}

          <ChallengeMetaRow
            icon={<ClockIcon variant="outline" color={theme.colors.text['on-brand']} size={20} />}
            label={`Reset ${challenge.resetTimeText}`}
          />

          <AppText variant="caption" style={styles.heroMeta}>
            Host @{challenge.hostUsername} · {challenge.dateRangeText}
          </AppText>
          {challenge.currentCycleText ? (
            <AppText variant="caption" style={styles.heroMeta}>
              {challenge.currentCycleText}
            </AppText>
          ) : null}
        </Card>

        {actionMessage ? (
          <Card style={styles.messageCard}>
            <AppText variant="caption" style={styles.bodyText}>
              {actionMessage}
            </AppText>
          </Card>
        ) : null}

        {isFormation ? (
          <Card style={styles.card}>
            <AppText variant="subtitle" style={styles.sectionTitle}>
              Waiting for members
            </AppText>
            <AppText variant="body" style={styles.bodyText}>
              This challenge will start once members are accepted and ready.
            </AppText>
            <View style={styles.actionRow}>
              {isPendingInvite ? (
                <>
                  <Button
                    title="Accept"
                    variant="primary"
                    size="sm"
                    loading={isMutating}
                    onPress={() => void runMutation(() => challengesService.acceptInvite(challenge.id))}
                  />
                  <Button
                    title="Decline"
                    variant="secondary"
                    size="sm"
                    disabled={isMutating}
                    onPress={() => void runMutation(() => challengesService.declineInvite(challenge.id), 'Invite declined.')}
                  />
                </>
              ) : null}
              {isAcceptedMember ? (
                <Button
                  title={myReady ? 'Set not ready' : 'Set ready'}
                  variant="primary"
                  size="sm"
                  loading={isMutating}
                  onPress={() => void runMutation(() => challengesService.setReady(challenge.id, !myReady))}
                />
              ) : null}
              {isHost ? (
                <Button
                  title="Invite Friends"
                  variant="secondary"
                  size="sm"
                  disabled={isMutating}
                  onPress={handleInviteFriends}
                  testID="invite-friends-button"
                />
              ) : null}
              {isAcceptedMember && !isHost ? (
                <Button
                  title="Leave"
                  variant="ghost"
                  size="sm"
                  disabled={isMutating}
                  onPress={() =>
                    confirmDestructive('Leave', 'Leave this formation challenge?', () =>
                      challengesService.leaveChallenge(challenge.id),
                    )
                  }
                />
              ) : null}
              {isHost ? (
                <Button
                  title="Delete"
                  variant="ghost"
                  size="sm"
                  disabled={isMutating}
                  onPress={() =>
                    confirmDestructive('Delete', 'Delete this formation challenge?', () =>
                      challengesService.deleteOrCancelChallenge(challenge.id),
                    )
                  }
                />
              ) : null}
            </View>
          </Card>
        ) : null}

        {isHistory ? (
          <Card style={styles.card}>
            {challenge.status === 'success' ? (
              <View style={styles.resultRow}>
                <CupIcon size={28} color={theme.colors.text.success} variant="bold" />
                <View style={styles.resultText}>
                  <AppText variant="subtitle" style={[styles.sectionTitle, { color: theme.colors.text.success }]}>
                    Challenge Completed!
                  </AppText>
                  <AppText variant="caption" style={styles.bodyText}>
                    Great job keeping the squad accountable.
                  </AppText>
                </View>
              </View>
            ) : null}
            {challenge.status === 'game-over' ? (
              <View style={styles.resultRow}>
                <MedalStarIcon size={28} color={theme.colors.text.error} variant="outline" />
                <View style={styles.resultText}>
                  <AppText variant="subtitle" style={[styles.sectionTitle, { color: theme.colors.text.error }]}>
                    Game Over
                  </AppText>
                  <AppText variant="caption" style={styles.bodyText}>
                    The squad ran out of hearts. Better luck next time!
                  </AppText>
                </View>
              </View>
            ) : null}
            {challenge.status === 'cancelled' ? (
              <AppText variant="body" style={styles.bodyText}>
                This challenge was cancelled before completion.
              </AppText>
            ) : null}
          </Card>
        ) : null}

        <Card style={styles.card}>
          <AppText variant="subtitle" style={styles.sectionTitle}>
            Members
          </AppText>
          <View style={styles.membersList}>
            {challenge.members.map((member) => (
              <View key={member.id} style={styles.memberRow}>
                <Avatar name={member.displayName} avatarUrl={member.avatarUrl} size={44} />
                <View style={styles.memberText}>
                  <AppText variant="subtitle" style={styles.memberName}>
                    {member.displayName}
                  </AppText>
                  <AppText variant="caption" style={styles.memberMeta}>
                    @{member.username} · {member.role === 'host' ? 'Host' : 'Member'}
                    {member.isReady != null ? ` · ${member.isReady ? 'Ready' : 'Not ready'}` : ''}
                    {member.checkedInToday != null ? ` · ${member.checkedInToday ? 'Checked in' : 'Pending'}` : ''}
                  </AppText>
                </View>
                {isActive && member.checkedInToday === false ? (
                  <Button
                    title="Slap"
                    variant="secondary"
                    size="sm"
                    disabled={isMutating}
                    onPress={() =>
                      void runMutation(
                        () => checkinService.nudgeMember(challenge.id, member.id),
                        'Nudge sent.',
                      )
                    }
                    testID={`slap-${member.id}`}
                  />
                ) : null}
              </View>
            ))}
          </View>
        </Card>

        {isActive ? (
          <Card style={styles.card}>
            <AppText variant="subtitle" style={styles.sectionTitle}>
              Today
            </AppText>
            {challenge.statsText ? (
              <AppText variant="caption" style={styles.bodyText}>
                {challenge.statsText}
              </AppText>
            ) : null}
            <View style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <AppText variant="subtitle" style={styles.activityName}>
                  Daily check-in
                </AppText>
                <AppText variant="caption" style={styles.activityStatus}>
                  {pendingTodayMembers.length} pending
                </AppText>
              </View>
              <AppText variant="caption" style={styles.activityWindow}>
                Reset {challenge.resetTimeText}
              </AppText>
              <View style={styles.actionRow}>
                <Button
                  title="Check in"
                  variant="primary"
                  size="sm"
                  onPress={() => onCheckIn?.(challenge.id)}
                  style={styles.actionButton}
                  testID="check-in-daily"
                />
                {pendingTodayMembers[0] ? (
                  <Button
                    title="Slap nudge"
                    variant="secondary"
                    size="sm"
                    disabled={isMutating}
                    onPress={() =>
                      void runMutation(
                        () => checkinService.nudgeMember(challenge.id, pendingTodayMembers[0].id),
                        'Nudge sent.',
                      )
                    }
                    style={styles.actionButton}
                  />
                ) : null}
              </View>
            </View>
            {isHost ? (
              <Button
                title="Cancel challenge"
                variant="ghost"
                size="sm"
                disabled={isMutating}
                onPress={() =>
                  confirmDestructive('Cancel', 'Cancel this active challenge?', () =>
                    challengesService.cancelChallenge(challenge.id),
                  )
                }
              />
            ) : null}
          </Card>
        ) : null}

        {!isFormation ? (
          <Card style={styles.card}>
            <AppText variant="subtitle" style={styles.sectionTitle}>
              Evidence feed
            </AppText>
            {challenge.checkins.length === 0 ? (
              <AppText variant="body" style={styles.bodyText}>
                No check-ins yet.
              </AppText>
            ) : (
              <View style={styles.membersList}>
                {challenge.checkins.map((checkin) => (
                  <View key={checkin.id} style={styles.feedItem}>
                    <AppText variant="subtitle" style={styles.memberName}>
                      {checkin.memberName ?? 'Member'}
                    </AppText>
                    <AppText variant="caption" style={styles.bodyText}>
                      {checkin.caption || 'Checked in'}
                    </AppText>
                    {checkin.evidenceUrl ? (
                      <AppText variant="caption" style={styles.linkText}>
                        {checkin.evidenceUrl}
                      </AppText>
                    ) : null}
                  </View>
                ))}
              </View>
            )}
          </Card>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    content: {
      gap: 16,
      padding: 16,
      paddingBottom: 120,
    },
    heroCard: {
      gap: 12,
      borderRadius: 28,
      padding: 20,
      backgroundColor: theme.colors.bg.brand,
    },
    heroTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    heroTitle: {
      color: theme.colors.text['on-brand'],
      fontWeight: '800',
    },
    heroMeta: {
      color: theme.colors.text['on-brand'],
      opacity: 0.86,
    },
    card: {
      padding: 16,
      gap: 14,
    },
    messageCard: {
      padding: 12,
    },
    sectionTitle: {
      color: theme.colors.text.primary,
      fontWeight: '800',
    },
    bodyText: {
      color: theme.colors.text.secondary,
      lineHeight: 20,
    },
    resultRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 14,
    },
    resultText: {
      flex: 1,
      gap: 4,
    },
    membersList: {
      gap: 12,
    },
    memberRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    memberText: {
      flex: 1,
      gap: 2,
    },
    memberName: {
      color: theme.colors.text.primary,
      fontWeight: '800',
    },
    memberMeta: {
      color: theme.colors.text.secondary,
    },
    activityCard: {
      gap: 10,
      borderRadius: 18,
      padding: 14,
      backgroundColor: theme.colors.bg['brand-subtle'],
    },
    activityHeader: {
      gap: 4,
    },
    activityName: {
      color: theme.colors.text.primary,
      fontWeight: '800',
    },
    activityStatus: {
      color: theme.colors.text.secondary,
    },
    activityWindow: {
      color: theme.colors.text.secondary,
    },
    actionRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    actionButton: {
      flex: 1,
    },
    feedItem: {
      gap: 4,
      paddingVertical: 10,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border.subtle,
    },
    linkText: {
      color: theme.colors.text.brand,
    },
  });
}
