import type { SessionUser, AuthSession } from './session';

export type BackendAuthResponse = {
  user: BackendUserDto;
  access_token: string;
  refresh_token: string;
};

export type BackendTokenResponse = {
  access_token: string;
  refresh_token: string;
};

export type BackendUserDto = {
  id?: string;
  user_id?: string;
  email?: string | null;
  username?: string | null;
  display_name?: string | null;
  displayName?: string | null;
  avatar_url?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  is_private?: boolean;
  isPrivate?: boolean;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  active_challenges_count?: number;
  current_streak?: number;
  mutual_count?: number;
  relationship?: string;
};

export type FrontendUser = SessionUser & {
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  activeChallengesCount?: number;
  currentStreak?: number;
  mutualCount?: number;
  relationship?: string;
};

export type FrontendProfile = {
  user?: FrontendUser;
  relationship?: string;
  stats?: unknown;
  badges?: unknown[];
  badgesLocked?: unknown[];
  recentActivities?: unknown[];
  latestActivities?: unknown[];
};

export type FrontendChallenge = Record<string, unknown>;
export type FrontendMember = Record<string, unknown>;
export type FrontendCheckin = Record<string, unknown>;
export type FrontendNotification = Record<string, unknown>;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

const snakeToCamelMap: Record<string, string> = {
  access_token: 'accessToken',
  refresh_token: 'refreshToken',
  display_name: 'displayName',
  avatar_url: 'avatarUrl',
  is_private: 'isPrivate',
  is_active: 'isActive',
  created_at: 'createdAt',
  updated_at: 'updatedAt',
  duration_days: 'durationDays',
  frequency_days: 'frequencyDays',
  reset_time: 'resetTime',
  total_hearts: 'totalHearts',
  max_members: 'maxMembers',
  is_ready: 'isReady',
  current_step: 'currentStep',
  unread_count: 'unreadCount',
  total_pages: 'totalPages',
  active_challenges_count: 'activeChallengesCount',
  current_streak: 'currentStreak',
  best_streak: 'bestStreak',
  total_checkins: 'totalCheckins',
  evidence_url: 'evidenceUrl',
  checked_in_at: 'checkedInAt',
  challenges_joined: 'challengesJoined',
  challenges_completed: 'challengesCompleted',
  completion_rate: 'completionRate',
  friends_count: 'friendsCount',
  badges_count: 'badgesCount',
  latest_activities: 'latestActivities',
  recent_activities: 'recentActivities',
  badges_locked: 'badgesLocked',
  member_id: 'memberId',
  challenge_id: 'challengeId',
  user_id: 'userId',
  receiver_id: 'receiverId',
  sender_id: 'senderId',
  my_membership: 'myMembership',
  result_banner: 'resultBanner',
  final_stats: 'finalStats',
  previous_squadmates: 'previousSquadmates',
  gallery_preview: 'galleryPreview',
  recreate_eligible: 'recreateEligible',
  has_child_challenge: 'hasChildChallenge',
  lifetime_stats: 'lifetimeStats',
  pending_overlays: 'pendingOverlays',
  active_challenges: 'activeChallenges',
  unread_notifications: 'unreadNotifications',
  cycle_number: 'cycleNumber',
  reset_at: 'resetAt',
  time_until_reset: 'timeUntilReset',
  squad_status: 'squadStatus',
  hearts_left: 'heartsLeft',
  members_checked_in: 'membersCheckedIn',
  members_total: 'membersTotal',
  elapsed_cycles: 'elapsedCycles',
  top_performer: 'topPerformer',
  member_stats: 'memberStats',
  notification_ids: 'notificationIds',
  mark_all: 'markAll',
  updated_count: 'updatedCount',
};

export function mapKeysToCamel<T = unknown>(value: unknown): T {
  if (Array.isArray(value)) {
    return value.map((entry) => mapKeysToCamel(entry)) as T;
  }

  if (!isPlainObject(value)) {
    return value as T;
  }

  return Object.entries(value).reduce<Record<string, unknown>>((result, [key, entry]) => {
    result[snakeToCamelMap[key] ?? key] = mapKeysToCamel(entry);
    return result;
  }, {}) as T;
}

export function mapUserDto(dto: BackendUserDto | null | undefined): FrontendUser {
  const mapped = mapKeysToCamel<Record<string, unknown>>(dto ?? {});
  return {
    id: String(mapped.id ?? mapped.userId ?? ''),
    email: (mapped.email as string | null | undefined) ?? null,
    username: (mapped.username as string | null | undefined) ?? null,
    displayName: (mapped.displayName as string | null | undefined) ?? null,
    avatarUrl: (mapped.avatarUrl as string | null | undefined) ?? null,
    bio: (mapped.bio as string | null | undefined) ?? null,
    isPrivate: mapped.isPrivate as boolean | undefined,
    isActive: mapped.isActive as boolean | undefined,
    createdAt: mapped.createdAt as string | undefined,
    updatedAt: mapped.updatedAt as string | undefined,
    activeChallengesCount: mapped.activeChallengesCount as number | undefined,
    currentStreak: mapped.currentStreak as number | undefined,
    mutualCount: mapped.mutualCount as number | undefined,
    relationship: mapped.relationship as string | undefined,
  };
}

export function mapAuthSession(response: BackendAuthResponse): AuthSession {
  return {
    user: mapUserDto(response.user),
    accessToken: response.access_token,
    refreshToken: response.refresh_token,
  };
}

export function mapTokenResponse(response: BackendTokenResponse): Pick<AuthSession, 'accessToken' | 'refreshToken'> {
  return {
    accessToken: response.access_token,
    refreshToken: response.refresh_token,
  };
}

export function mapProfileDto<T = FrontendProfile>(dto: unknown): T {
  const mapped = mapKeysToCamel<Record<string, unknown>>(dto);
  if (mapped.user) {
    mapped.user = mapUserDto(mapped.user as BackendUserDto);
  }
  return mapped as T;
}

export function mapChallengeDto<T = FrontendChallenge>(dto: unknown): T {
  return mapKeysToCamel<T>(dto);
}

export function mapMemberDto<T = FrontendMember>(dto: unknown): T {
  return mapKeysToCamel<T>(dto);
}

export function mapCheckinDto<T = FrontendCheckin>(dto: unknown): T {
  return mapKeysToCamel<T>(dto);
}

export function mapNotificationDto<T = FrontendNotification>(dto: unknown): T {
  return mapKeysToCamel<T>(dto);
}

export function mapPaginationDto<T = Record<string, unknown>>(dto: unknown): T {
  return mapKeysToCamel<T>(dto);
}
