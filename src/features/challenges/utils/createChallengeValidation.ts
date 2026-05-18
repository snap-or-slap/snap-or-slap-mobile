import type {
  CreateChallengeFormValues,
  CreateChallengeFieldErrors,
} from '../types/createChallenge.types';

export type ValidationResult = {
  isValid: boolean;
  errors: CreateChallengeFieldErrors;
};

export function validateCreateChallengeStep(
  step: 'info' | 'schedule' | 'rules' | 'invite',
  values: CreateChallengeFormValues
): ValidationResult {
  const errors: CreateChallengeFieldErrors = {};

  switch (step) {
    case 'info': {
      if (!values.title.trim()) {
        errors.title = 'Challenge name is required.';
      } else if (values.title.trim().length < 3) {
        errors.title = 'Name must be at least 3 characters.';
      }
      break;
    }

    case 'schedule': {
      if (!values.resetTime) {
        errors.resetTime = 'Reset time is required.';
      }
      if (!values.startDate) {
        errors.startDate = 'Start date is required.';
      }
      if (!values.endDate) {
        errors.endDate = 'End date is required.';
      }
      if (values.startDate && values.endDate && values.startDate >= values.endDate) {
        errors.endDate = 'End date must be after start date.';
      }
      if (values.stepLengthDays < 1) {
        errors.stepLengthDays = 'Step length must be at least 1 day.';
      }
      break;
    }

    case 'rules': {
      if (values.totalHearts < 1) {
        errors.totalHearts = 'Total hearts must be at least 1.';
      }
      if (values.minMembers < 2) {
        errors.minMembers = 'Minimum members must be at least 2.';
      }
      break;
    }

    case 'invite': {
      // Invite is optional but still validates the rest
      break;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateCreateChallengeFull(
  values: CreateChallengeFormValues
): ValidationResult {
  const allErrors: CreateChallengeFieldErrors = {};

  const steps: Array<'info' | 'schedule' | 'rules' | 'invite'> = [
    'info',
    'schedule',
    'rules',
    'invite',
  ];

  for (const step of steps) {
    const result = validateCreateChallengeStep(step, values);
    Object.assign(allErrors, result.errors);
  }

  return {
    isValid: Object.keys(allErrors).length === 0,
    errors: allErrors,
  };
}
