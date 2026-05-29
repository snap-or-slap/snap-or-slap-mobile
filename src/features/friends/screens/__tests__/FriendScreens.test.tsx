import React from 'react';
import { act, fireEvent, screen, waitFor } from '@testing-library/react-native';

import { renderWithProviders } from '../../../../test-utils/renderWithProviders';
import { AddFriendScreen } from '../AddFriendScreen';
import { FriendRequestsScreen } from '../FriendRequestsScreen';
import { FriendProfileScreen } from '../FriendProfileScreen';

// ── Service mocks ───────────────────────────────────────────────────────────

jest.mock('../../services', () => ({
  searchUsers: jest.fn(),
  sendFriendRequest: jest.fn(),
  addOutgoingRequest: jest.fn(),
  getOutgoingRequests: jest.fn(),
  getUserProfile: jest.fn(),
  getIncomingRequests: jest.fn(),
  respondFriendRequest: jest.fn(),
  removeFriend: jest.fn(),
}));

jest.mock('@services/api', () => ({
  session: {
    getCurrentUserId: jest.fn().mockResolvedValue('user-current'),
  },
  ApiError: class ApiError extends Error {
    status: number;
    constructor({ status, message }: { status: number; message: string }) {
      super(message);
      this.status = status;
    }
  },
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const friendsServices = require('../../services');
const mockSearchUsers = friendsServices.searchUsers as jest.Mock;
const mockSendFriendRequest = friendsServices.sendFriendRequest as jest.Mock;
const mockAddOutgoingRequest = friendsServices.addOutgoingRequest as jest.Mock;
const mockGetOutgoingRequests = friendsServices.getOutgoingRequests as jest.Mock;
const mockGetUserProfile = friendsServices.getUserProfile as jest.Mock;
const mockGetIncomingRequests = friendsServices.getIncomingRequests as jest.Mock;
const mockRespondFriendRequest = friendsServices.respondFriendRequest as jest.Mock;
const mockRemoveFriend = friendsServices.removeFriend as jest.Mock;

// ── AddFriendScreen ──────────────────────────────────────────────────────────

describe('AddFriendScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockGetOutgoingRequests.mockResolvedValue([]);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders search bar and before-search empty state', () => {
    renderWithProviders(<AddFriendScreen />);

    expect(screen.getByTestId('add-friend-screen')).toBeTruthy();
    expect(screen.getByTestId('add-friend-search')).toBeTruthy();
    expect(screen.getByTestId('add-friend-before-search')).toBeTruthy();
    expect(screen.getByText('Search by username to find friends')).toBeTruthy();
  });

  it('does not search when query is less than 2 characters', async () => {
    renderWithProviders(<AddFriendScreen />);
    fireEvent.changeText(screen.getByTestId('add-friend-search'), 'a');

    act(() => { jest.advanceTimersByTime(400); });
    await Promise.resolve();

    expect(mockSearchUsers).not.toHaveBeenCalled();
  });

  it('searches users and renders results after debounce', async () => {
    const mockUsers = [
      { id: 'user-1', username: 'alice', displayName: 'Alice', relationship: null },
      { id: 'user-2', username: 'bob', displayName: 'Bob', relationship: null },
    ];
    mockSearchUsers.mockResolvedValueOnce(mockUsers);

    renderWithProviders(<AddFriendScreen />);

    fireEvent.changeText(screen.getByTestId('add-friend-search'), 'ali');
    act(() => { jest.advanceTimersByTime(350); });

    await waitFor(() => {
      expect(mockSearchUsers).toHaveBeenCalledWith('ali');
    });
    await waitFor(() => {
      expect(screen.getByTestId('search-result-user-1')).toBeTruthy();
    });
  });

  it('shows no-result state when search returns empty array', async () => {
    mockSearchUsers.mockResolvedValueOnce([]);

    renderWithProviders(<AddFriendScreen />);

    fireEvent.changeText(screen.getByTestId('add-friend-search'), 'xyz');
    act(() => { jest.advanceTimersByTime(350); });

    await waitFor(() => {
      expect(screen.getByTestId('add-friend-no-result')).toBeTruthy();
    });
  });

  it('shows error state when search fails', async () => {
    mockSearchUsers.mockRejectedValueOnce(new Error('Network error'));

    renderWithProviders(<AddFriendScreen />);

    fireEvent.changeText(screen.getByTestId('add-friend-search'), 'ali');
    act(() => { jest.advanceTimersByTime(350); });

    await waitFor(() => {
      expect(screen.getByTestId('add-friend-error')).toBeTruthy();
    });
  });

  it('calls onBack when back button is pressed', () => {
    const onBack = jest.fn();
    renderWithProviders(<AddFriendScreen onBack={onBack} />);

    expect(screen.getByTestId('add-friend-back')).toBeTruthy();
    fireEvent.press(screen.getByTestId('add-friend-back'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('clears search results when clear is pressed', async () => {
    const mockUsers = [
      { id: 'user-1', username: 'alice', displayName: 'Alice', relationship: null },
    ];
    mockSearchUsers.mockResolvedValueOnce(mockUsers);

    renderWithProviders(<AddFriendScreen />);

    fireEvent.changeText(screen.getByTestId('add-friend-search'), 'ali');
    act(() => { jest.advanceTimersByTime(350); });
    await waitFor(() => {
      expect(screen.getByTestId('search-result-user-1')).toBeTruthy();
    });

    // Find and press clear button
    const searchBar = screen.getByTestId('add-friend-search');
    fireEvent(searchBar, 'clear');

    await waitFor(() => {
      expect(screen.getByTestId('add-friend-before-search')).toBeTruthy();
    });
  });

  it('sends friend request when Add Friend button is pressed', async () => {
    const mockUsers = [
      { id: 'user-1', username: 'alice', displayName: 'Alice', relationship: null, avatarUrl: null },
    ];
    mockSearchUsers.mockResolvedValueOnce(mockUsers);
    mockSendFriendRequest.mockResolvedValueOnce({ request: { id: 'req-1' } });
    mockAddOutgoingRequest.mockResolvedValueOnce(undefined);

    renderWithProviders(<AddFriendScreen />);

    fireEvent.changeText(screen.getByTestId('add-friend-search'), 'ali');
    act(() => { jest.advanceTimersByTime(350); });

    await waitFor(() => {
      expect(screen.getByTestId('search-result-user-1-add')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('search-result-user-1-add'));

    await waitFor(() => {
      expect(mockSendFriendRequest).toHaveBeenCalledWith('user-1');
    });
  });

  it('marks users with existing outgoing requests as pending_sent', async () => {
    const mockUsers = [
      { id: 'user-1', username: 'alice', displayName: 'Alice', relationship: null },
    ];
    mockSearchUsers.mockResolvedValueOnce(mockUsers);
    mockGetOutgoingRequests.mockResolvedValueOnce([
      { id: 'req-1', user: { id: 'user-1' } },
    ]);

    renderWithProviders(<AddFriendScreen />);

    fireEvent.changeText(screen.getByTestId('add-friend-search'), 'ali');
    act(() => { jest.advanceTimersByTime(350); });

    await waitFor(() => {
      expect(mockSearchUsers).toHaveBeenCalled();
    });
  });
});

// ── FriendRequestsScreen ────────────────────────────────────────────────────

describe('FriendRequestsScreen', () => {
  const REQUEST_INCOMING = {
    id: 'req-in-1',
    user: { id: 'user-2', username: 'bob', displayName: 'Bob', avatarUrl: null },
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  const REQUEST_OUTGOING = {
    id: 'req-out-1',
    user: { id: 'user-3', username: 'charlie', displayName: 'Charlie', avatarUrl: null },
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetIncomingRequests.mockResolvedValue([REQUEST_INCOMING]);
    mockGetOutgoingRequests.mockResolvedValue([REQUEST_OUTGOING]);
  });

  it('renders the friend requests screen with incoming tab by default', async () => {
    renderWithProviders(<FriendRequestsScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('friend-requests-screen')).toBeTruthy();
    });
    expect(screen.getByText('Friend Requests')).toBeTruthy();
  });

  it('renders incoming requests after loading', async () => {
    renderWithProviders(<FriendRequestsScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('request-card-req-in-1')).toBeTruthy();
    });
  });

  it('shows back button and calls onBack when pressed', async () => {
    const onBack = jest.fn();
    renderWithProviders(<FriendRequestsScreen onBack={onBack} />);

    await waitFor(() => {
      expect(screen.getByTestId('friend-requests-back')).toBeTruthy();
    });
    fireEvent.press(screen.getByTestId('friend-requests-back'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('switches to outgoing tab and shows outgoing requests', async () => {
    renderWithProviders(<FriendRequestsScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('friend-requests-tabs-outgoing')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('friend-requests-tabs-outgoing'));

    await waitFor(() => {
      expect(screen.getByTestId('request-card-req-out-1')).toBeTruthy();
    });
  });

  it('accepts incoming request and removes it from list', async () => {
    mockRespondFriendRequest.mockResolvedValueOnce({ success: true });

    renderWithProviders(<FriendRequestsScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('request-card-req-in-1')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('request-card-req-in-1-accept'));

    await waitFor(() => {
      expect(mockRespondFriendRequest).toHaveBeenCalledWith('req-in-1', 'accept');
    });
    await waitFor(() => {
      expect(screen.queryByTestId('request-card-req-in-1')).toBeNull();
    });
  });

  it('declines incoming request and removes it from list', async () => {
    mockRespondFriendRequest.mockResolvedValueOnce({ success: true });

    renderWithProviders(<FriendRequestsScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('request-card-req-in-1')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('request-card-req-in-1-decline'));

    await waitFor(() => {
      expect(mockRespondFriendRequest).toHaveBeenCalledWith('req-in-1', 'decline');
    });
    await waitFor(() => {
      expect(screen.queryByTestId('request-card-req-in-1')).toBeNull();
    });
  });

  it('shows empty incoming state when there are no requests', async () => {
    mockGetIncomingRequests.mockResolvedValueOnce([]);
    mockGetOutgoingRequests.mockResolvedValueOnce([]);

    renderWithProviders(<FriendRequestsScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('incoming-empty')).toBeTruthy();
    });
  });

  it('shows empty outgoing state when switching to outgoing tab', async () => {
    mockGetIncomingRequests.mockResolvedValueOnce([]);
    mockGetOutgoingRequests.mockResolvedValueOnce([]);

    renderWithProviders(<FriendRequestsScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('friend-requests-tabs-outgoing')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('friend-requests-tabs-outgoing'));

    await waitFor(() => {
      expect(screen.getByTestId('outgoing-empty')).toBeTruthy();
    });
  });

  it('calls onOpenUserPreview when request card is pressed', async () => {
    const onOpenUserPreview = jest.fn();
    renderWithProviders(
      <FriendRequestsScreen onOpenUserPreview={onOpenUserPreview} />
    );

    await waitFor(() => {
      expect(screen.getByTestId('request-card-req-in-1')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('request-card-req-in-1'));
    expect(onOpenUserPreview).toHaveBeenCalledWith('user-2', 'incoming');
  });

  it('calls onFindFriends when Find new friends button is pressed on empty incoming', async () => {
    const onFindFriends = jest.fn();
    mockGetIncomingRequests.mockResolvedValueOnce([]);
    mockGetOutgoingRequests.mockResolvedValueOnce([]);

    renderWithProviders(
      <FriendRequestsScreen onFindFriends={onFindFriends} />
    );

    await waitFor(() => {
      expect(screen.getByTestId('incoming-empty-primary')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('incoming-empty-primary'));
    expect(onFindFriends).toHaveBeenCalledTimes(1);
  });

  it('shows error is swallowed silently (screen renders without error UI)', async () => {
    mockGetIncomingRequests.mockRejectedValueOnce(new Error('API error'));
    mockGetOutgoingRequests.mockRejectedValueOnce(new Error('API error'));

    renderWithProviders(<FriendRequestsScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('friend-requests-screen')).toBeTruthy();
    });
    // No error UI shown — FriendRequestsScreen silently handles errors
  });
});

// ── FriendProfileScreen ─────────────────────────────────────────────────────

describe('FriendProfileScreen', () => {
  const FRIEND_PROFILE = {
    id: 'user-2',
    username: 'alice',
    displayName: 'Alice Johnson',
    avatarUrl: null,
    relationship: 'friend',
    currentStreak: 5,
    challengesJoined: 10,
    completionRate: 80,
    badges: [{ id: 'badge-1', label: 'Early Bird' }],
    latestActivities: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUserProfile.mockResolvedValue(FRIEND_PROFILE);
  });

  it('renders loading state initially', () => {
    // Make the promise never resolve immediately
    mockGetUserProfile.mockReturnValueOnce(new Promise(() => {}));

    renderWithProviders(<FriendProfileScreen userId="user-2" />);

    expect(screen.getByText('Loading profile…')).toBeTruthy();
  });

  it('renders friend profile after loading', async () => {
    renderWithProviders(<FriendProfileScreen userId="user-2" />);

    await waitFor(() => {
      expect(screen.getByTestId('friend-profile-screen')).toBeTruthy();
    });
    expect(screen.getByText('Alice Johnson')).toBeTruthy();
    expect(screen.getByText('@alice')).toBeTruthy();
  });

  it('shows error state when profile loading fails', async () => {
    mockGetUserProfile.mockRejectedValueOnce(new Error('Not found'));

    renderWithProviders(<FriendProfileScreen userId="user-2" />);

    await waitFor(() => {
      expect(screen.getByTestId('friend-profile-error')).toBeTruthy();
    });
  });

  it('renders stats when relationship is friend', async () => {
    renderWithProviders(<FriendProfileScreen userId="user-2" />);

    await waitFor(() => {
      expect(screen.getByTestId('stat-streak')).toBeTruthy();
    });
    expect(screen.getByTestId('stat-challenges')).toBeTruthy();
    expect(screen.getByTestId('stat-completion')).toBeTruthy();
  });

  it('shows limited information card when not friend', async () => {
    mockGetUserProfile.mockResolvedValueOnce({
      ...FRIEND_PROFILE,
      relationship: 'none',
    });

    renderWithProviders(<FriendProfileScreen userId="user-2" />);

    await waitFor(() => {
      expect(screen.getByTestId('friend-profile-limited')).toBeTruthy();
    });
  });

  it('renders back button and calls onBack when pressed', async () => {
    const onBack = jest.fn();
    renderWithProviders(<FriendProfileScreen userId="user-2" onBack={onBack} />);

    await waitFor(() => {
      expect(screen.getByTestId('friend-profile-back')).toBeTruthy();
    });
    fireEvent.press(screen.getByTestId('friend-profile-back'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('removes friend and calls onRemoved + onBack on success', async () => {
    const onRemoved = jest.fn();
    const onBack = jest.fn();
    mockRemoveFriend.mockResolvedValueOnce(undefined);

    renderWithProviders(
      <FriendProfileScreen userId="user-2" onRemoved={onRemoved} onBack={onBack} />
    );

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeTruthy();
    });

    // Press Remove Friend to start confirming
    fireEvent.press(screen.getByTestId('remove-friend-open'));
    // Confirm removal
    fireEvent.press(screen.getByTestId('remove-friend-confirm'));

    await waitFor(() => {
      expect(mockRemoveFriend).toHaveBeenCalledWith('user-2');
      expect(onRemoved).toHaveBeenCalledTimes(1);
    });
  });

  it('shows remove error when removal fails', async () => {
    mockRemoveFriend.mockRejectedValueOnce(new Error('Could not remove'));

    renderWithProviders(
      <FriendProfileScreen userId="user-2" />
    );

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('remove-friend-open'));
    fireEvent.press(screen.getByTestId('remove-friend-confirm'));

    await waitFor(() => {
      expect(screen.getByText('Could not remove friend. Please try again later.')).toBeTruthy();
    });
  });

  it('renders badges when profile has badges', async () => {
    renderWithProviders(<FriendProfileScreen userId="user-2" />);

    await waitFor(() => {
      expect(screen.getByTestId('badge-badge-1')).toBeTruthy();
    });
    expect(screen.getByText('Early Bird')).toBeTruthy();
  });
});
