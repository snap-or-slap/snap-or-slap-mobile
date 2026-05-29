import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import { renderWithProviders } from '../../../../test-utils/renderWithProviders';
import { FriendsHubScreen } from '../FriendsHubScreen';

// ── Service mocks ───────────────────────────────────────────────────────────

const mockRespondMut = jest.fn();

jest.mock('@store/api/friendApi', () => ({
  useGetFriendsQuery: jest.fn(() => ({
    data: [],
    isLoading: true,
  })),
  useGetIncomingRequestsQuery: jest.fn(() => ({
    data: [],
  })),
  useGetOutgoingRequestsQuery: jest.fn(() => ({
    data: [],
  })),
  useRespondToFriendRequestMutation: () => [mockRespondMut],
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { useGetFriendsQuery, useGetIncomingRequestsQuery } = require('@store/api/friendApi');

describe('FriendsHubScreen', () => {
  const mockOnOpenAddFriend = jest.fn();
  const mockOnOpenFriendProfile = jest.fn();
  const mockOnOpenFriendRequests = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    useGetFriendsQuery.mockReturnValue({
      data: [
        {
          id: 'user-1',
          username: 'friend1',
          displayName: 'Friend One',
        },
        {
          id: 'user-2',
          username: 'friend2',
          displayName: 'Friend Two',
        }
      ],
      isLoading: false,
    });
    
    useGetIncomingRequestsQuery.mockReturnValue({
      data: [
        {
          id: 'req-1',
          user: {
            id: 'user-3',
            username: 'stranger',
            displayName: 'Stranger User',
            mutualCount: 0,
          }
        }
      ],
    });

    mockRespondMut.mockReturnValue({ unwrap: () => Promise.resolve() });
  });



  it('renders friends list and incoming requests preview', async () => {
    renderWithProviders(<FriendsHubScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('friends-hub-screen')).toBeTruthy();
    });

    expect(screen.getByText('Friend One')).toBeTruthy();
    expect(screen.getByText('Friend Two')).toBeTruthy();
    expect(screen.getByText('Friend Requests')).toBeTruthy();
    expect(screen.getByText('Stranger User')).toBeTruthy();
  });

  it('handles accept incoming request', async () => {
    renderWithProviders(<FriendsHubScreen />);

    // Press Accept on the preview card
    fireEvent.press(screen.getByText('Accept'));

    await waitFor(() => {
      expect(mockRespondMut).toHaveBeenCalledWith({ requestId: 'req-1', action: 'accept' });
    });
  });

  it('handles decline incoming request', async () => {
    renderWithProviders(<FriendsHubScreen />);

    // Press Decline on the preview card
    fireEvent.press(screen.getByText('Decline'));

    await waitFor(() => {
      expect(mockRespondMut).toHaveBeenCalledWith({ requestId: 'req-1', action: 'decline' });
    });
  });

  it('handles search toggle and local search', async () => {
    renderWithProviders(<FriendsHubScreen />);

    // Open search
    fireEvent.press(screen.getByTestId('friends-hub-search-toggle'));

    await waitFor(() => {
      expect(screen.getByTestId('friends-hub-search')).toBeTruthy();
    });

    // Search for "two"
    fireEvent.changeText(screen.getByTestId('friends-hub-search'), 'two');

    await waitFor(() => {
      expect(screen.getByText('Friend Two')).toBeTruthy();
      expect(screen.queryByText('Friend One')).toBeNull();
    });

    // Clear search
    // Assuming FriendSearchBar has a clear button testID or we can change text to ''
    fireEvent.changeText(screen.getByTestId('friends-hub-search'), '');
    
    await waitFor(() => {
      expect(screen.getByText('Friend One')).toBeTruthy();
    });
  });

  it('handles open add friend', async () => {
    renderWithProviders(<FriendsHubScreen onOpenAddFriend={mockOnOpenAddFriend} />);

    fireEvent.press(screen.getByTestId('friends-hub-add-friend'));
    expect(mockOnOpenAddFriend).toHaveBeenCalledTimes(1);
  });
  
  it('handles open friend profile', async () => {
    renderWithProviders(<FriendsHubScreen onOpenFriendProfile={mockOnOpenFriendProfile} />);

    // Press on a friend item
    fireEvent.press(screen.getByText('Friend One'));
    
    await waitFor(() => {
      expect(mockOnOpenFriendProfile).toHaveBeenCalledWith('user-1');
    });
  });
  
  it('renders empty state when no friends', async () => {
    useGetFriendsQuery.mockReturnValue({
      data: [],
      isLoading: false,
    });
    
    renderWithProviders(<FriendsHubScreen />);
    
    await waitFor(() => {
      expect(screen.getByTestId('friends-hub-empty')).toBeTruthy();
    });
  });
});
