export type SubmitCheckInPayload = {
  evidenceUrl: string;
  caption?: string;
  userId?: string;
};

export type SubmitCheckInResult = {
  checkin: {
    id?: string;
    challengeId: string;
    evidenceUrl: string;
    caption?: string;
  };
};

/**
 * POST /api/challenges/{challengeId}/checkins?user_id=<currentUserId>
 * Body: { evidenceUrl, caption }
 *
 * TODO: Route through the real apiClient once the app has an API base URL and
 * authenticated current user session. For now this preserves the exact backend
 * contract in one service-layer function and returns a demo-safe response.
 */
export async function submitCheckIn(
  challengeId: string,
  payload: SubmitCheckInPayload
): Promise<SubmitCheckInResult> {
  if (!challengeId) {
    throw new Error('Missing challenge id.');
  }

  if (!payload.evidenceUrl) {
    throw new Error('Missing photo proof.');
  }

  return Promise.resolve({
    checkin: {
      id: `local-${Date.now()}`,
      challengeId,
      evidenceUrl: payload.evidenceUrl,
      caption: payload.caption?.trim() || undefined,
    },
  });
}

export const challengeService = {
  submitCheckIn,
};
