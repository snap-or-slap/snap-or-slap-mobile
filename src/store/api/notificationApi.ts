import { baseApi, toApiError } from './baseApi';
import {
  listNotifications,
  markRead,
  markAllRead,
  deleteNotification,
} from '../../features/notifications/services/notifications.service';
import type { ListNotificationsParams } from '../../features/notifications/services/notifications.service';

// ── API ──────────────────────────────────────────────────────────

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listNotifications: builder.query<unknown, ListNotificationsParams | void>({
      queryFn: async (params) => {
        try {
          const data = await listNotifications(params ?? {});
          return { data };
        } catch (error) {
          return toApiError(error);
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
          return toApiError(error);
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
          return toApiError(error);
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
          return toApiError(error);
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
