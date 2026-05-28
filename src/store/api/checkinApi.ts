import { baseApi } from './baseApi';
import {
  listCheckins,
  getTodayStatus,
  nudgeMember,
  submitCheckinWithPhoto,
  submitCheckIn,
} from '../../features/challenges/services/checkin.service';
import type {
  ListCheckinsParams,
  SubmitCheckInPayload,
  SubmitCheckInWithPhotoPayload,
  SubmitCheckInResult,
} from '../../features/challenges/services/checkin.service';

// ── Helper ───────────────────────────────────────────────────────

function toError(error: unknown) {
  return {
    error: {
      status: 'CUSTOM_ERROR' as const,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: error,
    },
  };
}

// ── API ──────────────────────────────────────────────────────────

export const checkinApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTodayStatus: builder.query<unknown, string>({
      queryFn: async (challengeId) => {
        try {
          const data = await getTodayStatus(challengeId);
          return { data };
        } catch (error) {
          return toError(error);
        }
      },
      providesTags: (_result, _err, challengeId) => [
        { type: 'TodayCheckin', id: challengeId },
      ],
    }),

    listCheckins: builder.query<unknown, { challengeId: string; params?: ListCheckinsParams }>({
      queryFn: async ({ challengeId, params }) => {
        try {
          const data = await listCheckins(challengeId, params);
          return { data };
        } catch (error) {
          return toError(error);
        }
      },
      providesTags: (_result, _err, { challengeId }) => [
        { type: 'Checkin', id: challengeId },
      ],
    }),

    submitCheckin: builder.mutation<SubmitCheckInResult, { challengeId: string; payload: SubmitCheckInPayload }>({
      queryFn: async ({ challengeId, payload }) => {
        try {
          const data = await submitCheckIn(challengeId, payload);
          return { data };
        } catch (error) {
          return toError(error);
        }
      },
      invalidatesTags: (_result, _err, { challengeId }) => [
        { type: 'TodayCheckin', id: challengeId },
        { type: 'Checkin', id: challengeId },
        { type: 'ChallengeDetail', id: challengeId },
        { type: 'ChallengeStats', id: challengeId },
        'Widget',
        'Challenge',
      ],
    }),

    submitCheckinWithPhoto: builder.mutation<SubmitCheckInResult, { challengeId: string; payload: SubmitCheckInWithPhotoPayload }>({
      queryFn: async ({ challengeId, payload }) => {
        try {
          const data = await submitCheckinWithPhoto(challengeId, payload);
          return { data };
        } catch (error) {
          return toError(error);
        }
      },
      invalidatesTags: (_result, _err, { challengeId }) => [
        { type: 'TodayCheckin', id: challengeId },
        { type: 'Checkin', id: challengeId },
        { type: 'ChallengeDetail', id: challengeId },
        { type: 'ChallengeStats', id: challengeId },
        'Widget',
        'Challenge',
      ],
    }),

    nudgeMember: builder.mutation<unknown, { challengeId: string; memberId: string }>({
      queryFn: async ({ challengeId, memberId }) => {
        try {
          const data = await nudgeMember(challengeId, memberId);
          return { data };
        } catch (error) {
          return toError(error);
        }
      },
      invalidatesTags: (_result, _err, { challengeId }) => [
        { type: 'ChallengeDetail', id: challengeId },
      ],
    }),
  }),
});

export const {
  useGetTodayStatusQuery,
  useListCheckinsQuery,
  useSubmitCheckinMutation,
  useSubmitCheckinWithPhotoMutation,
  useNudgeMemberMutation,
} = checkinApi;
