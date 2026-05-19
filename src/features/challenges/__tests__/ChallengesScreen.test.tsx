import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';

import { renderWithProviders } from '../../../test-utils/renderWithProviders';
import { ChallengesScreen } from '../screens/ChallengesScreen';

jest.mock('../services/challenges.service', () => ({
  challengesService: {
    listChallenges: jest.fn(async ({ status }: { status?: string } = {}) => {
      if (status === 'formation') {
        return {
          challenges: [
            {
              id: 'formation-1',
              title: 'Wake up at 9am',
              status: 'formation',
              memberCount: 4,
              joinedCount: 2,
              totalHearts: 4,
            },
          ],
        };
      }

      return {
        challenges: [
          {
            id: 'active-1',
            title: 'Wake Up 5AM',
            status: 'active',
            heartsLeft: 3,
            totalHearts: 3,
            memberCount: 4,
            joinedCount: 4,
          },
        ],
      };
    }),
    getHistoryList: jest.fn(async () => ({
      challenges: [
        { id: 'history-1', title: 'Morning run', status: 'completed' },
        { id: 'history-2', title: 'Read Before Bed', status: 'failed' },
        { id: 'history-3', title: 'Study Sprint', status: 'cancelled' },
      ],
    })),
  },
}));

describe('ChallengesScreen', () => {
  it('renders active challenges by default', async () => {
    renderWithProviders(<ChallengesScreen />);

    expect(screen.getByTestId('challenges-screen')).toBeTruthy();
    expect(screen.getByText('Active Challenges')).toBeTruthy();

    expect((await screen.findAllByText('Wake Up 5AM')).length).toBeGreaterThan(0);
  });

  it('switches to Formation segment when pressing Formation', async () => {
    renderWithProviders(<ChallengesScreen />);

    fireEvent.press(screen.getByTestId('challenge-segment-formation'));

    expect(screen.getByText('Challenges in Formation')).toBeTruthy();
    expect((await screen.findAllByText('Wake up at 9am')).length).toBeGreaterThan(0);
    expect(screen.getAllByText('2/4 joined').length).toBeGreaterThan(0);
  });

  it('switches to History segment when pressing History', async () => {
    renderWithProviders(<ChallengesScreen />);

    fireEvent.press(screen.getByTestId('challenge-segment-history'));

    expect(screen.getByText('Challenge History')).toBeTruthy();
    expect(await screen.findByText('Morning run')).toBeTruthy();
    expect(screen.getByText('Read Before Bed')).toBeTruthy();
    expect(screen.getByText('Study Sprint')).toBeTruthy();
  });

  it('switches back to Active segment when pressing Active', async () => {
    renderWithProviders(<ChallengesScreen />);

    fireEvent.press(screen.getByTestId('challenge-segment-history'));
    expect(screen.getByText('Challenge History')).toBeTruthy();

    fireEvent.press(screen.getByTestId('challenge-segment-active'));

    expect(screen.getByText('Active Challenges')).toBeTruthy();
    expect((await screen.findAllByText('Wake Up 5AM')).length).toBeGreaterThan(0);
  });

  it('does not crash when rendered', () => {
    expect(() => {
      renderWithProviders(<ChallengesScreen />);
    }).not.toThrow();
  });
});
