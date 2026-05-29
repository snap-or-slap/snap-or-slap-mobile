import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithTheme } from '../../../../test-utils/renderWithTheme';
import { ChallengeCard } from '../ChallengeCard';
import { ChallengeInfoCard } from '../ChallengeInfoCard';
import { ChallengeMemberRow } from '../ChallengeMemberRow';
import { ChallengeProgressSummary } from '../ChallengeProgressSummary';
import type { ChallengeListItem, ChallengeMember } from '../../types/challenge.types';

const pendingMember: ChallengeMember = {
  id: 'member-1',
  name: 'Mina Park',
  username: 'mina',
  status: 'PENDING',
};

const baseChallenge: ChallengeListItem = {
  id: 'challenge-1',
  title: 'Morning run',
  status: 'ACTIVE',
  heartsLeft: 0,
  totalHearts: 3,
  resetTime: '08:00',
  currentStepLabel: 'Day 2',
  progressLabel: '2 of 7 check-ins',
  memberCount: 2,
  members: [pendingMember],
};

describe('ChallengeInfoCard', () => {
  it('renders optional title and message for success variant', () => {
    renderWithTheme(
      <ChallengeInfoCard
        variant="success"
        title="Checked in"
        message="Your proof was uploaded."
      />
    );

    expect(screen.getByText('Checked in')).toBeTruthy();
    expect(screen.getByText('Your proof was uploaded.')).toBeTruthy();
  });

  it('renders message without a title for warning variant', () => {
    renderWithTheme(
      <ChallengeInfoCard variant="warning" message="One heart left." />
    );

    expect(screen.getByText('One heart left.')).toBeTruthy();
  });
});

describe('ChallengeProgressSummary', () => {
  it('renders step and progress labels', () => {
    renderWithTheme(
      <ChallengeProgressSummary
        currentStepLabel="Day 2"
        progressLabel="2 of 7 check-ins"
        testID="progress"
      />
    );

    expect(screen.getByTestId('progress')).toBeTruthy();
    expect(screen.getByText('Day 2')).toBeTruthy();
    expect(screen.getByText('2 of 7 check-ins')).toBeTruthy();
  });

  it('renders nothing without labels', () => {
    const { toJSON } = renderWithTheme(<ChallengeProgressSummary />);

    expect(toJSON()).toBeNull();
  });
});

describe('ChallengeMemberRow', () => {
  it('renders pending member and calls slap handler', () => {
    const onSlap = jest.fn();

    renderWithTheme(
      <ChallengeMemberRow
        member={pendingMember}
        onSlap={onSlap}
        testID="member-row"
      />
    );

    expect(screen.getByText('Mina Park')).toBeTruthy();
    expect(screen.getByText('@mina')).toBeTruthy();
    expect(screen.getByText('Pending')).toBeTruthy();

    fireEvent.press(screen.getByTestId('slap-member-1'));

    expect(onSlap).toHaveBeenCalledWith('member-1');
  });

  it('renders invited current-user actions', () => {
    const onAccept = jest.fn();
    const onDecline = jest.fn();

    renderWithTheme(
      <ChallengeMemberRow
        member={{
          id: 'me',
          name: 'Current User',
          status: 'INVITED',
          isCurrentUser: true,
        }}
        onAccept={onAccept}
        onDecline={onDecline}
      />
    );

    expect(screen.getByText('Current User (You)')).toBeTruthy();
    expect(screen.getByText('Invited')).toBeTruthy();

    fireEvent.press(screen.getByText('Accept'));
    fireEvent.press(screen.getByText('Decline'));

    expect(onAccept).toHaveBeenCalledWith('me');
    expect(onDecline).toHaveBeenCalledWith('me');
  });
});

describe('ChallengeCard', () => {
  it('renders active challenge danger progress and primary action', () => {
    const onPress = jest.fn();
    const onPrimaryAction = jest.fn();

    renderWithTheme(
      <ChallengeCard
        challenge={baseChallenge}
        mode="active"
        onPress={onPress}
        onPrimaryAction={onPrimaryAction}
        primaryActionLabel="Check in"
        testID="active-card"
      />
    );

    expect(screen.getByText('Morning run')).toBeTruthy();
    expect(screen.getByText('Reset 08:00')).toBeTruthy();
    expect(screen.getByText(/Danger/)).toBeTruthy();

    fireEvent.press(screen.getByTestId('active-card'));
    fireEvent.press(screen.getByTestId('challenge-card-primary-challenge-1'));

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onPrimaryAction).toHaveBeenCalledTimes(1);
  });

  it('renders formation metadata', () => {
    renderWithTheme(
      <ChallengeCard
        challenge={{
          ...baseChallenge,
          status: 'FORMATION',
          hostName: 'Long Tran',
          startDate: '2026-06-01',
          joinedCount: 2,
          memberCount: 4,
        }}
        mode="formation"
      />
    );

    expect(screen.getByText('Host: Long Tran')).toBeTruthy();
    expect(screen.getByText('Starts 2026-06-01')).toBeTruthy();
    expect(screen.getByText('2/4 joined')).toBeTruthy();
  });

  it('renders finished history result', () => {
    renderWithTheme(
      <ChallengeCard
        challenge={{
          ...baseChallenge,
          status: 'FINISHED',
          startDate: '2026-05-01',
          endDate: '2026-05-07',
          progressLabel: '7/7 check-ins',
        }}
        mode="history"
      />
    );

    expect(screen.getByText('7/7 check-ins')).toBeTruthy();
    expect(screen.getByText('Challenge complete!')).toBeTruthy();
  });
});
