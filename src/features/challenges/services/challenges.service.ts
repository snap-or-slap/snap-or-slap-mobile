import { apiClient, apiRoutes, mapKeysToCamel } from '@services/api';

export type ChallengeListFilters = {
  status?: string;
  page?: number;
  limit?: number;
};

export type CreateChallengePayload = {
  title: string;
  description?: string;
  durationDays: number;
  frequency: 'daily' | 'custom';
  frequencyDays?: number[];
  resetTime?: string;
  totalHearts?: number;
  maxMembers?: number;
  isPrivate?: boolean;
  invitedUserIds?: string[];
  startAt?: string;
  coverUrl?: string;
};

export type UpdateChallengePayload = Partial<Omit<CreateChallengePayload, 'invitedUserIds'>>;

export type RecreateChallengePayload = {
  title?: string;
  description?: string;
  duration_days?: number;
  frequency?: 'daily' | 'custom';
  reset_time?: string;
  total_hearts?: number;
  max_members?: number;
  is_private?: boolean;
  cover_url?: string;
  reinvite_user_ids?: string[];
};

export type BrowsePublicChallengesParams = {
  q?: string;
  page?: number;
  limit?: number;
};

export type HistoryListParams = {
  result?: 'success' | 'game_over' | 'cancelled';
  page?: number;
  limit?: number;
};

export async function listChallenges<T = unknown>(
  filters: ChallengeListFilters = {},
): Promise<T> {
  const response = await apiClient.get(apiRoutes.challenges.list, {
    query: filters,
    withCurrentUser: true,
  });
  return mapKeysToCamel<T>(response);
}

export async function createChallenge<T = unknown>(payload: CreateChallengePayload): Promise<T> {
  const response = await apiClient.post(apiRoutes.challenges.list, payload, {
    withCurrentUser: true,
  });
  return mapKeysToCamel<T>(response);
}

export async function browsePublicChallenges<T = unknown>(
  params: BrowsePublicChallengesParams = {},
): Promise<T> {
  const response = await apiClient.get(apiRoutes.challenges.public, {
    query: params,
    withCurrentUser: true,
  });
  return mapKeysToCamel<T>(response);
}

export async function getChallenge<T = unknown>(id: string): Promise<T> {
  const response = await apiClient.get(apiRoutes.challenges.detail(id), {
    withCurrentUser: true,
  });
  return mapKeysToCamel<T>(response);
}

export async function updateChallenge<T = unknown>(
  id: string,
  payload: UpdateChallengePayload,
): Promise<T> {
  const response = await apiClient.patch(apiRoutes.challenges.detail(id), payload, {
    withCurrentUser: true,
  });
  return mapKeysToCamel<T>(response);
}

export async function deleteOrCancelChallenge(id: string): Promise<{ message?: string; id?: string }> {
  return apiClient.delete(apiRoutes.challenges.detail(id), {
    withCurrentUser: true,
  });
}

export async function inviteUsers<T = unknown>(id: string, userIds: string[]): Promise<T> {
  const response = await apiClient.post(
    apiRoutes.challenges.invite(id),
    { userIds },
    { withCurrentUser: true },
  );
  return mapKeysToCamel<T>(response);
}

export async function acceptInvite<T = unknown>(id: string): Promise<T> {
  const response = await apiClient.post(apiRoutes.challenges.join(id), undefined, {
    withCurrentUser: true,
  });
  return mapKeysToCamel<T>(response);
}

export async function declineInvite<T = unknown>(id: string): Promise<T> {
  const response = await apiClient.post(apiRoutes.challenges.decline(id), undefined, {
    withCurrentUser: true,
  });
  return mapKeysToCamel<T>(response);
}

export async function setReady<T = unknown>(id: string, isReady: boolean): Promise<T> {
  const response = await apiClient.put(
    apiRoutes.challenges.ready(id),
    { isReady },
    { withCurrentUser: true },
  );
  return mapKeysToCamel<T>(response);
}

export async function getReadyStatus<T = unknown>(id: string): Promise<T> {
  const response = await apiClient.get(apiRoutes.challenges.ready(id));
  return mapKeysToCamel<T>(response);
}

export async function leaveChallenge(id: string): Promise<{ message?: string; challengeId?: string }> {
  const response = await apiClient.post(apiRoutes.challenges.leave(id), undefined, {
    withCurrentUser: true,
  });
  return mapKeysToCamel(response);
}

export async function cancelChallenge<T = unknown>(id: string, reason?: string): Promise<T> {
  const response = await apiClient.post(
    apiRoutes.challenges.cancel(id),
    reason ? { reason } : undefined,
    { withCurrentUser: true },
  );
  return mapKeysToCamel<T>(response);
}

export async function getChallengeStats<T = unknown>(id: string): Promise<T> {
  const response = await apiClient.get(apiRoutes.challenges.stats(id));
  return mapKeysToCamel<T>(response);
}

export async function getHistoryList<T = unknown>(params: HistoryListParams = {}): Promise<T> {
  const response = await apiClient.get(apiRoutes.users.challengeHistory, {
    query: params,
    withCurrentUser: true,
  });
  return mapKeysToCamel<T>(response);
}

export async function getChallengeHistory<T = unknown>(id: string): Promise<T> {
  const response = await apiClient.get(apiRoutes.challenges.history(id), {
    withCurrentUser: true,
  });
  return mapKeysToCamel<T>(response);
}

export async function recreateChallenge<T = unknown>(
  id: string,
  payload: RecreateChallengePayload = {},
): Promise<T> {
  const response = await apiClient.post(apiRoutes.challenges.recreate(id), payload, {
    withCurrentUser: true,
  });
  return mapKeysToCamel<T>(response);
}

export async function checkMilestone<T = unknown>(id: string): Promise<T> {
  const response = await apiClient.post(apiRoutes.challenges.milestoneCheck(id), undefined, {
    withCurrentUser: true,
  });
  return mapKeysToCamel<T>(response);
}

export const challengesService = {
  listChallenges,
  createChallenge,
  browsePublicChallenges,
  getChallenge,
  updateChallenge,
  deleteOrCancelChallenge,
  inviteUsers,
  acceptInvite,
  declineInvite,
  setReady,
  getReadyStatus,
  leaveChallenge,
  cancelChallenge,
  getChallengeStats,
  getHistoryList,
  getChallengeHistory,
  recreateChallenge,
  checkMilestone,
};
