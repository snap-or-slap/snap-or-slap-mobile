import { baseApi } from './baseApi';
import {
  listNotifications,
  markRead,
  markAllRead,
  deleteNotification,
} from '../../features/notifications/services/notifications.service';
import type { ListNotificationsParams } from '../../features/notifications/services/notifications.service';

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

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listNotifications: builder.query<unknown, ListNotificationsParams | void>({
      queryFn: async (params) => {
        try {
          const data = await listNotifications(params ?? {});
          return { data };
        } catch (error) {
          return toError(error);
        }
      },
      providesTags: ['Notification'],
    }),

    markRead: builder.mutation<unknown, string[]>({
      queryFn: async (notificationIds) => {
        try {
          const data = await markRead(notificationIds);
          return { data };
        } catch (error) {
          return toError(error);
        }
      },
      invalidatesTags: ['Notification'],
    }),

    markAllRead: builder.mutation<unknown, void>({
      queryFn: async () => {
        try {
          const data = await markAllRead();
          return { data };
        } catch (error) {
          return toError(error);
        }
      },
      invalidatesTags: ['Notification'],
    }),

    deleteNotification: builder.mutation<void, string>({
      queryFn: async (id) => {
        try {
          await deleteNotification(id);
          return { data: undefined };
        } catch (error) {
          return toError(error);
        }
      },
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useListNotificationsQuery,
  useMarkReadMutation,
  useMarkAllReadMutation,
  useDeleteNotificationMutation,
} = notificationApi;
