import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithTheme } from '../../../../test-utils/renderWithTheme';
import { SharedChallengePreviewCard } from '../SharedChallengePreviewCard';

describe('SharedChallengePreviewCard', () => {
  it('renders challenge details', () => {
    renderWithTheme(
      <SharedChallengePreviewCard
        challenge={{
          id: 'challenge-1',
          title: 'Daily Steps',
          status: 'ACTIVE',
          progressLabel: '3/5 days',
          coSquadmatesCount: 2,
        }}
        testID="shared-preview"
      />
    );

    expect(screen.getByTestId('shared-preview')).toBeTruthy();
    expect(screen.getByText('Daily Steps')).toBeTruthy();
    expect(screen.getByText('ACTIVE')).toBeTruthy();
    expect(screen.getByText('3/5 days')).toBeTruthy();
    expect(screen.getByText('2 other squadmates')).toBeTruthy();
  });

  it('handles optional fields omitted', () => {
    renderWithTheme(
      <SharedChallengePreviewCard
        challenge={{
          id: 'challenge-2',
          title: 'Morning Yoga',
          status: 'FORMATION',
        }}
      />
    );

    expect(screen.getByText('Morning Yoga')).toBeTruthy();
    expect(screen.getByText('FORMATION')).toBeTruthy();
    
    // progressLabel and coSquadmatesCount should not be rendered
    expect(screen.queryByText(/other squadmates/)).toBeNull();
  });

  it('handles zero squadmates', () => {
    renderWithTheme(
      <SharedChallengePreviewCard
        challenge={{
          id: 'challenge-3',
          title: 'Zero Squad',
          status: 'FINISHED',
          coSquadmatesCount: 0,
        }}
      />
    );

    expect(screen.getByText('0 other squadmates')).toBeTruthy();
  });
});
