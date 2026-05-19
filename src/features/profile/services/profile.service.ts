import {
  apiClient,
  apiRoutes,
  mapKeysToCamel,
  mapProfileDto,
  mapUserDto,
  type FrontendUser,
} from '@services/api';

import type { UserProfile } from '../types';

export type UpdateMePayload = {
  displayName?: string;
  bio?: string;
  isPrivate?: boolean;
  avatarUrl?: never;
};

export type ProfileActivitiesParams = {
  page?: number;
  limit?: number;
  type?: string;
};

export type ChallengeHistoryParams = {
  result?: 'success' | 'game_over' | 'cancelled';
  page?: number;
  limit?: number;
};

export type UpdateCurrentUserProfilePayload = {
  displayName: string;
  bio?: string;
  avatarUrl?: string;
};

type UserWrappedResponse = {
  user: unknown;
  message?: string;
};

function toUserProfile(user: FrontendUser): UserProfile {
  return {
    id: user.id,
    username: user.username ?? '',
    displayName: user.displayName ?? user.username ?? '',
    email: user.email ?? undefined,
    avatarUrl: user.avatarUrl ?? undefined,
  };
}

export async function getMe(): Promise<FrontendUser> {
  const response = await apiClient.get<UserWrappedResponse>(apiRoutes.users.me, {
    withCurrentUser: true,
  });
  return mapUserDto(response.user as never);
}

export async function updateMe(payload: UpdateMePayload): Promise<FrontendUser> {
  const { displayName, bio, isPrivate } = payload;
  const response = await apiClient.patch<UserWrappedResponse>(
    apiRoutes.users.me,
    { displayName, bio, isPrivate },
    { withCurrentUser: true },
  );
  return mapUserDto(response.user as never);
}

export async function deleteAccount(): Promise<void> {
  await apiClient.delete(apiRoutes.users.me, { withCurrentUser: true });
}

export async function getProfileOverview<T = unknown>(): Promise<T> {
  const response = await apiClient.get(apiRoutes.users.myProfile, {
    withCurrentUser: true,
  });
  return mapProfileDto<T>(response);
}

export async function getUserProfile<T = unknown>(targetUserId: string): Promise<T> {
  const response = await apiClient.get(apiRoutes.users.userProfile(targetUserId), {
    withCurrentUser: true,
  });
  return mapProfileDto<T>(response);
}

export async function searchUsers<T = FrontendUser[]>(query: string): Promise<T> {
  const response = await apiClient.get<{ users: unknown[] }>(apiRoutes.users.search, {
    query: { q: query },
    withCurrentUser: true,
  });
  return response.users.map((user) => mapUserDto(user as never)) as T;
}

export async function updateSettings(isPrivate: boolean): Promise<{ user: FrontendUser; message?: string }> {
  const response = await apiClient.put<UserWrappedResponse>(
    apiRoutes.users.settings,
    { isPrivate },
    { withCurrentUser: true },
  );
  return {
    user: mapUserDto(response.user as never),
    message: response.message,
  };
}

export async function getStats<T = unknown>(): Promise<T> {
  const response = await apiClient.get(apiRoutes.users.stats, {
    withCurrentUser: true,
  });
  return mapKeysToCamel<T>(response);
}

export async function getActivities<T = unknown>(params: ProfileActivitiesParams = {}): Promise<T> {
  const response = await apiClient.get(apiRoutes.users.activities, {
    query: params,
    withCurrentUser: true,
  });
  return mapKeysToCamel<T>(response);
}

export async function checkBadges<T = unknown>(): Promise<T> {
  const response = await apiClient.post(apiRoutes.users.badgesCheck, undefined, {
    withCurrentUser: true,
  });
  return mapKeysToCamel<T>(response);
}

export async function getChallengeHistoryList<T = unknown>(
  params: ChallengeHistoryParams = {},
): Promise<T> {
  const response = await apiClient.get(apiRoutes.users.challengeHistory, {
    query: params,
    withCurrentUser: true,
  });
  return mapKeysToCamel<T>(response);
}

export async function getMyProfile(): Promise<UserProfile> {
  return toUserProfile(await getMe());
}

export async function updateProfile(patch: Partial<UserProfile>): Promise<UserProfile> {
  const updated = await updateMe({
    displayName: patch.displayName,
    bio: patch.bio,
    isPrivate: undefined,
  });
  return toUserProfile(updated);
}

export async function updateCurrentUserProfile(
  payload: UpdateCurrentUserProfilePayload,
): Promise<UserProfile> {
  return updateProfile({
    displayName: payload.displayName,
    bio: payload.bio,
  });
}

export const profileService = {
  getMe,
  updateMe,
  deleteAccount,
  getProfileOverview,
  getUserProfile,
  searchUsers,
  updateSettings,
  getStats,
  getActivities,
  checkBadges,
  getChallengeHistoryList,
  getMyProfile,
  updateProfile,
  updateCurrentUserProfile,
};
