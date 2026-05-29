import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import { renderWithProviders } from '../../../../test-utils/renderWithProviders';
import { ChallengeHubScreen } from '../ChallengeHubScreen';

// ── Service mocks ───────────────────────────────────────────────────────────

const mockRefetchList = jest.fn();
const mockRefetchHistory = jest.fn();

const mockAcceptInvite = jest.fn();
const mockDeclineInvite = jest.fn();

jest.mock('@store/api/challengeApi', () => ({
  useListChallengesQuery: jest.fn(() => ({
    data: undefined,
    isLoading: true,
    isFetching: true,
    error: null,
    refetch: mockRefetchList,
  })),
  useGetHistoryListQuery: jest.fn(() => ({
    data: undefined,
    isLoading: false,
    isFetching: false,
    error: null,
    refetch: mockRefetchHistory,
  })),
  useAcceptInviteMutation: () => [mockAcceptInvite],
  useDeclineInviteMutation: () => [mockDeclineInvite],
}));

jest.mock('@store/api/widgetApi', () => ({
  useGetWidgetSummaryQuery: jest.fn(() => ({
    data: { currentStreak: 12 },
  })),
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { useListChallengesQuery, useGetHistoryListQuery } = require('@store/api/challengeApi');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { useGetWidgetSummaryQuery } = require('@store/api/widgetApi');

const MOCK_ACTIVE_CHALLENGES = {
  challenges: [
    {
      id: 'challenge-1',
      title: 'Active Challenge',
      status: 'ACTIVE',
      hostName: 'TestUser',
      memberCount: 3,
      joinedCount: 3,
    },
    {
      id: 'challenge-invite',
      title: 'You are invited',
      status: 'INVITED',
      hostName: 'HostUser',
    },
  ],
  total: 2,
};

const MOCK_HISTORY_CHALLENGES = {
  challenges: [
    {
      id: 'challenge-2',
      title: 'Completed Challenge',
      status: 'FINISHED',
      hostName: 'TestUser',
    },
  ],
};

describe('ChallengeHubScreen', () => {
  const mockOnCreateChallenge = jest.fn();
  const mockOnOpenChallenge = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    useListChallengesQuery.mockReturnValue({
      data: MOCK_ACTIVE_CHALLENGES,
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: mockRefetchList,
    });
    
    useGetHistoryListQuery.mockReturnValue({
      data: MOCK_HISTORY_CHALLENGES,
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: mockRefetchHistory,
    });

    mockAcceptInvite.mockReturnValue({ unwrap: () => Promise.resolve() });
    mockDeclineInvite.mockReturnValue({ unwrap: () => Promise.resolve() });
  });

  it('renders loading state initially', () => {
    useListChallengesQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: true,
      error: null,
      refetch: mockRefetchList,
    });
    
    renderWithProviders(<ChallengeHubScreen />);
    
    expect(screen.getByText('Loading challenges...')).toBeTruthy();
  });

  it('renders active challenges and invite', async () => {
    renderWithProviders(
      <ChallengeHubScreen
        onCreateChallenge={mockOnCreateChallenge}
        onOpenChallenge={mockOnOpenChallenge}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByTestId('challenge-hub-screen')).toBeTruthy();
    });

    expect(screen.getByText('Active Challenge')).toBeTruthy();
    expect(screen.getByText('You are invited')).toBeTruthy();
    expect(screen.getByText('12 days')).toBeTruthy(); // streak
  });

  it('handles create challenge button press', async () => {
    renderWithProviders(
      <ChallengeHubScreen
        onCreateChallenge={mockOnCreateChallenge}
      />
    );
    
    fireEvent.press(screen.getByTestId('open-create-challenge-button'));
    expect(mockOnCreateChallenge).toHaveBeenCalledTimes(1);
  });

  it('opens a challenge on press', async () => {
    renderWithProviders(
      <ChallengeHubScreen
        onOpenChallenge={mockOnOpenChallenge}
      />
    );
    
    // The "View" button for 'Active Challenge'
    fireEvent.press(screen.getByText('View'));
    expect(mockOnOpenChallenge).toHaveBeenCalledWith('challenge-1');
  });

  it('handles accept invite', async () => {
    renderWithProviders(
      <ChallengeHubScreen
        onOpenChallenge={mockOnOpenChallenge}
      />
    );
    
    // The "Accept" button for 'You are invited'
    fireEvent.press(screen.getByText('Accept'));
    
    await waitFor(() => {
      expect(mockAcceptInvite).toHaveBeenCalledWith('challenge-invite');
      expect(mockOnOpenChallenge).toHaveBeenCalledWith('challenge-invite');
    });
  });

  it('handles decline invite', async () => {
    renderWithProviders(<ChallengeHubScreen />);
    
    // The "Decline" button for 'You are invited'
    fireEvent.press(screen.getByText('Decline'));
    
    await waitFor(() => {
      expect(mockDeclineInvite).toHaveBeenCalledWith('challenge-invite');
    });
  });

  it('renders empty state when no active challenges', async () => {
    useListChallengesQuery.mockReturnValue({
      data: { challenges: [] },
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: mockRefetchList,
    });
    
    renderWithProviders(<ChallengeHubScreen />);
    
    await waitFor(() => {
      expect(screen.getByTestId('active-empty-state')).toBeTruthy();
    });
  });

  it('renders error state when API fails', async () => {
    useListChallengesQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      error: { error: 'Network error' },
      refetch: mockRefetchList,
    });
    
    renderWithProviders(<ChallengeHubScreen />);
    
    await waitFor(() => {
      expect(screen.getByTestId('challenge-error-state')).toBeTruthy();
    });
    expect(screen.getByText('Network error')).toBeTruthy();

    fireEvent.press(screen.getByText('Retry'));
    expect(mockRefetchList).toHaveBeenCalledTimes(1);
  });

  it('switches to history segment and renders history', async () => {
    renderWithProviders(<ChallengeHubScreen />);
    
    // Find the history tab (assuming it has text 'History')
    fireEvent.press(screen.getByText('History'));
    
    await waitFor(() => {
      expect(screen.getByText('Completed Challenge')).toBeTruthy();
    });
  });
});
