
export type ChallengeSegment = 'formation' | 'active' | 'history';

export type ActiveRiskStatus = 'on-track' | 'danger';

export type HistoryResultStatus = 'success' | 'game-over' | 'cancelled';

export interface ActiveChallengeItem {
  id: string;
  type: 'active';
  title: string;
  totalHeartsText: string;
  resetTimeText: string;
  stepText: string;
  riskStatus: ActiveRiskStatus;
}

export interface FormationChallengeItem {
  id: string;
  type: 'formation';
  title: string;
  totalHeartsText: string;
  durationText: string;
  loopEveryText: string;
  startDateText: string;
  resetAtText: string;
  joinedText: string;
}

export interface HistoryChallengeItem {
  id: string;
  type: 'history';
  title: string;
  status: HistoryResultStatus;
  description: string;
  heartsText?: string;
}
