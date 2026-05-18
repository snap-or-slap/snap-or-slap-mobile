/** Format mutual friend count as readable string */
export function formatMutualCount(count?: number): string {
  if (!count || count === 0) return '';
  if (count === 1) return '1 mutual friend';
  return `${count} mutual friends`;
}

/** Format streak count for display */
export function formatStreak(streak?: number): string {
  if (!streak || streak === 0) return '—';
  return `${streak}`;
}

/** Format active challenges count */
export function formatActiveChallenges(count?: number): string {
  if (count === undefined || count === null) return '';
  if (count === 0) return 'No active challenges';
  if (count === 1) return '1 active challenge';
  return `${count} active challenges`;
}

/** Format completion rate percentage */
export function formatCompletionRate(rate?: number): string {
  if (rate === undefined || rate === null) return '—';
  return `${rate}%`;
}
