import { apiClient, apiRoutes, mapKeysToCamel } from '@services/api';

export type SubmitCheckInPayload = {
  evidenceUrl?: string;
  caption?: string;
  userId?: string;
};

export type SubmitCheckInResult = {
  checkin: {
    id?: string;
    challengeId?: string;
    evidenceUrl?: string;
    caption?: string;
  };
};

export type ListCheckinsParams = {
  member_id?: string;
  page?: number;
  limit?: number;
};

export async function submitCheckin<T = SubmitCheckInResult>(
  challengeId: string,
  payload: SubmitCheckInPayload,
): Promise<T> {
  const { evidenceUrl, caption } = payload;
  const response = await apiClient.post(
    apiRoutes.challenges.checkins(challengeId),
    { evidenceUrl, caption },
    { withCurrentUser: true },
  );
  return mapKeysToCamel<T>(response);
}

export async function submitCheckIn<T = SubmitCheckInResult>(
  challengeId: string,
  payload: SubmitCheckInPayload,
): Promise<T> {
  return submitCheckin<T>(challengeId, payload);
}

export async function listCheckins<T = unknown>(
  challengeId: string,
  params: ListCheckinsParams = {},
): Promise<T> {
  const response = await apiClient.get(apiRoutes.challenges.checkins(challengeId), {
    query: params,
  });
  return mapKeysToCamel<T>(response);
}

export async function getTodayStatus<T = unknown>(challengeId: string): Promise<T> {
  const response = await apiClient.get(apiRoutes.challenges.todayCheckins(challengeId));
  return mapKeysToCamel<T>(response);
}

export async function nudgeMember<T = unknown>(
  challengeId: string,
  memberId: string,
): Promise<T> {
  const response = await apiClient.post(apiRoutes.challenges.nudge(challengeId, memberId), undefined, {
    withCurrentUser: true,
  });
  return mapKeysToCamel<T>(response);
}

export async function getNudgeHistory<T = unknown>(
  challengeId: string,
  memberId: string,
): Promise<T> {
  const response = await apiClient.get(apiRoutes.challenges.nudge(challengeId, memberId));
  return mapKeysToCamel<T>(response);
}

export const checkinService = {
  submitCheckin,
  submitCheckIn,
  listCheckins,
  getTodayStatus,
  nudgeMember,
  getNudgeHistory,
};
