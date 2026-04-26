import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';

import { renderWithProviders } from '../../../test-utils/renderWithProviders';
import { ChallengesScreen } from '../screens/ChallengesScreen';

describe('ChallengesScreen', () => {
  it('renders active challenges by default', () => {
    renderWithProviders(<ChallengesScreen />);

    expect(screen.getByTestId('challenges-screen')).toBeTruthy();
    expect(screen.getByText('Active Challenges')).toBeTruthy();

    expect(screen.getAllByText('Wake Up 5AM').length).toBeGreaterThan(0);
  });

  it('switches to Formation segment when pressing Formation', () => {
    renderWithProviders(<ChallengesScreen />);

    fireEvent.press(screen.getByTestId('challenge-segment-formation'));

    expect(screen.getByText('Challenges in Formation')).toBeTruthy();
    expect(screen.getAllByText('Wake up at 9am').length).toBeGreaterThan(0);
    expect(screen.getAllByText('2/4 joined').length).toBeGreaterThan(0);
  });

  it('switches to History segment when pressing History', () => {
    renderWithProviders(<ChallengesScreen />);

    fireEvent.press(screen.getByTestId('challenge-segment-history'));

    expect(screen.getByText('Challenge History')).toBeTruthy();
    expect(screen.getByText('Morning run')).toBeTruthy();
    expect(screen.getByText('Read Before Bed')).toBeTruthy();
    expect(screen.getByText('Study Sprint')).toBeTruthy();
  });

  it('switches back to Active segment when pressing Active', () => {
    renderWithProviders(<ChallengesScreen />);

    fireEvent.press(screen.getByTestId('challenge-segment-history'));
    expect(screen.getByText('Challenge History')).toBeTruthy();

    fireEvent.press(screen.getByTestId('challenge-segment-active'));

    expect(screen.getByText('Active Challenges')).toBeTruthy();
    expect(screen.getAllByText('Wake Up 5AM').length).toBeGreaterThan(0);
  });

  it('does not crash when rendered', () => {
    expect(() => {
      renderWithProviders(<ChallengesScreen />);
    }).not.toThrow();
  });
});