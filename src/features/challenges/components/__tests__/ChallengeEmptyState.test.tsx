import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithTheme } from '../../../../test-utils/renderWithTheme';
import { ChallengeEmptyState } from '../ChallengeEmptyState';

describe('ChallengeEmptyState', () => {
  it('renders title and description', () => {
    renderWithTheme(
      <ChallengeEmptyState
        title="No challenges"
        description="Create one to get started"
        testID="empty-state"
      />
    );

    expect(screen.getByTestId('empty-state')).toBeTruthy();
    expect(screen.getByText('No challenges')).toBeTruthy();
    expect(screen.getByText('Create one to get started')).toBeTruthy();
  });

  it('renders action button and calls onAction when pressed', () => {
    const mockOnAction = jest.fn();
    renderWithTheme(
      <ChallengeEmptyState
        title="No challenges"
        actionLabel="Create Challenge"
        onAction={mockOnAction}
        testID="empty-state"
      />
    );

    expect(screen.getByText('Create Challenge')).toBeTruthy();
    
    fireEvent.press(screen.getByTestId('empty-state-action'));
    
    expect(mockOnAction).toHaveBeenCalledTimes(1);
  });

  it('does not render description or action button if not provided', () => {
    renderWithTheme(
      <ChallengeEmptyState
        title="No challenges"
        testID="empty-state"
      />
    );

    expect(screen.getByText('No challenges')).toBeTruthy();
    // Use queryByText to verify absence
    expect(screen.queryByTestId('empty-state-action')).toBeNull();
  });
});
