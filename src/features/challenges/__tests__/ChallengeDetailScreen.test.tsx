import React from 'react';
import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react-native';

import { renderWithProviders } from '../../../test-utils/renderWithProviders';
import { ChallengeDetailScreen } from '../screens/ChallengeDetailScreen';
import { challengesService } from '../services/challenges.service';
import { checkinService } from '../services/checkin.service';
import { session } from '@services/api';
import { baseApi, setAuthenticated, store } from '@store/index';

jest.mock('../services/challenges.service', () => {
  const getChallenge = jest.fn(async () => ({
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
        {
          id: 'member-unknown',
          userId: 'user-unknown',
          displayName: 'Unknown Member',
          username: 'unknown',
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
  }));
  const getChallengeStats = jest.fn(async () => ({
    elapsedCycles: 1,
    durationDays: 7,
    heartsLeft: 3,
    totalCheckins: 1,
    completionRate: 33,
  }));
  const inviteUsers = jest.fn();
  const acceptInvite = jest.fn();
  const declineInvite = jest.fn();
  const setReady = jest.fn();
  const leaveChallenge = jest.fn();
  const deleteOrCancelChallenge = jest.fn();
  const cancelChallenge = jest.fn();

  return {
    getChallenge,
    getChallengeStats,
    inviteUsers,
    acceptInvite,
    declineInvite,
    setReady,
    leaveChallenge,
    deleteOrCancelChallenge,
    cancelChallenge,
    challengesService: {
      getChallenge,
      getChallengeStats,
      inviteUsers,
      acceptInvite,
      declineInvite,
      setReady,
      leaveChallenge,
      deleteOrCancelChallenge,
      cancelChallenge,
    },
  };
});

jest.mock('../services/checkin.service', () => {
  const getTodayStatus = jest.fn(async () => ({
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
  }));
  const listCheckins = jest.fn(async () => ({
    checkins: [
      {
        id: 'checkin-done',
        user_id: 'user-done',
        cycle_number: 1,
        evidence_url: '/uploads/checkins/challenge-1/cycle-1/user-done.jpg',
        caption: 'Finished the run',
        checked_in_at: '2026-05-20T06:10:00.000Z',
        username: 'done',
        display_name: 'Done Member',
      },
    ],
  }));
  const nudgeMember = jest.fn(async () => ({ message: 'Nudge sent successfully' }));

  return {
    getTodayStatus,
    listCheckins,
    nudgeMember,
    checkinService: {
      getTodayStatus,
      listCheckins,
      nudgeMember,
    },
  };
});

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
    getApiBaseUrl: jest.fn(() => 'http://10.0.2.2:3000/api'),
    session: {
      getCurrentUserId: jest.fn(async () => 'user-current'),
    },
  };
});

describe('ChallengeDetailScreen slap actions', () => {
  beforeEach(() => {
    store.dispatch(baseApi.util.resetApiState());
    store.dispatch(setAuthenticated({ id: 'user-current' }));
    jest.clearAllMocks();
    (session.getCurrentUserId as jest.Mock).mockResolvedValue('user-current');
  });

  afterEach(() => {
    cleanup();
    store.dispatch(baseApi.util.resetApiState());
  });

  it('keeps Slap visible but disabled for DONE members', async () => {
    renderWithProviders(<ChallengeDetailScreen challengeId="challenge-1" />);

    const button = await screen.findByTestId('slap-member-done');

    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Done');
  });

  it('does not reuse the first today status when backend members have no member id', async () => {
    (challengesService.getChallenge as jest.Mock).mockResolvedValueOnce({
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
          userId: 'user-done',
          displayName: 'Done Member',
          username: 'done',
          role: 'member',
          status: 'accepted',
          isReady: true,
        },
        {
          userId: 'user-current',
          displayName: 'Current User',
          username: 'current',
          role: 'host',
          status: 'accepted',
          isReady: true,
        },
        {
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
    });

    renderWithProviders(<ChallengeDetailScreen challengeId="challenge-1" />);

    expect(await screen.findByTestId('slap-user-done')).toHaveTextContent('Done');
    expect(await screen.findByTestId('slap-user-pending')).toHaveTextContent('Slap');
    expect(screen.getByTestId('slap-user-pending')).not.toBeDisabled();
  });

  it('enables Slap for pending other members and calls nudgeMember', async () => {
    renderWithProviders(<ChallengeDetailScreen challengeId="challenge-1" />);

    const button = await screen.findByTestId('slap-member-pending');
    expect(button).not.toBeDisabled();

    fireEvent.press(button);

    await waitFor(() => {
      expect(checkinService.nudgeMember).toHaveBeenCalledWith('challenge-1', 'user-pending');
    });
    expect(checkinService.getTodayStatus).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.getByTestId('slap-member-pending')).toHaveTextContent('Sent');
      expect(screen.getByTestId('slap-member-pending')).toBeDisabled();
    });
    expect(screen.queryByTestId('slap-error-member-pending')).toBeNull();
  });

  it('does not mark a slapped pending host as done', async () => {
    (session.getCurrentUserId as jest.Mock).mockResolvedValue('user-pending');
    store.dispatch(setAuthenticated({ id: 'user-pending' }));

    renderWithProviders(<ChallengeDetailScreen challengeId="challenge-1" />);

    const button = await screen.findByTestId('slap-member-current');
    expect(button).toHaveTextContent('Slap');

    fireEvent.press(button);

    await waitFor(() => {
      expect(checkinService.nudgeMember).toHaveBeenCalledWith('challenge-1', 'user-current');
    });

    expect(checkinService.getTodayStatus).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.getByTestId('slap-member-current')).toHaveTextContent('Sent');
    });
    expect(screen.queryByTestId('member-proof-member-current')).toBeNull();
  });

  it('does not show a Slap button for the current user', async () => {
    renderWithProviders(<ChallengeDetailScreen challengeId="challenge-1" />);

    await screen.findByTestId('challenge-detail-screen');

    expect(screen.queryByTestId('slap-member-current')).toBeNull();
  });

  it('shows N/A disabled when member check-in status is unavailable', async () => {
    renderWithProviders(<ChallengeDetailScreen challengeId="challenge-1" />);

    const button = await screen.findByTestId('slap-member-unknown');

    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('N/A');
  });

  it('shows slap API errors inline for the target member only', async () => {
    (checkinService.nudgeMember as jest.Mock).mockRejectedValueOnce(
      new Error('Already nudged this member today.'),
    );

    renderWithProviders(<ChallengeDetailScreen challengeId="challenge-1" />);

    fireEvent.press(await screen.findByTestId('slap-member-pending'));

    expect(await screen.findByTestId('slap-error-member-pending')).toHaveTextContent(
      'Already nudged this member today.',
    );
    expect(screen.queryByTestId('slap-error-member-done')).toBeNull();
    expect(screen.getByTestId('slap-member-pending')).toHaveTextContent('Slap');
  });

  it('renders uploaded check-in proof images from the gallery response', async () => {
    renderWithProviders(<ChallengeDetailScreen challengeId="challenge-1" />);

    const thumbnail = await screen.findByTestId('member-proof-member-done');
    expect(thumbnail).toHaveProp('source', {
      uri: 'http://10.0.2.2:3000/uploads/checkins/challenge-1/cycle-1/user-done.jpg',
    });

    fireEvent.press(screen.getByText('View Gallery'));

    const galleryImage = await screen.findByTestId('checkin-proof-checkin-done');
    expect(galleryImage).toHaveProp('source', {
      uri: 'http://10.0.2.2:3000/uploads/checkins/challenge-1/cycle-1/user-done.jpg',
    });
    expect(screen.getAllByText('Finished the run').length).toBeGreaterThan(0);
  });
});
