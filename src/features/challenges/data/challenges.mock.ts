import type {
  ActiveChallengeItem,
  FormationChallengeItem,
  HistoryChallengeItem,
} from '../types/challenge.types';

export const activeChallengesMock: ActiveChallengeItem[] = [
  {
    id: 'active-wake-up-5am-safe',
    type: 'active',
    title: 'Wake Up 5AM',
    heartsText: '2/3',
    resetTimeText: '05:00 AM',
    stepText: 'Step 6 of 14',
    riskStatus: 'on-track',
  },
  {
    id: 'active-ielts-danger',
    type: 'active',
    title: 'Read 20 Pages to get 9.0 Band in IELTS and destroy Huy Forum',
    heartsText: '1/5',
    resetTimeText: '05:00 AM',
    stepText: 'Step 9 of 14',
    riskStatus: 'danger',
  },
  {
    id: 'active-wake-up-5am-safe-secondary',
    type: 'active',
    title: 'Wake Up 5AM',
    heartsText: '2/3',
    resetTimeText: '05:00 AM',
    stepText: 'Step 6 of 14',
    riskStatus: 'on-track',
  },
];

export const formationChallengesMock: FormationChallengeItem[] = [
  {
    id: 'formation-wake-up-9am',
    type: 'formation',
    title: 'Wake up at 9am',
    heartsText: '4 total',
    durationText: '7 days',
    loopEveryText: '1 days',
    startDateText: 'Apr 18, 2026',
    resetAtText: '10:00 PM',
    joinedText: '2/4 joined',
    joinedCount: 2,
    totalMembers: 4,
    extraMembersText: '+1',
  },
  {
    id: 'formation-wake-up-9am-secondary',
    type: 'formation',
    title: 'Wake up at 9am',
    heartsText: '4 total',
    durationText: '7 days',
    loopEveryText: '1 days',
    startDateText: 'Apr 18, 2026',
    resetAtText: '10:00 PM',
    joinedText: '2/4 joined',
    joinedCount: 2,
    totalMembers: 4,
    extraMembersText: '+1',
  },
];

export const historyChallengesMock: HistoryChallengeItem[] = [
  {
    id: 'history-morning-run',
    type: 'history',
    title: 'Morning run',
    status: 'success',
    description: 'Completed successfully',
    heartsText: '2/3 left',
  },
  {
    id: 'history-read-before-bed',
    type: 'history',
    title: 'Read Before Bed',
    status: 'game-over',
    description: 'The Squad lost all hearts',
    heartsText: '0/3 left',
  },
  {
    id: 'history-study-sprint',
    type: 'history',
    title: 'Study Sprint',
    status: 'cancelled',
    description: 'Cancelled before completion',
  },
];