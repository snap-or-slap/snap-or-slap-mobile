import React from 'react';
import { Alert } from 'react-native';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import { renderWithProviders } from '../../../../test-utils/renderWithProviders';
import { NotificationsScreen } from '../NotificationsScreen';

// ── Service mocks ───────────────────────────────────────────────────────────

jest.mock('../../services', () => ({
  notificationsService: {
    syncOverlays: jest.fn(),
    listNotifications: jest.fn(),
    markRead: jest.fn(),
    markAllRead: jest.fn(),
    deleteNotification: jest.fn(),
  },
}));

jest.mock('@features/challenges/services', () => ({
  challengesService: {
    acceptInvite: jest.fn(),
    declineInvite: jest.fn(),
  },
}));

jest.mock('@services/api', () => ({
  ApiError: class ApiError extends Error {
    status: number;
    constructor({ status, message }: { status: number; message: string }) {
      super(message);
      this.status = status;
    }
  },
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { notificationsService } = require('../../services');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { challengesService } = require('@features/challenges/services');

const mockListNotifications = notificationsService.listNotifications as jest.Mock;
const mockSyncOverlays = notificationsService.syncOverlays as jest.Mock;
const mockMarkRead = notificationsService.markRead as jest.Mock;
const mockMarkAllRead = notificationsService.markAllRead as jest.Mock;
const mockDeleteNotification = notificationsService.deleteNotification as jest.Mock;
const mockAcceptInvite = challengesService.acceptInvite as jest.Mock;
const mockDeclineInvite = challengesService.declineInvite as jest.Mock;

// ── Notification factory helpers ────────────────────────────────────────────

function makeNotification(overrides: Record<string, unknown> = {}) {
  return {
    id: 'notif-1',
    title: 'Test notification',
    message: 'You have a new update.',
    category: 'system',
    type: 'system',
    isRead: false,
    createdAt: '2026-05-20T06:00:00.000Z',
    ...overrides,
  };
}

function makeChallengeInviteNotification(overrides: Record<string, unknown> = {}) {
  return {
    id: 'notif-invite-1',
    title: 'Challenge invitation',
    message: 'You were invited to Morning Run.',
    category: 'challenge',
    type: 'challenge_invite',
    isRead: false,
    challengeId: 'challenge-1',
    challengeTitle: 'Morning Run',
    inviterId: 'user-2',
    ...overrides,
  };
}

// ── Tests ───────────────────────────────────────────────────────────────────

describe('NotificationsScreen — Loading State', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSyncOverlays.mockResolvedValue(undefined);
    // Promise that never resolves — keeps loading state
    mockListNotifications.mockReturnValue(new Promise(() => {}));
  });

  it('shows loading notifications card initially', () => {
    renderWithProviders(<NotificationsScreen />);

    expect(screen.getByText('Loading notifications')).toBeTruthy();
    expect(screen.getByTestId('notifications-screen')).toBeTruthy();
  });
});

describe('NotificationsScreen — Error State', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSyncOverlays.mockResolvedValue(undefined);
    mockListNotifications.mockRejectedValue(new Error('Failed to load'));
  });

  it('shows error state with Retry button after load failure', async () => {
    renderWithProviders(<NotificationsScreen />);

    await waitFor(() => {
      expect(screen.getByText('Could not load notifications')).toBeTruthy();
    });
    expect(screen.getByTestId('notifications-retry-button')).toBeTruthy();
  });

  it('retries loading when Retry button is pressed', async () => {
    renderWithProviders(<NotificationsScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('notifications-retry-button')).toBeTruthy();
    });

    mockListNotifications.mockResolvedValueOnce({
      notifications: [],
      unreadCount: 0,
    });

    fireEvent.press(screen.getByTestId('notifications-retry-button'));

    await waitFor(() => {
      expect(screen.getByText('No notifications yet')).toBeTruthy();
    });
  });

  it('shows error message from API error', async () => {
    mockListNotifications.mockRejectedValueOnce(new Error('Server is down'));

    renderWithProviders(<NotificationsScreen />);

    await waitFor(() => {
      expect(screen.getByText('Server is down')).toBeTruthy();
    });
  });
});

describe('NotificationsScreen — Empty State', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSyncOverlays.mockResolvedValue(undefined);
    mockListNotifications.mockResolvedValue({
      notifications: [],
      unreadCount: 0,
    });
  });

  it('shows empty state when no notifications exist', async () => {
    renderWithProviders(<NotificationsScreen />);

    await waitFor(() => {
      expect(screen.getByText('No notifications yet')).toBeTruthy();
    });
  });

  it('shows "You are all caught up" subtitle when unread count is 0', async () => {
    renderWithProviders(<NotificationsScreen />);

    await waitFor(() => {
      expect(screen.getByText('You are all caught up')).toBeTruthy();
    });
  });

  it('Mark all read button is disabled when unread count is 0', async () => {
    renderWithProviders(<NotificationsScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('notifications-mark-all-read')).toBeDisabled();
    });
  });
});

describe('NotificationsScreen — Notification List', () => {
  const UNREAD_NOTIF = makeNotification({ id: 'notif-1', isRead: false, title: 'Unread Alert' });
  const READ_NOTIF = makeNotification({ id: 'notif-2', isRead: true, title: 'Read Notification' });

  beforeEach(() => {
    jest.clearAllMocks();
    mockSyncOverlays.mockResolvedValue(undefined);
    mockListNotifications.mockResolvedValue({
      notifications: [UNREAD_NOTIF, READ_NOTIF],
      unreadCount: 1,
    });
    mockMarkRead.mockResolvedValue(undefined);
    mockMarkAllRead.mockResolvedValue(undefined);
    mockDeleteNotification.mockResolvedValue(undefined);
  });

  it('renders notification cards after loading', async () => {
    renderWithProviders(<NotificationsScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('notification-card-notif-1')).toBeTruthy();
    });
    expect(screen.getByTestId('notification-card-notif-2')).toBeTruthy();
    expect(screen.getByText('Unread Alert')).toBeTruthy();
    expect(screen.getByText('Read Notification')).toBeTruthy();
  });

  it('shows "New" badge on unread notifications', async () => {
    renderWithProviders(<NotificationsScreen />);

    await waitFor(() => {
      expect(screen.getByText('New')).toBeTruthy();
    });
  });

  it('shows unread count in subtitle when count > 0', async () => {
    renderWithProviders(<NotificationsScreen />);

    await waitFor(() => {
      expect(screen.getByText('1 unread update')).toBeTruthy();
    });
  });

  it('Mark all read is enabled when there are unread notifications', async () => {
    renderWithProviders(<NotificationsScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('notifications-mark-all-read')).not.toBeDisabled();
    });
  });

  it('calls markAllRead and reloads when Mark all read is pressed', async () => {
    renderWithProviders(<NotificationsScreen />);

    // Wait for notifications to load and button to be enabled
    await waitFor(() => {
      const btn = screen.getByTestId('notifications-mark-all-read');
      expect(btn).not.toBeDisabled();
    });

    fireEvent.press(screen.getByTestId('notifications-mark-all-read'));

    await waitFor(() => {
      expect(mockMarkAllRead).toHaveBeenCalledTimes(1);
    });
  });

  it('shows notification count in toolbar', async () => {
    renderWithProviders(<NotificationsScreen />);

    await waitFor(() => {
      expect(screen.getByText('2 notifications')).toBeTruthy();
    });
  });

  it('renders filter category buttons', async () => {
    renderWithProviders(<NotificationsScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('notification-filter-all')).toBeTruthy();
    });
    expect(screen.getByTestId('notification-filter-challenge')).toBeTruthy();
    expect(screen.getByTestId('notification-filter-social')).toBeTruthy();
    expect(screen.getByTestId('notification-filter-system')).toBeTruthy();
  });

  it('switches category filter when pressing filter buttons', async () => {
    mockListNotifications.mockResolvedValue({
      notifications: [],
      unreadCount: 0,
    });

    renderWithProviders(<NotificationsScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('notification-filter-challenge')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('notification-filter-challenge'));

    await waitFor(() => {
      expect(mockListNotifications).toHaveBeenCalledTimes(2);
    });
  });

  it('shows back button and calls onBack when pressed', async () => {
    const onBack = jest.fn();
    renderWithProviders(<NotificationsScreen onBack={onBack} />);

    await waitFor(() => {
      expect(screen.getByTestId('notifications-back-button')).toBeTruthy();
    });
    fireEvent.press(screen.getByTestId('notifications-back-button'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('calls onOpenChallenge when pressing a regular notification with challengeId', async () => {
    const onOpenChallenge = jest.fn();
    const challengeNotif = makeNotification({
      id: 'notif-ch',
      title: 'Check in now',
      category: 'challenge',
      type: 'checkin_reminder',
      challengeId: 'challenge-1',
      isRead: true,
    });
    mockListNotifications.mockResolvedValue({
      notifications: [challengeNotif],
      unreadCount: 0,
    });

    renderWithProviders(<NotificationsScreen onOpenChallenge={onOpenChallenge} />);

    await waitFor(() => {
      expect(screen.getByTestId('notification-card-notif-ch')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('notification-card-notif-ch'));

    await waitFor(() => {
      expect(onOpenChallenge).toHaveBeenCalledWith('challenge-1');
    });
  });

  it('shows Alert and triggers delete when Delete button is pressed', async () => {
    const mockAlert = jest.spyOn(Alert, 'alert').mockImplementation(
      (_title, _message, buttons) => {
        // Simulate pressing Delete
        const deleteButton = buttons?.find((b) => b.text === 'Delete');
        deleteButton?.onPress?.();
      }
    );

    renderWithProviders(<NotificationsScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('notification-delete-notif-1')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('notification-delete-notif-1'));

    expect(mockAlert).toHaveBeenCalledWith(
      'Delete notification',
      'This notification will be removed from your inbox.',
      expect.any(Array),
    );

    await waitFor(() => {
      expect(mockDeleteNotification).toHaveBeenCalledWith('notif-1');
    });

    mockAlert.mockRestore();
  });

  it('calls onUnreadCountChange when unread count changes', async () => {
    const onUnreadCountChange = jest.fn();

    renderWithProviders(<NotificationsScreen onUnreadCountChange={onUnreadCountChange} />);

    await waitFor(() => {
      expect(onUnreadCountChange).toHaveBeenCalledWith(1);
    });
  });
});

describe('NotificationsScreen — Challenge Invite Notifications', () => {
  const INVITE_NOTIF = makeChallengeInviteNotification();

  beforeEach(() => {
    jest.clearAllMocks();
    mockSyncOverlays.mockResolvedValue(undefined);
    mockListNotifications.mockResolvedValue({
      notifications: [INVITE_NOTIF],
      unreadCount: 1,
    });
    mockMarkRead.mockResolvedValue(undefined);
    mockAcceptInvite.mockResolvedValue(undefined);
    mockDeclineInvite.mockResolvedValue(undefined);
    mockListNotifications.mockResolvedValue({
      notifications: [INVITE_NOTIF],
      unreadCount: 1,
    });
  });

  it('renders challenge invite notification card', async () => {
    renderWithProviders(<NotificationsScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('notification-card-notif-invite-1')).toBeTruthy();
    });
    expect(screen.getByText('Challenge invitation')).toBeTruthy();
  });

  it('renders Accept and Decline buttons on challenge invite', async () => {
    renderWithProviders(<NotificationsScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('notification-accept-notif-invite-1')).toBeTruthy();
    });
    expect(screen.getByTestId('notification-decline-notif-invite-1')).toBeTruthy();
  });

  it('calls acceptInvite when Accept is pressed', async () => {
    mockListNotifications
      .mockResolvedValueOnce({
        notifications: [INVITE_NOTIF],
        unreadCount: 1,
      })
      .mockResolvedValueOnce({
        notifications: [],
        unreadCount: 0,
      });

    const onOpenChallenge = jest.fn();
    renderWithProviders(<NotificationsScreen onOpenChallenge={onOpenChallenge} />);

    await waitFor(() => {
      expect(screen.getByTestId('notification-accept-notif-invite-1')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('notification-accept-notif-invite-1'));

    await waitFor(() => {
      expect(mockAcceptInvite).toHaveBeenCalledWith('challenge-1');
      expect(onOpenChallenge).toHaveBeenCalledWith('challenge-1');
    });
  });

  it('calls declineInvite when Decline is pressed', async () => {
    mockListNotifications
      .mockResolvedValueOnce({
        notifications: [INVITE_NOTIF],
        unreadCount: 1,
      })
      .mockResolvedValueOnce({
        notifications: [],
        unreadCount: 0,
      });

    renderWithProviders(<NotificationsScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('notification-decline-notif-invite-1')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('notification-decline-notif-invite-1'));

    await waitFor(() => {
      expect(mockDeclineInvite).toHaveBeenCalledWith('challenge-1');
    });
  });

  it('shows action error when acceptInvite fails', async () => {
    mockAcceptInvite.mockRejectedValueOnce(new Error('Already responded'));

    renderWithProviders(<NotificationsScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('notification-accept-notif-invite-1')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('notification-accept-notif-invite-1'));

    await waitFor(() => {
      expect(screen.getByText('Already responded')).toBeTruthy();
    });
  });
});
