import { baseApi } from './baseApi';
import {
  getProfileOverview,
  getMe,
  updateMe,
  updateSettings,
  deleteAccount,
} from '../../features/profile/services/profile.service';
import type { UpdateMePayload } from '../../features/profile/services/profile.service';
import type { FrontendUser } from '../../services/api/mappers';
import { setGuest, updateUser } from '../slices/authSlice';

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

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfileOverview: builder.query<unknown, void>({
      queryFn: async () => {
        try {
          const data = await getProfileOverview();
          return { data };
        } catch (error) {
          return toError(error);
        }
      },
      providesTags: ['Profile'],
    }),

    getMe: builder.query<FrontendUser, void>({
      queryFn: async () => {
        try {
          const data = await getMe();
          return { data };
        } catch (error) {
          return toError(error);
        }
      },
      providesTags: ['Profile'],
    }),

    updateMe: builder.mutation<FrontendUser, UpdateMePayload>({
      queryFn: async (payload) => {
        try {
          const data = await updateMe(payload);
          return { data };
        } catch (error) {
          return toError(error);
        }
      },
      invalidatesTags: ['Profile'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Keep the Redux auth user in sync with profile updates
          dispatch(updateUser({
            displayName: data.displayName,
            avatarUrl: data.avatarUrl,
            bio: data.bio,
          }));
        } catch {
          // Error handled by the component
        }
      },
    }),

    updateSettings: builder.mutation<{ user: FrontendUser; message?: string }, boolean>({
      queryFn: async (isPrivate) => {
        try {
          const data = await updateSettings(isPrivate);
          return { data };
        } catch (error) {
          return toError(error);
        }
      },
      invalidatesTags: ['Profile'],
    }),

    deleteAccount: builder.mutation<void, void>({
      queryFn: async () => {
        try {
          await deleteAccount();
          return { data: undefined };
        } catch (error) {
          return toError(error);
        }
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {
          // Even if this fails, don't clear state
          return;
        }
        dispatch(setGuest());
        dispatch(baseApi.util.resetApiState());
      },
    }),
  }),
});

export const {
  useGetProfileOverviewQuery,
  useGetMeQuery,
  useUpdateMeMutation,
  useUpdateSettingsMutation,
  useDeleteAccountMutation,
} = userApi;
