export type IllustrationType =
  | 'teamChallenge'
  | 'photoProof'
  | 'sharedConsequences'
  | 'slapReminder'
  | 'none';

export interface OnboardingSlideData {
  id: string;
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel?: string;
  showBack: boolean;
  showSkip: boolean;
  illustrationType: IllustrationType;
}

export const onboardingSlides: OnboardingSlideData[] = [
  {
    id: 'together',
    title: 'Discipline feels easier together',
    description:
      'SnapOrSlap turns daily habits into social challenges with photo proof, team accountability, and playful pressure.',
    primaryLabel: 'Get started',
    secondaryLabel: 'I already have an account',
    showBack: false,
    showSkip: true,
    illustrationType: 'teamChallenge',
  },
  {
    id: 'photo-proof',
    title: 'Check in with real photo proof',
    description:
      'Complete each step by uploading a real photo. It is fast, visual, and harder to fake than a simple tap.',
    primaryLabel: 'Next',
    showBack: true,
    showSkip: true,
    illustrationType: 'photoProof',
  },
  {
    id: 'shared-consequences',
    title: 'One team - One challenge - Shared consequences',
    description:
      'Every member matters. If someone misses a step, the whole team gets closer to losing a Heart.',
    primaryLabel: 'Next',
    showBack: true,
    showSkip: true,
    illustrationType: 'sharedConsequences',
  },
  {
    id: 'risk-heart',
    title: 'Miss a step, risk a Heart',
    description:
      'Slap reminders, visible team status, and shared Hearts keep everyone moving before time runs out.',
    primaryLabel: 'Next',
    showBack: true,
    showSkip: true,
    illustrationType: 'slapReminder',
  },
  {
    id: 'first-challenge',
    title: 'Ready for your first challenge?',
    description:
      'Create an account, join your squad, and begin your first photo-based challenge today.',
    primaryLabel: 'Create account',
    secondaryLabel: 'Log in',
    showBack: true,
    showSkip: false,
    illustrationType: 'none',
  },
];
