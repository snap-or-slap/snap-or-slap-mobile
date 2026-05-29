# FE Coverage Test Report

## Baseline

- Command: `npm run test:coverage -- --runInBand`
- Result observed before new tests: 119 tests passed.
- Coverage: statements 41.07%, branches 37.11%, functions 38.26%, lines 41.80%.
- Note: Jest printed open-handle/act warnings from existing screen tests after the summary.

## Final

- Command: `npm run test:coverage -- --runInBand --forceExit`
- Result: 24 suites passed, 168 tests passed.
- Coverage: statements 52.26%, branches 47.64%, functions 50.92%, lines 53.80%.
- `coverage/lcov.info` was generated.
- Typecheck: `npm run typecheck` passed.

## Added Test Files

- `src/features/auth/__tests__/AuthComponents.test.tsx`
- `src/features/auth/__tests__/AuthScreens.test.tsx`
- `src/features/challenges/components/__tests__/ChallengeDisplayComponents.test.tsx`
- `src/features/challenges/components/__tests__/CreateChallengeComponents.test.tsx`
- `src/features/friends/components/__tests__/FriendComponents.test.tsx`
- `src/features/profile/components/__tests__/ProfileComponents.test.tsx`

## Added Test Utility

- `src/test-utils/renderWithTheme.tsx`

## Production Refactors

- None for this pass.

## Still Low Coverage

- `src/features/challenges/screens/CreateChallengeScreen.tsx`: 1.20% lines.
- `src/features/challenges/screens/CheckInCameraScreen.tsx`: 0% lines.
- `src/features/notifications/screens/NotificationsScreen.tsx`: 0.72% lines.
- `src/features/friends/screens/AddFriendScreen.tsx`: 0% lines.
- `src/features/friends/screens/FriendRequestsScreen.tsx`: 0% lines.
- `src/features/friends/screens/FriendProfileScreen.tsx`: 0% lines.
- `src/features/friends/screens/UserProfilePreviewScreen.tsx`: 0% lines.
- `src/features/profile/screens/CompleteProfileScreen.tsx`: 0% lines.
- `src/features/profile/screens/SetupPermissionsScreen.tsx`: 0% lines.

## Recommended Next Tests

1. Add integration-style tests for `CreateChallengeScreen` with mocked challenge/friend APIs.
2. Add permission and upload tests for `CheckInCameraScreen`.
3. Cover notifications loading, empty, error, read/unread, and mark-as-read flows.
4. Cover friends screens around search, request accept/reject, and profile relationship states.
5. Fix existing act/open-handle warnings in screen tests so full coverage can run without `--forceExit`.
