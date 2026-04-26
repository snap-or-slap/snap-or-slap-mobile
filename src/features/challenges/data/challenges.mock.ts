
import { ActiveChallengeItem, FormationChallengeItem, HistoryChallengeItem } from '../types';

export const activeChallengesMock: ActiveChallengeItem[] = [
  {
    id: 'a1',
    type: 'active',
    title: 'Wake Up 5AM',
    totalHeartsText: '10 total',
    resetTimeText: '05:00 AM',
    stepText: 'Step 6 of 14',
    riskStatus: 'on-track',
  },
  {
    id: 'a2',
    type: 'active',
    title: 'Read 20 Pages to get 9.0 Band in IELTS and destroy Huy Forum',
    totalHeartsText: '10 total',
    resetTimeText: '05:00 AM',
    stepText: 'Step 9 of 14',
    riskStatus: 'danger',
  },
  {
    id: 'a3',
    type: 'active',
    title: 'Wake Up 5AM',
    totalHeartsText: '10 total',
    resetTimeText: '05:00 AM',
    stepText: 'Step 6 of 14',
    riskStatus: 'on-track',
  },
];

export const formationChallengesMock: FormationChallengeItem[] = [
  {
    id: 'f1',
    type: 'formation',
    title: 'Wake up at 9am',
    totalHeartsText: '4 total',
    durationText: '7 days',
    loopEveryText: '1 days',
    startDateText: 'Apr 18, 2026',
    resetAtText: '10:00 PM',
    joinedText: '2/4 joined',
  },
  {
    id: 'f2',
    type: 'formation',
    title: 'Wake up at 9am',
    totalHeartsText: '4 total',
    durationText: '7 days',
    loopEveryText: '1 days',
    startDateText: 'Apr 18, 2026',
    resetAtText: '10:00 PM',
    joinedText: '2/4 joined',
  },
];

export const historyChallengesMock: HistoryChallengeItem[] = [
  {
    id: 'h1',
    type: 'history',
    title: 'Morning run',
    status: 'success',
    description: 'Completed successfully',
    heartsText: '10 total',
  },
  {
    id: 'h2',
    type: 'history',
    title: 'Read Before Bed',
    status: 'game-over',
    description: 'The Squad lost all hearts',
    heartsText: '10 total',
  },
  {
    id: 'h3',
    type: 'history',
    title: 'Study Sprint',
    status: 'cancelled',
    description: 'Cancelled before completion',
  },
];
