import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import { renderWithProviders } from '../../../test-utils/renderWithProviders';
import { ChallengesScreen } from '../screens/ChallengesScreen';
import { challengesService } from '../services/challenges.service';

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

const listChallengesMock = challengesService.listChallenges as jest.Mock;

async function renderChallengesScreen() {
  const result = renderWithProviders(<ChallengesScreen />);

  await waitFor(() => {
    expect(listChallengesMock).toHaveBeenCalled();
  });

  return result;
}

describe('ChallengesScreen', () => {
  it('renders active challenges by default', async () => {
    const { unmount } = await renderChallengesScreen();

    expect(screen.getByTestId('challenges-screen')).toBeTruthy();
    expect(screen.getByText('Active Challenges')).toBeTruthy();

    expect((await screen.findAllByText('Wake Up 5AM')).length).toBeGreaterThan(0);

    unmount();
  });

  it('switches to Formation segment when pressing Formation', async () => {
    const { unmount } = await renderChallengesScreen();

    fireEvent.press(screen.getByTestId('challenge-segment-formation'));

    expect(screen.getByText('Challenges in Formation')).toBeTruthy();
    expect((await screen.findAllByText('Wake up at 9am')).length).toBeGreaterThan(0);
    expect(screen.getAllByText('2/4 joined').length).toBeGreaterThan(0);

    unmount();
  });

  it('switches to History segment when pressing History', async () => {
    const { unmount } = await renderChallengesScreen();

    fireEvent.press(screen.getByTestId('challenge-segment-history'));

    expect(screen.getByText('Challenge History')).toBeTruthy();
    expect(await screen.findByText('Morning run')).toBeTruthy();
    expect(screen.getByText('Read Before Bed')).toBeTruthy();
    expect(screen.getByText('Study Sprint')).toBeTruthy();

    unmount();
  });

  it('switches back to Active segment when pressing Active', async () => {
    const { unmount } = await renderChallengesScreen();

    fireEvent.press(screen.getByTestId('challenge-segment-history'));
    expect(await screen.findByText('Morning run')).toBeTruthy();

    fireEvent.press(screen.getByTestId('challenge-segment-active'));

    expect(screen.getByText('Active Challenges')).toBeTruthy();
    expect((await screen.findAllByText('Wake Up 5AM')).length).toBeGreaterThan(0);

    unmount();
  });

  it('does not crash when rendered', async () => {
    let unmount: (() => void) | undefined;

    expect(() => {
      ({ unmount } = renderWithProviders(<ChallengesScreen />));
    }).not.toThrow();

    await waitFor(() => {
      expect(listChallengesMock).toHaveBeenCalled();
    });

    unmount?.();
  });
});
