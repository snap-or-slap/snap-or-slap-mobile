# Backend API Reference

Inspected source: `Backend/src/app/api/**/route.ts`, `Backend/src/lib/schemas/**`, `Backend/src/lib/db/**`, and `Backend/src/app/api/docs/openapi.json`.

Framework: Next.js 15 App Router route handlers. Database: PostgreSQL via `pg`. Validation: Zod schemas plus route-local checks. Base path: `/api`.

Authentication convention: Most feature routes do not use Bearer auth. They require `user_id` query params. Auth endpoints issue JWT `access_token` and opaque `refresh_token`, and `withAuth.ts` can verify Bearer tokens, but inspected routes do not use that middleware. Cron execution uses `Authorization: Bearer <CRON_SECRET>`.

Response convention: JSON objects, usually wrapping resources (`user`, `challenge`, `friends`, `notifications`). Error convention: `{ "error": "message" }`; validation often adds `details`.

OpenAPI file: `src/app/api/docs/openapi.json`. "In OpenAPI" below means the endpoint path/method is documented there.

## System / Health / Docs

### GET /api/health

Source: `src/app/api/health/route.ts`

Purpose: Process health check without DB access.

Auth: none. Query/path/body: none.

Success 200:

```json
{ "status": "ok", "uptime": 123.45 }
```

Errors: none in active implementation.

Validation: none.

In OpenAPI: yes. FE usable: yes, diagnostic only. Status: Fully implemented.

### GET /api/hello

Source: `src/app/api/hello/route.ts`

Purpose: Railway smoke response.

Auth/query/path/body: none.

Success 200:

```json
{ "message": "hello sos railway abc" }
```

In OpenAPI: no. FE usable: avoid. Status: Fully implemented test endpoint.

### GET /api/docs

Source: `src/app/api/docs/route.ts`, `src/app/api/docs/openapi.json`

Purpose: Return OpenAPI JSON.

Auth/query/path/body: none.

Success 200: OpenAPI document.

In OpenAPI: no self-entry. FE usable: developer tooling only. Status: Fully implemented.

### GET /api/docs/ui

Source: `src/app/api/docs/ui/route.ts`

Purpose: Swagger UI HTML that loads `/api/docs` and external Swagger UI assets.

Auth/query/path/body: none.

Success 200: HTML.

In OpenAPI: no. FE usable: developer tooling only. Status: Fully implemented.

### GET /api/test-data

Source: `src/app/api/test-data/route.ts`

Purpose: Dump users, challenges, members, and checkins for testing.

Auth/query/path/body: none.

Success 200:

```json
{ "users": [], "challenges": [], "members": [], "checkins": [] }
```

Errors: 500 database error.

In OpenAPI: yes. FE usable: no; debug only. Status: Fully implemented.

## Auth

### POST /api/auth/register

Source: `src/app/api/auth/register/route.ts`, `src/lib/schemas/auth.ts`

Purpose: Create a new user and issue tokens.

Auth: none. Query/path params: none.

Request body:

```json
{
  "email": "alice@example.com",
  "password": "Password123!",
  "username": "alice_123",
  "terms_agreed": true
}
```

Validation: email format; password min 8; username 4-20 chars, letters/numbers/underscore; `terms_agreed` must be true. Unknown fields stripped.

Success 201:

```json
{
  "user": {
    "id": "uuid",
    "email": "alice@example.com",
    "username": "alice_123",
    "display_name": null,
    "avatar_url": null
  },
  "access_token": "jwt",
  "refresh_token": "opaque-token"
}
```

Errors: 400 invalid JSON/validation; 409 email or username taken; 500 internal server error.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

### POST /api/auth/login

Source: `src/app/api/auth/login/route.ts`, `src/lib/schemas/auth.ts`

Purpose: Authenticate with email/password and issue tokens.

Auth/query/path params: none.

Request body:

```json
{ "email": "alice@example.com", "password": "Password123!" }
```

Validation: email format; password required.

Success 200:

```json
{
  "user": {
    "id": "uuid",
    "email": "alice@example.com",
    "username": "alice_123",
    "display_name": "Alice",
    "avatar_url": null
  },
  "access_token": "jwt",
  "refresh_token": "opaque-token"
}
```

Errors: 400 invalid JSON/validation; 401 invalid credentials; 403 account disabled.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

### GET /api/auth/check-username

Source: `src/app/api/auth/check-username/route.ts`, `src/lib/schemas/auth.ts`

Purpose: Check username availability.

Auth: none.

Required query: `username`.

Validation: 4-20 chars, letters/numbers/underscore.

Success 200:

```json
{ "available": true }
```

Errors: 400 validation.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

### POST /api/auth/refresh

Source: `src/app/api/auth/refresh/route.ts`, `src/lib/schemas/auth.ts`

Purpose: Rotate refresh token and return a new token pair.

Auth/query/path params: none.

Request body:

```json
{ "refresh_token": "opaque-token" }
```

Validation: `refresh_token` non-empty.

Success 200:

```json
{ "access_token": "new-jwt", "refresh_token": "new-opaque-token" }
```

Errors: 400 invalid JSON/missing token; 401 invalid, revoked, expired token, or user not found.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

### POST /api/auth/signout

Source: `src/app/api/auth/signout/route.ts`, `src/lib/schemas/auth.ts`

Purpose: Revoke refresh token.

Request body:

```json
{ "refresh_token": "opaque-token" }
```

Success 200:

```json
{ "message": "Signed out" }
```

Errors: 400 invalid JSON/missing token.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

### POST /api/auth/change-password

Source: `src/app/api/auth/change-password/route.ts`, `src/lib/schemas/user.ts`

Purpose: Change password and revoke all refresh tokens for user.

Auth: `user_id` query param, not Bearer.

Required query: `user_id`.

Request body:

```json
{ "currentPassword": "OldPassword123", "newPassword": "NewPassword123" }
```

Validation: current password required; new password min 8 and must contain uppercase, lowercase, and number.

Success 200:

```json
{ "message": "Password changed successfully" }
```

Errors: 400 missing user_id/invalid JSON/validation; 401 current password incorrect; 404 user not found.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

## Users / Profile

### GET /api/users/me

Source: `src/app/api/users/me/route.ts`

Purpose: Read basic profile for `user_id`.

Auth: `user_id` query param.

Success 200:

```json
{ "user": { "id": "uuid", "email": "...", "username": "...", "display_name": null, "avatar_url": null, "bio": null, "is_private": false, "is_active": true, "created_at": "..." } }
```

Errors: 400 missing user_id; 404 user not found.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

### PATCH /api/users/me

Source: `src/app/api/users/me/route.ts`, `src/lib/schemas/user.ts`

Purpose: Update profile fields.

Auth: `user_id` query param.

Request body:

```json
{ "displayName": "Alice", "bio": "Doing hard things", "isPrivate": false }
```

Validation: at least one field; displayName 1-50; bio max 200; isPrivate boolean. Unknown fields stripped. Avatar update is not supported.

Success 200:

```json
{ "user": { "id": "uuid", "email": "...", "username": "...", "display_name": "Alice", "avatar_url": null, "bio": "...", "is_private": false } }
```

Errors: 400 missing user_id/invalid JSON/validation/no fields; 404 user not found.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

### DELETE /api/users/me

Source: `src/app/api/users/me/route.ts`

Purpose: Soft-delete account by deactivating/anonymizing user and revoking refresh tokens.

Auth: `user_id` query param.

Success 200:

```json
{ "message": "Account deleted successfully" }
```

Errors: 400 missing user_id; 404 user not found or already deleted.

In OpenAPI: no. FE usable: yes for delete account. Status: Fully implemented.

### GET /api/users/me/profile

Source: `src/app/api/users/me/profile/route.ts`

Purpose: Read full current profile, stats, earned/locked badges, and recent activities.

Auth: `user_id` query param.

Success 200:

```json
{
  "user": {},
  "stats": {},
  "badges": [],
  "badges_locked": [],
  "recent_activities": []
}
```

Errors: 400 missing user_id; 404 user not found.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

### GET /api/users/search

Source: `src/app/api/users/search/route.ts`

Purpose: Search active users by username prefix.

Required query: `q` min length 2. Optional query: `user_id` to exclude self.

Success 200:

```json
{ "users": [{ "id": "uuid", "username": "alice", "display_name": "Alice", "avatar_url": null, "is_private": false }] }
```

Errors: 400 missing/short `q`.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

### GET /api/users/{userId}/profile

Source: `src/app/api/users/[userId]/profile/route.ts`

Purpose: Privacy-aware profile preview for another user.

Path params: `userId`. Optional query: `user_id` current viewer.

Success 200 shape varies:

```json
{
  "user": {},
  "relationship": "self",
  "stats": {},
  "badges": [],
  "latest_activities": []
}
```

Relationships: `self`, `friend`, `pending_sent`, `pending_received`, `squadmate`, `none`.

Errors: 404 target user not found/inactive.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

### GET /api/users/me/stats

Source: `src/app/api/users/me/stats/route.ts`

Purpose: Read aggregate user stats row or defaults.

Auth: `user_id` query param.

Success 200:

```json
{ "stats": { "user_id": "uuid", "challenges_joined": 0, "challenges_completed": 0, "total_checkins": 0, "current_streak": 0, "best_streak": 0, "updated_at": "..." } }
```

Errors: 400 missing user_id.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

### POST /api/users/me/stats/recalculate

Source: `src/app/api/users/me/stats/recalculate/route.ts`

Purpose: Recalculate and upsert aggregate stats from source tables.

Auth: `user_id` query param. Body: none.

Success 200:

```json
{ "stats": {}, "message": "Stats recalculated successfully" }
```

Errors: 400 missing user_id.

In OpenAPI: yes. FE usable: optional/admin-like. Status: Fully implemented.

### PUT /api/users/me/settings

Source: `src/app/api/users/me/settings/route.ts`

Purpose: Update privacy setting only.

Auth: `user_id` query param.

Request body:

```json
{ "isPrivate": true }
```

Success 200:

```json
{ "user": { "id": "uuid", "is_private": true }, "message": "Settings updated" }
```

Errors: 400 missing user_id/invalid JSON/isPrivate missing; 404 user not found.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

### GET /api/users/me/activities

Source: `src/app/api/users/me/activities/route.ts`

Purpose: Paginated activity feed.

Required query: `user_id`. Optional query: `page` default 1, `limit` default 20 max 50, `type`.

Known activity types in schemas/migrations: `challenge_joined`, `challenge_completed`, `friend_added`, `badge_earned`, `checkin_done`, `streak_milestone`.

Success 200:

```json
{ "activities": [], "pagination": { "page": 1, "limit": 20, "total": 0, "total_pages": 0 } }
```

Errors: 400 missing user_id.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

### POST /api/users/me/badges/check

Source: `src/app/api/users/me/badges/check/route.ts`

Purpose: Check and award eligible badges.

Auth: `user_id` query param.

Success 200:

```json
{ "awarded": [], "message": "No new badges earned" }
```

Errors: 400 missing user_id.

In OpenAPI: yes. FE usable: optional. Status: Fully implemented.

### GET /api/users/me/challenges/history

Source: `src/app/api/users/me/challenges/history/route.ts`

Purpose: List finished challenges for user with lifetime stats.

Required query: `user_id`. Optional query: `result=success|game_over|cancelled`, `page` default 1, `limit` default 10 max 50.

Success 200:

```json
{
  "lifetime_stats": { "total_challenges": 0, "total_completed": 0, "best_streak": 0, "total_checkins": 0 },
  "challenges": [],
  "total": 0,
  "page": 1,
  "limit": 10
}
```

Errors: 400 missing user_id.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

## Friends

### GET /api/friends

Source: `src/app/api/friends/route.ts`

Purpose: List accepted friends.

Required query: `user_id`. Optional query: `page` default 1, `limit` default 20 max 50.

Success 200:

```json
{ "friends": [{ "id": "uuid", "username": "bob", "display_name": "Bob", "avatar_url": null, "active_challenges_count": 1 }], "total": 1, "page": 1, "limit": 20 }
```

Errors: 400 missing user_id.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

### POST /api/friends/request

Source: `src/app/api/friends/request/route.ts`, `src/lib/schemas/friend.ts`

Purpose: Send friend request.

Auth: sender `user_id` query param.

Request body:

```json
{ "receiver_id": "uuid" }
```

Validation: receiver_id UUID; cannot request self; receiver must exist.

Success 201:

```json
{ "request": { "id": "uuid", "sender_id": "uuid", "receiver_id": "uuid", "status": "pending", "created_at": "..." } }
```

Errors: 400 missing user_id/invalid JSON/validation/self; 404 receiver not found; 409 already friends/request conflict.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

### PUT /api/friends/request/{requestId}/respond

Source: `src/app/api/friends/request/[requestId]/respond/route.ts`

Purpose: Accept or decline incoming friend request.

Auth: receiver `user_id` query param. Path: `requestId`.

Request body:

```json
{ "action": "accept" }
```

Validation: action is `accept` or `decline`.

Success 200:

```json
{ "request": { "id": "uuid", "sender_id": "uuid", "receiver_id": "uuid", "status": "accepted" } }
```

Errors: 400 missing user_id/invalid JSON/validation; 403 not receiver; 404 request not found; 409 already processed.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

### GET /api/friends/requests/pending

Source: `src/app/api/friends/requests/pending/route.ts`

Purpose: List incoming pending friend requests.

Auth: `user_id` query param.

Success 200:

```json
{ "requests": [{ "id": "uuid", "sender": { "id": "uuid", "username": "alice", "display_name": "Alice", "avatar_url": null }, "created_at": "..." }] }
```

Errors: 400 missing user_id.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

### DELETE /api/friends/{friendUserId}

Source: `src/app/api/friends/[friendUserId]/route.ts`

Purpose: Delete accepted friendship in either direction.

Path: `friendUserId`. Required query: `user_id`.

Success 200:

```json
{ "message": "Unfriended successfully" }
```

Errors: 400 missing user_id; 404 not friends.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

## Challenges

### GET /api/challenges

Source: `src/app/api/challenges/route.ts`

Purpose: List challenges where current user is an accepted member.

Required query: `user_id`. Optional query: `status`, `page`, `limit`.

Success 200:

```json
{ "challenges": [], "total": 0, "page": 1, "limit": 20 }
```

Errors: 400 missing user_id.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

### POST /api/challenges

Source: `src/app/api/challenges/route.ts`, `src/lib/schemas/challenge.ts`

Purpose: Create formation challenge and optionally invite friends.

Auth: creator `user_id` query param.

Request body:

```json
{
  "title": "Wake Up at 6AM",
  "description": "30 days",
  "durationDays": 30,
  "frequency": "daily",
  "frequencyDays": [1, 3, 5],
  "resetTime": "06:00",
  "totalHearts": 3,
  "maxMembers": 10,
  "isPrivate": false,
  "invitedUserIds": ["uuid"],
  "startAt": "2026-05-20T00:00:00.000Z",
  "coverUrl": "https://example.com/cover.jpg"
}
```

Validation: title 1-100; description max 500; coverUrl URL; durationDays 1-365; frequency `daily|custom`; frequencyDays values 0-6; resetTime HH:MM; totalHearts 1-99; maxMembers 2-50; invited users must be friends.

Success 201:

```json
{ "challenge": {} }
```

Errors: 400 missing user_id/invalid JSON/validation/non-friend invitees; 404 user not found.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

### GET /api/challenges/public

Source: `src/app/api/challenges/public/route.ts`

Purpose: Browse public, not-full formation challenges.

Optional query: `user_id` exclude user's memberships, `q` title/description search, `page`, `limit`.

Success 200:

```json
{ "challenges": [], "total": 0, "page": 1, "limit": 20 }
```

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

### GET /api/challenges/{id}

Source: `src/app/api/challenges/[id]/route.ts`

Purpose: Challenge detail with members and optional viewer membership.

Path: `id`. Optional query: `user_id`.

Success 200:

```json
{ "challenge": {}, "members": [], "my_membership": { "role": "member", "status": "accepted", "is_ready": true, "current_step": 0 } }
```

Errors: 404 challenge not found.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

### PATCH /api/challenges/{id}

Source: `src/app/api/challenges/[id]/route.ts`

Purpose: Host edits formation challenge.

Auth: host `user_id` query param. Path: `id`.

Request body: same camelCase fields as create except no `invitedUserIds`; all optional.

Success 200:

```json
{ "challenge": {} }
```

Errors: 400 missing user_id/invalid JSON/validation/no fields/not formation; 404 challenge not found or not host.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

### DELETE /api/challenges/{id}

Source: `src/app/api/challenges/[id]/route.ts`

Purpose: Host deletes formation challenge or cancels active challenge.

Auth: host `user_id` query param. Path: `id`.

Success 200:

```json
{ "message": "Challenge deleted", "id": "uuid" }
```

or

```json
{ "message": "Active challenge cancelled", "id": "uuid" }
```

Errors: 400 missing user_id/cannot delete finished; 404 not found or not host.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

### GET /api/challenges/{id}/stats

Source: `src/app/api/challenges/[id]/stats/route.ts`

Purpose: Aggregate challenge stats for active/completed challenge.

Path: `id`.

Success 200:

```json
{ "challenge_id": "uuid", "status": "active", "elapsed_cycles": 3, "duration_days": 30, "hearts_left": 2, "total_checkins": 5, "completion_rate": 83.3, "top_performer": {}, "member_stats": [] }
```

Errors: 404 not found; 409 not active/completed.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

## Challenge Invitation / Formation

### POST /api/challenges/{id}/invite

Source: `src/app/api/challenges/[id]/invite/route.ts`

Purpose: Accepted challenge member invites friends to a formation challenge.

Auth: accepted member `user_id`. Path: `id`.

Request body:

```json
{ "userIds": ["uuid"] }
```

Validation: at least one UUID; challenge must be formation; inviter must be an accepted member; invitees must be friends of the inviter; duplicate members/invites are skipped; capacity not exceeded.

Success 201:

```json
{ "invited": [], "skipped": [] }
```

Errors: 400 missing user_id/invalid JSON/validation/non-friends; 403 not accepted member/not found; 409 started/full/all already members.

Challenge invite notifications include `metadata.challenge_id`, `metadata.challengeId`, `metadata.challenge_title`, `metadata.challengeTitle`, `metadata.inviter_id`, and `metadata.inviterId`.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

### POST /api/challenges/{id}/join

Source: `src/app/api/challenges/[id]/join/route.ts`

Purpose: Accept pending invitation.

Auth: invited `user_id`. Path: `id`. Body: none.

Success 200:

```json
{ "member": {} }
```

Errors: 400 missing user_id; 403 no pending invitation; 409 no longer formation/full.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

### GET /api/challenges/{id}/join

Source: `src/app/api/challenges/[id]/join/route.ts`

Purpose: Browser-testable pending invitation status.

Path: `id`. Optional query: `user_id`.

Success 200:

```json
{ "challenge_id": "uuid", "pending_invitations": [], "count": 0, "my_status": "not_invited" }
```

In OpenAPI: yes. FE usable: optional. Status: Fully implemented.

### POST /api/challenges/{id}/decline

Source: `src/app/api/challenges/[id]/decline/route.ts`

Purpose: Decline pending challenge invite.

Auth: invited `user_id`. Path: `id`.

Success 200:

```json
{ "member": {} }
```

Errors: 400 missing user_id; 403 no pending invitation.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

### PUT /api/challenges/{id}/ready

Source: `src/app/api/challenges/[id]/ready/route.ts`

Purpose: Set accepted member readiness in formation challenge.

Auth: `user_id`. Path: `id`.

Request body:

```json
{ "isReady": true }
```

Success 200:

```json
{ "is_ready": true, "readiness": { "total": 2, "ready": 2, "all_ready": true } }
```

Errors: 400 missing user_id/invalid JSON/validation; 403 not accepted member; 409 not formation.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

### GET /api/challenges/{id}/ready

Source: `src/app/api/challenges/[id]/ready/route.ts`

Purpose: Browser-testable readiness status.

Path: `id`.

Success 200:

```json
{ "challenge_id": "uuid", "members": [], "readiness": { "total": 2, "ready": 1, "all_ready": false } }
```

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

### POST /api/challenges/{id}/leave

Source: `src/app/api/challenges/[id]/leave/route.ts`

Purpose: Member leaves formation challenge.

Auth: member `user_id`. Path: `id`.

Success 200:

```json
{ "message": "Left challenge successfully", "challenge_id": "uuid" }
```

Errors: 400 missing user_id/host cannot leave/cannot leave active; 404 not member.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

### GET /api/challenges/{id}/cancel

Source: `src/app/api/challenges/[id]/cancel/route.ts`

Purpose: View cancel/status info.

Path: `id`.

Success 200:

```json
{ "challenge_id": "uuid", "title": "...", "status": "active", "end_reason": null, "final_stats": null, "updated_at": "...", "can_cancel": true }
```

Errors: 404 challenge not found.

In OpenAPI: yes. FE usable: optional. Status: Fully implemented.

### POST /api/challenges/{id}/cancel

Source: `src/app/api/challenges/[id]/cancel/route.ts`

Purpose: Host cancels active challenge and creates final stats snapshot.

Auth: host `user_id`. Path: `id`.

Success 200:

```json
{ "challenge_id": "uuid", "status": "cancelled", "end_reason": "host_cancelled", "final_stats": {} }
```

Errors: 400 missing user_id; 403 not found/not host; 409 not active.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

## Check-in / Photo Proof

### POST /api/challenges/{id}/checkins

Source: `src/app/api/challenges/[id]/checkins/route.ts`, `src/lib/schemas/checkin.ts`

Purpose: Submit current-cycle check-in.

Auth: accepted member `user_id`. Path: `id`.

Request body:

```json
{ "evidenceUrl": "https://example.com/photo.jpg", "caption": "Done" }
```

Validation: body may be empty; evidenceUrl must be URL if provided; caption max 280.

Success 201:

```json
{ "checkin": {}, "total_checkins": 1, "squad_status": { "hearts_left": 3, "members_checked_in": 1, "members_total": 2 } }
```

Errors: 400 missing user_id/validation/not started/ended; 403 not accepted member; 409 not active/already checked in.

In OpenAPI: yes. FE usable: yes, but media upload is not implemented. Status: Fully implemented for URL metadata.

### GET /api/challenges/{id}/checkins

Source: `src/app/api/challenges/[id]/checkins/route.ts`

Purpose: Paginated check-in gallery.

Path: `id`. Optional query: `member_id`, `page`, `limit`.

Success 200:

```json
{ "checkins": [], "total": 0, "page": 1, "limit": 20 }
```

Errors: 404 challenge not found; 409 not active/completed.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

### GET /api/challenges/{id}/checkins/today

Source: `src/app/api/challenges/[id]/checkins/today/route.ts`

Purpose: Current cycle status for all accepted members.

Path: `id`.

Success 200:

```json
{ "challenge_id": "uuid", "cycle_number": 1, "duration_days": 30, "hearts_left": 3, "reset_at": "2026-05-19T23:00:00.000Z", "time_until_reset": 3600, "members": [] }
```

Errors: 404 challenge not found; 409 not active.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

### POST /api/challenges/{id}/proof

Source: `src/app/api/challenges/[id]/proof/route.ts`

Purpose: Intended photo proof upload.

Implementation:

```json
{ "id": "uuid", "message": "not implemented" }
```

Status code: 501.

In OpenAPI: no. FE usable: no. Status: Not implemented.

## Slap / Nudge

### POST /api/challenges/{id}/nudge/{memberId}

Source: `src/app/api/challenges/[id]/nudge/[memberId]/route.ts`

Purpose: Send nudge notification to accepted member who has not checked in this cycle.

Auth: nudger `user_id`. Path: `id`, `memberId`.

Success 200:

```json
{ "message": "Nudge sent successfully", "target_user_id": "uuid" }
```

Errors: 400 missing user_id/cannot nudge self/already checked in; 403 both users must be accepted members; 409 challenge not active; 429 already nudged today.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

### GET /api/challenges/{id}/nudge/{memberId}

Source: `src/app/api/challenges/[id]/nudge/[memberId]/route.ts`

Purpose: View recent nudges for member/challenge.

Path: `id`, `memberId`.

Success 200:

```json
{ "nudges": [], "member_id": "uuid", "challenge_id": "uuid" }
```

In OpenAPI: yes. FE usable: optional. Status: Fully implemented.

## Notifications

### GET /api/notifications

Source: `src/app/api/notifications/route.ts`

Purpose: Paginated notification list with unread count.

Required query: `user_id`. Optional query: `page`, `limit`, `is_read=true|false`, `category=social|challenge|system`.

Success 200:

```json
{ "notifications": [], "unread_count": 0, "total": 0, "page": 1, "limit": 20, "total_pages": 0 }
```

Each formatted notification includes `id`, `type`, `category`, `title`, `message`, `metadata`, `is_read`, `created_at`, and `challenge_id` when the notification metadata references a challenge.

Errors: 400 missing user_id.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

### PUT /api/notifications/read

Source: `src/app/api/notifications/read/route.ts`

Purpose: Mark selected or all notifications read.

Auth: `user_id`.

Request body:

```json
{ "notification_ids": ["uuid"] }
```

or

```json
{ "mark_all": true }
```

Success 200:

```json
{ "updated_count": 1 }
```

Errors: 400 missing user_id/invalid JSON/body missing both controls.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

### DELETE /api/notifications/{id}

Source: `src/app/api/notifications/[id]/route.ts`

Purpose: Delete one notification for user.

Path: `id`. Required query: `user_id`.

Success 200:

```json
{ "message": "Notification deleted" }
```

Errors: 400 missing user_id; 404 notification not found.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

## Widget / Sync

### GET /api/widget/summary

Source: `src/app/api/widget/summary/route.ts`

Purpose: Compact dashboard/widget data for user.

Required query: `user_id`.

Success 200:

```json
{ "current_streak": 0, "active_challenges": [], "unread_notifications": 0 }
```

Errors: 400 missing user_id.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

### GET /api/sync

Source: `src/app/api/sync/route.ts`

Purpose: Fetch pending overlay notifications where `shown_at IS NULL`, then mark them shown.

Required query: `user_id`.

Success 200:

```json
{ "pending_overlays": [] }
```

Errors: 400 missing user_id.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

## Cron / Admin jobs

### GET /api/crons/{jobName}

Source: `src/app/api/crons/[jobName]/route.ts`

Purpose: Describe cron job.

Path: `jobName`, one of `formation-transition`, `heart-deduction`.

Auth: none.

Success 200:

```json
{ "job": "formation-transition", "description": "...", "method": "POST with Authorization: Bearer <CRON_SECRET> to execute", "available_jobs": ["formation-transition", "heart-deduction"] }
```

Errors: 404 unknown job.

In OpenAPI: yes. FE usable: no, admin/test only. Status: Fully implemented.

### POST /api/crons/{jobName}

Source: `src/app/api/crons/[jobName]/route.ts`, `src/lib/services/cronService.ts`

Purpose: Execute cron job.

Auth: `Authorization: Bearer <CRON_SECRET>`. Path: `jobName`.

Success 200:

```json
{ "job": "heart-deduction", "status": "completed", "duration_ms": 42, "executed_at": "...", "result": {} }
```

Errors: 401 invalid/missing CRON_SECRET; 404 unknown job; 500 job failed.

In OpenAPI: yes. FE usable: no. Status: Fully implemented.

## Deprecated / Not Implemented / Legacy APIs

### GET /api/teams

Source: `src/app/api/teams/route.ts`

Purpose: Legacy placeholder for teams list.

Success: none.

Response 501:

```json
{ "message": "not implemented" }
```

In OpenAPI: no. FE usable: no. Status: Not implemented.

### POST /api/teams

Source: `src/app/api/teams/route.ts`

Purpose: Legacy placeholder for team creation.

Response 501:

```json
{ "message": "not implemented" }
```

In OpenAPI: no. FE usable: no. Status: Not implemented.

### POST /api/teams/{id}/slap

Source: `src/app/api/teams/[id]/slap/route.ts`

Purpose: Legacy placeholder for slap reminder.

Path: `id`.

Response 501:

```json
{ "id": "uuid", "message": "not implemented" }
```

In OpenAPI: no. FE usable: no. Status: Not implemented.

## History / Recreate / Milestones

### GET /api/challenges/{id}/history

Source: `src/app/api/challenges/[id]/history/route.ts`

Purpose: Finished challenge detail with final stats, previous squadmates, gallery preview, and recreate eligibility.

Required query: `user_id`. Path: `id`.

Success 200:

```json
{ "challenge": {}, "result_banner": "CONGRATULATIONS", "final_stats": {}, "previous_squadmates": [], "gallery_preview": [], "recreate_eligible": true, "has_child_challenge": false }
```

Errors: 400 missing user_id; 404 challenge not found; 409 challenge not finished.

Validation/risk: Source queries membership but does not enforce it. FE should only call for challenges returned by current user's history list.

In OpenAPI: yes. FE usable: yes with access-control caveat. Status: Partially implemented.

### POST /api/challenges/{id}/recreate

Source: `src/app/api/challenges/[id]/recreate/route.ts`

Purpose: Create a new formation challenge from a finished challenge.

Required query: `user_id`. Path: old challenge `id`.

Request body: optional. This endpoint expects snake_case overrides:

```json
{
  "title": "Wake Up Again",
  "description": "Retry",
  "duration_days": 30,
  "frequency": "daily",
  "reset_time": "06:00:00",
  "total_hearts": 3,
  "max_members": 10,
  "is_private": false,
  "cover_url": "https://example.com/cover.jpg",
  "reinvite_user_ids": ["uuid"]
}
```

Success 201:

```json
{ "challenge": {} }
```

Errors: 400 missing user_id/non-friend reinvite; 403 user was not member of original; 404 challenge not found; 409 original not finished.

In OpenAPI: yes. FE usable: yes. Status: Fully implemented.

### POST /api/challenges/{id}/milestone-check

Source: `src/app/api/challenges/[id]/milestone-check/route.ts`

Purpose: If user's current streak is 7, 14, 30, 60, 100, or 365, create streak milestone notification/activity once.

Required query: `user_id`. Path: challenge `id`.

Success 200:

```json
{ "milestone_triggered": true, "milestone_days": 7, "current_streak": 7, "best_streak": 7, "next_milestone": 14 }
```

or

```json
{ "milestone_triggered": false, "current_streak": 3, "best_streak": 7, "next_milestone": 7 }
```

Errors: 400 missing user_id.

In OpenAPI: yes. FE usable: optional. Status: Fully implemented.
