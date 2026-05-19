import {
  ApiError,
  apiClient,
  apiRoutes,
  mapKeysToCamel,
  mapUserDto,
  session,
} from '@services/api';
import { profileService } from '@features/profile/services';

import type {
  FriendRequest,
  FriendRespondAction,
  FriendUser,
  OutgoingFriendRequest,
  RelationshipType,
  UserProfilePreview,
} from '../types';
import { formatActivityLabel, formatBadgeLabel } from '../utils';
import {
  addOutgoingRequest,
  reconcileOutgoingRequests,
  removeOutgoingRequest,
} from './outgoingRequests.store';

export type ListFriendsParams = {
  page?: number;
  limit?: number;
};

function mapRelationship(value: unknown): RelationshipType {
  switch (value) {
    case 'self':
    case 'friend':
    case 'squadmate':
      return value;
    case 'pending_sent':
      return 'pending_sent';
    case 'pending_received':
      return 'pending_received';
    case 'none':
      return 'none';
    case 'pending_outgoing':
      return 'pending_sent';
    case 'pending_incoming':
      return 'pending_received';
    case 'non_friend':
    default:
      return 'none';
  }
}

function mapFriendUser(raw: unknown, defaultRelationship: RelationshipType = 'friend'): FriendUser {
  const user = mapUserDto(raw as never);
  return {
    id: user.id,
    username: user.username ?? '',
    displayName: user.displayName ?? user.username ?? '',
    avatarUrl: user.avatarUrl ?? undefined,
    currentStreak: user.currentStreak,
    activeChallengesCount: user.activeChallengesCount,
    mutualCount: user.mutualCount,
    relationship: mapRelationship(user.relationship ?? defaultRelationship),
  };
}

function mapFriendRequest(raw: unknown): FriendRequest {
  const mapped = mapKeysToCamel<Record<string, unknown>>(raw);
  const sender = mapped.sender ?? mapped.user ?? mapped.requester ?? {};
  const receiver = mapped.receiver ?? {};
  const isOutgoing = Boolean(mapped.receiver);

  return {
    id: String(mapped.id ?? mapped.requestId ?? ''),
    direction: isOutgoing ? 'outgoing' : 'incoming',
    status: (mapped.status as FriendRequest['status'] | undefined) ?? 'pending',
    createdAt: String(mapped.createdAt ?? new Date().toISOString()),
    user: mapFriendUser(
      isOutgoing ? receiver : sender,
      isOutgoing ? 'pending_sent' : 'pending_received',
    ),
  };
}

function mapUserProfilePreview(raw: unknown): UserProfilePreview {
  const mapped = mapKeysToCamel<Record<string, unknown>>(raw);
  const user = mapFriendUser(mapped.user ?? mapped, 'none');
  const stats = (mapped.stats ?? {}) as Record<string, unknown>;
  const request = (mapped.request ?? {}) as Record<string, unknown>;
  const badges = Array.isArray(mapped.badges) ? mapped.badges.map(formatBadgeLabel) : undefined;
  const latestActivities = Array.isArray(mapped.latestActivities)
    ? mapped.latestActivities.map(formatActivityLabel)
    : undefined;

  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    relationship: mapRelationship(mapped.relationship ?? user.relationship),
    requestId: typeof mapped.requestId === 'string'
      ? mapped.requestId
      : typeof request.id === 'string'
        ? request.id
        : undefined,
    currentStreak: stats.currentStreak as number | undefined,
    challengesJoined: stats.challengesJoined as number | undefined,
    completionRate: stats.completionRate as number | undefined,
    badges,
    latestActivities,
  };
}

function mapOutgoingRequest(item: OutgoingFriendRequest): FriendRequest {
  return {
    id: item.requestId ?? `outgoing-${item.receiverId}`,
    direction: 'outgoing',
    status: 'pending',
    createdAt: item.createdAt ?? new Date().toISOString(),
    user: {
      id: item.receiverId,
      username: item.username,
      displayName: item.displayName ?? item.username,
      avatarUrl: item.avatarUrl ?? undefined,
      relationship: 'pending_sent',
    },
  };
}

function toOutgoingRequest(
  receiver: Pick<FriendUser, 'id' | 'username' | 'displayName' | 'avatarUrl'>,
  request?: unknown,
): OutgoingFriendRequest {
  const mapped = mapKeysToCamel<Record<string, unknown>>(request ?? {});
  return {
    requestId: typeof mapped.id === 'string' ? mapped.id : undefined,
    receiverId: receiver.id,
    username: receiver.username,
    displayName: receiver.displayName,
    avatarUrl: receiver.avatarUrl ?? null,
    status: 'pending',
    createdAt: typeof mapped.createdAt === 'string' ? mapped.createdAt : new Date().toISOString(),
  };
}

function isConflict(error: unknown): boolean {
  return error instanceof ApiError && error.status === 409;
}

export async function listFriends(params: ListFriendsParams = {}): Promise<{
  friends: FriendUser[];
  total: number;
  page: number;
  limit: number;
}> {
  const response = await apiClient.get<{
    friends: unknown[];
    total: number;
    page: number;
    limit: number;
  }>(apiRoutes.friends.list, {
    query: params,
    withCurrentUser: true,
  });

  return {
    ...response,
    friends: response.friends.map((friend) => mapFriendUser(friend)),
  };
}

export async function listPendingRequests(): Promise<FriendRequest[]> {
  const response = await apiClient.get<{ requests: unknown[] }>(apiRoutes.friends.pendingRequests, {
    withCurrentUser: true,
  });
  return response.requests.map(mapFriendRequest);
}

export async function sendFriendRequest(receiverId: string): Promise<{ request: unknown }> {
  return apiClient.post(
    apiRoutes.friends.request,
    { receiver_id: receiverId },
    { withCurrentUser: true },
  );
}

export async function sendFriendRequestByUsername(username: string): Promise<{
  targetUser: FriendUser;
  request?: unknown;
  alreadySent?: boolean;
}> {
  const users = await profileService.searchUsers(username);
  const receiver = users.find((user) => user.username === username) ?? users[0];
  if (!receiver?.id) {
    throw new Error('No matching user found.');
  }

  const targetUser = mapFriendUser(receiver, 'none');
  const currentUserId = await session.getCurrentUserId();

  try {
    const response = await sendFriendRequest(receiver.id);
    await addOutgoingRequest(currentUserId, toOutgoingRequest(targetUser, response.request));
    return { targetUser: { ...targetUser, relationship: 'pending_sent' }, request: response.request };
  } catch (error) {
    if (isConflict(error)) {
      const profile = await getUserProfile(receiver.id);
      if (profile.relationship === 'pending_sent') {
        await addOutgoingRequest(currentUserId, toOutgoingRequest(profile));
        return { targetUser: { ...targetUser, relationship: 'pending_sent' }, alreadySent: true };
      }
    }

    throw error;
  }
}

export async function respondToRequest(
  requestId: string,
  action: FriendRespondAction,
): Promise<unknown> {
  return apiClient.put(
    apiRoutes.friends.respond(requestId),
    { action },
    { withCurrentUser: true },
  );
}

export async function unfriend(friendUserId: string): Promise<void> {
  await apiClient.delete(apiRoutes.friends.unfriend(friendUserId), {
    withCurrentUser: true,
  });
  await removeOutgoingRequest(await session.getCurrentUserId(), friendUserId).catch(() => undefined);
}

export async function getFriendsOverview(): Promise<{
  friends: FriendUser[];
  pendingRequests: FriendRequest[];
  outgoingRequests: FriendRequest[];
}> {
  const [friendsResponse, pendingRequests, outgoingRequests] = await Promise.all([
    listFriends(),
    listPendingRequests(),
    getOutgoingRequests(),
  ]);
  return {
    friends: friendsResponse.friends,
    pendingRequests,
    outgoingRequests,
  };
}

export async function searchUsers(query: string): Promise<FriendUser[]> {
  if (query.length < 2) return [];
  const users = await profileService.searchUsers(query);
  return users.map((user) => mapFriendUser(user, 'none'));
}

export async function getUserProfile(userId: string): Promise<UserProfilePreview> {
  const response = await profileService.getUserProfile(userId);
  return mapUserProfilePreview(response);
}

export async function getFriends(): Promise<FriendUser[]> {
  return (await listFriends()).friends;
}

export async function getIncomingRequests(): Promise<FriendRequest[]> {
  return listPendingRequests();
}

export async function getOutgoingRequests(): Promise<FriendRequest[]> {
  const currentUserId = await session.getCurrentUserId();
  const items = await reconcileOutgoingRequests(currentUserId);
  return items.map(mapOutgoingRequest);
}

export async function respondFriendRequest(
  requestId: string,
  action: FriendRespondAction,
): Promise<void> {
  await respondToRequest(requestId, action);
}

export async function unsendFriendRequest(requestId: string): Promise<void> {
  void requestId;
}

export async function removeFriend(friendUserId: string): Promise<void> {
  await unfriend(friendUserId);
}

export const friendsService = {
  listFriends,
  listPendingRequests,
  sendFriendRequest,
  sendFriendRequestByUsername,
  respondToRequest,
  unfriend,
  getFriendsOverview,
  searchUsers,
  getUserProfile,
  getFriends,
  getIncomingRequests,
  getOutgoingRequests,
  respondFriendRequest,
  unsendFriendRequest,
  removeFriend,
};
