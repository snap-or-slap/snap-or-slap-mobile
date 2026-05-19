export type ThemeMode = 'light' | 'dark' | 'system';

export type UserProfile = {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  avatarUrl?: string;
  bio?: string;
  isPrivate?: boolean;
  currentStreak?: number;
  challengesJoined?: number;
  completionRate?: number;
  friendsCount?: number;
  badgesCount?: number;
  badges?: Array<{ id: string; label: string }>;
  recentActivities?: string[];
};
