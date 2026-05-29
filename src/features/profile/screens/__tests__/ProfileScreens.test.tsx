import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import * as ImagePicker from 'expo-image-picker';

import { renderWithProviders } from '../../../../test-utils/renderWithProviders';
import { CompleteProfileScreen } from '../CompleteProfileScreen';
import { SetupPermissionsScreen } from '../SetupPermissionsScreen';

// ── Service mocks ───────────────────────────────────────────────────────────

jest.mock('../../services', () => ({
  profileService: {
    updateMe: jest.fn(),
  },
  markProfileSetupCompleted: jest.fn(),
  markPermissionsSetupCompleted: jest.fn(),
}));

jest.mock('@services/api', () => ({
  session: {
    getCurrentUser: jest.fn(),
    getCurrentUserId: jest.fn(),
    setCurrentUser: jest.fn(),
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
const { profileService, markProfileSetupCompleted, markPermissionsSetupCompleted } = require('../../services');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { session } = require('@services/api');

const mockUpdateMe = profileService.updateMe as jest.Mock;
const mockMarkProfileCompleted = markProfileSetupCompleted as jest.Mock;
const mockMarkPermissionsCompleted = markPermissionsSetupCompleted as jest.Mock;
const mockGetCurrentUser = session.getCurrentUser as jest.Mock;
const mockSetCurrentUser = session.setCurrentUser as jest.Mock;

// ── CompleteProfileScreen ──────────────────────────────────────────────────

describe('CompleteProfileScreen', () => {
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCurrentUser.mockResolvedValue({
      id: 'user-1',
      displayName: '',
      username: 'testuser',
      avatarUrl: null,
    });
    mockUpdateMe.mockResolvedValue({
      id: 'user-1',
      displayName: 'Test User',
      username: 'testuser',
      avatarUrl: null,
    });
    mockMarkProfileCompleted.mockResolvedValue(undefined);
    mockSetCurrentUser.mockResolvedValue(undefined);
    (ImagePicker.getCameraPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: false,
      status: 'undetermined',
      canAskAgain: true,
    });
    (ImagePicker.getMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: false,
      status: 'undetermined',
      canAskAgain: true,
    });
  });

  it('renders the complete profile screen with all elements', async () => {
    renderWithProviders(
      <CompleteProfileScreen onComplete={mockOnComplete} />
    );

    await waitFor(() => {
      expect(screen.getByTestId('complete-profile-screen')).toBeTruthy();
    });
    expect(screen.getByText('Complete profile')).toBeTruthy();
    expect(screen.getByTestId('display-name-input')).toBeTruthy();
    expect(screen.getByTestId('complete-profile-continue-button')).toBeTruthy();
    expect(screen.getByTestId('complete-profile-skip-photo-button')).toBeTruthy();
  });

  it('renders back button when onBack is provided', async () => {
    const onBack = jest.fn();
    renderWithProviders(
      <CompleteProfileScreen onComplete={mockOnComplete} onBack={onBack} />
    );

    await waitFor(() => {
      expect(screen.getByTestId('complete-profile-back-button')).toBeTruthy();
    });
    fireEvent.press(screen.getByTestId('complete-profile-back-button'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('shows error when display name is empty and Continue is pressed', async () => {
    renderWithProviders(
      <CompleteProfileScreen onComplete={mockOnComplete} />
    );

    await waitFor(() => {
      expect(screen.getByTestId('complete-profile-continue-button')).toBeTruthy();
    });

    // Clear the display name input
    fireEvent.changeText(screen.getByTestId('display-name-input'), '');
    fireEvent.press(screen.getByTestId('complete-profile-continue-button'));

    await waitFor(() => {
      expect(screen.getByText('Display name is required.')).toBeTruthy();
    });
    expect(mockOnComplete).not.toHaveBeenCalled();
  });

  it('submits successfully with valid display name and calls onComplete', async () => {
    renderWithProviders(
      <CompleteProfileScreen
        initialDisplayName="My Name"
        onComplete={mockOnComplete}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('complete-profile-continue-button')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('complete-profile-continue-button'));

    await waitFor(() => {
      expect(mockUpdateMe).toHaveBeenCalledWith({ displayName: 'My Name' });
      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });
  });

  it('shows API error message when submit fails', async () => {
    mockUpdateMe.mockRejectedValueOnce(new Error('Server error'));

    renderWithProviders(
      <CompleteProfileScreen
        initialDisplayName="Test Name"
        onComplete={mockOnComplete}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('complete-profile-continue-button')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('complete-profile-continue-button'));

    await waitFor(() => {
      expect(screen.getByText('Could not save your profile. Please try again.')).toBeTruthy();
    });
    expect(mockOnComplete).not.toHaveBeenCalled();
  });

  it('shows network error when TypeError is thrown', async () => {
    mockUpdateMe.mockRejectedValueOnce(new TypeError('Network failure'));

    renderWithProviders(
      <CompleteProfileScreen
        initialDisplayName="Test Name"
        onComplete={mockOnComplete}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('complete-profile-continue-button')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('complete-profile-continue-button'));

    await waitFor(() => {
      expect(screen.getByText('Could not reach the server. Check your connection and try again.')).toBeTruthy();
    });
  });

  it('skip photo button calls completeProfile with skipPhoto=true', async () => {
    renderWithProviders(
      <CompleteProfileScreen
        initialDisplayName="Test User"
        onComplete={mockOnComplete}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('complete-profile-skip-photo-button')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('complete-profile-skip-photo-button'));

    await waitFor(() => {
      expect(mockUpdateMe).toHaveBeenCalledWith({ displayName: 'Test User' });
      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });
  });

  it('handles photo picker with permission denied gracefully', async () => {
    (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValueOnce({
      granted: false,
      status: 'denied',
    });

    renderWithProviders(
      <CompleteProfileScreen
        initialDisplayName="Test User"
        onComplete={mockOnComplete}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('upload-photo-button')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('upload-photo-button'));

    await waitFor(() => {
      expect(screen.getByText(/Photo access was not granted/)).toBeTruthy();
    });
  });

  it('handles photo picker with permission granted and image selected', async () => {
    (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValueOnce({
      granted: true,
      status: 'granted',
    });
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: 'file:///photo.jpg' }],
    });

    renderWithProviders(
      <CompleteProfileScreen
        initialDisplayName="Test User"
        onComplete={mockOnComplete}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('upload-photo-button')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('upload-photo-button'));

    await waitFor(() => {
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
    });
  });

  it('handles photo picker canceled by user — no info text shown', async () => {
    (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValueOnce({
      granted: true,
      status: 'granted',
    });
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValueOnce({
      canceled: true,
      assets: [],
    });

    renderWithProviders(
      <CompleteProfileScreen
        initialDisplayName="Test User"
        onComplete={mockOnComplete}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('upload-photo-button')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('upload-photo-button'));

    await waitFor(() => {
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
    });
    expect(screen.queryByText(/Photo preview saved/)).toBeNull();
  });

  it('prefills display name from initialDisplayName prop', async () => {
    renderWithProviders(
      <CompleteProfileScreen
        initialDisplayName="Prefilled Name"
        onComplete={mockOnComplete}
      />
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Prefilled Name')).toBeTruthy();
    });
  });
});

// ── SetupPermissionsScreen ──────────────────────────────────────────────────

describe('SetupPermissionsScreen', () => {
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockMarkPermissionsCompleted.mockResolvedValue(undefined);
    // Default: camera and photos undetermined
    (ImagePicker.getCameraPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: false,
      status: 'undetermined',
      canAskAgain: true,
    });
    (ImagePicker.getMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: false,
      status: 'undetermined',
      canAskAgain: true,
    });
  });

  it('renders the setup permissions screen with all permission cards', async () => {
    renderWithProviders(
      <SetupPermissionsScreen onComplete={mockOnComplete} />
    );

    await waitFor(() => {
      expect(screen.getByTestId('setup-permissions-screen')).toBeTruthy();
    });
    expect(screen.getByText('Set up permissions')).toBeTruthy();
    expect(screen.getByText('Notifications')).toBeTruthy();
    expect(screen.getByText('Camera')).toBeTruthy();
    expect(screen.getByText('Photos')).toBeTruthy();
    expect(screen.getByTestId('setup-permissions-continue-button')).toBeTruthy();
  });

  it('renders back button and calls onBack when pressed', async () => {
    const onBack = jest.fn();
    renderWithProviders(
      <SetupPermissionsScreen onComplete={mockOnComplete} onBack={onBack} />
    );

    await waitFor(() => {
      expect(screen.getByTestId('setup-permissions-back-button')).toBeTruthy();
    });
    fireEvent.press(screen.getByTestId('setup-permissions-back-button'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('calls markPermissionsSetupCompleted and onComplete when Continue is pressed', async () => {
    renderWithProviders(
      <SetupPermissionsScreen onComplete={mockOnComplete} />
    );

    await waitFor(() => {
      expect(screen.getByTestId('setup-permissions-continue-button')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('setup-permissions-continue-button'));

    await waitFor(() => {
      expect(mockMarkPermissionsCompleted).toHaveBeenCalledTimes(1);
      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });
  });

  it('allows requesting camera permission via Allow button', async () => {
    (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValueOnce({
      granted: true,
      status: 'granted',
      canAskAgain: false,
    });

    renderWithProviders(
      <SetupPermissionsScreen onComplete={mockOnComplete} />
    );

    await waitFor(() => {
      expect(screen.getByTestId('permission-camera-action')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('permission-camera-action'));

    await waitFor(() => {
      expect(ImagePicker.requestCameraPermissionsAsync).toHaveBeenCalled();
    });
  });

  it('allows requesting photos permission via Allow button', async () => {
    (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValueOnce({
      granted: true,
      status: 'granted',
      canAskAgain: false,
    });

    renderWithProviders(
      <SetupPermissionsScreen onComplete={mockOnComplete} />
    );

    await waitFor(() => {
      expect(screen.getByTestId('permission-photos-action')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('permission-photos-action'));

    await waitFor(() => {
      expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
    });
  });

  it('shows "Allowed" badge when camera and photos permissions are already granted', async () => {
    (ImagePicker.getCameraPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: true,
      status: 'granted',
      canAskAgain: false,
    });
    (ImagePicker.getMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: true,
      status: 'granted',
      canAskAgain: false,
    });

    renderWithProviders(
      <SetupPermissionsScreen onComplete={mockOnComplete} />
    );

    await waitFor(() => {
      expect(screen.getAllByText('Allowed').length).toBeGreaterThanOrEqual(1);
    });
  });

  it('shows "Open Settings" button when camera permission is blocked', async () => {
    (ImagePicker.getCameraPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: false,
      status: 'denied',
      canAskAgain: false,
    });
    (ImagePicker.getMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: false,
      status: 'undetermined',
      canAskAgain: true,
    });

    renderWithProviders(
      <SetupPermissionsScreen onComplete={mockOnComplete} />
    );

    await waitFor(() => {
      expect(screen.getByText('Open Settings')).toBeTruthy();
    });
  });

  it('shows notifications permission button as Unavailable and disabled', async () => {
    renderWithProviders(
      <SetupPermissionsScreen onComplete={mockOnComplete} />
    );

    await waitFor(() => {
      expect(screen.getByTestId('permission-notifications-action')).toBeTruthy();
    });
    expect(screen.getByText('Unavailable')).toBeTruthy();
    expect(screen.getByTestId('permission-notifications-action')).toBeDisabled();
  });
});
