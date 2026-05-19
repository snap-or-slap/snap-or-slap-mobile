import { apiClient, apiRoutes, mapKeysToCamel } from '@services/api';

export type ListNotificationsParams = {
  page?: number;
  limit?: number;
  is_read?: boolean;
  category?: 'social' | 'challenge' | 'system';
};

export async function listNotifications<T = unknown>(
  params: ListNotificationsParams = {},
): Promise<T> {
  const response = await apiClient.get(apiRoutes.notifications.list, {
    query: params,
    withCurrentUser: true,
  });
  return mapKeysToCamel<T>(response);
}

export async function markRead(notificationIds: string[]): Promise<{ updated_count?: number; updatedCount?: number }> {
  return apiClient.put(
    apiRoutes.notifications.read,
    { notification_ids: notificationIds },
    { withCurrentUser: true },
  );
}

export async function markAllRead(): Promise<{ updated_count?: number; updatedCount?: number }> {
  return apiClient.put(
    apiRoutes.notifications.read,
    { mark_all: true },
    { withCurrentUser: true },
  );
}

export async function deleteNotification(id: string): Promise<void> {
  await apiClient.delete(apiRoutes.notifications.delete(id), {
    withCurrentUser: true,
  });
}

export async function syncOverlays<T = unknown>(): Promise<T> {
  const response = await apiClient.get(apiRoutes.notifications.sync, {
    withCurrentUser: true,
  });
  return mapKeysToCamel<T>(response);
}

export const notificationsService = {
  listNotifications,
  markRead,
  markAllRead,
  deleteNotification,
  syncOverlays,
};
