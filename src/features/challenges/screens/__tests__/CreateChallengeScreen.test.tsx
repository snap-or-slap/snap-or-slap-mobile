import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import { renderWithProviders } from '../../../../test-utils/renderWithProviders';
import { CreateChallengeScreen } from '../CreateChallengeScreen';

// ── Service mocks ───────────────────────────────────────────────────────────

jest.mock('../../services/challenges.service', () => ({
  challengesService: {
    createChallenge: jest.fn(),
  },
}));

jest.mock('@features/friends/services', () => ({
  friendsService: {
    listFriends: jest.fn(),
  },
}));

jest.mock('@services/api', () => ({
  ApiError: class ApiError extends Error {
    status: number;
    details?: unknown;
    constructor({ status, message, details }: { status: number; message: string; details?: unknown }) {
      super(message);
      this.status = status;
      this.details = details;
    }
  },
}));

// Mock DateTimePicker to avoid native module issues
jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { challengesService } = require('../../services/challenges.service');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { friendsService } = require('@features/friends/services');

const mockCreateChallenge = challengesService.createChallenge as jest.Mock;
const mockListFriends = friendsService.listFriends as jest.Mock;

const FRIENDS = [
  { id: 'friend-1', displayName: 'Alice', username: 'alice' },
  { id: 'friend-2', displayName: 'Bob', username: 'bob' },
];

describe('CreateChallengeScreen — Info Step', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockListFriends.mockResolvedValue({ friends: FRIENDS });
  });

  it('renders the create challenge screen with Info step', async () => {
    renderWithProviders(<CreateChallengeScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('create-challenge-screen')).toBeTruthy();
    });
    expect(screen.getByText('Create Challenge')).toBeTruthy();
    expect(screen.getByTestId('input-title')).toBeTruthy();
    expect(screen.getByTestId('input-description')).toBeTruthy();
    expect(screen.getByTestId('input-task-instruction')).toBeTruthy();
  });

  it('shows validation error when trying to advance with empty title', async () => {
    renderWithProviders(<CreateChallengeScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('create-challenge-next-step')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('create-challenge-next-step'));

    await waitFor(() => {
      expect(screen.getByText('Challenge title is required.')).toBeTruthy();
    });
  });

  it('allows typing a title and advances to schedule step', async () => {
    renderWithProviders(<CreateChallengeScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('input-title')).toBeTruthy();
    });

    fireEvent.changeText(screen.getByTestId('input-title'), 'Morning Run');
    fireEvent.press(screen.getByTestId('create-challenge-next-step'));

    await waitFor(() => {
      expect(screen.getByText('Step 2 of 4')).toBeTruthy();
    });
  });

  it('calls onBack when back button is pressed on first step', async () => {
    const onBack = jest.fn();
    renderWithProviders(<CreateChallengeScreen onBack={onBack} />);

    await waitFor(() => {
      expect(screen.getByTestId('create-challenge-back-button')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('create-challenge-back-button'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('shows invalid cover URL error', async () => {
    renderWithProviders(<CreateChallengeScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('input-cover-url')).toBeTruthy();
    });

    fireEvent.changeText(screen.getByTestId('input-title'), 'Valid Title');
    fireEvent.changeText(screen.getByTestId('input-cover-url'), 'not-a-url');
    fireEvent.press(screen.getByTestId('create-challenge-next-step'));

    await waitFor(() => {
      expect(screen.getByText('Cover image URL must be a valid http or https URL.')).toBeTruthy();
    });
  });
});

describe('CreateChallengeScreen — Schedule Step', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockListFriends.mockResolvedValue({ friends: FRIENDS });
  });

  async function navigateToScheduleStep() {
    renderWithProviders(<CreateChallengeScreen />);
    await waitFor(() => expect(screen.getByTestId('input-title')).toBeTruthy());
    fireEvent.changeText(screen.getByTestId('input-title'), 'Morning Run');
    fireEvent.press(screen.getByTestId('create-challenge-next-step'));
    await waitFor(() => expect(screen.getByText('Step 2 of 4')).toBeTruthy());
  }

  it('renders schedule step with duration, frequency, and reset time', async () => {
    await navigateToScheduleStep();
    expect(screen.getByTestId('input-duration-days')).toBeTruthy();
    expect(screen.getByTestId('frequency-daily')).toBeTruthy();
    expect(screen.getByTestId('frequency-custom')).toBeTruthy();
  });

  it('can go back to info step', async () => {
    await navigateToScheduleStep();
    fireEvent.press(screen.getByTestId('create-challenge-back-step'));
    await waitFor(() => {
      expect(screen.getByText('Step 1 of 4')).toBeTruthy();
    });
  });

  it('switches frequency to custom and shows weekday buttons', async () => {
    await navigateToScheduleStep();

    fireEvent.press(screen.getByTestId('frequency-custom'));

    await waitFor(() => {
      expect(screen.getByTestId('frequency-day-1')).toBeTruthy(); // Mon
    });
  });

  it('selects weekday in custom frequency mode', async () => {
    await navigateToScheduleStep();
    fireEvent.press(screen.getByTestId('frequency-custom'));

    await waitFor(() => {
      expect(screen.getByTestId('frequency-day-1')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('frequency-day-1')); // Mon
    fireEvent.press(screen.getByTestId('frequency-day-3')); // Wed

    // Advance — should pass since days are selected
    fireEvent.press(screen.getByTestId('create-challenge-next-step'));
    await waitFor(() => {
      expect(screen.getByText('Step 3 of 4')).toBeTruthy();
    });
  });

  it('shows error when custom frequency has no days selected', async () => {
    await navigateToScheduleStep();
    fireEvent.press(screen.getByTestId('frequency-custom'));
    // Don't select any days
    fireEvent.press(screen.getByTestId('create-challenge-next-step'));

    await waitFor(() => {
      expect(screen.getByText('Choose at least one custom frequency day.')).toBeTruthy();
    });
  });

  it('increments duration days via NumericStepper', async () => {
    await navigateToScheduleStep();
    fireEvent.press(screen.getByTestId('input-duration-days-increase'));

    // The default is 14, after press it becomes 15
    await waitFor(() => {
      expect(screen.getByDisplayValue('15')).toBeTruthy();
    });
  });
});

describe('CreateChallengeScreen — Rules Step', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockListFriends.mockResolvedValue({ friends: FRIENDS });
  });

  async function navigateToRulesStep() {
    renderWithProviders(<CreateChallengeScreen />);
    await waitFor(() => expect(screen.getByTestId('input-title')).toBeTruthy());
    fireEvent.changeText(screen.getByTestId('input-title'), 'Morning Run');
    fireEvent.press(screen.getByTestId('create-challenge-next-step'));
    await waitFor(() => expect(screen.getByText('Step 2 of 4')).toBeTruthy());
    fireEvent.press(screen.getByTestId('create-challenge-next-step'));
    await waitFor(() => expect(screen.getByText('Step 3 of 4')).toBeTruthy());
  }

  it('renders rules step with hearts, members, and privacy', async () => {
    await navigateToRulesStep();
    expect(screen.getByTestId('input-total-hearts')).toBeTruthy();
    expect(screen.getByTestId('input-max-members')).toBeTruthy();
    expect(screen.getByTestId('privacy-public')).toBeTruthy();
    expect(screen.getByTestId('privacy-private')).toBeTruthy();
  });

  it('switches privacy between public and private', async () => {
    await navigateToRulesStep();
    fireEvent.press(screen.getByTestId('privacy-private'));
    // No crash, mode switches
    fireEvent.press(screen.getByTestId('privacy-public'));
  });
});

describe('CreateChallengeScreen — Invite Step', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockListFriends.mockResolvedValue({ friends: FRIENDS });
  });

  async function navigateToInviteStep() {
    renderWithProviders(<CreateChallengeScreen />);
    await waitFor(() => expect(screen.getByTestId('input-title')).toBeTruthy());
    fireEvent.changeText(screen.getByTestId('input-title'), 'Morning Run');
    // Step 1 → 2
    fireEvent.press(screen.getByTestId('create-challenge-next-step'));
    await waitFor(() => expect(screen.getByText('Step 2 of 4')).toBeTruthy());
    // Step 2 → 3
    fireEvent.press(screen.getByTestId('create-challenge-next-step'));
    await waitFor(() => expect(screen.getByText('Step 3 of 4')).toBeTruthy());
    // Step 3 → 4
    fireEvent.press(screen.getByTestId('create-challenge-next-step'));
    await waitFor(() => expect(screen.getByText('Step 4 of 4')).toBeTruthy());
  }

  it('renders invite step with friends list', async () => {
    await navigateToInviteStep();
    await waitFor(() => {
      expect(screen.getByText('Invite friends')).toBeTruthy();
    });
  });

  it('shows Review section on the invite step', async () => {
    await navigateToInviteStep();
    await waitFor(() => {
      expect(screen.getByText('Review')).toBeTruthy();
    });
  });

  it('shows Create Challenge submit button on last step', async () => {
    await navigateToInviteStep();
    await waitFor(() => {
      expect(screen.getByTestId('create-challenge-submit-button')).toBeTruthy();
    });
  });
});

describe('CreateChallengeScreen — Submit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockListFriends.mockResolvedValue({ friends: [] });
  });

  it('calls createChallenge and invokes onCreated on success', async () => {
    const onCreated = jest.fn();
    mockCreateChallenge.mockResolvedValueOnce({
      challenge: { id: 'new-challenge-id' },
    });

    renderWithProviders(<CreateChallengeScreen onCreated={onCreated} />);

    await waitFor(() => expect(screen.getByTestId('input-title')).toBeTruthy());
    fireEvent.changeText(screen.getByTestId('input-title'), 'Morning Run');

    // Navigate through all steps quickly
    fireEvent.press(screen.getByTestId('create-challenge-next-step'));
    await waitFor(() => expect(screen.getByText('Step 2 of 4')).toBeTruthy());
    fireEvent.press(screen.getByTestId('create-challenge-next-step'));
    await waitFor(() => expect(screen.getByText('Step 3 of 4')).toBeTruthy());
    fireEvent.press(screen.getByTestId('create-challenge-next-step'));
    await waitFor(() => expect(screen.getByText('Step 4 of 4')).toBeTruthy());

    fireEvent.press(screen.getByTestId('create-challenge-submit-button'));

    await waitFor(() => {
      expect(mockCreateChallenge).toHaveBeenCalledTimes(1);
      expect(onCreated).toHaveBeenCalledWith('new-challenge-id');
    });
  });

  it('shows submit error when createChallenge fails', async () => {
    mockCreateChallenge.mockRejectedValueOnce(new Error('Network error'));

    renderWithProviders(<CreateChallengeScreen />);

    await waitFor(() => expect(screen.getByTestId('input-title')).toBeTruthy());
    fireEvent.changeText(screen.getByTestId('input-title'), 'Morning Run');

    // Navigate to last step
    fireEvent.press(screen.getByTestId('create-challenge-next-step'));
    await waitFor(() => expect(screen.getByText('Step 2 of 4')).toBeTruthy());
    fireEvent.press(screen.getByTestId('create-challenge-next-step'));
    await waitFor(() => expect(screen.getByText('Step 3 of 4')).toBeTruthy());
    fireEvent.press(screen.getByTestId('create-challenge-next-step'));
    await waitFor(() => expect(screen.getByText('Step 4 of 4')).toBeTruthy());

    fireEvent.press(screen.getByTestId('create-challenge-submit-button'));

    await waitFor(() => {
      expect(screen.getByTestId('create-challenge-submit-error')).toBeTruthy();
    });
  });

  it('shows error when createChallenge returns challenge without id', async () => {
    mockCreateChallenge.mockResolvedValueOnce({
      challenge: {}, // no id
    });

    renderWithProviders(<CreateChallengeScreen />);

    await waitFor(() => expect(screen.getByTestId('input-title')).toBeTruthy());
    fireEvent.changeText(screen.getByTestId('input-title'), 'Morning Run');

    fireEvent.press(screen.getByTestId('create-challenge-next-step'));
    await waitFor(() => expect(screen.getByText('Step 2 of 4')).toBeTruthy());
    fireEvent.press(screen.getByTestId('create-challenge-next-step'));
    await waitFor(() => expect(screen.getByText('Step 3 of 4')).toBeTruthy());
    fireEvent.press(screen.getByTestId('create-challenge-next-step'));
    await waitFor(() => expect(screen.getByText('Step 4 of 4')).toBeTruthy());

    fireEvent.press(screen.getByTestId('create-challenge-submit-button'));

    await waitFor(() => {
      expect(screen.getByTestId('create-challenge-submit-error')).toBeTruthy();
    });
  });

  it('shows API error message on ApiError with status 409', async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { ApiError } = require('@services/api');
    mockCreateChallenge.mockRejectedValueOnce(
      new ApiError({ status: 409, message: 'Challenge name already exists.', details: [] })
    );

    renderWithProviders(<CreateChallengeScreen />);

    await waitFor(() => expect(screen.getByTestId('input-title')).toBeTruthy());
    fireEvent.changeText(screen.getByTestId('input-title'), 'Morning Run');

    fireEvent.press(screen.getByTestId('create-challenge-next-step'));
    await waitFor(() => expect(screen.getByText('Step 2 of 4')).toBeTruthy());
    fireEvent.press(screen.getByTestId('create-challenge-next-step'));
    await waitFor(() => expect(screen.getByText('Step 3 of 4')).toBeTruthy());
    fireEvent.press(screen.getByTestId('create-challenge-next-step'));
    await waitFor(() => expect(screen.getByText('Step 4 of 4')).toBeTruthy());

    fireEvent.press(screen.getByTestId('create-challenge-submit-button'));

    await waitFor(() => {
      expect(screen.getByTestId('create-challenge-submit-error')).toBeTruthy();
    });
  });

  it('handles friends loading failure gracefully (shows empty picker)', async () => {
    mockListFriends.mockRejectedValueOnce(new Error('Failed to load friends'));

    renderWithProviders(<CreateChallengeScreen />);

    await waitFor(() => expect(screen.getByTestId('input-title')).toBeTruthy());
    fireEvent.changeText(screen.getByTestId('input-title'), 'Morning Run');

    fireEvent.press(screen.getByTestId('create-challenge-next-step'));
    await waitFor(() => expect(screen.getByText('Step 2 of 4')).toBeTruthy());
    fireEvent.press(screen.getByTestId('create-challenge-next-step'));
    await waitFor(() => expect(screen.getByText('Step 3 of 4')).toBeTruthy());
    fireEvent.press(screen.getByTestId('create-challenge-next-step'));
    await waitFor(() => expect(screen.getByText('Step 4 of 4')).toBeTruthy());

    // Should render without crashing even with no friends
    await waitFor(() => {
      expect(screen.getByText('No friends to invite yet.')).toBeTruthy();
    });
  });
});
