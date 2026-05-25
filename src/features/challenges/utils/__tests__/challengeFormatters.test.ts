import {
  formatDateDisplay,
  formatDateRange,
  formatHearts,
  formatJoinedCount,
  formatMemberCount,
} from '../challengeFormatters';

describe('challengeFormatters', () => {
  describe('formatHearts', () => {
    it('formats remaining and total hearts', () => {
      expect(formatHearts(2, 5)).toBe('2/5');
      expect(formatHearts(0, 3)).toBe('0/3');
    });

    it('returns null when either heart value is missing', () => {
      expect(formatHearts(undefined, 5)).toBeNull();
      expect(formatHearts(2, undefined)).toBeNull();
    });
  });

  describe('formatDateDisplay', () => {
    it('formats valid dates using the compact English date format', () => {
      expect(formatDateDisplay('2026-05-18T12:00:00.000Z')).toBe('May 18, 2026');
    });

    it('returns a dash for empty input and the original value for invalid dates', () => {
      expect(formatDateDisplay()).toBe('\u2014');
      expect(formatDateDisplay('not-a-date')).toBe('not-a-date');
    });
  });

  describe('formatDateRange', () => {
    it('formats a valid start and end date', () => {
      expect(
        formatDateRange('2026-05-18T12:00:00.000Z', '2026-05-25T12:00:00.000Z'),
      ).toBe('May 18, 2026 \u2013 May 25, 2026');
    });

    it('returns a dash when either date is missing', () => {
      expect(formatDateRange(undefined, '2026-05-25T12:00:00.000Z')).toBe('\u2014');
      expect(formatDateRange('2026-05-18T12:00:00.000Z')).toBe('\u2014');
    });
  });

  describe('member count formatters', () => {
    it('formats singular, plural, and missing member counts', () => {
      expect(formatMemberCount(1)).toBe('1 member');
      expect(formatMemberCount(2)).toBe('2 members');
      expect(formatMemberCount(0)).toBe('0 members');
      expect(formatMemberCount()).toBe('\u2014');
    });

    it('formats joined counts and handles missing values', () => {
      expect(formatJoinedCount(3, 5)).toBe('3/5 joined');
      expect(formatJoinedCount(0, 5)).toBe('0/5 joined');
      expect(formatJoinedCount(undefined, 5)).toBe('\u2014');
      expect(formatJoinedCount(3)).toBe('\u2014');
    });
  });
});
