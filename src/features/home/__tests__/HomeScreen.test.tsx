import React from 'react';
import { fireEvent, screen, waitFor, within } from '@testing-library/react-native';

import { renderWithProviders } from '../../../test-utils/renderWithProviders';
import { notificationsService } from '@features/notifications/services';
import { HomeScreen } from '../screens/HomeScreen';

jest.mock('@features/challenges', () => {
  const React = require('react');
  const { Text, View } = require('react-native');

  const MockScreen = ({ testID, label }: { testID: string; label: string }) =>
    React.createElement(View, { testID }, React.createElement(Text, null, label));

  return {
    ChallengeHubScreen: () =>
      React.createElement(MockScreen, {
        testID: 'mock-challenge-hub-screen',
        label: 'Challenge Hub',
      }),
    ChallengeDetailScreen: () =>
      React.createElement(MockScreen, {
        testID: 'mock-challenge-detail-screen',
        label: 'Challenge Detail',
      }),
    CheckInCameraScreen: () =>
      React.createElement(MockScreen, {
        testID: 'mock-check-in-camera-screen',
        label: 'Check In Camera',
      }),
    CreateChallengeScreen: () =>
      React.createElement(MockScreen, {
        testID: 'mock-create-challenge-screen',
        label: 'Create Challenge',
      }),
  };
});

jest.mock('@features/friends', () => {
  const React = require('react');
  const { Text, View } = require('react-native');

  const MockScreen = ({ testID, label }: { testID: string; label: string }) =>
    React.createElement(View, { testID }, React.createElement(Text, null, label));

  return {
    AddFriendScreen: () =>
      React.createElement(MockScreen, {
        testID: 'mock-add-friend-screen',
        label: 'Add Friend',
      }),
    FriendProfileScreen: () =>
      React.createElement(MockScreen, {
        testID: 'mock-friend-profile-screen',
        label: 'Friend Profile',
      }),
    FriendRequestsScreen: () =>
      React.createElement(MockScreen, {
        testID: 'mock-friend-requests-screen',
        label: 'Friend Requests',
      }),
    FriendsHubScreen: () =>
      React.createElement(MockScreen, {
        testID: 'mock-friends-hub-screen',
        label: 'Friends Hub',
      }),
    UserProfilePreviewScreen: () =>
      React.createElement(MockScreen, {
        testID: 'mock-user-profile-preview-screen',
        label: 'User Preview',
      }),
  };
});

jest.mock('@features/profile', () => {
  const React = require('react');
  const { Text, View } = require('react-native');

  return {
    ProfileScreen: () =>
      React.createElement(
        View,
        { testID: 'profile-screen' },
        React.createElement(Text, null, 'Profile'),
      ),
  };
});

jest.mock('@features/notifications', () => {
  const React = require('react');
  const { Text, View } = require('react-native');

  return {
    NotificationsScreen: () =>
      React.createElement(
        View,
        { testID: 'mock-notifications-screen' },
        React.createElement(Text, null, 'Notifications'),
      ),
  };
});

jest.mock('@features/notifications/services', () => ({
  notificationsService: {
    listNotifications: jest.fn(),
  },
}));

const listNotificationsMock = notificationsService.listNotifications as jest.Mock;

async function renderHomeScreen() {
  const result = renderWithProviders(<HomeScreen />);

  await waitFor(() => {
    expect(listNotificationsMock).toHaveBeenCalledTimes(1);
  });

  return result;
}

describe('HomeScreen', () => {
  beforeEach(() => {
    listNotificationsMock.mockResolvedValue({ unreadCount: 0 });
  });

  it('renders with Challenges tab by default', async () => {
    const { unmount } = await renderHomeScreen();

    expect(screen.getByTestId('home-screen')).toBeTruthy();
    expect(screen.getByTestId('home-bottom-tab-bar')).toBeTruthy();
    expect(screen.getByTestId('challenges-screen')).toBeTruthy();

    expect(screen.getByText('Active Challenges')).toBeTruthy();

    unmount();
  });

  it('switches to Friends tab when pressing Friends', async () => {
    const { unmount } = await renderHomeScreen();

    fireEvent.press(screen.getByTestId('home-tab-friends'));

    const friendsScreen = screen.getByTestId('friends-screen');

    expect(friendsScreen).toBeTruthy();
    expect(within(friendsScreen).getByText('Friends')).toBeTruthy();

    await waitFor(() => {
      expect(listNotificationsMock).toHaveBeenCalledTimes(2);
    });

    unmount();
  });

  it('switches to Profile tab when pressing Profile', async () => {
    const { unmount } = await renderHomeScreen();

    fireEvent.press(screen.getByTestId('home-tab-profile'));

    const profileScreen = screen.getByTestId('profile-screen');

    expect(profileScreen).toBeTruthy();
    expect(within(profileScreen).getByText('Profile')).toBeTruthy();

    await waitFor(() => {
      expect(listNotificationsMock).toHaveBeenCalledTimes(2);
    });

    unmount();
  });

  it('switches back to Challenges tab when pressing Challenges', async () => {
    const { unmount } = await renderHomeScreen();

    fireEvent.press(screen.getByTestId('home-tab-friends'));

    expect(screen.getByTestId('friends-screen')).toBeTruthy();

    fireEvent.press(screen.getByTestId('home-tab-challenges'));

    expect(screen.getByTestId('challenges-screen')).toBeTruthy();
    expect(screen.getByText('Active Challenges')).toBeTruthy();

    await waitFor(() => {
      expect(listNotificationsMock).toHaveBeenCalledTimes(3);
    });

    unmount();
  });

  it('does not crash when rendered', async () => {
    let unmount: (() => void) | undefined;

    expect(() => {
      ({ unmount } = renderWithProviders(<HomeScreen />));
    }).not.toThrow();

    await waitFor(() => {
      expect(listNotificationsMock).toHaveBeenCalledTimes(1);
    });

    unmount?.();
  });
});
