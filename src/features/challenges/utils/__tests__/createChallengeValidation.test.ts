import type { CreateChallengeFormValues } from '../../types/createChallenge.types';
import {
  getCreateChallengeStepFields,
  mapBackendCreateChallengeErrors,
  validateCreateChallengeField,
  validateCreateChallengeFull,
  validateCreateChallengeStep,
} from '../createChallengeValidation';

const futureDate = new Date('2026-05-25T10:00:00.000Z');

const validValues: CreateChallengeFormValues = {
  title: 'Morning proof',
  description: 'Daily proof with friends',
  taskInstruction: 'Upload a photo',
  coverUrl: 'https://example.com/cover.png',
  durationDays: 30,
  frequency: 'custom',
  frequencyDays: [1, 3, 5],
  resetTime: '07:30',
  startAt: futureDate,
  totalHearts: 5,
  maxMembers: 4,
  isPrivate: true,
  invitedFriendIds: ['friend-1', 'friend-2'],
};

describe('createChallengeValidation', () => {
  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(new Date('2026-05-24T10:00:00.000Z').getTime());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('accepts a valid full form', () => {
    expect(validateCreateChallengeFull(validValues, ['friend-1', 'friend-2'])).toEqual({
      isValid: true,
      errors: {},
    });
  });

  it('validates info fields', () => {
    expect(validateCreateChallengeField('title', { ...validValues, title: '   ' })).toBe(
      'Challenge title is required.',
    );
    expect(validateCreateChallengeField('title', { ...validValues, title: 'a'.repeat(101) })).toBe(
      'Challenge title must be at most 100 characters.',
    );
    expect(
      validateCreateChallengeField('description', {
        ...validValues,
        description: 'a'.repeat(501),
      }),
    ).toBe('Description must be at most 500 characters.');
    expect(validateCreateChallengeField('coverUrl', { ...validValues, coverUrl: 'ftp://x.test' }))
      .toBe('Cover image URL must be a valid http or https URL.');
  });

  it('validates schedule fields', () => {
    expect(validateCreateChallengeField('durationDays', { ...validValues, durationDays: NaN })).toBe(
      'Duration is required.',
    );
    expect(validateCreateChallengeField('durationDays', { ...validValues, durationDays: 1.5 })).toBe(
      'Duration must be a whole number of days.',
    );
    expect(validateCreateChallengeField('durationDays', { ...validValues, durationDays: 0 })).toBe(
      'Duration must be at least 1 day.',
    );
    expect(validateCreateChallengeField('durationDays', { ...validValues, durationDays: 366 })).toBe(
      'Duration cannot exceed 365 days.',
    );
    expect(
      validateCreateChallengeField('frequency', {
        ...validValues,
        frequency: 'weekly' as never,
      }),
    ).toBe('Frequency must be daily or custom.');
    expect(
      validateCreateChallengeField('frequencyDays', {
        ...validValues,
        frequency: 'daily',
        frequencyDays: [],
      }),
    ).toBeUndefined();
    expect(
      validateCreateChallengeField('frequencyDays', {
        ...validValues,
        frequencyDays: [],
      }),
    ).toBe('Choose at least one custom frequency day.');
    expect(
      validateCreateChallengeField('frequencyDays', {
        ...validValues,
        frequencyDays: [0, 7],
      }),
    ).toBe('Custom frequency days must be valid weekdays.');
    expect(validateCreateChallengeField('resetTime', { ...validValues, resetTime: '' })).toBe(
      'Reset time is required.',
    );
    expect(validateCreateChallengeField('resetTime', { ...validValues, resetTime: '24:00' })).toBe(
      'Reset time must be a valid time.',
    );
  });

  it('validates start date edge cases', () => {
    expect(validateCreateChallengeField('startAt', { ...validValues, startAt: null })).toBeUndefined();
    expect(
      validateCreateChallengeField('startAt', {
        ...validValues,
        startAt: new Date('invalid'),
      }),
    ).toBe('Start time must be a valid date and time.');
    expect(
      validateCreateChallengeField('startAt', {
        ...validValues,
        startAt: new Date('2026-05-24T09:58:59.000Z'),
      }),
    ).toBe('Start time cannot be in the past.');
    expect(
      validateCreateChallengeField('startAt', {
        ...validValues,
        startAt: new Date('2026-05-24T09:59:30.000Z'),
      }),
    ).toBeUndefined();
  });

  it('validates rule and invite fields', () => {
    expect(validateCreateChallengeField('totalHearts', { ...validValues, totalHearts: 0 })).toBe(
      'Hearts must be at least 1.',
    );
    expect(validateCreateChallengeField('totalHearts', { ...validValues, totalHearts: 100 })).toBe(
      'Hearts cannot exceed 99.',
    );
    expect(validateCreateChallengeField('totalHearts', { ...validValues, totalHearts: 1.5 })).toBe(
      'Hearts must be a whole number.',
    );
    expect(validateCreateChallengeField('maxMembers', { ...validValues, maxMembers: 1 })).toBe(
      'A challenge needs at least 2 members.',
    );
    expect(validateCreateChallengeField('maxMembers', { ...validValues, maxMembers: 51 })).toBe(
      'A challenge cannot have more than 50 members.',
    );
    expect(validateCreateChallengeField('maxMembers', { ...validValues, maxMembers: 2.5 })).toBe(
      'Max members must be a whole number.',
    );
    expect(
      validateCreateChallengeField('invitedFriendIds', {
        ...validValues,
        invitedFriendIds: ['friend-1', 'friend-1'],
      }),
    ).toBe('Invitees cannot contain duplicates.');
    expect(
      validateCreateChallengeField('invitedFriendIds', {
        ...validValues,
        maxMembers: 2,
        invitedFriendIds: ['friend-1', 'friend-2'],
      }),
    ).toBe('You can invite up to 1 friend for this challenge.');
    expect(
      validateCreateChallengeField('invitedFriendIds', validValues, ['friend-1']),
    ).toBe('Invitees must be selected from your friends list.');
  });

  it('validates combined description and task instruction length', () => {
    expect(
      validateCreateChallengeField('taskInstruction', {
        ...validValues,
        description: 'a'.repeat(490),
        taskInstruction: 'b'.repeat(20),
      }),
    ).toBe('Description and task instruction must be at most 500 characters combined.');
    expect(validateCreateChallengeField('isPrivate', validValues)).toBeUndefined();
  });

  it('validates individual steps and exposes step fields', () => {
    expect(validateCreateChallengeStep('info', { ...validValues, title: '' }).errors).toEqual({
      title: 'Challenge title is required.',
    });
    expect(validateCreateChallengeStep('rules', validValues).isValid).toBe(true);
    expect(getCreateChallengeStepFields('schedule')).toEqual([
      'durationDays',
      'frequency',
      'frequencyDays',
      'resetTime',
      'startAt',
    ]);
  });

  it('maps backend field details to form errors', () => {
    expect(
      mapBackendCreateChallengeErrors({
        status: 400,
        message: 'Invalid',
        details: [
          { field: 'cover_url', message: 'Cover must be public' },
          { path: ['body', 'duration_days'], message: 'Too long' },
          { field: 'unknown', message: 'Ignored' },
        ],
      }),
    ).toEqual({
      fieldErrors: {
        coverUrl: 'Cover must be public',
        durationDays: 'Too long',
      },
      formError: 'Please fix the highlighted fields and try again.',
    });
  });

  it('maps backend form-level errors', () => {
    expect(
      mapBackendCreateChallengeErrors({
        status: 409,
        message: '',
        details: 'not-an-array',
      }).formError,
    ).toBe('The challenge could not be created because of a business rule conflict.');

    expect(
      mapBackendCreateChallengeErrors({
        status: 400,
        message: 'Friend is not eligible',
      }),
    ).toEqual({
      fieldErrors: { invitedFriendIds: 'Friend is not eligible' },
      formError: 'Friend is not eligible',
    });

    expect(
      mapBackendCreateChallengeErrors({
        status: 500,
        message: '',
      }).formError,
    ).toBe('Could not create the challenge. Please try again.');
  });
});
