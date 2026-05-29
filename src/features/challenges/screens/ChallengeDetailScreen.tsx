import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, TextInput, View, Image } from 'react-native';
import { AppText, Badge, Button, Card, Screen } from '@ds/components';
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
import { ApiError, session, getApiBaseUrl } from '@services/api';
import { useGetChallengeQuery, useGetChallengeStatsQuery, useAcceptInviteMutation, useDeclineInviteMutation, useSetReadyMutation, useLeaveChallengeMutation, useCancelChallengeMutation, useInviteUsersMutation } from '@store/api/challengeApi';
import { useGetTodayStatusQuery, useListCheckinsQuery, useNudgeMemberMutation } from '@store/api/checkinApi';
import { useGetFriendsQuery } from '@store/api/friendApi';
import { useAppSelector } from '@store/hooks';
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

type FeedbackTone = 'success' | 'error' | 'warning' | 'info';

type InlineFeedbackMessage = {
  type: FeedbackTone;
  message: string;
};

type SlapButtonState = {
  shouldShow: boolean;
  title: string;
  disabled: boolean;
  loading: boolean;
  variant: 'primary' | 'secondary' | 'ghost';
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
  currentCheckin?: CheckinItem;
};

type CheckinItem = {
  id: string;
  userId?: string;
  cycleNumber?: number;
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
  maxMembers: number;
  currentCycleText?: string;
  timeUntilResetText?: string;
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

function booleanLikeValue(value: unknown): boolean | undefined {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') {
    if (value === 1) return true;
    if (value === 0) return false;
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes'].includes(normalized)) return true;
    if (['false', '0', 'no'].includes(normalized)) return false;
  }
  return undefined;
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
  const status = String(raw.status ?? '').toLowerCase();
  if (status === 'checked_in' || status === 'done' || status === 'completed') return true;
  if (status === 'pending' || status === 'not_checked_in') return false;

  const explicitValue = booleanLikeValue(
    raw.checkedIn ??
    raw.checked_in ??
    raw.hasCheckedIn ??
    raw.has_checked_in,
  );
  if (explicitValue !== undefined) return explicitValue;

  return Boolean(
    stringValue(raw.checkedInAt ?? raw.checked_in_at) ??
    stringValue(raw.checkinId ?? raw.checkin_id),
  );
}

function mapMember(
  raw: BackendRecord,
  todayMembers: BackendRecord[],
  currentCycleCheckins: CheckinItem[],
): DetailMember {
  const user = (raw.user ?? {}) as BackendRecord;
  const memberId = stringValue(raw.id ?? raw.memberId ?? raw.member_id);
  const userId = stringValue(raw.userId ?? raw.user_id ?? user.id);
  const today = todayMembers.find((entry) => {
    const todayUserId = stringValue(entry.userId ?? entry.user_id);
    const todayMemberId = stringValue(entry.memberId ?? entry.member_id ?? entry.id);
    return Boolean(userId && todayUserId === userId) || Boolean(memberId && todayMemberId === memberId);
  });

  return {
    id: String(memberId ?? userId ?? ''),
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
    currentCheckin: currentCycleCheckins.find((checkin) => checkin.userId === userId),
  };
}

function mapCheckin(raw: BackendRecord): CheckinItem {
  const user = (raw.user ?? raw.member ?? {}) as BackendRecord;
  return {
    id: String(raw.id ?? raw.checkinId ?? raw.checkin_id ?? ''),
    userId: stringValue(raw.userId ?? raw.user_id ?? user.id),
    cycleNumber: numberValue(raw.cycleNumber ?? raw.cycle_number),
    caption: stringValue(raw.caption),
    evidenceUrl: stringValue(raw.evidenceUrl ?? raw.evidence_url),
    createdAt: stringValue(raw.createdAt ?? raw.created_at ?? raw.checkedInAt ?? raw.checked_in_at),
    memberName:
      stringValue(raw.memberName ?? raw.member_name) ??
      stringValue(raw.displayName ?? raw.display_name ?? raw.username) ??
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
  const currentCycleCheckins = checkins
    .map(mapCheckin)
    .filter((item) => item.id && item.cycleNumber === todayStatus?.cycleNumber);
  const members = (detail.members ?? []).map((member) =>
    mapMember(member, todayMembers, currentCycleCheckins),
  );
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
    maxMembers: numberValue(challenge.maxMembers ?? challenge.max_members) ?? 10,
    currentCycleText:
      todayStatus?.cycleNumber != null
        ? `Cycle ${todayStatus.cycleNumber}`
        : stats?.elapsedCycles != null
          ? `Cycle ${stats.elapsedCycles}`
          : undefined,
    timeUntilResetText:
      todayStatus?.timeUntilReset != null
        ? formatDuration(todayStatus.timeUntilReset)
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

function formatDuration(totalSeconds: number): string {
  const clamped = Math.max(0, totalSeconds);
  const hours = Math.floor(clamped / 3600);
  const minutes = Math.floor((clamped % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const lowerMessage = error.message.toLowerCase();
    if (error.status === 400 && lowerMessage.includes('yourself')) return 'You cannot slap yourself.';
    if (error.status === 400 && lowerMessage.includes('already checked in')) return 'That member already checked in.';
    if (error.status === 409) return error.message;
    if (error.status === 403) return 'You do not have access to this challenge.';
    if (error.status === 429) return 'Already nudged this member today.';
    if (error.status === 404) return 'Challenge not found.';
    return error.message;
  }
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null) {
    const record = error as { status?: unknown; error?: unknown; data?: unknown };
    const data = record.data as { message?: unknown } | undefined;
    const message =
      typeof data?.message === 'string'
        ? data.message
        : typeof record.error === 'string'
          ? record.error
          : undefined;

    if (record.status === 400 && message?.toLowerCase().includes('yourself')) return 'You cannot slap yourself.';
    if (record.status === 400 && message?.toLowerCase().includes('already checked in')) return 'That member already checked in.';
    if (record.status === 409 && message) return message;
    if (record.status === 403) return 'You do not have access to this challenge.';
    if (record.status === 429) return 'Already nudged this member today.';
    if (record.status === 404) return 'Challenge not found.';
    if (message) return message;
  }
  return 'Could not load challenge.';
}

function getMemberStatus(member: DetailMember, isActive: boolean): {
  label: string;
  tone: FeedbackTone | 'neutral';
} {
  const status = String(member.status ?? '').toLowerCase();

  if (isActive) {
    if (member.checkedInToday === true) return { label: 'DONE', tone: 'success' };
    if (member.checkedInToday === false) return { label: 'PENDING', tone: 'warning' };
    return { label: 'UNKNOWN', tone: 'info' };
  }

  if (status === 'accepted') {
    if (member.isReady === true) return { label: 'READY', tone: 'success' };
    if (member.isReady === false) return { label: 'NOT READY', tone: 'warning' };
    return { label: 'ACCEPTED', tone: 'info' };
  }

  if (status === 'pending') return { label: 'INVITED', tone: 'warning' };
  if (status === 'declined') return { label: 'DECLINED', tone: 'neutral' };
  return { label: status ? status.toUpperCase() : 'MEMBER', tone: 'neutral' };
}

function getBadgeVariant(tone: FeedbackTone | 'neutral'): 'neutral' | 'success' | 'warning' | 'danger' | 'info' {
  if (tone === 'error') return 'danger';
  if (tone === 'neutral') return 'neutral';
  return tone;
}

function StatusPill({
  label,
  tone,
  testID,
}: {
  label: string;
  tone: FeedbackTone | 'neutral';
  testID?: string;
}) {
  return (
    <Badge variant={getBadgeVariant(tone)} size="sm" testID={testID}>
      {label}
    </Badge>
  );
}

function InlineFeedback({
  feedback,
  testID,
}: {
  feedback?: InlineFeedbackMessage | null;
  testID?: string;
}) {
  const theme = useTheme();
  const styles = createStyles(theme);

  if (!feedback) return null;

  return (
    <View
      style={[
        styles.inlineFeedback,
        feedback.type === 'success' && styles.inlineFeedbackSuccess,
        feedback.type === 'error' && styles.inlineFeedbackError,
        feedback.type === 'warning' && styles.inlineFeedbackWarning,
        feedback.type === 'info' && styles.inlineFeedbackInfo,
      ]}
      testID={testID}
    >
      <AppText
        variant="caption"
        style={[
          styles.inlineFeedbackText,
          feedback.type === 'success' && styles.successText,
          feedback.type === 'error' && styles.errorText,
          feedback.type === 'warning' && styles.warningText,
          feedback.type === 'info' && styles.infoText,
        ]}
      >
        {feedback.message}
      </AppText>
    </View>
  );
}

export function ChallengeDetailScreen({
  challengeId,
  onBack,
  onCheckIn,
}: ChallengeDetailScreenProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const currentUserId = useAppSelector((state) => state.auth.user?.id ?? null);

  // ── RTK Query data fetching ─────────────────────────────────
  const hasId = Boolean(challengeId);
  const { data: detailData, isLoading: detailLoading, error: detailError, refetch: refetchDetail } =
    useGetChallengeQuery(challengeId!, { skip: !hasId });
  const { data: todayData } = useGetTodayStatusQuery(challengeId!, { skip: !hasId });
  const { data: statsData } = useGetChallengeStatsQuery(challengeId!, { skip: !hasId });
  const { data: checkinsData } = useListCheckinsQuery(
    { challengeId: challengeId!, params: { limit: 30 } },
    { skip: !hasId },
  );
  const { data: friendsData } = useGetFriendsQuery();

  // ── RTK Query mutations ────────────────────────────────────
  const [acceptInviteMut] = useAcceptInviteMutation();
  const [declineInviteMut] = useDeclineInviteMutation();
  const [setReadyMut] = useSetReadyMutation();
  const [leaveMut] = useLeaveChallengeMutation();
  const [cancelMut] = useCancelChallengeMutation();
  const [inviteUsersMut] = useInviteUsersMutation();
  const [nudgeMemberMut] = useNudgeMemberMutation();

  // ── Derive composed state from RTK Query cache ─────────────
  const challenge = useMemo<LoadedDetail | null>(() => {
    if (!detailData) return null;
    const detail = detailData as DetailResponse;
    const todayStatus = todayData as TodayStatus | undefined;
    const stats = statsData as StatsResponse | undefined;
    const checkins = (checkinsData as CheckinsResponse | undefined)?.checkins ?? [];
    return mapLoadedDetail(detail, todayStatus, stats, checkins);
  }, [detailData, todayData, statsData, checkinsData]);

  const friends = useMemo(() => (friendsData as FriendUser[] | undefined) ?? [], [friendsData]);
  const isLoading = detailLoading;
  const error = detailError ? getErrorMessage((detailError as { data?: unknown })?.data ?? detailError) : null;

  // Alias refetchDetail as loadChallenge for backward compat with mutation callbacks
  const loadChallenge = refetchDetail;

  const [isInviteModalVisible, setInviteModalVisible] = useState(false);
  const [inviteSearch, setInviteSearch] = useState('');
  const [selectedInviteIds, setSelectedInviteIds] = useState<string[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [inviteFeedback, setInviteFeedback] = useState<InlineFeedbackMessage | null>(null);
  const [slapLoadingMemberId, setSlapLoadingMemberId] = useState<string | null>(null);
  const [slappedMemberIds, setSlappedMemberIds] = useState<Record<string, boolean>>({});
  const [slapErrorByMemberId, setSlapErrorByMemberId] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    setInviteFeedback(null);
    setSlapLoadingMemberId(null);
    setSlappedMemberIds({});
    setSlapErrorByMemberId({});
  }, [challengeId]);

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
    () =>
      challenge?.members.filter(
        (member) =>
          member.status === 'accepted' &&
          member.checkedInToday === false &&
          member.userId !== currentUserId,
      ) ?? [],
    [challenge?.members, currentUserId],
  );

  const nonDeclinedMembers = useMemo(
    () => challenge?.members.filter((member) => member.status !== 'declined') ?? [],
    [challenge?.members],
  );
  const remainingSlots = challenge
    ? Math.max(0, challenge.maxMembers - nonDeclinedMembers.length)
    : 0;
  const canInviteMore = Boolean(isFormation && isAcceptedMember && remainingSlots > 0);
  const currentUserToday = useMemo(
    () => challenge?.members.find((member) => member.userId === currentUserId),
    [challenge?.members, currentUserId],
  );
  const shouldShowCheckIn = Boolean(isActive && isAcceptedMember && currentUserToday?.checkedInToday === false);
  const acceptedMembers = useMemo(
    () =>
      challenge?.members.filter((member) => String(member.status ?? '').toLowerCase() === 'accepted') ?? [],
    [challenge?.members],
  );
  const checkedInMembersCount = useMemo(
    () => acceptedMembers.filter((member) => member.checkedInToday === true).length,
    [acceptedMembers],
  );
  const teamProgressText = isActive
    ? `${checkedInMembersCount}/${acceptedMembers.length} checked in`
    : `${nonDeclinedMembers.length}/${challenge?.maxMembers ?? 0} members`;
  const todayActionTitle = isActive
    ? shouldShowCheckIn
      ? 'Your proof is due'
      : currentUserToday?.checkedInToday
        ? 'You are done for this cycle'
        : 'Check-in is not available'
    : isFormation
      ? 'Get the squad ready'
      : 'Challenge result';
  const todayActionHelper = isActive
    ? shouldShowCheckIn
      ? 'Take a proof photo before reset to keep your streak alive.'
      : currentUserToday?.checkedInToday
        ? 'Your proof is submitted. Help the squad by reminding pending members.'
        : isAcceptedMember
          ? 'Your check-in status is unavailable for this cycle.'
          : 'Only accepted members can check in.'
    : isFormation
      ? isPendingInvite
        ? 'Accept the invite to join this challenge.'
        : isAcceptedMember
          ? 'Set your ready state and invite friends before the challenge starts.'
          : 'Waiting for accepted members to get ready.'
      : challenge?.status === 'success'
        ? 'The squad completed this challenge.'
        : challenge?.status === 'game-over'
        ? 'The squad ran out of hearts.'
        : 'This challenge is no longer active.';
  const getSlapButtonState = useCallback(
    (member: DetailMember): SlapButtonState => {
      const isCurrentUser = Boolean(currentUserId && member.userId === currentUserId);
      const isAccepted = String(member.status ?? '').toLowerCase() === 'accepted';
      const loading = slapLoadingMemberId === member.id;

      if (!isActive || !isAccepted || isCurrentUser) {
        return {
          shouldShow: false,
          title: 'Slap',
          disabled: true,
          loading: false,
          variant: 'secondary',
        };
      }

      if (loading) {
        return {
          shouldShow: true,
          title: 'Sending...',
          disabled: true,
          loading: true,
          variant: 'secondary',
        };
      }

      if (member.checkedInToday === true) {
        return {
          shouldShow: true,
          title: 'Done',
          disabled: true,
          loading: false,
          variant: 'ghost',
        };
      }

      if (slappedMemberIds[member.id]) {
        return {
          shouldShow: true,
          title: 'Sent',
          disabled: true,
          loading: false,
          variant: 'ghost',
        };
      }

      if (member.checkedInToday === false) {
        return {
          shouldShow: true,
          title: 'Slap',
          disabled: false,
          loading: false,
          variant: 'secondary',
        };
      }

      return {
        shouldShow: true,
        title: 'N/A',
        disabled: true,
        loading: false,
        variant: 'ghost',
      };
    },
    [currentUserId, isActive, slapLoadingMemberId, slappedMemberIds],
  );

  const existingUserIds = useMemo(
    () => new Set(challenge?.members.map((member) => member.userId).filter(Boolean) ?? []),
    [challenge?.members],
  );
  const filteredFriends = useMemo(() => {
    const query = inviteSearch.trim().toLowerCase();
    return friends.filter((friend) => {
      if (!query) return true;
      return (
        friend.displayName.toLowerCase().includes(query) ||
        friend.username.toLowerCase().includes(query)
      );
    });
  }, [friends, inviteSearch]);

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

  const openInviteModal = () => {
    setSelectedInviteIds([]);
    setInviteSearch('');
    setInviteFeedback(null);
    setInviteModalVisible(true);
  };

  const toggleInviteSelection = (friendId: string) => {
    if (existingUserIds.has(friendId)) return;
    setInviteFeedback(null);
    setSelectedInviteIds((current) => {
      if (current.includes(friendId)) {
        return current.filter((id) => id !== friendId);
      }
      if (current.length >= remainingSlots) return current;
      return [...current, friendId];
    });
  };

  const submitInvites = async () => {
    if (!challenge) return;
    if (selectedInviteIds.length === 0) {
      setInviteFeedback({ type: 'error', message: 'Select at least one friend to invite.' });
      return;
    }
    if (selectedInviteIds.length > remainingSlots) {
      setInviteFeedback({
        type: 'warning',
        message: `Only ${remainingSlots} slot${remainingSlots === 1 ? '' : 's'} remaining.`,
      });
      return;
    }

    setIsMutating(true);
    setActionMessage(null);
    setInviteFeedback(null);

    try {
      await inviteUsersMut({ challengeId: challenge.id, userIds: selectedInviteIds }).unwrap();
      setActionMessage(`${selectedInviteIds.length} invite${selectedInviteIds.length === 1 ? '' : 's'} sent.`);
      setInviteModalVisible(false);
      setSelectedInviteIds([]);
      setInviteSearch('');
      // RTK Query auto-refetches via tag invalidation
    } catch (inviteError) {
      setInviteFeedback({ type: 'error', message: getErrorMessage(inviteError) });
    } finally {
      setIsMutating(false);
    }
  };

  const nudgeMember = async (member: DetailMember) => {
    if (!challenge) return;

    setSlapErrorByMemberId((current) => ({
      ...current,
      [member.id]: undefined,
    }));
    setSlapLoadingMemberId(member.id);

    try {
      await nudgeMemberMut({ challengeId: challenge.id, memberId: member.userId ?? member.id }).unwrap();
      setSlappedMemberIds((current) => ({
        ...current,
        [member.id]: true,
      }));
    } catch (nudgeError) {
      setSlapErrorByMemberId((current) => ({
        ...current,
        [member.id]: getErrorMessage(nudgeError),
      }));
    } finally {
      setSlapLoadingMemberId(null);
    }
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

        <Card style={styles.primaryActionCard} testID="challenge-primary-action-card">
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderText}>
              <AppText variant="caption" style={styles.sectionEyebrow}>
                What you need to do now
              </AppText>
              <AppText variant="subtitle" style={styles.sectionTitle}>
                {todayActionTitle}
              </AppText>
            </View>
            <StatusPill
              label={isActive ? (currentUserToday?.checkedInToday ? 'DONE' : 'DUE') : challenge.statusLabel.toUpperCase()}
              tone={isActive ? (currentUserToday?.checkedInToday ? 'success' : 'warning') : isHistory ? 'info' : 'neutral'}
            />
          </View>

          <AppText variant="body" style={styles.bodyText}>
            {todayActionHelper}
          </AppText>

          {isActive ? (
            <>
              <InlineFeedback
                feedback={{
                  type: 'info',
                  message: 'Slap is only a reminder; it does not reduce hearts.',
                }}
              />
              {shouldShowCheckIn ? (
                <Button
                  title="My Check-in"
                  variant="primary"
                  size="md"
                  fullWidth
                  onPress={() => onCheckIn?.(challenge.id)}
                  accessibilityLabel="Open camera to submit my check-in proof"
                  testID="my-check-in-button"
                />
              ) : null}
            </>
          ) : null}

          {isFormation ? (
            <View style={styles.actionStack}>
              {isPendingInvite ? (
                <View style={styles.actionRow}>
                  <Button
                    title="Accept Invite"
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
                </View>
              ) : null}

              {isAcceptedMember ? (
                <Button
                  title={myReady ? 'Set not ready' : 'Set ready'}
                  variant="primary"
                  size="md"
                  fullWidth
                  loading={isMutating}
                  onPress={() => void runMutation(() => challengesService.setReady(challenge.id, !myReady))}
                />
              ) : null}

              {canInviteMore ? (
                <Button
                  title="Invite Friends"
                  variant="secondary"
                  size="md"
                  fullWidth
                  disabled={isMutating}
                  onPress={openInviteModal}
                  testID="invite-friends-button"
                />
              ) : (
                <InlineFeedback
                  feedback={{
                    type: 'info',
                    message: remainingSlots === 0 ? 'This challenge is full.' : 'Invite is not available right now.',
                  }}
                />
              )}
            </View>
          ) : null}

          {isHistory ? (
            <View style={styles.resultRow}>
              {challenge.status === 'success' ? (
                <CupIcon size={28} color={theme.colors.text.success} variant="bold" />
              ) : challenge.status === 'game-over' ? (
                <MedalStarIcon size={28} color={theme.colors.text.error} variant="outline" />
              ) : null}
              <View style={styles.resultText}>
                <AppText variant="caption" style={styles.bodyText}>
                  {challenge.status === 'success'
                    ? 'Great job keeping the squad accountable.'
                    : challenge.status === 'game-over'
                      ? 'Better luck next time.'
                      : 'This challenge was cancelled before completion.'}
                </AppText>
              </View>
            </View>
          ) : null}
        </Card>

        <Card style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderText}>
              <AppText variant="subtitle" style={styles.sectionTitle}>
                Team progress
              </AppText>
              <AppText variant="caption" style={styles.bodyText}>
                {teamProgressText}
              </AppText>
            </View>
            <StatusPill label={isActive ? 'TODAY' : isFormation ? 'FORMATION' : 'FINAL'} tone="info" />
          </View>
          <View style={styles.currentStepGrid}>
            <View style={styles.currentStepMetric}>
              <AppText variant="caption" style={styles.memberMeta}>
                Cycle
              </AppText>
              <AppText variant="subtitle" style={styles.memberName}>
                {challenge.currentCycleText ?? (isFormation ? 'Not started' : 'Final')}
              </AppText>
            </View>
            <View style={styles.currentStepMetric}>
              <AppText variant="caption" style={styles.memberMeta}>
                Reset
              </AppText>
              <AppText variant="subtitle" style={styles.memberName}>
                {isActive ? challenge.timeUntilResetText ?? challenge.resetTimeText : challenge.resetTimeText}
              </AppText>
            </View>
            <View style={styles.currentStepMetric}>
              <AppText variant="caption" style={styles.memberMeta}>
                Members
              </AppText>
              <AppText variant="subtitle" style={styles.memberName}>
                {teamProgressText}
              </AppText>
            </View>
          </View>
          <View style={styles.legendRow}>
            <StatusPill label="DONE" tone="success" />
            <StatusPill label="PENDING" tone="warning" />
            <StatusPill label="UNKNOWN" tone="info" />
          </View>
        </Card>

        <Card style={styles.card} testID="challenge-members-card">
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderText}>
              <AppText variant="subtitle" style={styles.sectionTitle}>
                Members
              </AppText>
              <AppText variant="caption" style={styles.bodyText}>
                You can only slap members who have not checked in for the current cycle.
              </AppText>
            </View>
          </View>

          <View style={styles.membersList}>
            {challenge.members.map((member) => {
              const memberStatus = getMemberStatus(member, isActive);
              const slapButtonState = getSlapButtonState(member);
              const slapError = slapErrorByMemberId[member.id];

              return (
                <View key={member.id} style={styles.memberItem}>
                  <View style={styles.memberRow}>
                    <Avatar name={member.displayName} avatarUrl={member.avatarUrl} size={44} />

                    <View style={styles.memberText}>
                      <View style={styles.memberTitleRow}>
                        <AppText variant="subtitle" style={styles.memberName}>
                          {member.displayName}
                        </AppText>
                        <StatusPill
                          label={memberStatus.label}
                          tone={memberStatus.tone}
                          testID={`member-status-${member.id}`}
                        />
                      </View>

                      <AppText variant="caption" style={styles.memberMeta}>
                        @{member.username} · {member.role === 'host' ? 'Host' : 'Member'}
                        {member.status ? ` · ${member.status}` : ''}
                      </AppText>

                      {isFormation && member.isReady != null ? (
                        <AppText variant="caption" style={styles.bodyText}>
                          {member.isReady ? 'Ready for launch.' : 'Not ready yet.'}
                        </AppText>
                      ) : null}

                      {isActive && member.checkedInToday && member.currentCheckin?.caption ? (
                        <AppText variant="caption" style={styles.bodyText}>
                          {member.currentCheckin.caption}
                        </AppText>
                      ) : null}

                      {isActive && member.checkedInToday && member.currentCheckin?.evidenceUrl ? (
                        <EvidenceImage
                          evidenceUrl={member.currentCheckin.evidenceUrl}
                          variant="thumbnail"
                          testID={`member-proof-${member.id}`}
                        />
                      ) : null}
                    </View>

                    {slapButtonState.shouldShow ? (
                      <View style={styles.slapAction}>
                        <Button
                          title={slapButtonState.title}
                          variant={slapButtonState.variant}
                          size="sm"
                          disabled={slapButtonState.disabled}
                          loading={slapButtonState.loading}
                          onPress={() => void nudgeMember(member)}
                          testID={`slap-${member.id}`}
                        />
                      </View>
                    ) : null}
                  </View>

                  {slapError ? (
                    <AppText
                      variant="caption"
                      style={styles.slapError}
                      testID={`slap-error-${member.id}`}
                    >
                      {slapError}
                    </AppText>
                  ) : null}
                </View>
              );
            })}
          </View>
        </Card>

        {isActive || isFormation ? (
          <Card style={styles.card}>
            <AppText variant="subtitle" style={styles.sectionTitle}>
              Manage challenge
            </AppText>

            {isActive && challenge.statsText ? (
              <AppText variant="caption" style={styles.bodyText}>
                {challenge.statsText}
              </AppText>
            ) : null}

            {isActive ? (
              <View style={styles.actionRow}>
                <Button
                  title={showGallery ? 'Hide Gallery' : 'View Gallery'}
                  variant="secondary"
                  size="sm"
                  onPress={() => setShowGallery((value) => !value)}
                />

                <Button title="View Previous Steps" variant="ghost" size="sm" disabled />

                <Button title="View History" variant="ghost" size="sm" disabled />
              </View>
            ) : null}

            {isFormation ? (
              <View style={styles.actionRow}>
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
                    variant="danger"
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
            ) : null}

            {isActive && isHost ? (
              <View style={styles.destructiveSection}>
                <Button
                  title="Cancel challenge"
                  variant="danger"
                  size="sm"
                  disabled={isMutating}
                  onPress={() =>
                    confirmDestructive('Cancel', 'Cancel this active challenge?', () =>
                      challengesService.cancelChallenge(challenge.id),
                    )
                  }
                />
              </View>
            ) : null}
          </Card>
        ) : null}

        {!isFormation && (isHistory || showGallery) ? (
          <Card style={styles.card}>
            <AppText variant="subtitle" style={styles.sectionTitle}>
              {isHistory ? 'Evidence feed' : 'Gallery'}
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
                      <EvidenceImage
                        evidenceUrl={checkin.evidenceUrl}
                        testID={`checkin-proof-${checkin.id}`}
                      />
                    ) : null}
                  </View>
                ))}
              </View>
            )}
          </Card>
        ) : null}
      </ScrollView>

      <Modal
        visible={isInviteModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setInviteModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalPanel}>
            <View style={styles.modalHeader}>
              <View>
                <AppText variant="subtitle" style={styles.sectionTitle}>
                  Invite friends
                </AppText>
                <AppText variant="caption" style={styles.bodyText}>
                  {remainingSlots} slot{remainingSlots === 1 ? '' : 's'} remaining
                </AppText>
                {remainingSlots === 0 ? (
                  <InlineFeedback
                    feedback={{ type: 'warning', message: 'No invite slots are available.' }}
                  />
                ) : null}
              </View>
              <Button
                title="Close"
                variant="ghost"
                size="sm"
                onPress={() => setInviteModalVisible(false)}
              />
            </View>

            <TextInput
              value={inviteSearch}
              onChangeText={setInviteSearch}
              placeholder="Search friends"
              placeholderTextColor={theme.colors.text.tertiary}
              style={styles.searchInput}
            />

            <ScrollView style={styles.inviteList} keyboardShouldPersistTaps="handled">
              {filteredFriends.length === 0 ? (
                <AppText variant="body" style={styles.bodyText}>
                  No friends found.
                </AppText>
              ) : (
                filteredFriends.map((friend) => {
                  const disabled = existingUserIds.has(friend.id);
                  const selected = selectedInviteIds.includes(friend.id);
                  return (
                    <Pressable
                      key={friend.id}
                      disabled={disabled}
                      onPress={() => toggleInviteSelection(friend.id)}
                      style={[
                        styles.inviteFriendRow,
                        selected && styles.inviteFriendSelected,
                        disabled && styles.inviteFriendDisabled,
                      ]}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: selected, disabled }}
                    >
                      <Avatar name={friend.displayName} avatarUrl={friend.avatarUrl} size={36} />
                      <View style={styles.memberText}>
                        <AppText variant="subtitle" style={styles.memberName}>
                          {friend.displayName}
                        </AppText>
                        <AppText variant="caption" style={styles.memberMeta}>
                          @{friend.username}
                          {disabled ? ' · already invited/member' : selected ? ' · selected' : ''}
                        </AppText>
                      </View>
                    </Pressable>
                  );
                })
              )}
            </ScrollView>

            <InlineFeedback feedback={inviteFeedback} testID="invite-feedback" />

            <Button
              title={`Invite Selected (${selectedInviteIds.length})`}
              variant="primary"
              size="md"
              fullWidth
              disabled={isMutating || remainingSlots === 0}
              loading={isMutating}
              onPress={() => void submitInvites()}
            />
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

function getRenderableEvidenceUrl(evidenceUrl?: string | null): string | undefined {
  if (!evidenceUrl) {
    return undefined;
  }

  const apiBaseUrl = getApiBaseUrl();
  const uploadBaseUrl = apiBaseUrl.replace(/\/api\/?$/, '');
  const trimmedUrl = evidenceUrl.trim();

  if (!trimmedUrl) {
    return undefined;
  }

  if (trimmedUrl.startsWith('/')) {
    return `${uploadBaseUrl}${trimmedUrl}`;
  }

  if (!/^https?:\/\//i.test(trimmedUrl) && !/^file:\/\//i.test(trimmedUrl)) {
    return `${uploadBaseUrl}/${trimmedUrl.replace(/^\/+/, '')}`;
  }

  try {
    const parsedUrl = new URL(trimmedUrl);

    const isLocalHost =
      parsedUrl.hostname === 'localhost' ||
      parsedUrl.hostname === '127.0.0.1' ||
      parsedUrl.hostname === '0.0.0.0';

    if (isLocalHost) {
      return `${uploadBaseUrl}${parsedUrl.pathname}${parsedUrl.search}`;
    }
    return trimmedUrl;
  } catch {
    return `${uploadBaseUrl}/${trimmedUrl.replace(/^\/+/, '')}`;
  }
}

function EvidenceImage({
  evidenceUrl,
  variant = 'large',
  testID,
}: {
  evidenceUrl?: string | null;
  variant?: 'thumbnail' | 'large';
  testID?: string;
}) {
  const renderableUrl = getRenderableEvidenceUrl(evidenceUrl);
  const theme = useTheme();
  const styles = createStyles(theme);

  if (!renderableUrl) {
    return null;
  }

  return (
    <Image
      source={{ uri: renderableUrl }}
      style={variant === 'thumbnail' ? styles.proofThumbnail : styles.proofImage}
      resizeMode="cover"
      testID={testID}
    />
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
    primaryActionCard: {
      padding: 18,
      gap: 14,
      borderWidth: 1,
      // borderColor: theme.colors.border.brand,
      backgroundColor: theme.colors.bg['brand-subtle'],
      borderRadius: theme.components.card.common.radius
    },
    messageCard: {
      padding: 12,
      borderWidth: 1,
      borderColor: theme.colors.border.success,
      backgroundColor: theme.colors.bg['success-subtle'],
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12,
    },
    sectionHeaderText: {
      flex: 1,
      gap: 4,
    },
    sectionEyebrow: {
      color: theme.colors.text.brand,
      fontWeight: '800',
      textTransform: 'uppercase',
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
    memberItem: {
      gap: 12,
      paddingVertical: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border.subtle,
    },
    memberRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },
    memberText: {
      flex: 1,
      gap: 2,
    },
    memberTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      flexWrap: 'wrap',
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
    actionStack: {
      gap: 10,
    },
    actionButton: {
      flex: 1,
    },
    currentStepGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    currentStepMetric: {
      flex: 1,
      minWidth: 96,
      borderRadius: 14,
      padding: 12,
      backgroundColor: theme.colors.bg['brand-subtle'],
      gap: 4,
    },
    legendRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
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
    slapAction: {
      alignItems: 'flex-end',
      minWidth: 82,
    },
    slapError: {
      alignSelf: 'flex-end',
      maxWidth: 180,
      color: theme.colors.text.error,
      textAlign: 'right',
      lineHeight: 18,
    },
    inlineFeedback: {
      width: '100%',
      borderRadius: 12,
      borderWidth: 1,
      paddingVertical: 8,
      paddingHorizontal: 10,
    },
    inlineFeedbackSuccess: {
      borderColor: theme.colors.border.success,
      backgroundColor: theme.colors.bg['success-subtle'],
    },
    inlineFeedbackError: {
      borderColor: theme.colors.border.error,
      backgroundColor: theme.colors.bg['error-subtle'],
    },
    inlineFeedbackWarning: {
      borderColor: theme.colors.border.warning,
      backgroundColor: theme.colors.bg['warning-subtle'],
    },
    inlineFeedbackInfo: {
      borderColor: theme.colors.border.info,
      backgroundColor: theme.colors.bg['info-subtle'],
    },
    inlineFeedbackText: {
      lineHeight: 18,
    },
    successText: {
      color: theme.colors.text.success,
    },
    errorText: {
      color: theme.colors.text.error,
    },
    warningText: {
      color: theme.colors.text.warning,
    },
    infoText: {
      color: theme.colors.text.info,
    },
    destructiveSection: {
      paddingTop: 10,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.border.subtle,
      alignItems: 'flex-start',
    },
    modalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.35)',
      justifyContent: 'flex-end',
    },
    modalPanel: {
      maxHeight: '82%',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      gap: 14,
      backgroundColor: theme.colors.bg.surface,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12,
    },
    searchInput: {
      minHeight: 46,
      borderWidth: 1,
      borderColor: theme.colors.border.subtle,
      borderRadius: theme.radius.md,
      paddingHorizontal: 14,
      color: theme.colors.text.primary,
      backgroundColor: theme.colors.bg['surface-elevated'],
      fontSize: 16,
    },
    inviteList: {
      maxHeight: 360,
    },
    inviteFriendRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 10,
      paddingHorizontal: 4,
      borderRadius: 12,
    },
    inviteFriendSelected: {
      backgroundColor: theme.colors.bg['brand-subtle'],
    },
    inviteFriendDisabled: {
      opacity: 0.45,
    },
    proofThumbnail: {
      width: 120,
      height: 120,
      marginTop: theme.spacing[8],
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.bg['page-subtle'],
    },
    proofImage: {
      width: '100%',
      height: 220,
      marginTop: theme.spacing[8],
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.bg['page-subtle'],
    },
  });
}
