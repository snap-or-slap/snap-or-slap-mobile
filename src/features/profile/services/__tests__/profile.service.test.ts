import { apiClient, mapKeysToCamel, mapProfileDto, mapUserDto } from '@services/api';

import {
  checkBadges,
  deleteAccount,
  getActivities,
  getChallengeHistoryList,
  getMe,
  getMyProfile,
  getProfileOverview,
  getStats,
  getUserProfile,
  searchUsers,
  updateCurrentUserProfile,
  updateMe,
  updateProfile,
  updateSettings,
} from '../profile.service';

jest.mock('@services/api', () => {
  const actual = jest.requireActual('@services/api');

  return {
    ...actual,
    apiClient: {
      get: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      post: jest.fn(),
      delete: jest.fn(),
    },
    mapKeysToCamel: jest.fn((value) => value),
    mapProfileDto: jest.fn((value) => value),
    mapUserDto: jest.fn((user) => ({
      id: String(user?.id ?? user?.user_id ?? ''),
      email: user?.email ?? null,
      username: user?.username ?? null,
      displayName: user?.display_name ?? user?.displayName ?? null,
      avatarUrl: user?.avatar_url ?? user?.avatarUrl ?? null,
      bio: user?.bio ?? null,
      isPrivate: user?.is_private ?? user?.isPrivate,
    })),
  };
});

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('profile.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('gets, updates, and deletes the current user profile', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      user: { id: 'user-1', email: 'a@example.com', username: 'snapper' },
    });

    await expect(getMe()).resolves.toMatchObject({
      id: 'user-1',
      email: 'a@example.com',
      username: 'snapper',
    });
    expect(mockedApiClient.get).toHaveBeenCalledWith('/users/me', {
      withCurrentUser: true,
    });

    mockedApiClient.patch.mockResolvedValueOnce({
      user: { id: 'user-1', display_name: 'Display', bio: 'Bio', is_private: true },
    });
    await expect(updateMe({ displayName: 'Display', bio: 'Bio', isPrivate: true })).resolves.toMatchObject({
      id: 'user-1',
      displayName: 'Display',
      bio: 'Bio',
      isPrivate: true,
    });
    expect(mockedApiClient.patch).toHaveBeenCalledWith(
      '/users/me',
      { displayName: 'Display', bio: 'Bio', isPrivate: true },
      { withCurrentUser: true },
    );

    await deleteAccount();
    expect(mockedApiClient.delete).toHaveBeenCalledWith('/users/me', {
      withCurrentUser: true,
    });
  });

  it('loads profile overview, target profiles, search results, and settings', async () => {
    mockedApiClient.get.mockResolvedValueOnce({ user: { id: 'me' }, stats: {} });
    await expect(getProfileOverview()).resolves.toEqual({ user: { id: 'me' }, stats: {} });
    expect(mockedApiClient.get).toHaveBeenLastCalledWith('/users/me/profile', {
      withCurrentUser: true,
    });

    mockedApiClient.get.mockResolvedValueOnce({ user: { id: 'target' } });
    await getUserProfile('target');
    expect(mockedApiClient.get).toHaveBeenLastCalledWith('/users/target/profile', {
      withCurrentUser: true,
    });

    mockedApiClient.get.mockResolvedValueOnce({
      users: [{ id: 'user-2', username: 'friend', display_name: 'Friend' }],
    });
    await expect(searchUsers('fri')).resolves.toEqual([
      expect.objectContaining({ id: 'user-2', username: 'friend', displayName: 'Friend' }),
    ]);
    expect(mockedApiClient.get).toHaveBeenLastCalledWith('/users/search', {
      query: { q: 'fri' },
      withCurrentUser: true,
    });

    mockedApiClient.put.mockResolvedValueOnce({
      user: { id: 'user-1', is_private: false },
      message: 'Updated',
    });
    await expect(updateSettings(false)).resolves.toEqual({
      user: expect.objectContaining({ id: 'user-1', isPrivate: false }),
      message: 'Updated',
    });
    expect(mockedApiClient.put).toHaveBeenCalledWith(
      '/users/me/settings',
      { isPrivate: false },
      { withCurrentUser: true },
    );
    expect(mapProfileDto).toHaveBeenCalled();
    expect(mapUserDto).toHaveBeenCalled();
  });

  it('loads stats, activities, badges, and challenge history', async () => {
    mockedApiClient.get.mockResolvedValue({ total_checkins: 5 });
    mockedApiClient.post.mockResolvedValue({ badges_count: 2 });

    await getStats();
    expect(mockedApiClient.get).toHaveBeenLastCalledWith('/users/me/stats', {
      withCurrentUser: true,
    });

    await getActivities({ page: 2, limit: 10, type: 'checkin' });
    expect(mockedApiClient.get).toHaveBeenLastCalledWith('/users/me/activities', {
      query: { page: 2, limit: 10, type: 'checkin' },
      withCurrentUser: true,
    });

    await checkBadges();
    expect(mockedApiClient.post).toHaveBeenCalledWith('/users/me/badges/check', undefined, {
      withCurrentUser: true,
    });

    await getChallengeHistoryList({ result: 'game_over', page: 3 });
    expect(mockedApiClient.get).toHaveBeenLastCalledWith('/users/me/challenges/history', {
      query: { result: 'game_over', page: 3 },
      withCurrentUser: true,
    });
    expect(mapKeysToCamel).toHaveBeenCalled();
  });

  it('maps current-user helpers to the app profile shape', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      user: {
        id: 'user-1',
        username: 'snapper',
        display_name: null,
        email: 'a@example.com',
        avatar_url: 'https://example.com/avatar.png',
      },
    });

    await expect(getMyProfile()).resolves.toEqual({
      id: 'user-1',
      username: 'snapper',
      displayName: 'snapper',
      email: 'a@example.com',
      avatarUrl: 'https://example.com/avatar.png',
    });

    mockedApiClient.patch.mockResolvedValueOnce({
      user: { id: 'user-1', username: 'snapper', display_name: 'Updated', bio: 'New bio' },
    });
    await expect(updateProfile({ displayName: 'Updated', bio: 'New bio' })).resolves.toEqual({
      id: 'user-1',
      username: 'snapper',
      displayName: 'Updated',
      email: undefined,
      avatarUrl: undefined,
    });

    mockedApiClient.patch.mockResolvedValueOnce({
      user: { id: 'user-1', username: 'snapper', display_name: 'Current' },
    });
    await updateCurrentUserProfile({ displayName: 'Current', bio: 'Bio', avatarUrl: 'ignored' });
    expect(mockedApiClient.patch).toHaveBeenLastCalledWith(
      '/users/me',
      { displayName: 'Current', bio: 'Bio', isPrivate: undefined },
      { withCurrentUser: true },
    );
  });
});
