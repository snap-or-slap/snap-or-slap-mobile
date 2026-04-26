export type ChallengeSegment = 'formation' | 'active' | 'history';

export type ActiveRiskStatus = 'on-track' | 'danger';

export type HistoryResultStatus = 'success' | 'game-over' | 'cancelled';

export type ChallengeStatusTone =
  | 'active'
  | 'formation'
  | 'on-track'
  | 'danger'
  | 'success'
  | 'game-over'
  | 'cancelled';

export type HeartBadgeVariant = 'filled' | 'outline';

export type HeartBadgeTone = 'brand' | 'danger' | 'muted';

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