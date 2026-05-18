export type RelationshipType =
  | 'self'
  | 'friend'
  | 'non_friend'
  | 'squadmate'
  | 'pending_incoming'
  | 'pending_outgoing';

export type FriendRequestTab = 'incoming' | 'outgoing';

export type FriendUser = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  currentStreak?: number;
  activeChallengesCount?: number;
  mutualCount?: number;
  relationship: RelationshipType;
};

export type FriendRequest = {
  id: string;
  direction: 'incoming' | 'outgoing';
  status: 'pending' | 'accepted' | 'declined';
  user: FriendUser;
  createdAt: string;
};

export type UserProfilePreview = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  relationship: RelationshipType;
  currentStreak?: number;
  challengesJoined?: number;
  completionRate?: number;
  mutualCount?: number;
  badges?: Array<{
    id: string;
    label: string;
    icon?: string;
  }>;
  latestActivities?: string[];
  sharedChallenge?: {
    id: string;
    title: string;
    status: 'ACTIVE' | 'FORMATION' | 'FINISHED' | 'GAME_OVER' | 'CANCELLED';
    progressLabel?: string;
    coSquadmatesCount?: number;
    coSquadmateAvatars?: string[];
  };
};

export type FriendRespondAction = 'accept' | 'decline';
