export type CreateChallengeFormValues = {
  title: string;
  description?: string;
  taskInstruction?: string;
  coverUrl?: string;
  durationDays: number;
  frequency: 'daily' | 'custom';
  frequencyDays: number[];
  resetTime: string;
  startAt: Date | null;
  totalHearts: number;
  maxMembers: number;
  isPrivate: boolean;
  invitedFriendIds: string[];
};

export type CreateChallengeFieldErrors = Partial<
  Record<keyof CreateChallengeFormValues, string>
>;

export type CreateChallengeStep =
  | 'info'
  | 'schedule'
  | 'rules'
  | 'invite';

export const CREATE_CHALLENGE_STEPS: CreateChallengeStep[] = [
  'info',
  'schedule',
  'rules',
  'invite',
];

export const STEP_LABELS: Record<CreateChallengeStep, string> = {
  info: 'Challenge Info',
  schedule: 'Schedule',
  rules: 'Survival Rules',
  invite: 'Invite & Review',
};

export const STEP_NUMBERS: Record<CreateChallengeStep, number> = {
  info: 1,
  schedule: 2,
  rules: 3,
  invite: 4,
};
