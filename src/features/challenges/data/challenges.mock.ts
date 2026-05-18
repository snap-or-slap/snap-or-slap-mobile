import type {
  ActiveChallengeItem,
  ChallengeDetail,
  ChallengeDetailMember,
  FormationChallengeItem,
  HistoryChallengeItem,
  ChallengeListItem,
} from '../types/challenge.types';

// ─── Legacy mock arrays (kept for backward compat with existing card components) ───

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

// ─── Unified ChallengeListItem mock (used by new ChallengeCard / ChallengeHubScreen) ───

export const challengeListMock: ChallengeListItem[] = [
  // Active challenges
  {
    id: 'active-wake-up-5am-safe',
    title: 'Wake Up 5AM',
    status: 'ACTIVE',
    heartsLeft: 2,
    totalHearts: 3,
    resetTime: '05:00 AM',
    startDate: '2026-05-18',
    endDate: '2026-05-31',
    stepLengthDays: 1,
    currentStepLabel: 'Step 6 of 14',
    progressLabel: 'On track',
    memberCount: 3,
    hostName: 'Minh Tran',
    members: [
      { id: 'member-minh', name: 'Minh Tran', username: 'minh', status: 'DONE' },
      { id: 'member-anna', name: 'Anna Pham', username: 'anna', status: 'PENDING', isCurrentUser: true },
      { id: 'member-khoa', name: 'Khoa Le', username: 'khoa', status: 'DONE' },
    ],
  },
  {
    id: 'active-ielts-danger',
    title: 'Read 20 Pages — IELTS',
    status: 'ACTIVE',
    heartsLeft: 1,
    totalHearts: 5,
    resetTime: '05:00 AM',
    startDate: '2026-05-12',
    endDate: '2026-05-26',
    stepLengthDays: 1,
    currentStepLabel: 'Step 9 of 14',
    progressLabel: 'Danger',
    memberCount: 2,
    hostName: 'Huy Forum',
    members: [
      { id: 'member-huy', name: 'Huy Forum', username: 'huy', status: 'DONE' },
      { id: 'member-linh', name: 'Linh Dao', username: 'linh', status: 'PENDING', isCurrentUser: true },
    ],
  },

  // Formation / invited challenges
  {
    id: 'formation-wake-up-9am',
    title: 'Wake up at 9am',
    status: 'FORMATION',
    totalHearts: 4,
    startDate: '2026-04-18',
    endDate: '2026-04-25',
    resetTime: '10:00 PM',
    stepLengthDays: 1,
    minMembers: 4,
    memberCount: 4,
    joinedCount: 2,
    invitedCount: 2,
    hostName: 'Phuc Hoang',
    members: [
      { id: 'member-phuc', name: 'Phuc Hoang', username: 'phuc', status: 'JOINED' },
      { id: 'member-ngan', name: 'Ngan Vo', username: 'ngan', status: 'INVITED' },
    ],
  },
  {
    id: 'formation-invited-morning',
    title: 'Morning Yoga Squad',
    status: 'INVITED',
    isInvite: true,
    totalHearts: 3,
    startDate: '2026-05-20',
    endDate: '2026-05-27',
    resetTime: '07:00 AM',
    stepLengthDays: 1,
    minMembers: 3,
    memberCount: 3,
    joinedCount: 1,
    invitedCount: 2,
    hostName: 'Linh Dao',
    members: [
      { id: 'member-linh2', name: 'Linh Dao', username: 'linh', status: 'JOINED' },
      { id: 'member-you', name: 'You', username: 'me', status: 'INVITED', isCurrentUser: true },
    ],
  },

  // History challenges
  {
    id: 'history-morning-run',
    title: 'Morning Run',
    status: 'FINISHED',
    heartsLeft: 2,
    totalHearts: 3,
    startDate: '2026-04-01',
    endDate: '2026-04-14',
    memberCount: 3,
    progressLabel: 'Completed successfully',
  },
  {
    id: 'history-read-before-bed',
    title: 'Read Before Bed',
    status: 'GAME_OVER',
    heartsLeft: 0,
    totalHearts: 3,
    startDate: '2026-03-10',
    endDate: '2026-03-24',
    memberCount: 4,
    progressLabel: 'The squad lost all hearts',
  },
  {
    id: 'history-study-sprint',
    title: 'Study Sprint',
    status: 'CANCELLED',
    startDate: '2026-02-15',
    endDate: '2026-02-22',
    memberCount: 2,
    progressLabel: 'Cancelled before completion',
  },
];

// ─── Challenge detail mock (for ChallengeDetailScreen) ───

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
    title: 'Read 20 Pages — IELTS',
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
  {
    id: 'history-morning-run',
    title: 'Morning Run',
    status: 'success',
    statusLabel: 'Finished',
    heartsText: '2/3',
    resetTimeText: '06:00 AM',
    dateRangeText: 'Apr 1, 2026 to Apr 14, 2026',
    hostUsername: 'minh',
    members: [
      {
        id: 'member-minh',
        displayName: 'Minh Tran',
        username: 'minh',
        role: 'host',
      },
    ],
    activities: [],
  },
  {
    id: 'history-read-before-bed',
    title: 'Read Before Bed',
    status: 'game-over',
    statusLabel: 'Game Over',
    heartsText: '0/3',
    resetTimeText: '09:00 PM',
    dateRangeText: 'Mar 10, 2026 to Mar 24, 2026',
    hostUsername: 'khoa',
    members: [],
    activities: [],
  },
  {
    id: 'history-study-sprint',
    title: 'Study Sprint',
    status: 'cancelled',
    statusLabel: 'Cancelled',
    heartsText: '—',
    resetTimeText: '07:00 PM',
    dateRangeText: 'Feb 15, 2026 to Feb 22, 2026',
    hostUsername: 'anna',
    members: [],
    activities: [],
  },
];

export function getChallengeDetailMock(challengeId?: string): ChallengeDetail {
  return (
    challengeDetailsMock.find((challenge) => challenge.id === challengeId) ??
    challengeDetailsMock[0]
  );
}

export function getChallengeListMock(segment: 'active' | 'formation' | 'history'): ChallengeListItem[] {
  switch (segment) {
    case 'active':
      return challengeListMock.filter((c) => c.status === 'ACTIVE');
    case 'formation':
      return challengeListMock.filter((c) => c.status === 'FORMATION' || c.status === 'INVITED');
    case 'history':
      return challengeListMock.filter(
        (c) => c.status === 'FINISHED' || c.status === 'GAME_OVER' || c.status === 'CANCELLED'
      );
  }
}

// ─── Mock friend options for CreateChallenge invite step ───
export type FriendOption = {
  id: string;
  name: string;
  username: string;
};

export const friendOptionsMock: FriendOption[] = [
  { id: 'friend-anna', name: 'Anna Pham', username: 'anna' },
  { id: 'friend-khoa', name: 'Khoa Le', username: 'khoa' },
  { id: 'friend-linh', name: 'Linh Dao', username: 'linh' },
  { id: 'friend-minh', name: 'Minh Tran', username: 'minh' },
  { id: 'friend-ngan', name: 'Ngan Vo', username: 'ngan' },
];
