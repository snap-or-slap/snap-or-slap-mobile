import {
  isActiveSegment,
  isFormationSegment,
  isHistorySegment,
  statusLabel,
  statusToTone,
} from '../challengeStatus';

describe('challengeStatus', () => {
  it.each([
    ['ACTIVE', 'active'],
    ['FORMATION', 'formation'],
    ['INVITED', 'invited'],
    ['FINISHED', 'success'],
    ['GAME_OVER', 'game-over'],
    ['CANCELLED', 'cancelled'],
  ] as const)('maps %s to the %s tone', (status, tone) => {
    expect(statusToTone(status)).toBe(tone);
  });

  it('falls back to the formation tone for unknown statuses', () => {
    expect(statusToTone('UNKNOWN' as never)).toBe('formation');
  });

  it.each([
    ['ACTIVE', 'Active'],
    ['FORMATION', 'Formation'],
    ['INVITED', 'Invited'],
    ['FINISHED', 'Finished'],
    ['GAME_OVER', 'Game Over'],
    ['CANCELLED', 'Cancelled'],
  ] as const)('maps %s to the %s label', (status, label) => {
    expect(statusLabel(status)).toBe(label);
  });

  it('falls back to the raw status as a label for unknown statuses', () => {
    expect(statusLabel('ARCHIVED' as never)).toBe('ARCHIVED');
  });

  it('classifies active, formation, and history segments', () => {
    expect(isActiveSegment('ACTIVE')).toBe(true);
    expect(isActiveSegment('FORMATION')).toBe(false);

    expect(isFormationSegment('FORMATION')).toBe(true);
    expect(isFormationSegment('INVITED')).toBe(true);
    expect(isFormationSegment('ACTIVE')).toBe(false);

    expect(isHistorySegment('FINISHED')).toBe(true);
    expect(isHistorySegment('GAME_OVER')).toBe(true);
    expect(isHistorySegment('CANCELLED')).toBe(true);
    expect(isHistorySegment('ACTIVE')).toBe(false);
  });
});
