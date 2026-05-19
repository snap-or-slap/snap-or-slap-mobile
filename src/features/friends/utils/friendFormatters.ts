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

export function formatActivityLabel(activity: unknown): string {
  if (typeof activity === 'string') return activity;
  if (!activity || typeof activity !== 'object') return 'Activity updated';

  const item = activity as {
    type?: unknown;
    label?: unknown;
    title?: unknown;
    description?: unknown;
    metadata?: Record<string, unknown>;
  };

  if (typeof item.label === 'string' && item.label.trim()) return item.label;
  if (typeof item.title === 'string' && item.title.trim()) return item.title;
  if (typeof item.description === 'string' && item.description.trim()) return item.description;

  switch (item.type) {
    case 'friend_added':
      return 'Added a new friend';
    case 'challenge_joined':
      return 'Joined a challenge';
    case 'challenge_completed':
      return 'Completed a challenge';
    case 'checkin_done':
      return 'Completed a check-in';
    case 'badge_earned':
      return 'Earned a badge';
    case 'streak_milestone':
      return 'Reached a streak milestone';
    default:
      return 'Activity updated';
  }
}

export function formatBadgeLabel(badge: unknown): { id: string; label: string } {
  if (!badge || typeof badge !== 'object') {
    const value = String(badge ?? 'badge');
    return { id: value, label: value };
  }

  const item = badge as Record<string, unknown>;
  const id = String(item.id ?? item.badgeId ?? item.name ?? item.title ?? item.label ?? 'badge');
  const label = String(item.label ?? item.name ?? item.title ?? id);
  return { id, label };
}
