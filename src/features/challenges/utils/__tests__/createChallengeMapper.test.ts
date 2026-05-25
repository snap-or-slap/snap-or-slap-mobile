import type { CreateChallengeFormValues } from '../../types/createChallenge.types';
import { mapFormToCreatePayload } from '../createChallengeMapper';

const baseValues: CreateChallengeFormValues = {
  title: '  Morning proof  ',
  description: '  Take a picture after running.  ',
  taskInstruction: '  Upload the proof before 9 AM.  ',
  coverUrl: '  https://example.com/cover.jpg  ',
  durationDays: 14,
  frequency: 'custom',
  frequencyDays: [1, 3, 5],
  resetTime: '09:00',
  startAt: new Date('2026-05-25T02:00:00.000Z'),
  totalHearts: 3,
  maxMembers: 8,
  isPrivate: true,
  invitedFriendIds: ['friend-1', 'friend-2'],
};

describe('mapFormToCreatePayload', () => {
  it('trims text fields and combines description with task instruction', () => {
    expect(mapFormToCreatePayload(baseValues)).toEqual({
      title: 'Morning proof',
      description: 'Take a picture after running.\n\nTask: Upload the proof before 9 AM.',
      durationDays: 14,
      frequency: 'custom',
      frequencyDays: [1, 3, 5],
      resetTime: '09:00',
      totalHearts: 3,
      maxMembers: 8,
      isPrivate: true,
      invitedUserIds: ['friend-1', 'friend-2'],
      startAt: '2026-05-25T02:00:00.000Z',
      coverUrl: 'https://example.com/cover.jpg',
    });
  });

  it('omits optional empty fields and custom days for daily challenges', () => {
    const payload = mapFormToCreatePayload({
      ...baseValues,
      description: '   ',
      taskInstruction: '',
      coverUrl: ' ',
      frequency: 'daily',
      frequencyDays: [2],
      startAt: null,
      invitedFriendIds: [],
      isPrivate: false,
    });

    expect(payload).toEqual({
      title: 'Morning proof',
      durationDays: 14,
      frequency: 'daily',
      resetTime: '09:00',
      totalHearts: 3,
      maxMembers: 8,
      isPrivate: false,
    });
  });

  it('keeps a task-only description with the task prefix', () => {
    expect(
      mapFormToCreatePayload({
        ...baseValues,
        description: undefined,
        taskInstruction: 'Drink water',
      }).description,
    ).toBe('Task: Drink water');
  });
});
