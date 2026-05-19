import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import { renderWithProviders } from '../../../test-utils/renderWithProviders';
import { ChallengeDetailScreen } from '../screens/ChallengeDetailScreen';
import { checkinService } from '../services/checkin.service';

jest.mock('../services/challenges.service', () => ({
  challengesService: {
    getChallenge: jest.fn(async () => ({
      challenge: {
        id: 'challenge-1',
        title: 'Morning Run',
        status: 'active',
        totalHearts: 3,
        heartsLeft: 3,
        resetTime: '06:00:00',
        startAt: '2026-05-20T00:00:00.000Z',
        durationDays: 7,
        maxMembers: 4,
      },
      members: [
        {
          id: 'member-current',
          userId: 'user-current',
          displayName: 'Current User',
          username: 'current',
          role: 'host',
          status: 'accepted',
          isReady: true,
        },
        {
          id: 'member-done',
          userId: 'user-done',
          displayName: 'Done Member',
          username: 'done',
          role: 'member',
          status: 'accepted',
          isReady: true,
        },
        {
          id: 'member-pending',
          userId: 'user-pending',
          displayName: 'Pending Member',
          username: 'pending',
          role: 'member',
          status: 'accepted',
          isReady: true,
        },
      ],
      myMembership: {
        role: 'host',
        status: 'accepted',
        isReady: true,
      },
    })),
    getChallengeStats: jest.fn(async () => ({
      elapsedCycles: 1,
      durationDays: 7,
      heartsLeft: 3,
      totalCheckins: 1,
      completionRate: 33,
    })),
    inviteUsers: jest.fn(),
    acceptInvite: jest.fn(),
    declineInvite: jest.fn(),
    setReady: jest.fn(),
    leaveChallenge: jest.fn(),
    deleteOrCancelChallenge: jest.fn(),
    cancelChallenge: jest.fn(),
  },
}));

jest.mock('../services/checkin.service', () => ({
  checkinService: {
    getTodayStatus: jest.fn(async () => ({
      cycleNumber: 1,
      durationDays: 7,
      heartsLeft: 3,
      resetAt: '2026-05-20T06:00:00.000Z',
      timeUntilReset: 3600,
      members: [
        { userId: 'user-current', status: 'pending' },
        { userId: 'user-done', status: 'checked_in' },
        { userId: 'user-pending', status: 'pending' },
      ],
    })),
    listCheckins: jest.fn(async () => ({ checkins: [] })),
    nudgeMember: jest.fn(async () => ({ message: 'Nudge sent successfully' })),
  },
}));

jest.mock('@features/friends/services', () => ({
  friendsService: {
    listFriends: jest.fn(async () => ({ friends: [] })),
  },
}));

jest.mock('@services/api', () => {
  class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
      super(message);
      this.status = status;
    }
  }

  return {
    ApiError,
    session: {
      getCurrentUserId: jest.fn(async () => 'user-current'),
    },
  };
});

describe('ChallengeDetailScreen slap actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('keeps Slap visible but disabled for DONE members', async () => {
    renderWithProviders(<ChallengeDetailScreen challengeId="challenge-1" />);

    await waitFor(() => {
      expect(screen.getByText('Checked in')).toBeTruthy();
    });
    const button = screen.getByTestId('slap-member-done');

    expect(button).toBeDisabled();
  });

  it('enables Slap for pending other members and calls nudgeMember', async () => {
    renderWithProviders(<ChallengeDetailScreen challengeId="challenge-1" />);

    const button = await screen.findByTestId('slap-member-pending');
    expect(button).not.toBeDisabled();

    fireEvent.press(button);

    await waitFor(() => {
      expect(checkinService.nudgeMember).toHaveBeenCalledWith('challenge-1', 'user-pending');
    });
    expect(await screen.findByText('Reminder sent.')).toBeTruthy();
  });

  it('does not show a Slap button for the current user', async () => {
    renderWithProviders(<ChallengeDetailScreen challengeId="challenge-1" />);

    await screen.findByTestId('challenge-detail-screen');

    expect(screen.queryByTestId('slap-member-current')).toBeNull();
  });
});
