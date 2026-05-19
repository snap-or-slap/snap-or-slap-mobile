import type { UserProfile } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Mock data — replace with real API calls when backend is ready
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_PROFILE: UserProfile = {
  id: 'me',
  username: 'snapstarter',
  displayName: 'SnapOrSlap User',
  email: 'user@snaporslap.app',
  currentStreak: 12,
  challengesJoined: 24,
  completionRate: 87,
  friendsCount: 24,
  badgesCount: 3,
  badges: [
    { id: 'newcomer', label: 'Newcomer' },
    { id: 'early-riser', label: 'Early Riser' },
    { id: 'team-player', label: 'Team Player' },
  ],
};

/**
 * GET /api/users/me?user_id=<me>
 * TODO: Uncomment and wire real API when endpoint is available.
 */
export async function getMyProfile(): Promise<UserProfile> {
  // const res = await fetch('/api/users/me?user_id=me');
  // if (res.ok) return res.json();
  return Promise.resolve(MOCK_PROFILE);
}

/**
 * PATCH /api/users/me?user_id=<me>
 * TODO: Wire when backend supports profile updates.
 */
export async function updateProfile(patch: Partial<UserProfile>): Promise<UserProfile> {
  // const res = await fetch('/api/users/me?user_id=me', {
  //   method: 'PATCH',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(patch),
  // });
  // if (!res.ok) throw new Error('Failed to update profile');
  // return res.json();
  return Promise.resolve({ ...MOCK_PROFILE, ...patch });
}

export type UpdateCurrentUserProfilePayload = {
  displayName: string;
  bio?: string;
  avatarUrl?: string;
};

/**
 * PATCH /api/users/me?user_id=<me>
 * Body: { displayName, bio?, avatarUrl? }
 *
 * The app currently has no real auth session or API base URL configured, so this
 * delegates to the existing mock-backed updater until backend integration lands.
 */
export async function updateCurrentUserProfile(
  payload: UpdateCurrentUserProfilePayload
): Promise<UserProfile> {
  return updateProfile({
    displayName: payload.displayName,
    bio: payload.bio,
    avatarUrl: payload.avatarUrl,
  } as Partial<UserProfile>);
}

/**
 * DELETE /api/users/me?user_id=<me>
 * TODO: Uncomment and wire when endpoint is available.
 */
export async function deleteAccount(): Promise<void> {
  // const res = await fetch('/api/users/me?user_id=me', { method: 'DELETE' });
  // if (!res.ok) throw new Error('Failed to delete account');
  console.warn('[profileService] deleteAccount: backend endpoint not yet available');
  return Promise.resolve();
}

export const profileService = {
  getMyProfile,
  updateProfile,
  updateCurrentUserProfile,
  deleteAccount,
};
