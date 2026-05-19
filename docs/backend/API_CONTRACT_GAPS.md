# Backend API Contract Gaps

Source of truth: `Backend/src/app/api/**/route.ts`; OpenAPI file: `Backend/src/app/api/docs/openapi.json`.

## 1. OpenAPI vs `route.ts` mismatches

### Missing implemented routes in OpenAPI

- Description: Actual route handlers exist but are not listed in `openapi.json`.
- Affected endpoints/files: `GET /api/hello` (`src/app/api/hello/route.ts`), `GET /api/docs` (`src/app/api/docs/route.ts`), `GET /api/docs/ui` (`src/app/api/docs/ui/route.ts`), `DELETE /api/users/me` (`src/app/api/users/me/route.ts`).
- Frontend impact: Low. These are docs/smoke endpoints and should not be used by app features.
- Workaround: FE should call `/api/docs` only for developer inspection, not runtime app behavior.
- Backend change later: Optional OpenAPI update.

### 501 routes missing from OpenAPI

- Description: Legacy or placeholder routes exist but are not listed in OpenAPI.
- Affected endpoints/files: `POST /api/challenges/{id}/proof`, `GET /api/teams`, `POST /api/teams`, `POST /api/teams/{id}/slap`.
- Frontend impact: High if FE tries to use photo proof upload or old team/slap APIs.
- Workaround: Use `POST /api/challenges/{id}/checkins` with `evidenceUrl` for check-in metadata. Do not call teams/slap routes.
- Backend change later: Required for real media upload/proof endpoint if FE needs backend-hosted photos.

### OpenAPI claims "No auth" but JWT helper exists

- Description: OpenAPI says "No auth — use ?user_id=UUID." Actual route handlers mostly use `user_id` query params, but `src/lib/middleware/withAuth.ts` exists and verifies `Authorization: Bearer <access_token>`. The route inventory inspected does not wrap handlers with `withAuth`.
- Affected files: `src/lib/middleware/withAuth.ts`, all route handlers.
- Frontend impact: FE should not assume Bearer access tokens identify users for current APIs. It must still pass `user_id` query params where required.
- Workaround: Store `user.id` from login/register and append `?user_id=<id>` for user-scoped APIs. Keep tokens for auth endpoints/future backend changes.
- Backend change later: Recommended: either wire Bearer auth into routes or remove token dependency from FE contract.

### `POST /api/auth/signout` response text differs

- Description: OpenAPI says "Signed out successfully"; implementation returns `{ "message": "Signed out" }`.
- Affected file: `src/app/api/auth/signout/route.ts`.
- Frontend impact: Do not match exact success message text.
- Workaround: Treat HTTP 200 as success.
- Backend change later: Optional OpenAPI update.

### `POST /api/challenges/{id}/cancel` error text differs

- Description: Implementation returns `user_id query param required` without "is"; most routes return `user_id query param is required`.
- Affected file: `src/app/api/challenges/[id]/cancel/route.ts`.
- Frontend impact: Error parser must not depend on exact text.
- Workaround: Use status code plus `error` string for display.
- Backend change later: Optional consistency cleanup.

## 2. Route exists but missing from OpenAPI

See section 1. The route-only list is:

- `GET /api/hello`
- `GET /api/docs`
- `GET /api/docs/ui`
- `DELETE /api/users/me`
- `POST /api/challenges/{id}/proof`
- `GET /api/teams`
- `POST /api/teams`
- `POST /api/teams/{id}/slap`

## 3. OpenAPI lists endpoint but implementation differs

- `GET /api/challenges/{id}/history`: implementation calculates membership with `memberCheck` but does not enforce it. OpenAPI describes a history endpoint for a user's finished challenge, implying membership-gated data.
- `POST /api/challenges/{id}/recreate`: OpenAPI body uses snake_case overrides (`duration_days`, `reset_time`, `reinvite_user_ids`), and implementation also expects snake_case here. This differs from normal challenge create/update camelCase.
- `PUT /api/users/me/settings`: OpenAPI may be interpreted as a general settings endpoint; implementation only supports privacy updates with `{ "isPrivate": boolean }`.

No OpenAPI endpoint was found without a corresponding `route.ts` implementation during this inspection.

## 4. Endpoint exists but returns 501/not implemented

- `POST /api/challenges/{id}/proof`: returns `{ id, message: "not implemented" }`, status 501.
- `GET /api/teams`: returns `{ message: "not implemented" }`, status 501.
- `POST /api/teams`: returns `{ message: "not implemented" }`, status 501.
- `POST /api/teams/{id}/slap`: returns `{ id, message: "not implemented" }`, status 501.

## 5. Endpoint exists but unclear request/response shape

- `GET /api/test-data`: debug dump shape follows current tables and should not be treated as stable.
- `GET /api/sync`: returns pending notifications and marks them shown in the same request. This is useful for overlays, but the word "sync" may imply broader state sync. It only handles pending overlays.
- `GET /api/challenges/{id}/join`, `GET /api/challenges/{id}/ready`, `GET /api/challenges/{id}/cancel`, `GET /api/challenges/{id}/nudge/{memberId}` are labeled browser-testable helpers in source comments. They are implemented but should be treated as secondary FE APIs.

## 6. Inconsistent naming

- Auth returns `access_token` and `refresh_token`, not `accessToken` or `refreshToken`.
- Most database-backed response fields are snake_case: `display_name`, `avatar_url`, `is_private`, `created_at`, `current_step`.
- Many request bodies use camelCase: `displayName`, `isPrivate`, `durationDays`, `resetTime`, `totalHearts`, `maxMembers`, `invitedUserIds`, `evidenceUrl`, `isReady`.
- Some request bodies use snake_case: `refresh_token`, `receiver_id`, `notification_ids`, `mark_all`, `reinvite_user_ids`, recreate overrides like `duration_days`.
- Most user-scoped APIs require `user_id` as a query param even after login.

Frontend workaround:

- Centralize mappers in `src/services/api/mappers.ts`.
- Treat response models as backend DTOs and map to app models at service boundaries.
- Always pass `user_id` from stored current user unless the endpoint is explicitly public.

## 7. Missing backend support for current FE needs

### Avatar upload

- Affected endpoint/file: `PATCH /api/users/me` (`src/app/api/users/me/route.ts`) does not accept `avatarUrl`; only `displayName`, `bio`, `isPrivate`.
- Frontend impact: Profile screen cannot upload/change avatar through current API.
- Workaround: Keep avatar local or use a placeholder. Need verification if another media service is intended.
- Backend change later: Required for real avatar upload/update.

### Media upload for check-in proof

- Affected endpoint/file: `POST /api/challenges/{id}/proof` is 501; `POST /api/challenges/{id}/checkins` only accepts `evidenceUrl` as a URL string.
- Frontend impact: Camera proof cannot upload binary media to backend.
- Workaround: If FE has a hosted URL, pass it as `evidenceUrl`; local `file://` URIs will fail Zod `.url()` or be unusable outside the device. Need verification if `file://` is accepted by Zod in the deployed runtime; do not rely on it.
- Backend change later: Required for production photo proof upload.

### Reject invalid proof

- Affected endpoint/file: No implemented reject endpoint was found. `POST /api/challenges/{id}/proof` is a 501 placeholder and should not be used as a reject workflow.
- Frontend impact: FE must not show a working Reject action for proof review.
- Workaround: Hide the action or show a disabled "coming soon" state.
- Backend change later: Required for SRS peer-review/reject behavior.

### Real push notification token registration

- Affected endpoint/file: No route for Expo/APNs/FCM token registration was found.
- Frontend impact: Backend notifications are in-app database notifications only.
- Workaround: Use in-app `/api/notifications` and local Expo Go placeholder notifications.
- Backend change later: Required for push notifications.

## 9. Updated contract notes

- `POST /api/challenges/{id}/invite` now allows any accepted member of a formation challenge to invite friends from that member's own friends list. It is no longer host-only.
- Challenge invitation notifications include challenge navigation metadata: `challenge_id`, `challengeId`, `challenge_title`, `challengeTitle`, `inviter_id`, and `inviterId`.
- Notifications remain in-app database notifications. Push token registration is still not implemented.

### Theme setting

- Affected endpoint/file: `PUT /api/users/me/settings` only stores `isPrivate`.
- Frontend impact: No backend persistence for theme mode.
- Workaround: Store theme locally on device.
- Backend change later: Optional.

### Bearer token auth not enforced

- Affected endpoint/file: `withAuth.ts` exists but routes use `user_id`.
- Frontend impact: Anyone who knows a UUID can call user-scoped APIs unless deployment has external controls.
- Workaround: FE must still pass `user_id`; do not depend on Authorization for security.
- Backend change later: Strongly recommended before production.

### Challenge history membership check gap

- Affected endpoint/file: `src/app/api/challenges/[id]/history/route.ts`.
- Frontend impact: Route accepts `user_id` but does not reject non-members after querying membership.
- Workaround: FE should only call from challenge history lists for the current user.
- Backend change later: Recommended access-control fix.

## 8. FE workaround suggestions

- Use `/api/challenges/{id}/checkins` for check-in submission; pass `evidenceUrl` only when it is a real URL.
- Store theme mode locally.
- Use `/api/notifications` plus `/api/sync` for in-app notifications/overlays; push tokens are not supported.
- Compose dashboard/home data from `/api/widget/summary`, `/api/challenges?status=active`, `/api/notifications`, and `/api/users/me/profile`.
- Do not use `/api/teams`, `/api/teams/{id}/slap`, or `/api/challenges/{id}/proof` until backend implements them.
