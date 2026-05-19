# Backend API Endpoint Summary

Source of truth: `Backend/src/app/api/**/route.ts`, checked on 2026-05-19. Base path is `/api`.

| Group | Method | Endpoint | Purpose | user_id | Body | FE Priority | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| System | GET | `/api/health` | Process health check | No | No | P1 | Implemented |
| System | GET | `/api/hello` | Railway smoke hello | No | No | Avoid | Implemented, test only |
| System | GET | `/api/docs` | OpenAPI JSON | No | No | P2 | Implemented |
| System | GET | `/api/docs/ui` | Swagger UI HTML | No | No | P2 | Implemented |
| System | GET | `/api/test-data` | Dump test data | No | No | Avoid | Implemented, debug only |
| Auth | POST | `/api/auth/register` | Register account | No | Yes | P0 | Implemented |
| Auth | POST | `/api/auth/login` | Login | No | Yes | P0 | Implemented |
| Auth | GET | `/api/auth/check-username` | Username availability | No | No | P0 | Implemented |
| Auth | POST | `/api/auth/refresh` | Rotate refresh token | No | Yes | P0 | Implemented |
| Auth | POST | `/api/auth/signout` | Revoke refresh token | No | Yes | P0 | Implemented |
| Auth | POST | `/api/auth/change-password` | Change password | Yes | Yes | P1 | Implemented |
| Users / Profile | GET | `/api/users/me` | Current user basic profile by query id | Yes | No | P0 | Implemented |
| Users / Profile | PATCH | `/api/users/me` | Update profile | Yes | Yes | P0 | Implemented |
| Users / Profile | DELETE | `/api/users/me` | Soft delete account | Yes | No | P1 | Implemented |
| Users / Profile | GET | `/api/users/me/profile` | Profile plus stats, badges, activity | Yes | No | P0 | Implemented |
| Users / Profile | GET | `/api/users/search` | Search users by username prefix | Optional | No | P0 | Implemented |
| Users / Profile | GET | `/api/users/{userId}/profile` | Privacy-aware public profile | Optional | No | P0 | Implemented |
| Users / Profile | GET | `/api/users/me/stats` | Read aggregate stats | Yes | No | P1 | Implemented |
| Users / Profile | POST | `/api/users/me/stats/recalculate` | Recalculate aggregate stats | Yes | No | P2 | Implemented |
| Users / Profile | PUT | `/api/users/me/settings` | Update privacy setting | Yes | Yes | P1 | Implemented |
| Users / Profile | GET | `/api/users/me/activities` | Paginated activity feed | Yes | No | P1 | Implemented |
| Users / Profile | POST | `/api/users/me/badges/check` | Award eligible badges | Yes | No | P2 | Implemented |
| History | GET | `/api/users/me/challenges/history` | Finished challenge list | Yes | No | P1 | Implemented |
| Friends | GET | `/api/friends` | List accepted friends | Yes | No | P0 | Implemented |
| Friends | POST | `/api/friends/request` | Send friend request | Yes | Yes | P0 | Implemented |
| Friends | PUT | `/api/friends/request/{requestId}/respond` | Accept/decline request | Yes | Yes | P0 | Implemented |
| Friends | GET | `/api/friends/requests/pending` | Pending incoming requests | Yes | No | P0 | Implemented |
| Friends | DELETE | `/api/friends/{friendUserId}` | Unfriend | Yes | No | P1 | Implemented |
| Challenges | GET | `/api/challenges` | List my accepted challenges | Yes | No | P0 | Implemented |
| Challenges | POST | `/api/challenges` | Create challenge | Yes | Yes | P0 | Implemented |
| Challenges | GET | `/api/challenges/public` | Browse public formation challenges | Optional | No | P1 | Implemented |
| Challenges | GET | `/api/challenges/{id}` | Challenge detail | Optional | No | P0 | Implemented |
| Challenges | PATCH | `/api/challenges/{id}` | Edit formation challenge | Yes | Yes | P1 | Implemented |
| Challenges | DELETE | `/api/challenges/{id}` | Delete formation or cancel active | Yes | No | P1 | Implemented |
| Challenge Invitation / Formation | POST | `/api/challenges/{id}/invite` | Accepted member invites friends during formation | Yes | Yes | P0 | Implemented |
| Challenge Invitation / Formation | POST | `/api/challenges/{id}/join` | Accept invite | Yes | No | P0 | Implemented |
| Challenge Invitation / Formation | GET | `/api/challenges/{id}/join` | View pending invitations | Optional | No | P2 | Implemented, browser-test helper |
| Challenge Invitation / Formation | POST | `/api/challenges/{id}/decline` | Decline invite | Yes | No | P0 | Implemented |
| Challenge Invitation / Formation | PUT | `/api/challenges/{id}/ready` | Set ready flag | Yes | Yes | P0 | Implemented |
| Challenge Invitation / Formation | GET | `/api/challenges/{id}/ready` | View readiness | No | No | P1 | Implemented |
| Challenge Invitation / Formation | POST | `/api/challenges/{id}/leave` | Leave formation challenge | Yes | No | P1 | Implemented |
| Challenges | GET | `/api/challenges/{id}/cancel` | View cancel status | No | No | P2 | Implemented |
| Challenges | POST | `/api/challenges/{id}/cancel` | Host cancels active challenge | Yes | No | P1 | Implemented |
| Check-in / Photo Proof | POST | `/api/challenges/{id}/checkins` | Submit current-cycle check-in | Yes | Optional | P0 | Implemented |
| Check-in / Photo Proof | GET | `/api/challenges/{id}/checkins` | Check-in gallery | No | No | P0 | Implemented |
| Check-in / Photo Proof | GET | `/api/challenges/{id}/checkins/today` | Current cycle member status | No | No | P0 | Implemented |
| Check-in / Photo Proof | POST | `/api/challenges/{id}/proof` | Upload photo proof | N/A (501) | N/A (501) | Avoid | 501 |
| Challenges | GET | `/api/challenges/{id}/stats` | Challenge stats | No | No | P1 | Implemented |
| Slap / Nudge | POST | `/api/challenges/{id}/nudge/{memberId}` | Nudge member | Yes | No | P1 | Implemented |
| Slap / Nudge | GET | `/api/challenges/{id}/nudge/{memberId}` | Recent nudges for member | No | No | P2 | Implemented |
| History | GET | `/api/challenges/{id}/history` | Finished challenge detail | Yes | No | P1 | Implemented, access gap |
| History | POST | `/api/challenges/{id}/recreate` | Recreate finished challenge | Yes | Optional | P1 | Implemented |
| History | POST | `/api/challenges/{id}/milestone-check` | Trigger streak milestone notification | Yes | No | P2 | Implemented |
| Notifications | GET | `/api/notifications` | List notifications | Yes | No | P0 | Implemented |
| Notifications | PUT | `/api/notifications/read` | Mark notifications read | Yes | Yes | P0 | Implemented |
| Notifications | DELETE | `/api/notifications/{id}` | Delete notification | Yes | No | P1 | Implemented |
| Widget / Sync | GET | `/api/widget/summary` | Widget/home summary | Yes | No | P1 | Implemented |
| Widget / Sync | GET | `/api/sync` | Pending overlays and mark shown | Yes | No | P1 | Implemented |
| Cron / Admin | GET | `/api/crons/{jobName}` | Cron job info | No | No | Avoid | Implemented, admin/test |
| Cron / Admin | POST | `/api/crons/{jobName}` | Execute cron job | No, uses CRON_SECRET | No | Avoid | Implemented, admin only |
| Legacy | GET | `/api/teams` | Legacy teams list | N/A (501) | No | Avoid | 501 |
| Legacy | POST | `/api/teams` | Legacy team create | N/A (501) | N/A (501) | Avoid | 501 |
| Legacy | POST | `/api/teams/{id}/slap` | Legacy slap reminder | N/A (501) | N/A (501) | Avoid | 501 |

Totals:

- Actual route handlers: 63
- Implemented handlers: 59
- Not implemented handlers returning 501: 4

## Runtime behavior notes

- `GET /api/challenges`, `GET /api/challenges/{id}?user_id=...`, and `GET /api/widget/summary` apply due formation transitions before returning data.
- Formation transition conditions: `status = formation`, `start_at <= now`, at least two accepted members, and all accepted members are ready. Not-enough-member or not-ready challenges stay in formation and are reported as skipped by the cron result.
- `POST /api/crons/formation-transition` remains available for scheduler/manual testing with `Authorization: Bearer <CRON_SECRET>`, but the frontend should not call it.
- Slap UI maps to `POST /api/challenges/{id}/nudge/{memberId}?user_id=<currentUserId>`.
- `POST /api/teams/{id}/slap` remains a legacy 501 placeholder and must not be used.
- Slap/nudge only sends a notification. It does not mark DONE/PENDING, reduce hearts, or evaluate a step.
