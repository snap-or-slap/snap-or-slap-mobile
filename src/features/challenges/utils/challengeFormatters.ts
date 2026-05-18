/**
 * Format hearts as "N/M"
 */
export function formatHearts(heartsLeft?: number, totalHearts?: number): string | null {
  if (heartsLeft == null || totalHearts == null) return null;
  return `${heartsLeft}/${totalHearts}`;
}

/**
 * Format a date string (ISO or similar) into "May 18, 2026" style
 */
export function formatDateDisplay(dateStr?: string): string {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format a date range
 */
export function formatDateRange(startDate?: string, endDate?: string): string {
  if (!startDate || !endDate) return '—';
  return `${formatDateDisplay(startDate)} – ${formatDateDisplay(endDate)}`;
}

/**
 * Format member count
 */
export function formatMemberCount(count?: number): string {
  if (count == null) return '—';
  return `${count} member${count === 1 ? '' : 's'}`;
}

/**
 * Format joined/total members
 */
export function formatJoinedCount(joined?: number, total?: number): string {
  if (joined == null || total == null) return '—';
  return `${joined}/${total} joined`;
}
