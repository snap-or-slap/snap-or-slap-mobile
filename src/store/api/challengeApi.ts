import { baseApi } from './baseApi';
import {
  listChallenges,
  getChallenge,
  createChallenge,
  getChallengeStats,
  acceptInvite,
  declineInvite,
  setReady,
  leaveChallenge,
  cancelChallenge,
  deleteOrCancelChallenge,
  inviteUsers,
  recreateChallenge,
  browsePublicChallenges,
  getHistoryList,
  getChallengeHistory,
  checkMilestone,
} from '../../features/challenges/services/challenges.service';
import type {
  ChallengeListFilters,
  CreateChallengePayload,
  BrowsePublicChallengesParams,
  HistoryListParams,
  RecreateChallengePayload,
} from '../../features/challenges/services/challenges.service';

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

export const challengeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Queries ─────────────────────────────────────────────────

    listChallenges: builder.query<unknown, ChallengeListFilters | void>({
      queryFn: async (filters) => {
        try {
          const data = await listChallenges(filters ?? {});
          return { data };
        } catch (error) {
          return toError(error);
        }
      },
      providesTags: ['Challenge'],
    }),

    getChallenge: builder.query<unknown, string>({
      queryFn: async (id) => {
        try {
          const data = await getChallenge(id);
          return { data };
        } catch (error) {
          return toError(error);
        }
      },
      providesTags: (_result, _err, id) => [{ type: 'ChallengeDetail', id }],
    }),

    getChallengeStats: builder.query<unknown, string>({
      queryFn: async (id) => {
        try {
          const data = await getChallengeStats(id);
          return { data };
        } catch (error) {
          return toError(error);
        }
      },
      providesTags: (_result, _err, id) => [{ type: 'ChallengeStats', id }],
    }),

    browsePublicChallenges: builder.query<unknown, BrowsePublicChallengesParams | void>({
      queryFn: async (params) => {
        try {
          const data = await browsePublicChallenges(params ?? {});
          return { data };
        } catch (error) {
          return toError(error);
        }
      },
      providesTags: ['Challenge'],
    }),

    getHistoryList: builder.query<unknown, HistoryListParams | void>({
      queryFn: async (params) => {
        try {
          const data = await getHistoryList(params ?? {});
          return { data };
        } catch (error) {
          return toError(error);
        }
      },
      providesTags: ['Challenge'],
    }),

    getChallengeHistory: builder.query<unknown, string>({
      queryFn: async (id) => {
        try {
          const data = await getChallengeHistory(id);
          return { data };
        } catch (error) {
          return toError(error);
        }
      },
      providesTags: (_result, _err, id) => [{ type: 'ChallengeDetail', id }],
    }),

    // ── Mutations ───────────────────────────────────────────────

    createChallenge: builder.mutation<unknown, CreateChallengePayload>({
      queryFn: async (payload) => {
        try {
          const data = await createChallenge(payload);
          return { data };
        } catch (error) {
          return toError(error);
        }
      },
      invalidatesTags: ['Challenge'],
    }),

    acceptInvite: builder.mutation<unknown, string>({
      queryFn: async (id) => {
        try {
          const data = await acceptInvite(id);
          return { data };
        } catch (error) {
          return toError(error);
        }
      },
      invalidatesTags: (_result, _err, id) => [
        'Challenge',
        { type: 'ChallengeDetail', id },
        'Notification',
      ],
    }),

    declineInvite: builder.mutation<unknown, string>({
      queryFn: async (id) => {
        try {
          const data = await declineInvite(id);
          return { data };
        } catch (error) {
          return toError(error);
        }
      },
      invalidatesTags: (_result, _err, id) => [
        'Challenge',
        { type: 'ChallengeDetail', id },
        'Notification',
      ],
    }),

    setReady: builder.mutation<unknown, { id: string; isReady: boolean }>({
      queryFn: async ({ id, isReady }) => {
        try {
          const data = await setReady(id, isReady);
          return { data };
        } catch (error) {
          return toError(error);
        }
      },
      invalidatesTags: (_result, _err, { id }) => [{ type: 'ChallengeDetail', id }],
    }),

    leaveChallenge: builder.mutation<unknown, string>({
      queryFn: async (id) => {
        try {
          const data = await leaveChallenge(id);
          return { data };
        } catch (error) {
          return toError(error);
        }
      },
      invalidatesTags: (_result, _err, id) => [
        'Challenge',
        { type: 'ChallengeDetail', id },
      ],
    }),

    cancelChallenge: builder.mutation<unknown, { id: string; reason?: string }>({
      queryFn: async ({ id, reason }) => {
        try {
          const data = await cancelChallenge(id, reason);
          return { data };
        } catch (error) {
          return toError(error);
        }
      },
      invalidatesTags: (_result, _err, { id }) => [
        'Challenge',
        { type: 'ChallengeDetail', id },
      ],
    }),

    deleteOrCancelChallenge: builder.mutation<unknown, string>({
      queryFn: async (id) => {
        try {
          const data = await deleteOrCancelChallenge(id);
          return { data };
        } catch (error) {
          return toError(error);
        }
      },
      invalidatesTags: ['Challenge'],
    }),

    inviteUsers: builder.mutation<unknown, { challengeId: string; userIds: string[] }>({
      queryFn: async ({ challengeId, userIds }) => {
        try {
          const data = await inviteUsers(challengeId, userIds);
          return { data };
        } catch (error) {
          return toError(error);
        }
      },
      invalidatesTags: (_result, _err, { challengeId }) => [
        { type: 'ChallengeDetail', id: challengeId },
      ],
    }),

    recreateChallenge: builder.mutation<unknown, { id: string; payload?: RecreateChallengePayload }>({
      queryFn: async ({ id, payload }) => {
        try {
          const data = await recreateChallenge(id, payload);
          return { data };
        } catch (error) {
          return toError(error);
        }
      },
      invalidatesTags: ['Challenge'],
    }),

    checkMilestone: builder.mutation<unknown, string>({
      queryFn: async (id) => {
        try {
          const data = await checkMilestone(id);
          return { data };
        } catch (error) {
          return toError(error);
        }
      },
    }),
  }),
});

export const {
  useListChallengesQuery,
  useGetChallengeQuery,
  useGetChallengeStatsQuery,
  useBrowsePublicChallengesQuery,
  useGetHistoryListQuery,
  useGetChallengeHistoryQuery,
  useCreateChallengeMutation,
  useAcceptInviteMutation,
  useDeclineInviteMutation,
  useSetReadyMutation,
  useLeaveChallengeMutation,
  useCancelChallengeMutation,
  useDeleteOrCancelChallengeMutation,
  useInviteUsersMutation,
  useRecreateChallengeMutation,
  useCheckMilestoneMutation,
} = challengeApi;
