import type {
  FriendUser,
  FriendRequest,
  UserProfilePreview,
  FriendRespondAction,
} from '../types';
import {
  MOCK_FRIENDS,
  MOCK_INCOMING_REQUESTS,
  MOCK_OUTGOING_REQUESTS,
  MOCK_SEARCH_RESULTS,
  MOCK_FRIEND_PROFILE,
  MOCK_NON_FRIEND_PREVIEW,
  MOCK_SQUADMATE_PREVIEW,
} from '../data/friends.mock';

// ─────────────────────────────────────────────────────────────────
// API Base URL — update when backend is available
// TODO: Wire to actual apiClient / env config when ready
// ─────────────────────────────────────────────────────────────────
const CURRENT_USER_ID = 'me'; // TODO: Replace with auth session user id

function apiUrl(path: string, userId = CURRENT_USER_ID): string {
  return `/api${path}?user_id=${userId}`;
}

// ─────────────────────────────────────────────────────────────────
// Mapper helpers — backend snake_case → frontend camelCase
// ─────────────────────────────────────────────────────────────────
function mapUserFromBackend(raw: any): FriendUser {
  return {
    id: raw.id ?? raw.user_id ?? '',
    username: raw.username ?? '',
    displayName: raw.display_name ?? raw.displayName ?? raw.username ?? '',
    avatarUrl: raw.avatar_url ?? raw.avatarUrl ?? undefined,
    currentStreak: raw.current_streak ?? raw.currentStreak ?? undefined,
    activeChallengesCount:
      raw.active_challenges_count ?? raw.activeChallengesCount ?? undefined,
    mutualCount: raw.mutual_count ?? raw.mutualCount ?? undefined,
    relationship: raw.relationship ?? 'non_friend',
  };
}

function mapRequestFromBackend(raw: any): FriendRequest {
  return {
    id: raw.id ?? raw.request_id ?? '',
    direction: raw.direction ?? 'incoming',
    status: raw.status ?? 'pending',
    createdAt: raw.created_at ?? raw.createdAt ?? new Date().toISOString(),
    user: mapUserFromBackend(raw.user ?? raw.requester ?? raw.receiver ?? {}),
  };
}

function mapProfileFromBackend(raw: any): UserProfilePreview {
  return {
    id: raw.id ?? '',
    username: raw.username ?? '',
    displayName: raw.display_name ?? raw.displayName ?? raw.username ?? '',
    avatarUrl: raw.avatar_url ?? undefined,
    relationship: raw.relationship ?? 'non_friend',
    currentStreak: raw.current_streak ?? undefined,
    challengesJoined: raw.challenges_joined ?? undefined,
    completionRate: raw.completion_rate ?? undefined,
    badges: Array.isArray(raw.badges)
      ? raw.badges.map((b: any) => ({
          id: b.id ?? '',
          label: b.label ?? b.name ?? '',
          icon: b.icon ?? undefined,
        }))
      : undefined,
    latestActivities: raw.latest_activities ?? undefined,
    sharedChallenge: raw.shared_challenge
      ? {
          id: raw.shared_challenge.id ?? '',
          title: raw.shared_challenge.title ?? '',
          status: raw.shared_challenge.status ?? 'ACTIVE',
          progressLabel: raw.shared_challenge.progress_label ?? undefined,
          coSquadmatesCount:
            raw.shared_challenge.co_squadmates_count ?? undefined,
          coSquadmateAvatars:
            raw.shared_challenge.co_squadmate_avatars ?? undefined,
        }
      : undefined,
  };
}

// ─────────────────────────────────────────────────────────────────
// Service functions
// ─────────────────────────────────────────────────────────────────

/**
 * GET /api/friends?user_id=<me>
 * Returns current user's friends list.
 * Falls back to mock data if backend is unreachable.
 */
export async function getFriends(): Promise<FriendUser[]> {
  // TODO: Uncomment when real API is ready
  // const res = await fetch(apiUrl('/friends'));
  // if (res.ok) {
  //   const data = await res.json();
  //   return (data.friends ?? data).map(mapUserFromBackend);
  // }
  return Promise.resolve(MOCK_FRIENDS);
}

/**
 * GET /api/friends/requests/pending?user_id=<me>
 * Returns incoming friend requests.
 */
export async function getIncomingRequests(): Promise<FriendRequest[]> {
  // TODO: Uncomment when real API is ready
  // const res = await fetch(apiUrl('/friends/requests/pending'));
  // if (res.ok) {
  //   const data = await res.json();
  //   return (data.requests ?? data).map(mapRequestFromBackend);
  // }
  return Promise.resolve(MOCK_INCOMING_REQUESTS);
}

/**
 * GET outgoing requests.
 * TODO: Backend does not yet expose GET /api/friends/requests/outgoing.
 * Returns mock data until endpoint is available.
 */
export async function getOutgoingRequests(): Promise<FriendRequest[]> {
  // TODO: Wire to GET /api/friends/requests/outgoing?user_id=<me> when available
  return Promise.resolve(MOCK_OUTGOING_REQUESTS);
}

/**
 * GET /api/users/search?q=<query>&user_id=<me>
 */
export async function searchUsers(query: string): Promise<FriendUser[]> {
  if (!query || query.length < 2) return [];
  // TODO: Uncomment when real API is ready
  // const res = await fetch(apiUrl(`/users/search?q=${encodeURIComponent(query)}`));
  // if (res.ok) {
  //   const data = await res.json();
  //   return (data.users ?? data).map(mapUserFromBackend);
  // }
  const lower = query.toLowerCase();
  return Promise.resolve(
    MOCK_SEARCH_RESULTS.filter(
      (u) =>
        u.username.toLowerCase().includes(lower) ||
        u.displayName.toLowerCase().includes(lower),
    ),
  );
}

/**
 * POST /api/friends/request?user_id=<me>
 * Body: { receiver_id: string }
 */
export async function sendFriendRequest(receiverId: string): Promise<void> {
  // TODO: Uncomment when real API is ready
  // const res = await fetch(apiUrl('/friends/request'), {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ receiver_id: receiverId }),
  // });
  // if (!res.ok) throw new Error('Failed to send friend request');
  return Promise.resolve();
}

/**
 * PUT /api/friends/request/{requestId}/respond?user_id=<me>
 * Body: { action: "accept" | "decline" }
 */
export async function respondFriendRequest(
  requestId: string,
  action: FriendRespondAction,
): Promise<void> {
  // TODO: Uncomment when real API is ready
  // const res = await fetch(apiUrl(`/friends/request/${requestId}/respond`), {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ action }),
  // });
  // if (!res.ok) throw new Error(`Failed to ${action} friend request`);
  return Promise.resolve();
}

/**
 * Unsend an outgoing friend request.
 * TODO: Backend does not yet expose DELETE /api/friends/request/{requestId}/unsend.
 * Safely no-ops for now.
 */
export async function unsendFriendRequest(requestId: string): Promise<void> {
  // TODO: Wire to DELETE /api/friends/request/{requestId}?user_id=<me> when available
  console.warn('[friendsService] unsendFriendRequest is not yet wired to backend', requestId);
  return Promise.resolve();
}

/**
 * DELETE /api/friends/{friendUserId}?user_id=<me>
 */
export async function removeFriend(friendUserId: string): Promise<void> {
  // TODO: Uncomment when real API is ready
  // const res = await fetch(apiUrl(`/friends/${friendUserId}`), { method: 'DELETE' });
  // if (!res.ok) throw new Error('Failed to remove friend');
  return Promise.resolve();
}

/**
 * GET /api/users/{userId}/profile?user_id=<me>
 */
export async function getUserProfile(userId: string): Promise<UserProfilePreview> {
  // TODO: Uncomment when real API is ready
  // const res = await fetch(apiUrl(`/users/${userId}/profile`));
  // if (res.ok) {
  //   const data = await res.json();
  //   return mapProfileFromBackend(data);
  // }
  if (userId === MOCK_NON_FRIEND_PREVIEW.id || userId === 'user-james') {
    return Promise.resolve(MOCK_NON_FRIEND_PREVIEW);
  }
  if (userId === MOCK_SQUADMATE_PREVIEW.id || userId === 'user-tung') {
    return Promise.resolve(MOCK_SQUADMATE_PREVIEW);
  }
  if (userId.startsWith('user-minh') || userId.startsWith('user-ngan') || userId.startsWith('user-maya')) {
    return Promise.resolve({
      ...MOCK_NON_FRIEND_PREVIEW,
      id: userId,
      relationship: 'pending_incoming',
    });
  }
  if (userId.startsWith('user-hai') || userId.startsWith('user-tuan')) {
    return Promise.resolve({
      ...MOCK_NON_FRIEND_PREVIEW,
      id: userId,
      relationship: 'pending_outgoing',
    });
  }
  return Promise.resolve(MOCK_FRIEND_PROFILE);
}
