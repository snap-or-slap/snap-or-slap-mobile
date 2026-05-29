import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithTheme } from '../../../../test-utils/renderWithTheme';
import { ActiveChallengeCard } from '../ActiveChallengeCard';
import { JoinedMembersBar } from '../JoinedMembersBar';
import { ChallengeHearts } from '../ChallengeHearts';
import { ChallengeStatusBadge } from '../ChallengeStatusBadge';
import { HeartCountBadge } from '../HeartCountBadge';
import { ChallengeStatusPill } from '../ChallengeStatusPill';

describe('ActiveChallengeCard', () => {
  it('renders correctly', () => {
    renderWithTheme(
      <ActiveChallengeCard
        challenge={{
          id: '1',
          title: 'Daily Run',
          status: 'ACTIVE',
          heartsLeft: 2,
          totalHearts: 3,
          resetTimeText: '8:00 AM',
          stepText: 'Step 1/5',
          heartsText: '2 hearts left',
          riskStatus: 'safe',
        }}
        testID="active-card"
      />
    );

    expect(screen.getByTestId('active-card')).toBeTruthy();
    expect(screen.getByText('Daily Run')).toBeTruthy();
    expect(screen.getByText('Reset 8:00 AM')).toBeTruthy();
    expect(screen.getByText('Step 1/5')).toBeTruthy();
    expect(screen.getByText('2 hearts left')).toBeTruthy();
  });

  it('renders correctly with danger status', () => {
    renderWithTheme(
      <ActiveChallengeCard
        challenge={{
          id: '2',
          title: 'Morning Yoga',
          status: 'ACTIVE',
          heartsLeft: 0,
          totalHearts: 3,
          resetTimeText: '9:00 AM',
          stepText: 'Step 3/5',
          heartsText: 'No hearts left',
          riskStatus: 'danger',
        }}
        testID="active-card-danger"
      />
    );

    expect(screen.getByTestId('active-card-danger')).toBeTruthy();
    expect(screen.getByText('No hearts left')).toBeTruthy();
    // It should render 'Danger' pill
    expect(screen.getByText('Danger')).toBeTruthy();
  });
});

describe('JoinedMembersBar', () => {
  it('renders default +1 extra text', () => {
    renderWithTheme(
      <JoinedMembersBar joinedText="2/5 joined" testID="joined-bar" />
    );

    expect(screen.getByTestId('joined-bar')).toBeTruthy();
    expect(screen.getByText('2/5 joined')).toBeTruthy();
    expect(screen.getByText('+1')).toBeTruthy();
  });

  it('renders custom extra members text', () => {
    renderWithTheme(
      <JoinedMembersBar joinedText="4/5 joined" extraMembersText="+3" />
    );

    expect(screen.getByText('4/5 joined')).toBeTruthy();
    expect(screen.getByText('+3')).toBeTruthy();
  });
});

describe('ChallengeHearts (and HeartCountBadge)', () => {
  it('renders standard hearts badge', () => {
    renderWithTheme(
      <ChallengeHearts label="3 hearts left" variant="standard" tone="brand" />
    );
    expect(screen.getByText('3 hearts left')).toBeTruthy();
  });

  it('renders via deprecated HeartCountBadge', () => {
    renderWithTheme(
      <HeartCountBadge label="1 heart left" variant="filled" tone="danger" />
    );
    expect(screen.getByText('1 heart left')).toBeTruthy();
  });
});

describe('ChallengeStatusBadge (and ChallengeStatusPill)', () => {
  it('renders active tone', () => {
    renderWithTheme(<ChallengeStatusBadge tone="active" />);
    expect(screen.getByText('Active')).toBeTruthy();
  });

  it('renders custom label and via deprecated ChallengeStatusPill', () => {
    renderWithTheme(
      <ChallengeStatusPill tone="on-track" label="On Track" showDot />
    );
    expect(screen.getByText('On Track')).toBeTruthy();
  });
});
