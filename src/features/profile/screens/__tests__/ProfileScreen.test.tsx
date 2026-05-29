import React from 'react';
import { Alert } from 'react-native';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import { renderWithProviders } from '../../../../test-utils/renderWithProviders';
import { ProfileScreen } from '../ProfileScreen';

// ── Service mocks ───────────────────────────────────────────────────────────

jest.mock('../../services', () => ({
  profileService: {
    getProfileOverview: jest.fn(),
    getActivities: jest.fn(),
  },
}));

jest.mock('@services/api', () => ({
  session: {
    getCurrentUser: jest.fn(),
    getRefreshToken: jest.fn(),
    setCurrentUser: jest.fn(),
  },
}));

const mockLogout = jest.fn();
jest.mock('@store/api/authApi', () => ({
  useLogoutMutation: () => [mockLogout, { isLoading: false }],
}));

const mockDeleteAccount = jest.fn();
const mockUpdateSettings = jest.fn();
jest.mock('@store/api/userApi', () => ({
  useDeleteAccountMutation: () => [mockDeleteAccount],
  useUpdateSettingsMutation: () => [mockUpdateSettings],
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { profileService } = require('../../services');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { session } = require('@services/api');

const mockGetProfileOverview = profileService.getProfileOverview as jest.Mock;
const mockGetActivities = profileService.getActivities as jest.Mock;
const mockGetCurrentUser = session.getCurrentUser as jest.Mock;
const mockGetRefreshToken = session.getRefreshToken as jest.Mock;

const DEFAULT_USER = {
  id: 'user-1',
  username: 'testuser',
  displayName: 'Test User',
  isPrivate: false,
};

describe('ProfileScreen', () => {
  const mockOnSignedOut = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnSignedOut.mockClear();

    mockGetProfileOverview.mockResolvedValue({
      user: DEFAULT_USER,
      stats: { currentStreak: 5, challengesCompleted: 10, friendsCount: 3 },
      badges: [{ id: 'b1', label: 'First Win' }],
    });
    mockGetActivities.mockResolvedValue({
      activities: ['Completed a challenge', 'Added a new friend'],
    });
    mockGetCurrentUser.mockResolvedValue(DEFAULT_USER);
    mockGetRefreshToken.mockResolvedValue('token-123');

    mockLogout.mockReturnValue({ unwrap: () => Promise.resolve() });
    mockDeleteAccount.mockReturnValue({ unwrap: () => Promise.resolve() });
    mockUpdateSettings.mockReturnValue({ unwrap: () => Promise.resolve({ user: { ...DEFAULT_USER, isPrivate: true } }) });
  });

  it('renders loading state initially', () => {
    renderWithProviders(<ProfileScreen />);
    expect(screen.getByText('Loading profile...')).toBeTruthy();
  });

  it('renders error state if profile fails to load', async () => {
    mockGetProfileOverview.mockRejectedValueOnce(new Error('Failed'));
    
    renderWithProviders(<ProfileScreen />);

    await waitFor(() => {
      expect(screen.getByText('Could not load your profile. Please try again later.')).toBeTruthy();
    });
  });

  it('renders profile data successfully', async () => {
    renderWithProviders(<ProfileScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('profile-screen')).toBeTruthy();
    });

    expect(screen.getAllByText('Test User').length).toBeGreaterThan(0);
    expect(screen.getAllByText('@testuser').length).toBeGreaterThan(0);
    expect(screen.getByText('Completed a challenge')).toBeTruthy();
  });

  it('handles logout flow successfully', async () => {
    renderWithProviders(<ProfileScreen onSignedOut={mockOnSignedOut} />);

    await waitFor(() => {
      expect(screen.getByTestId('profile-logout-button')).toBeTruthy();
    });

    // Open modal
    fireEvent.press(screen.getByTestId('profile-logout-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('logout-confirm-modal')).toBeTruthy();
    });

    // Confirm logout
    fireEvent.press(screen.getByTestId('logout-confirm-button'));

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledWith('token-123');
      expect(mockOnSignedOut).toHaveBeenCalledTimes(1);
    });
  });

  it('handles delete account flow successfully', async () => {
    jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
      // Simulate pressing "Continue" button
      const continueBtn = buttons?.find(b => b.style === 'destructive');
      continueBtn?.onPress?.();
    });

    renderWithProviders(<ProfileScreen onSignedOut={mockOnSignedOut} />);

    await waitFor(() => {
      expect(screen.getByTestId('delete-account-open')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('delete-account-open'));

    // Confirm UI should be shown
    await waitFor(() => {
      expect(screen.getByTestId('delete-account-confirm')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('delete-account-confirm'));

    await waitFor(() => {
      expect(mockDeleteAccount).toHaveBeenCalledTimes(1);
      expect(mockOnSignedOut).toHaveBeenCalledTimes(1);
    });
  });

  it('handles privacy toggle successfully', async () => {
    renderWithProviders(<ProfileScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('profile-privacy-switch')).toBeTruthy();
    });

    fireEvent(screen.getByTestId('profile-privacy-switch'), 'valueChange', true);

    await waitFor(() => {
      expect(mockUpdateSettings).toHaveBeenCalledWith(true);
    });
  });
});
