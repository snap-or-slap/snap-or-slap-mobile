import { apiClient, mapKeysToCamel } from '@services/api';

import {
  deleteNotification,
  listNotifications,
  markAllRead,
  markRead,
  syncOverlays,
} from '../notifications.service';

jest.mock('@services/api', () => {
  const actual = jest.requireActual('@services/api');

  return {
    ...actual,
    apiClient: {
      get: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    },
    mapKeysToCamel: jest.fn((value) => value),
  };
});

const mockedApiClient = apiClient as unknown as jest.Mocked<Pick<typeof apiClient, 'get' | 'put' | 'delete'>>;
const mockedMapKeysToCamel = mapKeysToCamel as unknown as jest.Mock;

describe('notifications.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lists notifications with filters for the current user', async () => {
    mockedApiClient.get.mockResolvedValueOnce({ notifications: [] });

    await expect(
      listNotifications({ page: 2, limit: 20, is_read: false, category: 'challenge' }),
    ).resolves.toEqual({ notifications: [] });

    expect(mockedApiClient.get).toHaveBeenCalledWith('/notifications', {
      query: { page: 2, limit: 20, is_read: false, category: 'challenge' },
      withCurrentUser: true,
    });
    expect(mockedMapKeysToCamel).toHaveBeenCalledWith({ notifications: [] });
  });

  it('marks selected notifications or all notifications as read', async () => {
    mockedApiClient.put.mockResolvedValueOnce({ updated_count: 2 });
    await expect(markRead(['n1', 'n2'])).resolves.toEqual({ updated_count: 2 });
    expect(mockedApiClient.put).toHaveBeenCalledWith(
      '/notifications/read',
      { notification_ids: ['n1', 'n2'] },
      { withCurrentUser: true },
    );

    mockedApiClient.put.mockResolvedValueOnce({ updated_count: 10 });
    await expect(markAllRead()).resolves.toEqual({ updated_count: 10 });
    expect(mockedApiClient.put).toHaveBeenLastCalledWith(
      '/notifications/read',
      { mark_all: true },
      { withCurrentUser: true },
    );
  });

  it('deletes a notification and syncs overlays', async () => {
    mockedApiClient.get.mockResolvedValueOnce({ pending_overlays: [] });

    await deleteNotification('notification-1');
    expect(mockedApiClient.delete).toHaveBeenCalledWith('/notifications/notification-1', {
      withCurrentUser: true,
    });

    await expect(syncOverlays()).resolves.toEqual({ pending_overlays: [] });
    expect(mockedApiClient.get).toHaveBeenCalledWith('/sync', {
      withCurrentUser: true,
    });
  });
});
