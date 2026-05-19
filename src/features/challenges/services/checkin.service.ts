import { apiClient, apiRoutes, mapKeysToCamel } from '@services/api';

export type SubmitCheckInPayload = {
  evidenceUrl?: string;
  caption?: string;
  userId?: string;
};

export type SubmitCheckInWithPhotoPayload = {
  photoUri: string;
  caption?: string;
  userId?: string;
};

export type SubmitCheckInResult = {
  checkin: {
    id?: string;
    challengeId?: string;
    userId?: string;
    cycleNumber?: number;
    evidenceUrl?: string;
    caption?: string;
    createdAt?: string;
  };
  totalCheckins?: number;
  squadStatus?: {
    heartsLeft?: number;
    membersCheckedIn?: number;
    membersTotal?: number;
  };
};

export type ListCheckinsParams = {
  member_id?: string;
  page?: number;
  limit?: number;
};

function appendUserIdToRoute(route: string, userId?: string): string {
  if (!userId) {
    return route;
  }

  const separator = route.includes('?') ? '&' : '?';

  return `${route}${separator}user_id=${encodeURIComponent(userId)}`;
}

function getImageTypeFromUri(uri: string): string {
  const normalizedUri = uri.toLowerCase().split('?')[0] ?? '';

  if (normalizedUri.endsWith('.png')) {
    return 'image/png';
  }

  if (normalizedUri.endsWith('.webp')) {
    return 'image/webp';
  }

  if (normalizedUri.endsWith('.jpg') || normalizedUri.endsWith('.jpeg')) {
    return 'image/jpeg';
  }

  return 'image/jpeg';
}

function getImageNameFromUri(uri: string): string {
  const mimeType = getImageTypeFromUri(uri);

  if (mimeType === 'image/png') {
    return `checkin-${Date.now()}.png`;
  }

  if (mimeType === 'image/webp') {
    return `checkin-${Date.now()}.webp`;
  }

  return `checkin-${Date.now()}.jpg`;
}

export async function listCheckins<T = unknown>(
  challengeId: string,
  params: ListCheckinsParams = {},
): Promise<T> {
  const response = await apiClient.get(
    apiRoutes.challenges.checkins(challengeId),
    {
      query: params,
    },
  );

  return mapKeysToCamel<T>(response);
}

export async function getTodayStatus<T = unknown>(
  challengeId: string,
): Promise<T> {
  const response = await apiClient.get(
    apiRoutes.challenges.todayCheckins(challengeId),
  );

  return mapKeysToCamel<T>(response);
}

export async function nudgeMember<T = unknown>(
  challengeId: string,
  memberId: string,
): Promise<T> {
  const response = await apiClient.post(
    apiRoutes.challenges.nudge(challengeId, memberId),
    undefined,
    {
      withCurrentUser: true,
    },
  );

  return mapKeysToCamel<T>(response);
}

export async function getNudgeHistory<T = unknown>(
  challengeId: string,
  memberId: string,
): Promise<T> {
  const response = await apiClient.get(
    apiRoutes.challenges.nudge(challengeId, memberId),
  );

  return mapKeysToCamel<T>(response);
}

export async function submitCheckIn(
  challengeId: string,
  payload: SubmitCheckInPayload,
): Promise<SubmitCheckInResult> {
  const { userId, ...body } = payload;

  const route = appendUserIdToRoute(
    apiRoutes.challenges.checkins(challengeId),
    userId,
  );

  const response = await apiClient.post(route, body, {
    withCurrentUser: !userId,
  });

  return mapKeysToCamel<SubmitCheckInResult>(response);
}

export async function submitCheckin(
  challengeId: string,
  payload: SubmitCheckInPayload,
): Promise<SubmitCheckInResult> {
  return submitCheckIn(challengeId, payload);
}

export async function submitCheckinWithPhoto(
  challengeId: string,
  payload: SubmitCheckInWithPhotoPayload,
): Promise<SubmitCheckInResult> {
  const formData = new FormData();

  formData.append('proof', {
    uri: payload.photoUri,
    name: getImageNameFromUri(payload.photoUri),
    type: getImageTypeFromUri(payload.photoUri),
  } as any);

  if (payload.caption?.trim()) {
    formData.append('caption', payload.caption.trim());
  }

  const route = appendUserIdToRoute(
    apiRoutes.challenges.checkins(challengeId),
    payload.userId,
  );

  const response = await apiClient.post(route, formData, {
    withCurrentUser: !payload.userId,

    /**
     * Không set thủ công Content-Type ở đây.
     * React Native fetch cần tự thêm multipart boundary.
     *
     * Nếu apiClient của bạn có option riêng cho multipart
     * thì có thể đọc option này để bỏ header application/json.
     */
    isMultipart: true,
  } as any);

  return mapKeysToCamel<SubmitCheckInResult>(response);
}

export const checkinService = {
  listCheckins,
  getTodayStatus,
  nudgeMember,
  getNudgeHistory,

  // Giữ cả hai tên để không vỡ code cũ.
  submitCheckIn,
  submitCheckin,

  // Method mới cho camera upload file thật.
  submitCheckinWithPhoto,
};