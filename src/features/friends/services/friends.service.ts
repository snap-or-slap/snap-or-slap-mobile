import { apiClient, apiRoutes, mapKeysToCamel, mapUserDto } from '@services/api';
import { profileService } from '@features/profile/services';

import type {
  FriendRequest,
  FriendRespondAction,
  FriendUser,
  RelationshipType,
  UserProfilePreview,
} from '../types';

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
    case 'pending_outgoing':
      return 'pending_outgoing';
    case 'pending_received':
    case 'pending_incoming':
      return 'pending_incoming';
    case 'none':
    case 'non_friend':
    default:
      return 'non_friend';
  }
}

function mapFriendUser(raw: unknown): FriendUser {
  const user = mapUserDto(raw as never);
  return {
    id: user.id,
    username: user.username ?? '',
    displayName: user.displayName ?? user.username ?? '',
    avatarUrl: user.avatarUrl ?? undefined,
    currentStreak: user.currentStreak,
    activeChallengesCount: user.activeChallengesCount,
    mutualCount: user.mutualCount,
    relationship: mapRelationship(user.relationship ?? 'friend'),
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
    user: mapFriendUser(isOutgoing ? receiver : sender),
  };
}

function mapUserProfilePreview(raw: unknown): UserProfilePreview {
  const mapped = mapKeysToCamel<Record<string, unknown>>(raw);
  const user = mapFriendUser(mapped.user ?? mapped);
  const stats = (mapped.stats ?? {}) as Record<string, unknown>;

  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    relationship: mapRelationship(mapped.relationship ?? user.relationship),
    currentStreak: stats.currentStreak as number | undefined,
    challengesJoined: stats.challengesJoined as number | undefined,
    completionRate: stats.completionRate as number | undefined,
    badges: mapped.badges as UserProfilePreview['badges'],
    latestActivities: mapped.latestActivities as string[] | undefined,
  };
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
    friends: response.friends.map(mapFriendUser),
  };
}

export async function listPendingRequests(): Promise<FriendRequest[]> {
  const response = await apiClient.get<{ requests: unknown[] }>(apiRoutes.friends.pendingRequests, {
    withCurrentUser: true,
  });
  return response.requests.map(mapFriendRequest);
}

export async function sendFriendRequest(receiverId: string): Promise<unknown> {
  return apiClient.post(
    apiRoutes.friends.request,
    { receiver_id: receiverId },
    { withCurrentUser: true },
  );
}

export async function sendFriendRequestByUsername(username: string): Promise<unknown> {
  const users = await profileService.searchUsers(username);
  const receiver = users.find((user) => user.username === username) ?? users[0];
  if (!receiver?.id) {
    throw new Error('No matching user found.');
  }

  return sendFriendRequest(receiver.id);
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
}

export async function getFriendsOverview(): Promise<{
  friends: FriendUser[];
  pendingRequests: FriendRequest[];
}> {
  const [friendsResponse, pendingRequests] = await Promise.all([
    listFriends(),
    listPendingRequests(),
  ]);
  return {
    friends: friendsResponse.friends,
    pendingRequests,
  };
}

export async function searchUsers(query: string): Promise<FriendUser[]> {
  if (query.length < 2) return [];
  const users = await profileService.searchUsers(query);
  return users.map(mapFriendUser);
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
  return [];
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
