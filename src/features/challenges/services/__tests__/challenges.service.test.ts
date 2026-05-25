import { apiClient, mapKeysToCamel } from '@services/api';

import {
  acceptInvite,
  browsePublicChallenges,
  cancelChallenge,
  checkMilestone,
  createChallenge,
  declineInvite,
  deleteOrCancelChallenge,
  getChallenge,
  getChallengeHistory,
  getChallengeStats,
  getHistoryList,
  getReadyStatus,
  inviteUsers,
  leaveChallenge,
  listChallenges,
  recreateChallenge,
  setReady,
  updateChallenge,
} from '../challenges.service';

jest.mock('@services/api', () => {
  const actual = jest.requireActual('@services/api');

  return {
    ...actual,
    apiClient: {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
    },
    mapKeysToCamel: jest.fn((value) => value),
  };
});

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;
const mockedMapKeysToCamel = mapKeysToCamel as jest.Mock;

describe('challenges.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lists, creates, browses, reads, updates, and deletes challenges', async () => {
    mockedApiClient.get.mockResolvedValue({ challenges: [] });
    mockedApiClient.post.mockResolvedValue({ id: 'challenge-1' });
    mockedApiClient.patch.mockResolvedValue({ id: 'challenge-1', title: 'Updated' });
    mockedApiClient.delete.mockResolvedValue({ message: 'Deleted' });

    await listChallenges({ status: 'ACTIVE', page: 2, limit: 10 });
    expect(mockedApiClient.get).toHaveBeenLastCalledWith('/challenges', {
      query: { status: 'ACTIVE', page: 2, limit: 10 },
      withCurrentUser: true,
    });

    await createChallenge({
      title: 'Daily proof',
      durationDays: 7,
      frequency: 'daily',
    });
    expect(mockedApiClient.post).toHaveBeenLastCalledWith(
      '/challenges',
      { title: 'Daily proof', durationDays: 7, frequency: 'daily' },
      { withCurrentUser: true },
    );

    await browsePublicChallenges({ q: 'run', page: 1, limit: 5 });
    expect(mockedApiClient.get).toHaveBeenLastCalledWith('/challenges/public', {
      query: { q: 'run', page: 1, limit: 5 },
      withCurrentUser: true,
    });

    await getChallenge('challenge-1');
    expect(mockedApiClient.get).toHaveBeenLastCalledWith('/challenges/challenge-1', {
      withCurrentUser: true,
    });

    await updateChallenge('challenge-1', { title: 'Updated' });
    expect(mockedApiClient.patch).toHaveBeenLastCalledWith(
      '/challenges/challenge-1',
      { title: 'Updated' },
      { withCurrentUser: true },
    );

    await expect(deleteOrCancelChallenge('challenge-1')).resolves.toEqual({
      message: 'Deleted',
    });
    expect(mockedApiClient.delete).toHaveBeenLastCalledWith('/challenges/challenge-1', {
      withCurrentUser: true,
    });
    expect(mockedMapKeysToCamel).toHaveBeenCalled();
  });

  it('handles invite and formation actions', async () => {
    mockedApiClient.post.mockResolvedValue({ ok: true });
    mockedApiClient.put.mockResolvedValue({ is_ready: true });
    mockedApiClient.get.mockResolvedValue({ is_ready: true });

    await inviteUsers('challenge-1', ['user-1', 'user-2']);
    expect(mockedApiClient.post).toHaveBeenLastCalledWith(
      '/challenges/challenge-1/invite',
      { userIds: ['user-1', 'user-2'] },
      { withCurrentUser: true },
    );

    await acceptInvite('challenge-1');
    expect(mockedApiClient.post).toHaveBeenLastCalledWith(
      '/challenges/challenge-1/join',
      undefined,
      { withCurrentUser: true },
    );

    await declineInvite('challenge-1');
    expect(mockedApiClient.post).toHaveBeenLastCalledWith(
      '/challenges/challenge-1/decline',
      undefined,
      { withCurrentUser: true },
    );

    await setReady('challenge-1', true);
    expect(mockedApiClient.put).toHaveBeenLastCalledWith(
      '/challenges/challenge-1/ready',
      { isReady: true },
      { withCurrentUser: true },
    );

    await getReadyStatus('challenge-1');
    expect(mockedApiClient.get).toHaveBeenLastCalledWith('/challenges/challenge-1/ready');
  });

  it('handles history, stats, recreate, milestone, leave, and cancel actions', async () => {
    mockedApiClient.get.mockResolvedValue({ rows: [] });
    mockedApiClient.post.mockResolvedValue({ ok: true });

    await leaveChallenge('challenge-1');
    expect(mockedApiClient.post).toHaveBeenLastCalledWith(
      '/challenges/challenge-1/leave',
      undefined,
      { withCurrentUser: true },
    );

    await cancelChallenge('challenge-1');
    expect(mockedApiClient.post).toHaveBeenLastCalledWith(
      '/challenges/challenge-1/cancel',
      undefined,
      { withCurrentUser: true },
    );

    await cancelChallenge('challenge-1', 'Not enough members');
    expect(mockedApiClient.post).toHaveBeenLastCalledWith(
      '/challenges/challenge-1/cancel',
      { reason: 'Not enough members' },
      { withCurrentUser: true },
    );

    await getChallengeStats('challenge-1');
    expect(mockedApiClient.get).toHaveBeenLastCalledWith('/challenges/challenge-1/stats');

    await getHistoryList({ result: 'success', page: 1 });
    expect(mockedApiClient.get).toHaveBeenLastCalledWith('/users/me/challenges/history', {
      query: { result: 'success', page: 1 },
      withCurrentUser: true,
    });

    await getChallengeHistory('challenge-1');
    expect(mockedApiClient.get).toHaveBeenLastCalledWith('/challenges/challenge-1/history', {
      withCurrentUser: true,
    });

    await recreateChallenge('challenge-1', { title: 'Again' });
    expect(mockedApiClient.post).toHaveBeenLastCalledWith(
      '/challenges/challenge-1/recreate',
      { title: 'Again' },
      { withCurrentUser: true },
    );

    await checkMilestone('challenge-1');
    expect(mockedApiClient.post).toHaveBeenLastCalledWith(
      '/challenges/challenge-1/milestone-check',
      undefined,
      { withCurrentUser: true },
    );
  });
});
