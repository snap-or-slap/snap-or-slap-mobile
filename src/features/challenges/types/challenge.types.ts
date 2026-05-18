export type ChallengeSegment = 'formation' | 'active' | 'history';

export type ActiveRiskStatus = 'on-track' | 'danger';

export type HistoryResultStatus = 'success' | 'game-over' | 'cancelled';

export type ChallengeStatusTone =
  | 'active'
  | 'formation'
  | 'invited'
  | 'on-track'
  | 'danger'
  | 'success'
  | 'game-over'
  | 'cancelled';

// Unified ChallengeStatus for new unified type
export type ChallengeStatus =
  | 'FORMATION'
  | 'INVITED'
  | 'ACTIVE'
  | 'FINISHED'
  | 'GAME_OVER'
  | 'CANCELLED';

export type ChallengeMemberStatus =
  | 'PENDING'
  | 'DONE'
  | 'REJECTED'
  | 'JOINED'
  | 'INVITED'
  | 'DECLINED'
  | 'LEFT';

export type HeartBadgeVariant = 'filled' | 'outline';

export type HeartBadgeTone = 'brand' | 'danger' | 'muted';

// --- Unified UI model for list items ---
export type ChallengeListItem = {
  id: string;
  title: string;
  status: ChallengeStatus;
  description?: string;
  taskInstruction?: string;
  heartsLeft?: number;
  totalHearts?: number;
  resetTime?: string;
  startDate?: string;
  endDate?: string;
  stepLengthDays?: number;
  minMembers?: number;
  memberCount?: number;
  joinedCount?: number;
  invitedCount?: number;
  hostName?: string;
  currentStepLabel?: string;
  progressLabel?: string;
  isInvite?: boolean;
  members?: ChallengeMember[];
};

export type ChallengeMember = {
  id: string;
  name: string;
  username?: string;
  avatarUrl?: string;
  status: ChallengeMemberStatus;
  isCurrentUser?: boolean;
};

// --- Legacy types (kept for backward compat with existing cards/mock) ---
export interface ActiveChallengeItem {
  id: string;
  type: 'active';
  title: string;
  heartsText: string;
  resetTimeText: string;
  stepText: string;
  riskStatus: ActiveRiskStatus;
}

export interface FormationChallengeItem {
  id: string;
  type: 'formation';
  title: string;
  heartsText: string;
  durationText: string;
  loopEveryText: string;
  startDateText: string;
  resetAtText: string;
  joinedText: string;
  joinedCount: number;
  totalMembers: number;
  extraMembersText?: string;
}

export interface HistoryChallengeItem {
  id: string;
  type: 'history';
  title: string;
  status: HistoryResultStatus;
  description: string;
  heartsText?: string;
}

export type ChallengeItem =
  | ActiveChallengeItem
  | FormationChallengeItem
  | HistoryChallengeItem;

export type ChallengeMemberRole = 'host' | 'member';

export interface ChallengeDetailMember {
  id: string;
  displayName: string;
  username: string;
  role: ChallengeMemberRole;
  avatarUrl?: string;
}

export interface ChallengeActivity {
  id: string;
  name: string;
  windowLabel: string;
  statusLabel: string;
}

export interface ChallengeDetail {
  id: string;
  title: string;
  status: ChallengeStatusTone;
  statusLabel: string;
  heartsText: string;
  resetTimeText: string;
  dateRangeText: string;
  hostUsername: string;
  members: ChallengeDetailMember[];
  activities: ChallengeActivity[];
}
