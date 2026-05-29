import { baseApi, toApiError } from './baseApi';
import { authService } from '../../features/auth/services/auth.service';
import { setAuthenticated, setGuest, setSetupStage } from '../slices/authSlice';
import type { LoginPayload, RegisterPayload } from '../../features/auth/services/auth.service';
import type { AuthSession } from '../../services/api/session';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Mutations ─────────────────────────────────────────────────

    login: builder.mutation<AuthSession, LoginPayload>({
      queryFn: async (payload) => {
        try {
          const data = await authService.login(payload);
          return { data };
        } catch (error) {
          return toApiError(error);
        }
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAuthenticated(data.user));
          dispatch(setSetupStage('checking'));
        } catch {
          // Error handled by the component
        }
      },
    }),

    register: builder.mutation<AuthSession, RegisterPayload>({
      queryFn: async (payload) => {
        try {
          const data = await authService.register(payload);
          return { data };
        } catch (error) {
          return toApiError(error);
        }
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAuthenticated(data.user));
          dispatch(setSetupStage('profile'));
        } catch {
          // Error handled by the component
        }
      },
    }),

    logout: builder.mutation<void, string | undefined>({
      queryFn: async (refreshTokenValue) => {
        try {
          await authService.signout(refreshTokenValue);
          return { data: undefined };
        } catch (error) {
          return toApiError(error);
        }
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {
          // Even if API call fails, clear local state
        }
        dispatch(setGuest());
        dispatch(baseApi.util.resetApiState());
      },
    }),

    // ── Queries ───────────────────────────────────────────────────

    checkUsername: builder.query<{ available: boolean }, string>({
      queryFn: async (username) => {
        try {
          const data = await authService.checkUsername(username);
          return { data };
        } catch (error) {
          return toApiError(error);
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useLazyCheckUsernameQuery,
} = authApi;
