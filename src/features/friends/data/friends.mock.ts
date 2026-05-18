import type { FriendUser, FriendRequest, UserProfilePreview } from '../types';

export const MOCK_FRIENDS: FriendUser[] = [
  {
    id: 'user-anna',
    username: 'anna_pham',
    displayName: 'Anna Pham',
    currentStreak: 12,
    activeChallengesCount: 2,
    mutualCount: 5,
    relationship: 'friend',
  },
  {
    id: 'user-khoa',
    username: 'khoa_le',
    displayName: 'Khoa Le',
    currentStreak: 7,
    activeChallengesCount: 1,
    mutualCount: 3,
    relationship: 'friend',
  },
  {
    id: 'user-linh',
    username: 'linh_dao',
    displayName: 'Linh Dao',
    currentStreak: 24,
    activeChallengesCount: 3,
    mutualCount: 8,
    relationship: 'friend',
  },
  {
    id: 'user-sam',
    username: 'sam_riv',
    displayName: 'Sam Rivera',
    currentStreak: 5,
    activeChallengesCount: 0,
    mutualCount: 2,
    relationship: 'friend',
  },
];

export const MOCK_INCOMING_REQUESTS: FriendRequest[] = [
  {
    id: 'req-minh',
    direction: 'incoming',
    status: 'pending',
    createdAt: new Date().toISOString(),
    user: {
      id: 'user-minh',
      username: 'minh_tran',
      displayName: 'Minh Tran',
      mutualCount: 12,
      relationship: 'pending_incoming',
    },
  },
  {
    id: 'req-ngan',
    direction: 'incoming',
    status: 'pending',
    createdAt: new Date().toISOString(),
    user: {
      id: 'user-ngan',
      username: 'ngan_vo',
      displayName: 'Ngan Vo',
      mutualCount: 4,
      relationship: 'pending_incoming',
    },
  },
  {
    id: 'req-maya',
    direction: 'incoming',
    status: 'pending',
    createdAt: new Date().toISOString(),
    user: {
      id: 'user-maya',
      username: 'maya_z',
      displayName: 'Maya Z.',
      mutualCount: 12,
      relationship: 'pending_incoming',
    },
  },
];

// TODO: Backend does not yet expose a GET /api/friends/requests/outgoing endpoint.
// Return empty for now; wire up when endpoint is available.
export const MOCK_OUTGOING_REQUESTS: FriendRequest[] = [
  {
    id: 'outreq-hai',
    direction: 'outgoing',
    status: 'pending',
    createdAt: new Date().toISOString(),
    user: {
      id: 'user-hai',
      username: 'hai_nguyen',
      displayName: 'Hai Nguyen',
      mutualCount: 3,
      relationship: 'pending_outgoing',
    },
  },
  {
    id: 'outreq-tuan',
    direction: 'outgoing',
    status: 'pending',
    createdAt: new Date().toISOString(),
    user: {
      id: 'user-tuan',
      username: 'tuan_pham',
      displayName: 'Tuan Pham',
      mutualCount: 1,
      relationship: 'pending_outgoing',
    },
  },
];

export const MOCK_SEARCH_RESULTS: FriendUser[] = [
  {
    id: 'user-sarah',
    username: 'sarahj',
    displayName: 'Sarah Jenkins',
    currentStreak: 24,
    mutualCount: 6,
    relationship: 'non_friend',
  },
  {
    id: 'user-james',
    username: 'james_k',
    displayName: 'James Kim',
    mutualCount: 2,
    relationship: 'non_friend',
  },
];

export const MOCK_FRIEND_PROFILE: UserProfilePreview = {
  id: 'user-sarah',
  username: 'sarahj',
  displayName: 'Sarah Jenkins',
  relationship: 'friend',
  currentStreak: 24,
  challengesJoined: 24,
  completionRate: 92,
  badges: [
    { id: 'badge-early', label: 'Early Adopter' },
    { id: 'badge-mvp', label: 'Squad MVP' },
    { id: 'badge-speed', label: 'Speed Demon' },
  ],
  latestActivities: [
    'Active in 3 challenges this week.',
    'Recent win: 5AM Wake Up call.',
  ],
};

export const MOCK_NON_FRIEND_PREVIEW: UserProfilePreview = {
  id: 'user-james',
  username: 'james_k',
  displayName: 'James Kim',
  relationship: 'non_friend',
  mutualCount: 2,
};

export const MOCK_SQUADMATE_PREVIEW: UserProfilePreview = {
  id: 'user-tung',
  username: 'tung_n',
  displayName: 'Tung Nguyen',
  relationship: 'squadmate',
  sharedChallenge: {
    id: 'chal-5am',
    title: '5AM Wake Up',
    status: 'ACTIVE',
    progressLabel: 'Day 12 Streak',
    coSquadmatesCount: 8,
    coSquadmateAvatars: [],
  },
};
