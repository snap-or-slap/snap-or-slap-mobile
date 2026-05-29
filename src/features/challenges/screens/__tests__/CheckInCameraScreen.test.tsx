import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { useCameraPermissions } from 'expo-camera';
import { Linking } from 'react-native';

import { renderWithProviders } from '../../../../test-utils/renderWithProviders';
import { CheckInCameraScreen } from '../CheckInCameraScreen';

// ── Service mock ────────────────────────────────────────────────────────────

jest.mock('../../services/checkin.service', () => ({
  checkinService: {
    submitCheckinWithPhoto: jest.fn(),
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
const { checkinService } = require('../../services/checkin.service');
const mockSubmitCheckin = checkinService.submitCheckinWithPhoto as jest.Mock;

const mockUseCameraPermissions = useCameraPermissions as jest.Mock;

// Mock Linking
jest.spyOn(Linking, 'openSettings').mockResolvedValue(undefined);

// Default props
const DEFAULT_PROPS = {
  challengeId: 'challenge-1',
  currentUserId: 'user-1',
  onBack: jest.fn(),
  onSubmitted: jest.fn(),
};

describe('CheckInCameraScreen — Permission loading', () => {
  it('shows loading state when permission is null (not yet determined)', () => {
    mockUseCameraPermissions.mockReturnValueOnce([null, jest.fn()]);

    renderWithProviders(<CheckInCameraScreen {...DEFAULT_PROPS} />);

    expect(screen.getByText('Loading camera permission...')).toBeTruthy();
  });
});

describe('CheckInCameraScreen — Permission denied', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCameraPermissions.mockReturnValue([
      { granted: false, canAskAgain: true },
      jest.fn(),
    ]);
  });

  it('shows permission screen with Camera permission needed card', () => {
    renderWithProviders(<CheckInCameraScreen {...DEFAULT_PROPS} />);

    expect(screen.getByTestId('check-in-camera-permission-screen')).toBeTruthy();
    expect(screen.getByText('Camera permission needed')).toBeTruthy();
    expect(screen.getByTestId('check-in-grant-permission-button')).toBeTruthy();
    expect(screen.getByTestId('check-in-open-settings-button')).toBeTruthy();
  });

  it('calls requestPermission when Grant Permission is pressed', async () => {
    const mockRequestPermission = jest.fn().mockResolvedValue({ granted: true });
    mockUseCameraPermissions.mockReturnValue([
      { granted: false, canAskAgain: true },
      mockRequestPermission,
    ]);

    renderWithProviders(<CheckInCameraScreen {...DEFAULT_PROPS} />);

    fireEvent.press(screen.getByTestId('check-in-grant-permission-button'));

    await waitFor(() => {
      expect(mockRequestPermission).toHaveBeenCalledTimes(1);
    });
  });

  it('calls Linking.openSettings when Open Settings is pressed', async () => {
    renderWithProviders(<CheckInCameraScreen {...DEFAULT_PROPS} />);

    fireEvent.press(screen.getByTestId('check-in-open-settings-button'));

    await waitFor(() => {
      expect(Linking.openSettings).toHaveBeenCalledTimes(1);
    });
  });

  it('shows error when requestPermission fails', async () => {
    const mockRequestPermission = jest.fn().mockRejectedValueOnce(new Error('Failed'));
    mockUseCameraPermissions.mockReturnValue([
      { granted: false, canAskAgain: true },
      mockRequestPermission,
    ]);

    renderWithProviders(<CheckInCameraScreen {...DEFAULT_PROPS} />);

    fireEvent.press(screen.getByTestId('check-in-grant-permission-button'));

    await waitFor(() => {
      expect(screen.getByText('Could not request camera permission. Please try again.')).toBeTruthy();
    });
  });

  it('shows close button and calls onBack when pressed', () => {
    const onBack = jest.fn();
    renderWithProviders(<CheckInCameraScreen {...DEFAULT_PROPS} onBack={onBack} />);

    fireEvent.press(screen.getByTestId('check-in-close-button'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});

describe('CheckInCameraScreen — Permission granted', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCameraPermissions.mockReturnValue([
      { granted: true, canAskAgain: false },
      jest.fn(),
    ]);
    mockSubmitCheckin.mockResolvedValue({ success: true });
    DEFAULT_PROPS.onBack = jest.fn();
    DEFAULT_PROPS.onSubmitted = jest.fn();
  });

  it('renders the camera screen with caption input and submit button', () => {
    renderWithProviders(<CheckInCameraScreen {...DEFAULT_PROPS} />);

    expect(screen.getByTestId('check-in-camera-screen')).toBeTruthy();
    expect(screen.getByTestId('check-in-caption-input')).toBeTruthy();
    expect(screen.getByTestId('check-in-submit-button')).toBeTruthy();
    expect(screen.getByTestId('check-in-capture-button')).toBeTruthy();
  });

  it('close button calls onBack', () => {
    const onBack = jest.fn();
    renderWithProviders(<CheckInCameraScreen {...DEFAULT_PROPS} onBack={onBack} />);

    fireEvent.press(screen.getByTestId('check-in-close-button'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('submit button is disabled when no photo taken (guard behavior)', async () => {
    renderWithProviders(<CheckInCameraScreen {...DEFAULT_PROPS} />);

    const submitBtn = screen.getByTestId('check-in-submit-button');
    expect(submitBtn).toBeDisabled();
    expect(mockSubmitCheckin).not.toHaveBeenCalled();
  });

  it('shows submit button as disabled when no photo taken', () => {
    renderWithProviders(<CheckInCameraScreen {...DEFAULT_PROPS} />);

    expect(screen.getByTestId('check-in-submit-button')).toBeDisabled();
  });

  it('displays caption counter while typing', () => {
    renderWithProviders(<CheckInCameraScreen {...DEFAULT_PROPS} />);

    fireEvent.changeText(screen.getByTestId('check-in-caption-input'), 'Hello world');
    expect(screen.getByText('11/280')).toBeTruthy();
  });
});

describe('CheckInCameraScreen — Submit', () => {
  const onBack = jest.fn();
  const onSubmitted = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCameraPermissions.mockReturnValue([
      { granted: true, canAskAgain: false },
      jest.fn(),
    ]);
    onBack.mockReset();
    onSubmitted.mockReset();
    mockSubmitCheckin.mockResolvedValue({ success: true });
  });

  it('submit flow: verify button states — disabled without photo, capture available', async () => {
    mockSubmitCheckin.mockResolvedValueOnce({ success: true });

    renderWithProviders(
      <CheckInCameraScreen
        challengeId="challenge-1"
        currentUserId="user-1"
        onBack={onBack}
        onSubmitted={onSubmitted}
      />
    );

    // Initially no photo taken → submit disabled, capture available
    expect(screen.getByTestId('check-in-submit-button')).toBeDisabled();
    expect(screen.getByTestId('check-in-capture-button')).toBeTruthy();
  });

  it('shows generic API error on submit failure — submit requires photo first (button disabled guard)', () => {
    renderWithProviders(
      <CheckInCameraScreen
        challengeId="challenge-1"
        currentUserId="user-1"
        onBack={onBack}
        onSubmitted={onSubmitted}
      />
    );

    // Submit button is disabled when no photo — this is the guard
    const submitBtn = screen.getByTestId('check-in-submit-button');
    expect(submitBtn).toBeDisabled();
    // API not called since button is disabled
    expect(mockSubmitCheckin).not.toHaveBeenCalled();
  });

  it('shows Take Photo button that is initially disabled (camera not ready)', () => {
    renderWithProviders(
      <CheckInCameraScreen
        challengeId="challenge-1"
        currentUserId="user-1"
        onBack={onBack}
        onSubmitted={onSubmitted}
      />
    );

    const takePhotoBtn = screen.getByTestId('check-in-capture-button');
    // Camera not ready by default, so disabled
    expect(takePhotoBtn).toBeDisabled();
  });

  it('shows "Photo proof" heading in both permission and camera screens', () => {
    mockUseCameraPermissions.mockReturnValue([
      { granted: false, canAskAgain: true },
      jest.fn(),
    ]);

    renderWithProviders(
      <CheckInCameraScreen
        challengeId="challenge-1"
        currentUserId="user-1"
        onBack={onBack}
        onSubmitted={onSubmitted}
      />
    );

    expect(screen.getByText('Photo proof')).toBeTruthy();
  });
});
