import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

// ── Tag Types ────────────────────────────────────────────────────

export const TAG_TYPES = [
  'Auth',
  'Challenge',
  'ChallengeDetail',
  'ChallengeStats',
  'Checkin',
  'TodayCheckin',
  'Friend',
  'FriendRequest',
  'Profile',
  'UserProfile',
  'Notification',
  'Widget',
] as const;

// ── Base API ─────────────────────────────────────────────────────

/**
 * Base API definition for RTK Query.
 *
 * We use `fakeBaseQuery` because each endpoint calls the existing
 * service functions directly (which already handle apiClient,
 * auth headers, base URL, error normalization, and snake→camel mapping).
 *
 * Endpoints are injected from separate api files per domain.
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery(),
  tagTypes: [...TAG_TYPES],
  endpoints: () => ({}),
});
