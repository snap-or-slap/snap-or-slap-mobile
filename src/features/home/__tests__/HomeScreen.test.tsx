import React from 'react';
import { fireEvent, screen, within } from '@testing-library/react-native';

import { renderWithProviders } from '../../../test-utils/renderWithProviders';
import { HomeScreen } from '../screens/HomeScreen';

describe('HomeScreen', () => {
  it('renders with Challenges tab by default', () => {
    renderWithProviders(<HomeScreen />);

    expect(screen.getByTestId('home-screen')).toBeTruthy();
    expect(screen.getByTestId('home-bottom-tab-bar')).toBeTruthy();
    expect(screen.getByTestId('challenges-screen')).toBeTruthy();

    expect(screen.getByText('Active Challenges')).toBeTruthy();
  });

  it('switches to Friends tab when pressing Friends', () => {
    renderWithProviders(<HomeScreen />);

    fireEvent.press(screen.getByTestId('home-tab-friends'));

    const friendsScreen = screen.getByTestId('friends-screen');

    expect(friendsScreen).toBeTruthy();
    expect(within(friendsScreen).getByText('Friends')).toBeTruthy();
  });

  it('switches to Profile tab when pressing Profile', () => {
    renderWithProviders(<HomeScreen />);

    fireEvent.press(screen.getByTestId('home-tab-profile'));

    const profileScreen = screen.getByTestId('profile-screen');

    expect(profileScreen).toBeTruthy();
    expect(within(profileScreen).getByText('Profile')).toBeTruthy();
  });

  it('switches back to Challenges tab when pressing Challenges', () => {
    renderWithProviders(<HomeScreen />);

    fireEvent.press(screen.getByTestId('home-tab-friends'));

    expect(screen.getByTestId('friends-screen')).toBeTruthy();

    fireEvent.press(screen.getByTestId('home-tab-challenges'));

    expect(screen.getByTestId('challenges-screen')).toBeTruthy();
    expect(screen.getByText('Active Challenges')).toBeTruthy();
  });

  it('does not crash when rendered', () => {
    expect(() => {
      renderWithProviders(<HomeScreen />);
    }).not.toThrow();
  });
});