import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';

import { renderWithProviders } from '../../../test-utils/renderWithProviders';
import { OnboardingScreen } from '../screens/OnboardingScreen';

describe('OnboardingScreen', () => {
  it('renders the first onboarding slide', () => {
    renderWithProviders(<OnboardingScreen />);

    expect(screen.getByTestId('onboarding-screen')).toBeTruthy();

    expect(
      screen.getByText('Discipline feels easier together')
    ).toBeTruthy();

    expect(screen.getByText('Get started')).toBeTruthy();
  });

  it('moves to the second slide when pressing Get started', () => {
    renderWithProviders(<OnboardingScreen />);

    fireEvent.press(screen.getByText('Get started'));

    expect(
      screen.getByText('Check in with real photo proof')
    ).toBeTruthy();
  });

  it('goes back to the first slide when pressing Back', () => {
    renderWithProviders(<OnboardingScreen />);

    fireEvent.press(screen.getByText('Get started'));

    expect(
      screen.getByText('Check in with real photo proof')
    ).toBeTruthy();

    fireEvent.press(screen.getByTestId('onboarding-back-button'));

    expect(
      screen.getByText('Discipline feels easier together')
    ).toBeTruthy();
  });

  it('calls onComplete when pressing Skip', () => {
    const onComplete = jest.fn();

    renderWithProviders(<OnboardingScreen onComplete={onComplete} />);

    fireEvent.press(screen.getByTestId('onboarding-skip-button'));

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('calls onComplete when pressing Create account on the final slide', () => {
    const onComplete = jest.fn();

    renderWithProviders(<OnboardingScreen onComplete={onComplete} />);

    fireEvent.press(screen.getByText('Get started'));
    fireEvent.press(screen.getByText('Next'));
    fireEvent.press(screen.getByText('Next'));
    fireEvent.press(screen.getByText('Next'));

    expect(
      screen.getByText('Ready for your first challenge?')
    ).toBeTruthy();

    fireEvent.press(screen.getByText('Create account'));

    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});