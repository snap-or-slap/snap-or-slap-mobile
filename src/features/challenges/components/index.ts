// ─── New unified components ───
export * from './ChallengeCard';
export * from './ChallengeTabBar';
export * from './ChallengeStatusBadge';
export * from './ChallengeHearts';
export * from './ChallengeMetaRow';
export * from './ChallengeMemberPreview';
export * from './ChallengeMemberRow';
export * from './ChallengeEmptyState';
export * from './ChallengeProgressSummary';
export * from './CreateChallengeStepHeader';
export * from './CreateChallengeFooter';
export * from './CreateChallengeFriendPicker';
export * from './CreateChallengeReviewCard';
export * from './ChallengeInfoCard';
export * from './NumericStepper';

// ─── Legacy components (preserved for backward compat with tests) ───
export * from './ActiveChallengeCard';
export * from './FormationChallengeCard';
export * from './HistoryChallengeCard';
export * from './JoinedMembersBar';
export * from './ChallengesHeader';
export * from './ChallengeSectionIntro';

// Note: ChallengeSegmentTabs kept for existing tests
export * from './ChallengeSegmentTabs';

// Note: ChallengeStatusPill and HeartCountBadge are re-exported via ChallengeStatusBadge and ChallengeHearts above.
// Do NOT re-export ChallengeStatusPill.tsx or HeartCountBadge.tsx directly to avoid duplicate exports.
