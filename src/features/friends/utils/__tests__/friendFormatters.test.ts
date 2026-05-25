import {
  formatActiveChallenges,
  formatActivityLabel,
  formatBadgeLabel,
  formatCompletionRate,
  formatMutualCount,
  formatStreak,
} from '../friendFormatters';

describe('friendFormatters', () => {
  it('formats friend profile counters', () => {
    expect(formatMutualCount()).toBe('');
    expect(formatMutualCount(0)).toBe('');
    expect(formatMutualCount(1)).toBe('1 mutual friend');
    expect(formatMutualCount(3)).toBe('3 mutual friends');

    expect(formatStreak()).toBe('\u2014');
    expect(formatStreak(0)).toBe('\u2014');
    expect(formatStreak(12)).toBe('12');

    expect(formatActiveChallenges()).toBe('');
    expect(formatActiveChallenges(null as never)).toBe('');
    expect(formatActiveChallenges(0)).toBe('No active challenges');
    expect(formatActiveChallenges(1)).toBe('1 active challenge');
    expect(formatActiveChallenges(4)).toBe('4 active challenges');

    expect(formatCompletionRate()).toBe('\u2014');
    expect(formatCompletionRate(0)).toBe('0%');
    expect(formatCompletionRate(87)).toBe('87%');
  });

  it('formats activity labels from strings and explicit object text fields', () => {
    expect(formatActivityLabel('Won a challenge')).toBe('Won a challenge');
    expect(formatActivityLabel({ label: '  Labeled activity  ' })).toBe('  Labeled activity  ');
    expect(formatActivityLabel({ title: 'Shared proof' })).toBe('Shared proof');
    expect(formatActivityLabel({ description: 'Completed the daily task' })).toBe(
      'Completed the daily task',
    );
  });

  it.each([
    ['friend_added', 'Added a new friend'],
    ['challenge_joined', 'Joined a challenge'],
    ['challenge_completed', 'Completed a challenge'],
    ['checkin_done', 'Completed a check-in'],
    ['badge_earned', 'Earned a badge'],
    ['streak_milestone', 'Reached a streak milestone'],
    ['unknown', 'Activity updated'],
  ])('formats activity type %s', (type, label) => {
    expect(formatActivityLabel({ type })).toBe(label);
  });

  it('falls back for invalid activity values', () => {
    expect(formatActivityLabel(null)).toBe('Activity updated');
    expect(formatActivityLabel(42)).toBe('Activity updated');
  });

  it('normalizes badge values into id and label pairs', () => {
    expect(formatBadgeLabel('early-bird')).toEqual({
      id: 'early-bird',
      label: 'early-bird',
    });
    expect(formatBadgeLabel(null)).toEqual({ id: 'badge', label: 'badge' });
    expect(formatBadgeLabel({ id: 'badge-1', label: 'Early Bird' })).toEqual({
      id: 'badge-1',
      label: 'Early Bird',
    });
    expect(formatBadgeLabel({ badgeId: 'badge-2', name: 'Consistent' })).toEqual({
      id: 'badge-2',
      label: 'Consistent',
    });
    expect(formatBadgeLabel({ title: 'Closer' })).toEqual({
      id: 'Closer',
      label: 'Closer',
    });
  });
});
