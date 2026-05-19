import type { CreateChallengeFormValues } from '../types/createChallenge.types';
import type { CreateChallengePayload } from '../services/challenges.service';

function trimOptional(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function mapFormToCreatePayload(values: CreateChallengeFormValues): CreateChallengePayload {
  const description = [
    trimOptional(values.description),
    values.taskInstruction?.trim() ? `Task: ${values.taskInstruction.trim()}` : undefined,
  ]
    .filter(Boolean)
    .join('\n\n');

  const payload: CreateChallengePayload = {
    title: values.title.trim(),
    description: description || undefined,
    durationDays: values.durationDays,
    frequency: values.frequency,
    frequencyDays: values.frequency === 'custom' ? values.frequencyDays : undefined,
    resetTime: values.resetTime,
    totalHearts: values.totalHearts,
    maxMembers: values.maxMembers,
    isPrivate: values.isPrivate,
    invitedUserIds: values.invitedFriendIds.length ? values.invitedFriendIds : undefined,
    startAt: values.startAt ? values.startAt.toISOString() : undefined,
    coverUrl: trimOptional(values.coverUrl),
  };

  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== ''),
  ) as CreateChallengePayload;
}
