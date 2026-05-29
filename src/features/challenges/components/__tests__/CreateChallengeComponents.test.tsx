import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithTheme } from '../../../../test-utils/renderWithTheme';
import { CreateChallengeFooter } from '../CreateChallengeFooter';
import { CreateChallengeFriendPicker } from '../CreateChallengeFriendPicker';
import { CreateChallengeReviewCard } from '../CreateChallengeReviewCard';
import { CreateChallengeStepHeader } from '../CreateChallengeStepHeader';
import { NumericStepper } from '../NumericStepper';
import type { CreateChallengeFormValues } from '../../types/createChallenge.types';

const friends = [
  { id: 'friend-1', name: 'Mina Park', username: 'mina' },
  { id: 'friend-2', name: 'Long Tran', username: 'long' },
];

const reviewValues: CreateChallengeFormValues = {
  title: 'Morning run',
  description: 'Check in after the run',
  taskInstruction: 'Take a photo outside',
  coverUrl: 'https://example.com/cover.png',
  durationDays: 7,
  frequency: 'custom',
  frequencyDays: [1, 3, 5],
  resetTime: '08:00',
  startAt: null,
  totalHearts: 3,
  maxMembers: 8,
  isPrivate: true,
  invitedFriendIds: ['friend-1'],
};

describe('NumericStepper', () => {
  it('increments, decrements, and disables at bounds', () => {
    const onChange = jest.fn();
    const { rerender } = renderWithTheme(
      <NumericStepper
        label="Duration"
        value={2}
        min={1}
        max={3}
        onChange={onChange}
        testID="duration"
      />
    );

    fireEvent.press(screen.getByTestId('duration-increase'));
    fireEvent.press(screen.getByTestId('duration-decrease'));

    expect(onChange).toHaveBeenNthCalledWith(1, 3);
    expect(onChange).toHaveBeenNthCalledWith(2, 1);

    rerender(
      <NumericStepper
        label="Duration"
        value={1}
        min={1}
        max={3}
        onChange={onChange}
        testID="duration"
      />
    );

    expect(screen.getByTestId('duration-decrease')).toBeDisabled();
  });

  it('validates manual input and clamps committed values', () => {
    const onChange = jest.fn();

    renderWithTheme(
      <NumericStepper
        label="Hearts"
        value={5}
        min={1}
        max={10}
        onChange={onChange}
        testID="hearts"
      />
    );

    fireEvent.changeText(screen.getByTestId('hearts-input'), '99');
    expect(screen.getByText('Hearts must be between 1 and 10.')).toBeTruthy();

    fireEvent(screen.getByTestId('hearts-input'), 'blur');
    expect(onChange).toHaveBeenCalledWith(10);
  });
});

describe('CreateChallengeFooter', () => {
  it('calls back and next handlers for non-final steps', () => {
    const onBack = jest.fn();
    const onNext = jest.fn();

    renderWithTheme(
      <CreateChallengeFooter onBack={onBack} onNext={onNext} />
    );

    fireEvent.press(screen.getByTestId('create-challenge-back-step'));
    fireEvent.press(screen.getByTestId('create-challenge-next-step'));

    expect(onBack).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('renders final submit state and honors disabled', () => {
    renderWithTheme(
      <CreateChallengeFooter
        isLastStep
        nextDisabled
        onSubmit={jest.fn()}
      />
    );

    expect(screen.getByText('Create Challenge')).toBeTruthy();
    expect(screen.getByTestId('create-challenge-submit-button')).toBeDisabled();
  });
});

describe('CreateChallengeFriendPicker', () => {
  it('renders empty state when there are no friends', () => {
    renderWithTheme(
      <CreateChallengeFriendPicker friends={[]} selectedIds={[]} onToggle={jest.fn()} />
    );

    expect(screen.getByText('No friends to invite yet.')).toBeTruthy();
    expect(screen.getByText('Add friends to invite them to a challenge.')).toBeTruthy();
  });

  it('renders selectable friends and calls onToggle', () => {
    const onToggle = jest.fn();

    renderWithTheme(
      <CreateChallengeFriendPicker
        friends={friends}
        selectedIds={['friend-1']}
        onToggle={onToggle}
      />
    );

    expect(screen.getByText('Mina Park')).toBeTruthy();
    expect(screen.getByText('@mina')).toBeTruthy();
    expect(screen.getByTestId('friend-row-friend-1')).toHaveAccessibilityState({
      checked: true,
    });

    fireEvent.press(screen.getByTestId('friend-row-friend-2'));

    expect(onToggle).toHaveBeenCalledWith('friend-2');
  });
});

describe('CreateChallengeReviewCard', () => {
  it('renders challenge details, privacy, cover, and invited friends', () => {
    renderWithTheme(
      <CreateChallengeReviewCard values={reviewValues} friends={friends} />
    );

    expect(screen.getByText('Morning run')).toBeTruthy();
    expect(screen.getByText('Check in after the run')).toBeTruthy();
    expect(screen.getByText('Starts when the host launches it')).toBeTruthy();
    expect(screen.getByText('3 custom days')).toBeTruthy();
    expect(screen.getByText('Private')).toBeTruthy();
    expect(screen.getByText('https://example.com/cover.png')).toBeTruthy();
    expect(screen.getByText('Invited friends')).toBeTruthy();
  });

  it('renders fallback values for optional review fields', () => {
    renderWithTheme(
      <CreateChallengeReviewCard
        values={{
          ...reviewValues,
          title: '',
          description: '',
          coverUrl: '',
          durationDays: 1,
          frequency: 'daily',
          frequencyDays: [],
          isPrivate: false,
          invitedFriendIds: [],
        }}
        friends={friends}
      />
    );

    expect(screen.getByText('(Untitled)')).toBeTruthy();
    expect(screen.getByText('1 day')).toBeTruthy();
    expect(screen.getByText('Daily')).toBeTruthy();
    expect(screen.getByText('Public')).toBeTruthy();
    expect(screen.queryByText('Invited friends')).toBeNull();
  });
});

describe('CreateChallengeStepHeader', () => {
  it('renders current step progress and completed steps', () => {
    renderWithTheme(
      <CreateChallengeStepHeader
        currentStep="schedule"
        completedSteps={['info']}
      />
    );

    expect(screen.getByText('Step 2 of 4')).toBeTruthy();
    expect(screen.getAllByText('Schedule').length).toBeGreaterThan(0);
    expect(screen.getByText('Challenge Info')).toBeTruthy();
  });

  it('marks a step when one of its fields has an error', () => {
    renderWithTheme(
      <CreateChallengeStepHeader
        currentStep="rules"
        fieldErrors={{ totalHearts: 'Required' }}
      />
    );

    expect(screen.getByText('Step 3 of 4')).toBeTruthy();
    expect(screen.getAllByText('Survival Rules').length).toBeGreaterThan(0);
  });
});
