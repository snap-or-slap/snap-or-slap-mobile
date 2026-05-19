# API Service Mapping

## Auth Service

File: `src/features/auth/services/auth.service.ts`

Methods:

- `login(payload)` -> `POST /api/auth/login`
  - Body: `{ email, password }`
  - Returns: `{ user, access_token, refresh_token }`
  - Mapper: yes, snake_case tokens to session model if FE uses camelCase.
  - Screens: `SignInScreen`
- `register(payload)` -> `POST /api/auth/register`
  - Body: `{ email, password, username, terms_agreed: true }`
  - Returns: `{ user, access_token, refresh_token }`
  - Mapper: yes.
  - Screens: `SignUpScreen`
- `checkUsername(username)` -> `GET /api/auth/check-username?username=`
  - Returns: `{ available }`
  - Mapper: no.
  - Screens: `SignUpScreen`
- `refreshToken(refreshToken)` -> `POST /api/auth/refresh`
  - Body: `{ refresh_token }`
  - Returns: `{ access_token, refresh_token }`
  - Mapper: yes.
  - Screens: app session bootstrap.
- `signout(refreshToken)` -> `POST /api/auth/signout`
  - Body: `{ refresh_token }`
  - Returns: `{ message }`
  - Mapper: no.
  - Screens: settings/profile sign out action.
- `changePassword(userId, payload)` -> `POST /api/auth/change-password?user_id=`
  - Body: `{ currentPassword, newPassword }`
  - Returns: `{ message }`
  - Mapper: no.
  - Screens: `ProfileScreen` or settings.

## Profile Service

File: `src/features/profile/services/profile.service.ts`

Methods:

- `getMe(userId)` -> `GET /api/users/me?user_id=`
  - Returns: `{ user }`
  - Mapper: yes, user snake_case fields.
  - Screens: `HomeScreen`, `ProfileScreen`, session restore.
- `updateMe(userId, payload)` -> `PATCH /api/users/me?user_id=`
  - Body: `{ displayName?, bio?, isPrivate? }`
  - Returns: `{ user }`
  - Mapper: yes.
  - Screens: `CompleteProfileScreen`, `ProfileScreen`
- `deleteAccount(userId)` -> `DELETE /api/users/me?user_id=`
  - Returns: `{ message }`
  - Mapper: no.
  - Screens: `ProfileScreen`
- `getProfileOverview(userId)` -> `GET /api/users/me/profile?user_id=`
  - Returns: `{ user, stats, badges, badges_locked, recent_activities }`
  - Mapper: yes.
  - Screens: `ProfileScreen`, `HomeScreen`
- `getUserProfile(targetUserId, currentUserId?)` -> `GET /api/users/{userId}/profile?user_id=`
  - Returns: privacy-aware `{ user, relationship, stats, badges, latest_activities }`
  - Mapper: yes.
  - Screens: `FriendsScreen`, `ProfileScreen`
- `searchUsers(q, userId?)` -> `GET /api/users/search?q=&user_id=`
  - Returns: `{ users }`
  - Mapper: yes.
  - Screens: `FriendsScreen`, `CreateChallengeScreen`
- `updateSettings(userId, isPrivate)` -> `PUT /api/users/me/settings?user_id=`
  - Body: `{ isPrivate }`
  - Returns: `{ user, message }`
  - Mapper: yes.
  - Screens: `ProfileScreen`
- `getStats(userId)` -> `GET /api/users/me/stats?user_id=`
  - Returns: `{ stats }`
  - Mapper: yes.
  - Screens: `ProfileScreen`
- `getActivities(userId, params)` -> `GET /api/users/me/activities?user_id=&page=&limit=&type=`
  - Returns: `{ activities, pagination }`
  - Mapper: yes.
  - Screens: `ProfileScreen`, `HomeScreen`
- `checkBadges(userId)` -> `POST /api/users/me/badges/check?user_id=`
  - Returns: `{ awarded, message }`
  - Mapper: no.
  - Screens: `ProfileScreen`

## Friends Service

File: `src/features/friends/services/friends.service.ts`

Methods:

- `listFriends(userId, page?, limit?)` -> `GET /api/friends?user_id=&page=&limit=`
  - Returns: `{ friends, total, page, limit }`
  - Mapper: yes.
  - Screens: `FriendsScreen`, `CreateChallengeScreen`
- `sendFriendRequest(userId, receiverId)` -> `POST /api/friends/request?user_id=`
  - Body: `{ receiver_id }`
  - Returns: `{ request }`
  - Mapper: yes.
  - Screens: `FriendsScreen`
- `listPendingRequests(userId)` -> `GET /api/friends/requests/pending?user_id=`
  - Returns: `{ requests }`
  - Mapper: yes.
  - Screens: `FriendsScreen`, `HomeScreen`
- `respondToRequest(userId, requestId, action)` -> `PUT /api/friends/request/{requestId}/respond?user_id=`
  - Body: `{ action: "accept" | "decline" }`
  - Returns: `{ request }`
  - Mapper: yes.
  - Screens: `FriendsScreen`
- `unfriend(userId, friendUserId)` -> `DELETE /api/friends/{friendUserId}?user_id=`
  - Returns: `{ message }`
  - Mapper: no.
  - Screens: `FriendsScreen`, `ProfileScreen`

## Challenges Service

File: `src/features/challenges/services/challenges.service.ts`

Methods:

- `listChallenges(userId, filters)` -> `GET /api/challenges?user_id=&status=&page=&limit=`
  - Returns: `{ challenges, total, page, limit }`
  - Mapper: yes.
  - Screens: `HomeScreen`, `ChallengesScreen`
- `createChallenge(userId, payload)` -> `POST /api/challenges?user_id=`
  - Body: `{ title, description?, durationDays, frequency, frequencyDays?, startAt?, resetTime?, totalHearts?, maxMembers?, isPrivate?, invitedUserIds?, coverUrl? }`
  - Returns: `{ challenge }`
  - Mapper: yes.
  - Screens: `CreateChallengeScreen`
- `getChallenge(id, userId?)` -> `GET /api/challenges/{id}?user_id=`
  - Returns: `{ challenge, members, my_membership }`
  - Mapper: yes.
  - Screens: `ChallengeDetailScreen`
- `updateChallenge(id, userId, payload)` -> `PATCH /api/challenges/{id}?user_id=`
  - Body: same as create without `invitedUserIds`, all optional.
  - Returns: `{ challenge }`
  - Mapper: yes.
  - Screens: `CreateChallengeScreen`, `ChallengeDetailScreen`
- `deleteOrCancelChallenge(id, userId)` -> `DELETE /api/challenges/{id}?user_id=`
  - Returns: `{ message, id }`
  - Mapper: no.
  - Screens: `ChallengeDetailScreen`
- `browsePublicChallenges(userId?, q?, page?, limit?)` -> `GET /api/challenges/public`
  - Returns: `{ challenges, total, page, limit }`
  - Mapper: yes.
  - Screens: `ChallengesScreen`
- `inviteUsers(id, userId, userIds)` -> `POST /api/challenges/{id}/invite?user_id=`
  - Body: `{ userIds }`
  - Returns: `{ invited, skipped }`
  - Mapper: yes.
  - Screens: `CreateChallengeScreen`, `ChallengeDetailScreen`
  - Rule: caller must be an accepted member of a formation challenge; invitees must be friends of that caller.
- `acceptInvite(id, userId)` -> `POST /api/challenges/{id}/join?user_id=`
  - Returns: `{ member }`
  - Mapper: yes.
  - Screens: `HomeScreen`, `Notifications`, `ChallengeDetailScreen`
- `declineInvite(id, userId)` -> `POST /api/challenges/{id}/decline?user_id=`
  - Returns: `{ member }`
  - Mapper: yes.
  - Screens: `Notifications`, `ChallengeDetailScreen`
- `setReady(id, userId, isReady)` -> `PUT /api/challenges/{id}/ready?user_id=`
  - Body: `{ isReady }`
  - Returns: `{ is_ready, readiness }`
  - Mapper: yes.
  - Screens: `ChallengeDetailScreen`
- `getReadyStatus(id)` -> `GET /api/challenges/{id}/ready`
  - Returns: `{ challenge_id, members, readiness }`
  - Mapper: yes.
  - Screens: `ChallengeDetailScreen`
- `leaveChallenge(id, userId)` -> `POST /api/challenges/{id}/leave?user_id=`
  - Returns: `{ message, challenge_id }`
  - Mapper: no.
  - Screens: `ChallengeDetailScreen`
- `cancelChallenge(id, userId)` -> `POST /api/challenges/{id}/cancel?user_id=`
  - Returns: `{ challenge_id, status, end_reason, final_stats }`
  - Mapper: yes.
  - Screens: `ChallengeDetailScreen`
- `getChallengeStats(id)` -> `GET /api/challenges/{id}/stats`
  - Returns: `{ challenge_id, status, elapsed_cycles, duration_days, hearts_left, total_checkins, completion_rate, top_performer, member_stats }`
  - Mapper: yes.
  - Screens: `ChallengeDetailScreen`
- `getHistoryList(userId, params)` -> `GET /api/users/me/challenges/history?user_id=&result=&page=&limit=`
  - Returns: `{ lifetime_stats, challenges, total, page, limit }`
  - Mapper: yes.
  - Screens: `ProfileScreen`, `ChallengesScreen`
- `getChallengeHistory(id, userId)` -> `GET /api/challenges/{id}/history?user_id=`
  - Returns: `{ challenge, result_banner, final_stats, previous_squadmates, gallery_preview, recreate_eligible, has_child_challenge }`
  - Mapper: yes.
  - Screens: `ChallengeDetailScreen`
- `recreateChallenge(id, userId, payload)` -> `POST /api/challenges/{id}/recreate?user_id=`
  - Body: snake_case overrides, e.g. `{ title?, duration_days?, reinvite_user_ids? }`
  - Returns: `{ challenge }`
  - Mapper: yes.
  - Screens: `CreateChallengeScreen`, `ChallengeDetailScreen`

## Check-in Service

File: `src/features/challenges/services/challenges.service.ts` or `src/features/checkin/services/checkin.service.ts`

Methods:

- `submitCheckin(challengeId, userId, payload)` -> `POST /api/challenges/{id}/checkins?user_id=`
  - Body: `{ evidenceUrl?, caption? }`
  - Returns: `{ checkin, total_checkins, squad_status }`
  - Mapper: yes.
  - Screens: `CheckInCameraScreen`, `ChallengeDetailScreen`
- `listCheckins(challengeId, params)` -> `GET /api/challenges/{id}/checkins?member_id=&page=&limit=`
  - Returns: `{ checkins, total, page, limit }`
  - Mapper: yes.
  - Screens: `ChallengeDetailScreen`
- `getTodayStatus(challengeId)` -> `GET /api/challenges/{id}/checkins/today`
  - Returns: `{ challenge_id, cycle_number, duration_days, hearts_left, reset_at, time_until_reset, members }`
  - Mapper: yes.
  - Screens: `HomeScreen`, `ChallengeDetailScreen`
- `uploadProof(...)` -> no usable backend endpoint
  - `POST /api/challenges/{id}/proof` is 501.
  - Screens: `CheckInCameraScreen`

## Notifications Service

File: `src/features/notifications/services/notifications.service.ts`

Methods:

- `listNotifications(userId, params)` -> `GET /api/notifications?user_id=&page=&limit=&is_read=&category=`
  - Returns: `{ notifications, unread_count, total, page, limit, total_pages }`
  - Challenge invite notifications expose challenge metadata in `metadata.challenge_id`/`metadata.challengeId` and top-level `challenge_id` when available.
  - Mapper: yes.
  - Screens: `HomeScreen`, `Notifications`
- `markRead(userId, notificationIds)` -> `PUT /api/notifications/read?user_id=`
  - Body: `{ notification_ids }` or `{ mark_all: true }`
  - Returns: `{ updated_count }`
  - Mapper: no.
  - Screens: `Notifications`
- `deleteNotification(userId, id)` -> `DELETE /api/notifications/{id}?user_id=`
  - Returns: `{ message }`
  - Mapper: no.
  - Screens: `Notifications`
- `syncOverlays(userId)` -> `GET /api/sync?user_id=`
  - Returns: `{ pending_overlays }`, marks them shown.
  - Mapper: yes.
  - Screens: `HomeScreen`

## Widget Service

File: `src/features/widget/services/widget.service.ts`

Methods:

- `getSummary(userId)` -> `GET /api/widget/summary?user_id=`
  - Returns: `{ current_streak, active_challenges, unread_notifications }`
  - Mapper: yes.
  - Screens: `HomeScreen`, widgets.

## Setup Permissions Screen

`SetupPermissionsScreen` has no backend push-token endpoint in inspected source. Store permissions locally or defer server registration until backend adds a push token route.
