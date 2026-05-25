import { profileService } from '@features/profile/services';
import { ApiError, apiClient, session } from '@services/api';

import {
  getFriends,
  getFriendsOverview,
  getIncomingRequests,
  getOutgoingRequests,
  getUserProfile,
  listFriends,
  listPendingRequests,
  removeFriend,
  respondFriendRequest,
  respondToRequest,
  searchUsers,
  sendFriendRequest,
  sendFriendRequestByUsername,
  unfriend,
  unsendFriendRequest,
} from '../friends.service';
import {
  addOutgoingRequest,
  reconcileOutgoingRequests,
  removeOutgoingRequest,
} from '../outgoingRequests.store';

jest.mock('@features/profile/services', () => ({
  profileService: {
    searchUsers: jest.fn(),
    getUserProfile: jest.fn(),
  },
}));

jest.mock('../outgoingRequests.store', () => ({
  addOutgoingRequest: jest.fn(),
  reconcileOutgoingRequests: jest.fn(),
  removeOutgoingRequest: jest.fn(),
}));

jest.mock('@services/api', () => {
  const actual = jest.requireActual('@services/api');

  return {
    ...actual,
    apiClient: {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    },
    session: {
      getCurrentUserId: jest.fn(),
    },
    mapKeysToCamel: jest.fn((value) => {
      if (!value || typeof value !== 'object' || Array.isArray(value)) return value;
      return Object.entries(value as Record<string, unknown>).reduce<Record<string, unknown>>(
        (result, [key, entry]) => {
          const mappedKey =
            key === 'request_id'
              ? 'requestId'
              : key === 'created_at'
                ? 'createdAt'
                : key === 'latest_activities'
                  ? 'latestActivities'
                  : key === 'current_streak'
                    ? 'currentStreak'
                    : key === 'completion_rate'
                      ? 'completionRate'
                      : key === 'challenges_joined'
                        ? 'challengesJoined'
                        : key;
          result[mappedKey] = entry;
          return result;
        },
        {},
      );
    }),
    mapUserDto: jest.fn((user) => ({
      id: String(user?.id ?? user?.user_id ?? ''),
      username: user?.username ?? null,
      displayName: user?.display_name ?? user?.displayName ?? null,
      avatarUrl: user?.avatar_url ?? user?.avatarUrl ?? null,
      currentStreak: user?.current_streak ?? user?.currentStreak,
      activeChallengesCount: user?.active_challenges_count ?? user?.activeChallengesCount,
      mutualCount: user?.mutual_count ?? user?.mutualCount,
      relationship: user?.relationship,
    })),
  };
});

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;
const mockedProfileService = profileService as jest.Mocked<typeof profileService>;
const mockedSession = session as jest.Mocked<Pick<typeof session, 'getCurrentUserId'>>;
const mockedReconcileOutgoingRequests = reconcileOutgoingRequests as jest.Mock;
const mockedAddOutgoingRequest = addOutgoingRequest as jest.Mock;
const mockedRemoveOutgoingRequest = removeOutgoingRequest as jest.Mock;

describe('friends.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedSession.getCurrentUserId.mockResolvedValue('current-user');
    mockedRemoveOutgoingRequest.mockResolvedValue(undefined);
    mockedAddOutgoingRequest.mockResolvedValue(undefined);
  });

  it('lists friends and maps relationship aliases', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      friends: [
        {
          id: 'friend-1',
          username: 'alex',
          display_name: 'Alex',
          relationship: 'pending_incoming',
        },
      ],
      total: 1,
      page: 1,
      limit: 20,
    });

    await expect(listFriends({ page: 1, limit: 20 })).resolves.toEqual({
      friends: [
        expect.objectContaining({
          id: 'friend-1',
          username: 'alex',
          displayName: 'Alex',
          relationship: 'pending_received',
        }),
      ],
      total: 1,
      page: 1,
      limit: 20,
    });

    expect(mockedApiClient.get).toHaveBeenCalledWith('/friends', {
      query: { page: 1, limit: 20 },
      withCurrentUser: true,
    });
  });

  it('lists incoming and outgoing pending requests', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      requests: [
        {
          id: 'request-1',
          sender: { id: 'sender-1', username: 'sender' },
          status: 'pending',
          created_at: '2026-05-25T00:00:00.000Z',
        },
        {
          request_id: 'request-2',
          receiver: { id: 'receiver-1', username: 'receiver' },
          status: 'pending',
          created_at: '2026-05-25T01:00:00.000Z',
        },
      ],
    });

    await expect(listPendingRequests()).resolves.toEqual([
      expect.objectContaining({
        id: 'request-1',
        direction: 'incoming',
        user: expect.objectContaining({ relationship: 'pending_received' }),
      }),
      expect.objectContaining({
        id: 'request-2',
        direction: 'outgoing',
        user: expect.objectContaining({ relationship: 'pending_sent' }),
      }),
    ]);
    expect(mockedApiClient.get).toHaveBeenCalledWith('/friends/requests/pending', {
      withCurrentUser: true,
    });
  });

  it('sends, responds to, and removes friend relationships', async () => {
    mockedApiClient.post.mockResolvedValueOnce({ request: { id: 'request-1' } });
    await expect(sendFriendRequest('receiver-1')).resolves.toEqual({
      request: { id: 'request-1' },
    });
    expect(mockedApiClient.post).toHaveBeenCalledWith(
      '/friends/request',
      { receiver_id: 'receiver-1' },
      { withCurrentUser: true },
    );

    await respondToRequest('request-1', 'accept');
    expect(mockedApiClient.put).toHaveBeenCalledWith(
      '/friends/request/request-1/respond',
      { action: 'accept' },
      { withCurrentUser: true },
    );

    await unfriend('friend-1');
    expect(mockedApiClient.delete).toHaveBeenCalledWith('/friends/friend-1', {
      withCurrentUser: true,
    });
    expect(mockedRemoveOutgoingRequest).toHaveBeenCalledWith('current-user', 'friend-1');
  });

  it('sends a request by username and records outgoing request state', async () => {
    mockedProfileService.searchUsers.mockResolvedValueOnce([
      { id: 'receiver-1', username: 'target', displayName: 'Target' },
    ] as never);
    mockedApiClient.post.mockResolvedValueOnce({
      request: { id: 'request-1', created_at: '2026-05-25T00:00:00.000Z' },
    });

    await expect(sendFriendRequestByUsername('target')).resolves.toEqual({
      targetUser: expect.objectContaining({ id: 'receiver-1', relationship: 'pending_sent' }),
      request: { id: 'request-1', created_at: '2026-05-25T00:00:00.000Z' },
    });

    expect(mockedAddOutgoingRequest).toHaveBeenCalledWith(
      'current-user',
      expect.objectContaining({
        requestId: 'request-1',
        receiverId: 'receiver-1',
        username: 'target',
      }),
    );
  });

  it('handles already-sent username requests reported as conflicts', async () => {
    mockedProfileService.searchUsers.mockResolvedValueOnce([
      { id: 'receiver-1', username: 'target', displayName: 'Target' },
    ] as never);
    mockedApiClient.post.mockRejectedValueOnce(
      new ApiError({ status: 409, message: 'Already requested' }),
    );
    mockedProfileService.getUserProfile.mockResolvedValueOnce({
      id: 'receiver-1',
      username: 'target',
      relationship: 'pending_sent',
    } as never);

    await expect(sendFriendRequestByUsername('target')).resolves.toEqual({
      targetUser: expect.objectContaining({ relationship: 'pending_sent' }),
      alreadySent: true,
    });
    expect(mockedAddOutgoingRequest).toHaveBeenCalled();
  });

  it('supports overview and convenience helpers', async () => {
    mockedApiClient.get
      .mockResolvedValueOnce({ friends: [], total: 0, page: 1, limit: 50 })
      .mockResolvedValueOnce({ requests: [] });
    mockedReconcileOutgoingRequests.mockResolvedValueOnce([
      {
        requestId: 'request-1',
        receiverId: 'receiver-1',
        username: 'receiver',
        status: 'pending',
      },
    ]);

    await expect(getFriendsOverview()).resolves.toEqual({
      friends: [],
      pendingRequests: [],
      outgoingRequests: [
        expect.objectContaining({
          id: 'request-1',
          direction: 'outgoing',
          user: expect.objectContaining({ id: 'receiver-1' }),
        }),
      ],
    });

    mockedApiClient.get.mockResolvedValueOnce({ friends: [], total: 0, page: 1, limit: 50 });
    await expect(getFriends()).resolves.toEqual([]);

    mockedApiClient.get.mockResolvedValueOnce({ requests: [] });
    await expect(getIncomingRequests()).resolves.toEqual([]);

    mockedReconcileOutgoingRequests.mockResolvedValueOnce([]);
    await expect(getOutgoingRequests()).resolves.toEqual([]);

    await respondFriendRequest('request-1', 'decline');
    await expect(unsendFriendRequest('request-1')).resolves.toBeUndefined();
    await removeFriend('friend-1');
  });

  it('searches users through profile service and guards short queries', async () => {
    await expect(searchUsers('a')).resolves.toEqual([]);
    expect(mockedProfileService.searchUsers).not.toHaveBeenCalled();

    mockedProfileService.searchUsers.mockResolvedValueOnce([
      { id: 'user-1', username: 'alex', relationship: 'non_friend' },
    ] as never);

    await expect(searchUsers('al')).resolves.toEqual([
      expect.objectContaining({ id: 'user-1', relationship: 'none' }),
    ]);
  });

  it('maps profile previews from profile service responses', async () => {
    mockedProfileService.getUserProfile.mockResolvedValueOnce({
      user: { id: 'user-1', username: 'alex', display_name: 'Alex' },
      relationship: 'squadmate',
      request: { id: 'request-1' },
      stats: {
        currentStreak: 8,
        challengesJoined: 4,
        completionRate: 75,
      },
      badges: [{ id: 'badge-1', label: 'Consistent' }],
      latestActivities: [{ type: 'checkin_done' }],
    } as never);

    await expect(getUserProfile('user-1')).resolves.toEqual(
      expect.objectContaining({
        id: 'user-1',
        relationship: 'squadmate',
        requestId: 'request-1',
        currentStreak: 8,
        badges: [{ id: 'badge-1', label: 'Consistent' }],
        latestActivities: ['Completed a check-in'],
      }),
    );
  });

  it('throws when username search has no match and rethrows non-conflict request errors', async () => {
    mockedProfileService.searchUsers.mockResolvedValueOnce([] as never);
    await expect(sendFriendRequestByUsername('missing')).rejects.toThrow('No matching user found.');

    mockedProfileService.searchUsers.mockResolvedValueOnce([
      { id: 'receiver-1', username: 'target' },
    ] as never);
    mockedApiClient.post.mockRejectedValueOnce(new Error('Network down'));

    await expect(sendFriendRequestByUsername('target')).rejects.toThrow('Network down');
  });
});
