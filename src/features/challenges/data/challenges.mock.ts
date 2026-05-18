import type {
  ActiveChallengeItem,
  ChallengeDetail,
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

export const challengeDetailsMock: ChallengeDetail[] = [
  {
    id: 'active-wake-up-5am-safe',
    title: 'Wake Up 5AM',
    status: 'active',
    statusLabel: 'Active',
    heartsText: '2/3',
    resetTimeText: '05:00 AM',
    dateRangeText: 'May 18, 2026 to May 31, 2026',
    hostUsername: 'minh',
    members: [
      {
        id: 'member-minh',
        displayName: 'Minh Tran',
        username: 'minh',
        role: 'host',
      },
      {
        id: 'member-anna',
        displayName: 'Anna Pham',
        username: 'anna',
        role: 'member',
      },
      {
        id: 'member-khoa',
        displayName: 'Khoa Le',
        username: 'khoa',
        role: 'member',
      },
    ],
    activities: [
      {
        id: 'activity-wake',
        name: 'Wake up and post proof',
        windowLabel: '04:45 AM - 05:15 AM',
        statusLabel: 'Waiting for next reset',
      },
      {
        id: 'activity-water',
        name: 'Drink water',
        windowLabel: '05:15 AM - 05:45 AM',
        statusLabel: 'Optional check-in',
      },
    ],
  },
  {
    id: 'active-ielts-danger',
    title: 'Read 20 Pages to get 9.0 Band in IELTS and destroy Huy Forum',
    status: 'danger',
    statusLabel: 'Danger',
    heartsText: '1/5',
    resetTimeText: '05:00 AM',
    dateRangeText: 'May 12, 2026 to May 26, 2026',
    hostUsername: 'huy',
    members: [
      {
        id: 'member-huy',
        displayName: 'Huy Forum',
        username: 'huy',
        role: 'host',
      },
      {
        id: 'member-linh',
        displayName: 'Linh Dao',
        username: 'linh',
        role: 'member',
      },
    ],
    activities: [
      {
        id: 'activity-read',
        name: 'Read 20 pages',
        windowLabel: '08:00 PM - 10:00 PM',
        statusLabel: 'Needs check-in today',
      },
      {
        id: 'activity-vocab',
        name: 'Review vocabulary',
        windowLabel: '10:00 PM - 10:30 PM',
        statusLabel: 'Pending',
      },
    ],
  },
  {
    id: 'formation-wake-up-9am',
    title: 'Wake up at 9am',
    status: 'formation',
    statusLabel: 'Formation',
    heartsText: '4 total',
    resetTimeText: '10:00 PM',
    dateRangeText: 'Apr 18, 2026 to Apr 25, 2026',
    hostUsername: 'phuc',
    members: [
      {
        id: 'member-phuc',
        displayName: 'Phuc Hoang',
        username: 'phuc',
        role: 'host',
      },
      {
        id: 'member-ngan',
        displayName: 'Ngan Vo',
        username: 'ngan',
        role: 'member',
      },
    ],
    activities: [
      {
        id: 'activity-alarm',
        name: 'Alarm selfie',
        windowLabel: '08:45 AM - 09:15 AM',
        statusLabel: 'Starts when enough members join',
      },
    ],
  },
];

export function getChallengeDetailMock(challengeId?: string): ChallengeDetail {
  return (
    challengeDetailsMock.find((challenge) => challenge.id === challengeId) ??
    challengeDetailsMock[0]
  );
}
