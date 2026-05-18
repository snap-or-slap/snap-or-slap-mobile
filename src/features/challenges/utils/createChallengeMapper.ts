import type { CreateChallengeFormValues } from '../types/createChallenge.types';

/**
 * Maps the UI form values to the backend payload shape.
 * Update field names here when the backend API contract is known.
 */
export function mapFormToCreatePayload(values: CreateChallengeFormValues) {
  return {
    title: values.title.trim(),
    description: values.description?.trim() ?? '',
    taskInstruction: values.taskInstruction?.trim() ?? '',
    stepLengthDays: values.stepLengthDays,
    resetTime: values.resetTime,
    startDate: values.startDate,
    endDate: values.endDate,
    totalHearts: values.totalHearts,
    minMembers: values.minMembers,
    invitedUserIds: values.invitedFriendIds,
  };
}
