import type {
  CreateChallengeFormValues,
  CreateChallengeFieldErrors,
  CreateChallengeStep,
} from '../types/createChallenge.types';

export type ValidationResult = {
  isValid: boolean;
  errors: CreateChallengeFieldErrors;
};

type BackendDetail = {
  field?: unknown;
  path?: unknown;
  message?: unknown;
};

const FIELD_BY_BACKEND_NAME: Record<string, keyof CreateChallengeFormValues> = {
  title: 'title',
  description: 'description',
  coverUrl: 'coverUrl',
  cover_url: 'coverUrl',
  durationDays: 'durationDays',
  duration_days: 'durationDays',
  frequency: 'frequency',
  frequencyDays: 'frequencyDays',
  frequency_days: 'frequencyDays',
  resetTime: 'resetTime',
  reset_time: 'resetTime',
  totalHearts: 'totalHearts',
  total_hearts: 'totalHearts',
  maxMembers: 'maxMembers',
  max_members: 'maxMembers',
  isPrivate: 'isPrivate',
  is_private: 'isPrivate',
  invitedUserIds: 'invitedFriendIds',
  invited_user_ids: 'invitedFriendIds',
  startAt: 'startAt',
  start_at: 'startAt',
};

const STEP_FIELDS: Record<CreateChallengeStep, Array<keyof CreateChallengeFormValues>> = {
  info: ['title', 'description', 'coverUrl', 'taskInstruction'],
  schedule: ['durationDays', 'frequency', 'frequencyDays', 'resetTime', 'startAt'],
  rules: ['totalHearts', 'maxMembers', 'isPrivate'],
  invite: ['invitedFriendIds'],
};

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function isValidResetTime(value: string): boolean {
  if (!/^\d{2}:\d{2}$/.test(value)) return false;
  const [hours, minutes] = value.split(':').map(Number);
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
}

function isIntegerInRange(value: number, min: number, max: number): boolean {
  return Number.isInteger(value) && value >= min && value <= max;
}

function isInPastBeyondGrace(date: Date): boolean {
  return date.getTime() < Date.now() - 60_000;
}

export function validateCreateChallengeField(
  field: keyof CreateChallengeFormValues,
  values: CreateChallengeFormValues,
  validFriendIds: string[] = [],
): string | undefined {
  switch (field) {
    case 'title': {
      const title = values.title.trim();
      if (!title) return 'Challenge title is required.';
      if (title.length > 100) return 'Challenge title must be at most 100 characters.';
      return undefined;
    }
    case 'description': {
      if ((values.description?.trim().length ?? 0) > 500) {
        return 'Description must be at most 500 characters.';
      }
      return undefined;
    }
    case 'coverUrl': {
      const coverUrl = values.coverUrl?.trim();
      if (coverUrl && !isHttpUrl(coverUrl)) {
        return 'Cover image URL must be a valid http or https URL.';
      }
      return undefined;
    }
    case 'durationDays': {
      if (!Number.isFinite(values.durationDays)) return 'Duration is required.';
      if (!Number.isInteger(values.durationDays)) return 'Duration must be a whole number of days.';
      if (values.durationDays < 1) return 'Duration must be at least 1 day.';
      if (values.durationDays > 365) return 'Duration cannot exceed 365 days.';
      return undefined;
    }
    case 'frequency': {
      if (values.frequency !== 'daily' && values.frequency !== 'custom') {
        return 'Frequency must be daily or custom.';
      }
      return undefined;
    }
    case 'frequencyDays': {
      if (values.frequency !== 'custom') return undefined;
      if (!values.frequencyDays.length) return 'Choose at least one custom frequency day.';
      if (values.frequencyDays.some((day) => !Number.isInteger(day) || day < 0 || day > 6)) {
        return 'Custom frequency days must be valid weekdays.';
      }
      return undefined;
    }
    case 'resetTime': {
      if (!values.resetTime) return 'Reset time is required.';
      if (!isValidResetTime(values.resetTime)) return 'Reset time must be a valid time.';
      return undefined;
    }
    case 'startAt': {
      if (!values.startAt) return undefined;
      if (Number.isNaN(values.startAt.getTime())) {
        return 'Start time must be a valid date and time.';
      }
      if (isInPastBeyondGrace(values.startAt)) return 'Start time cannot be in the past.';
      return undefined;
    }
    case 'totalHearts': {
      if (!isIntegerInRange(values.totalHearts, 1, 99)) {
        if (values.totalHearts < 1) return 'Hearts must be at least 1.';
        if (values.totalHearts > 99) return 'Hearts cannot exceed 99.';
        return 'Hearts must be a whole number.';
      }
      return undefined;
    }
    case 'maxMembers': {
      if (!isIntegerInRange(values.maxMembers, 2, 50)) {
        if (values.maxMembers < 2) return 'A challenge needs at least 2 members.';
        if (values.maxMembers > 50) return 'A challenge cannot have more than 50 members.';
        return 'Max members must be a whole number.';
      }
      return undefined;
    }
    case 'invitedFriendIds': {
      if (!validFriendIds.length) return undefined;
      const invalidInvitee = values.invitedFriendIds.some((id) => !validFriendIds.includes(id));
      return invalidInvitee ? 'Invitees must be selected from your friends list.' : undefined;
    }
    case 'taskInstruction':
      if (
        [
          values.description?.trim(),
          values.taskInstruction?.trim() ? `Task: ${values.taskInstruction.trim()}` : undefined,
        ]
          .filter(Boolean)
          .join('\n\n').length > 500
      ) {
        return 'Description and task instruction must be at most 500 characters combined.';
      }
      return undefined;
    case 'isPrivate':
    default:
      return undefined;
  }
}

export function validateCreateChallengeStep(
  step: CreateChallengeStep,
  values: CreateChallengeFormValues,
  validFriendIds: string[] = [],
): ValidationResult {
  const errors: CreateChallengeFieldErrors = {};

  for (const field of STEP_FIELDS[step]) {
    const error = validateCreateChallengeField(field, values, validFriendIds);
    if (error) errors[field] = error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateCreateChallengeFull(
  values: CreateChallengeFormValues,
  validFriendIds: string[] = [],
): ValidationResult {
  const allErrors: CreateChallengeFieldErrors = {};

  const steps: CreateChallengeStep[] = [
    'info',
    'schedule',
    'rules',
    'invite',
  ];

  for (const step of steps) {
    const result = validateCreateChallengeStep(step, values, validFriendIds);
    Object.assign(allErrors, result.errors);
  }

  return {
    isValid: Object.keys(allErrors).length === 0,
    errors: allErrors,
  };
}

export function getCreateChallengeStepFields(step: CreateChallengeStep) {
  return STEP_FIELDS[step];
}

export function mapBackendCreateChallengeErrors(error: {
  status: number;
  message: string;
  details?: unknown;
}): {
  fieldErrors: CreateChallengeFieldErrors;
  formError: string;
} {
  const fieldErrors: CreateChallengeFieldErrors = {};
  const details = Array.isArray(error.details) ? error.details : [];

  details.forEach((detail) => {
    const item = detail as BackendDetail;
    const rawField = Array.isArray(item.path)
      ? item.path[item.path.length - 1]
      : item.field ?? item.path;
    const field = typeof rawField === 'string' ? FIELD_BY_BACKEND_NAME[rawField] : undefined;
    const message = typeof item.message === 'string' ? item.message : undefined;
    if (field && message) {
      fieldErrors[field] = message;
    }
  });

  if (Object.keys(fieldErrors).length > 0) {
    return {
      fieldErrors,
      formError: 'Please fix the highlighted fields and try again.',
    };
  }

  if (error.status === 409) {
    return {
      fieldErrors,
      formError: error.message || 'The challenge could not be created because of a business rule conflict.',
    };
  }

  if (error.status === 400) {
    const lowerMessage = error.message.toLowerCase();
    if (lowerMessage.includes('friend')) {
      fieldErrors.invitedFriendIds = error.message;
    }
    return {
      fieldErrors,
      formError: error.message || 'Backend validation rejected the challenge details.',
    };
  }

  return {
    fieldErrors,
    formError: error.message || 'Could not create the challenge. Please try again.',
  };
}
