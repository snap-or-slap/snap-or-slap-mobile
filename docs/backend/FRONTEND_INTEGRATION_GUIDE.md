# Frontend Integration Guide

Source of truth: backend route handlers under `Backend/src/app/api/**/route.ts`.

## Base URL

- Local backend: `http://localhost:3000`
- Deployed backend in OpenAPI: `https://backend-production-2ba1.up.railway.app`
- All runtime routes are under `/api`.
- Example: `GET {BASE_URL}/api/users/me?user_id=<uuid>`

## Auth and session handling

Current implemented routes return JWTs, but most APIs do not read `Authorization: Bearer`. They identify the caller with `user_id` query params.

1. Login: `POST /api/auth/login` with `{ "email": "...", "password": "..." }`.
2. Register: `POST /api/auth/register` with `{ "email": "...", "password": "...", "username": "...", "terms_agreed": true }`.
3. Store `user.id`, `access_token`, and `refresh_token`.
4. Refresh: `POST /api/auth/refresh` with `{ "refresh_token": "..." }`; backend rotates refresh tokens.
5. Sign out: `POST /api/auth/signout` with `{ "refresh_token": "..." }`.
6. Pass `?user_id=<stored user.id>` to user-scoped endpoints.
7. Bearer access token is only enforced by the unused helper `src/lib/middleware/withAuth.ts`; route handlers inspected here do not use it. Need verification before relying on Bearer auth for any endpoint other than future backend changes.

## Backend conventions

- Responses are JSON.
- Success responses usually wrap resources: `{ "user": ... }`, `{ "challenge": ... }`, `{ "friends": [...] }`, `{ "notifications": [...] }`.
- Errors usually return `{ "error": "message" }`.
- Validation errors usually return `{ "error": "Validation failed", "details": [{ "field": "...", "message": "..." }] }`, but some routes return raw Zod issues in `details`.
- Backend response fields are often snake_case: `display_name`, `avatar_url`, `is_private`, `access_token`, `refresh_token`.
- Many request bodies are camelCase: `displayName`, `isPrivate`, `durationDays`, `resetTime`, `invitedUserIds`, `evidenceUrl`, `isReady`.
- Some request bodies are snake_case: `refresh_token`, `receiver_id`, `notification_ids`, `mark_all`, `reinvite_user_ids`.
- `user_id` query param is required for most user-scoped APIs.
- Do not use endpoints marked 501 or debug-only.

## Recommended FE service structure

```text
src/services/api/
  apiClient.ts
  apiError.ts
  apiRoutes.ts
  mappers.ts

src/features/auth/services/auth.service.ts
src/features/profile/services/profile.service.ts
src/features/friends/services/friends.service.ts
src/features/challenges/services/challenges.service.ts
src/features/notifications/services/notifications.service.ts
src/features/widget/services/widget.service.ts
```

## Recommended integration order

1. API client: base URL, JSON parsing, error normalization, `user_id` query helper.
2. Auth: register, login, refresh, signout, session storage.
3. Profile: `/api/users/me`, `/api/users/me/profile`, profile update, privacy settings.
4. Friends: search, friend request, pending requests, respond, list friends.
5. Challenges: list, create, detail, invite/join/decline/ready/leave.
6. Check-in: submit check-in, today status, gallery, stats.
7. Notifications/widget: list/read/delete notifications, sync overlays, widget summary.

## Do-not-use list

- `POST /api/challenges/{id}/proof`: 501, no media upload implementation.
- `GET /api/teams`: 501 legacy placeholder.
- `POST /api/teams`: 501 legacy placeholder.
- `POST /api/teams/{id}/slap`: 501 legacy placeholder.
- `GET /api/test-data`: debug dump only.
- `GET /api/hello`: smoke endpoint only.
- Old FE "teams" or "slap" APIs do not map to the implemented challenge/nudge model.

## Example service calls

```ts
await api.post('/api/auth/login', { email, password });
// returns { user, access_token, refresh_token }

await api.get(`/api/users/me?user_id=${userId}`);

await api.get(`/api/users/search?q=${encodeURIComponent(q)}&user_id=${userId}`);

await api.post(`/api/friends/request?user_id=${userId}`, {
  receiver_id: targetUserId,
});

await api.get(`/api/challenges?user_id=${userId}&status=active`);

await api.post(`/api/challenges?user_id=${userId}`, {
  title,
  description,
  durationDays: 30,
  frequency: 'daily',
  resetTime: '06:00',
  totalHearts: 3,
  maxMembers: 10,
  isPrivate: false,
  invitedUserIds,
});

await api.get(`/api/challenges/${challengeId}?user_id=${userId}`);

await api.post(`/api/challenges/${challengeId}/checkins?user_id=${userId}`, {
  evidenceUrl,
  caption,
});

await api.post(`/api/challenges/${challengeId}/nudge/${memberId}?user_id=${userId}`);

await api.delete(`/api/users/me?user_id=${userId}`);
```

## Error handling strategy

- Parse JSON for every non-204 response.
- If body has `error`, use it as the developer-facing message and map to friendly UI copy.
- If body has `details`, show field-level messages when possible.
- `400`: validation or missing query/body; keep user on form and highlight fields.
- `401`: invalid credentials/token/current password; ask user to retry login or current password.
- `403`: user is not allowed or not a member/host; show "You do not have access."
- `404`: entity missing; navigate back or show empty state.
- `409`: business rule conflict such as already checked in, challenge full, not in formation.
- `429`: nudge rate limit; show "Already nudged this member today."
- `500`: backend failure; show retry UI and log response.

## Key integration warnings

- Keep `user.id`; many APIs require `?user_id=`.
- Do not depend on exact success message strings.
- Do not send camelCase to recreate endpoints; `POST /api/challenges/{id}/recreate` expects snake_case overrides.
- Do not assume image upload exists. `POST /api/challenges/{id}/checkins` stores only an `evidenceUrl` string.
- Do not use Bearer auth as the only identity mechanism until backend routes are changed to use `withAuth`.
