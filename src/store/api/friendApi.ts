import { baseApi } from './baseApi';
import {
  getFriends,
  getIncomingRequests,
  getOutgoingRequests,
  sendFriendRequest,
  respondFriendRequest,
  unfriend,
  searchUsers,
  getUserProfile,
  removeFriend,
} from '../../features/friends/services/friends.service';
import type { FriendRespondAction } from '../../features/friends/types';

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

export const friendApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Queries ─────────────────────────────────────────────────

    getFriends: builder.query<unknown, void>({
      queryFn: async () => {
        try {
          const data = await getFriends();
          return { data };
        } catch (error) {
          return toError(error);
        }
      },
      providesTags: ['Friend'],
    }),

    getIncomingRequests: builder.query<unknown, void>({
      queryFn: async () => {
        try {
          const data = await getIncomingRequests();
          return { data };
        } catch (error) {
          return toError(error);
        }
      },
      providesTags: [{ type: 'FriendRequest', id: 'incoming' }],
    }),

    getOutgoingRequests: builder.query<unknown, void>({
      queryFn: async () => {
        try {
          const data = await getOutgoingRequests();
          return { data };
        } catch (error) {
          return toError(error);
        }
      },
      providesTags: [{ type: 'FriendRequest', id: 'outgoing' }],
    }),

    searchUsers: builder.query<unknown, string>({
      queryFn: async (query) => {
        try {
          const data = await searchUsers(query);
          return { data };
        } catch (error) {
          return toError(error);
        }
      },
      // No tags — ephemeral search results
    }),

    getUserProfile: builder.query<unknown, string>({
      queryFn: async (userId) => {
        try {
          const data = await getUserProfile(userId);
          return { data };
        } catch (error) {
          return toError(error);
        }
      },
      providesTags: (_result, _err, userId) => [{ type: 'UserProfile', id: userId }],
    }),

    // ── Mutations ───────────────────────────────────────────────

    sendFriendRequest: builder.mutation<unknown, string>({
      queryFn: async (receiverId) => {
        try {
          const data = await sendFriendRequest(receiverId);
          return { data };
        } catch (error) {
          return toError(error);
        }
      },
      invalidatesTags: ['FriendRequest'],
    }),

    respondToFriendRequest: builder.mutation<unknown, { requestId: string; action: FriendRespondAction }>({
      queryFn: async ({ requestId, action }) => {
        try {
          await respondFriendRequest(requestId, action);
          return { data: undefined };
        } catch (error) {
          return toError(error);
        }
      },
      invalidatesTags: ['Friend', 'FriendRequest'],
    }),

    unfriend: builder.mutation<void, string>({
      queryFn: async (friendUserId) => {
        try {
          await unfriend(friendUserId);
          return { data: undefined };
        } catch (error) {
          return toError(error);
        }
      },
      invalidatesTags: ['Friend'],
    }),

    removeFriend: builder.mutation<void, string>({
      queryFn: async (friendUserId) => {
        try {
          await removeFriend(friendUserId);
          return { data: undefined };
        } catch (error) {
          return toError(error);
        }
      },
      invalidatesTags: ['Friend', 'UserProfile'],
    }),
  }),
});

export const {
  useGetFriendsQuery,
  useGetIncomingRequestsQuery,
  useGetOutgoingRequestsQuery,
  useSearchUsersQuery,
  useLazySearchUsersQuery,
  useGetUserProfileQuery,
  useSendFriendRequestMutation,
  useRespondToFriendRequestMutation,
  useUnfriendMutation,
  useRemoveFriendMutation,
} = friendApi;
