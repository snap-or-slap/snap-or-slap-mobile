import React from 'react';
import { fireEvent, screen, waitFor, act } from '@testing-library/react-native';

import { renderWithProviders } from '../../../../test-utils/renderWithProviders';
import { UserProfilePreviewScreen } from '../UserProfilePreviewScreen';

// ── Service mocks ───────────────────────────────────────────────────────────

jest.mock('../../services', () => ({
  getUserProfile: jest.fn(),
  sendFriendRequest: jest.fn(),
  addOutgoingRequest: jest.fn(),
  respondToRequest: jest.fn(),
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
const mockGetUserProfile = friendsServices.getUserProfile as jest.Mock;
const mockSendFriendRequest = friendsServices.sendFriendRequest as jest.Mock;
const mockAddOutgoingRequest = friendsServices.addOutgoingRequest as jest.Mock;
const mockRespondToRequest = friendsServices.respondToRequest as jest.Mock;

describe('UserProfilePreviewScreen', () => {
  const mockOnBack = jest.fn();
  const mockOnOpenFriendRequests = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockGetUserProfile.mockResolvedValue({
      id: 'user-1',
      username: 'alice',
      displayName: 'Alice',
      relationship: 'none',
    });
  });

  it('renders loading state initially', () => {
    // delay resolution to see loading state
    mockGetUserProfile.mockReturnValue(new Promise(() => {}));

    renderWithProviders(
      <UserProfilePreviewScreen userId="user-1" />
    );

    expect(screen.getByText('Loading…')).toBeTruthy();
  });

  it('renders error state on load failure', async () => {
    mockGetUserProfile.mockRejectedValue(new Error('Network error'));

    renderWithProviders(
      <UserProfilePreviewScreen userId="user-1" />
    );

    await waitFor(() => {
      expect(screen.getByTestId('preview-error')).toBeTruthy();
    });
    expect(screen.getByText('Could not load profile')).toBeTruthy();
  });

  it('renders non-friend profile correctly', async () => {
    renderWithProviders(
      <UserProfilePreviewScreen userId="user-1" onBack={mockOnBack} />
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-profile-preview-screen')).toBeTruthy();
    });

    expect(screen.getByText('Alice')).toBeTruthy();
    expect(screen.getByText('@alice')).toBeTruthy();
    expect(screen.getByTestId('preview-stranger-warning')).toBeTruthy();

    expect(screen.getByTestId('preview-back')).toBeTruthy();
    fireEvent.press(screen.getByTestId('preview-back'));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('handles add friend action', async () => {
    mockSendFriendRequest.mockResolvedValue({ request: { id: 'req-1' } });
    mockAddOutgoingRequest.mockResolvedValue(undefined);

    renderWithProviders(
      <UserProfilePreviewScreen userId="user-1" />
    );

    await waitFor(() => {
      expect(screen.getByTestId('preview-add-friend')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('preview-add-friend'));

    await waitFor(() => {
      expect(mockSendFriendRequest).toHaveBeenCalledWith('user-1');
      expect(mockAddOutgoingRequest).toHaveBeenCalledWith('user-current', expect.any(Object));
    });
  });

  it('handles incoming request with accept action', async () => {
    mockGetUserProfile.mockResolvedValue({
      id: 'user-2',
      username: 'bob',
      displayName: 'Bob',
      relationship: 'pending_received',
      requestId: 'req-2',
    });

    mockRespondToRequest.mockResolvedValue(undefined);

    renderWithProviders(
      <UserProfilePreviewScreen userId="user-2" />
    );

    await waitFor(() => {
      expect(screen.getByTestId('preview-accept-friend')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('preview-accept-friend'));

    await waitFor(() => {
      expect(mockRespondToRequest).toHaveBeenCalledWith('req-2', 'accept');
    });

    await waitFor(() => {
      expect(screen.getByText('Friend')).toBeTruthy();
    });
  });

  it('renders squadmate limited info', async () => {
    mockGetUserProfile.mockResolvedValue({
      id: 'user-3',
      username: 'charlie',
      displayName: 'Charlie',
      relationship: 'squadmate',
    });

    renderWithProviders(
      <UserProfilePreviewScreen userId="user-3" />
    );

    await waitFor(() => {
      expect(screen.getByTestId('preview-limited-info')).toBeTruthy();
    });
  });

  it('shows pending request card without inline actions if no requestId', async () => {
    mockGetUserProfile.mockResolvedValue({
      id: 'user-4',
      username: 'diana',
      displayName: 'Diana',
      relationship: 'pending_received',
    });

    renderWithProviders(
      <UserProfilePreviewScreen userId="user-4" onOpenFriendRequests={mockOnOpenFriendRequests} />
    );

    await waitFor(() => {
      expect(screen.getByText('Pending request')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('preview-view-requests'));
    expect(mockOnOpenFriendRequests).toHaveBeenCalledTimes(1);
  });
});
