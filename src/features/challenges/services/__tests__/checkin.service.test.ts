import { apiClient } from '@services/api';

import {
  getNudgeHistory,
  getTodayStatus,
  listCheckins,
  nudgeMember,
  submitCheckIn,
  submitCheckin,
  submitCheckinWithPhoto,
} from '../checkin.service';

jest.mock('@services/api', () => {
  const actual = jest.requireActual('@services/api');

  return {
    ...actual,
    apiClient: {
      get: jest.fn(),
      post: jest.fn(),
    },
    mapKeysToCamel: jest.fn((value) => value),
  };
});

const mockApiClient = apiClient as unknown as jest.Mocked<
  Pick<typeof apiClient, 'get' | 'post'>
>;

let appendedParts: Array<[string, unknown]>;

describe('checkin.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Date, 'now').mockReturnValue(1770000000000);

    appendedParts = [];

    jest.spyOn(FormData.prototype, 'append').mockImplementation((name, value) => {
      appendedParts.push([name, value]);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('lists check-ins and reads current cycle status', async () => {
    mockApiClient.get.mockResolvedValue({ checkins: [] });

    await listCheckins('challenge-1', {
      member_id: 'member-1',
      page: 2,
      limit: 5,
    });

    expect(mockApiClient.get).toHaveBeenLastCalledWith('/challenges/challenge-1/checkins', {
      query: {
        member_id: 'member-1',
        page: 2,
        limit: 5,
      },
    });

    await getTodayStatus('challenge-1');

    expect(mockApiClient.get).toHaveBeenLastCalledWith(
      '/challenges/challenge-1/checkins/today',
    );
  });

  it('nudges a pending member and reads nudge history', async () => {
    mockApiClient.post.mockResolvedValue({ message: 'Nudged' });
    mockApiClient.get.mockResolvedValue({ nudges: [] });

    await nudgeMember('challenge-1', 'member-1');

    expect(mockApiClient.post).toHaveBeenCalledWith(
      '/challenges/challenge-1/nudge/member-1',
      undefined,
      { withCurrentUser: true },
    );

    await getNudgeHistory('challenge-1', 'member-1');

    expect(mockApiClient.get).toHaveBeenCalledWith(
      '/challenges/challenge-1/nudge/member-1',
    );
  });

  it('submits URL check-ins for the current user or an explicit user', async () => {
    mockApiClient.post.mockResolvedValue({ checkin: { id: 'checkin-1' } });

    await submitCheckIn('challenge-1', {
      evidenceUrl: 'https://example.com/proof.jpg',
      caption: 'Done',
    });

    expect(mockApiClient.post).toHaveBeenLastCalledWith(
      '/challenges/challenge-1/checkins',
      {
        evidenceUrl: 'https://example.com/proof.jpg',
        caption: 'Done',
      },
      { withCurrentUser: true },
    );

    await submitCheckin('challenge-1', {
      evidenceUrl: 'https://example.com/proof.jpg',
      userId: 'user 1',
    });

    expect(mockApiClient.post).toHaveBeenLastCalledWith(
      '/challenges/challenge-1/checkins?user_id=user%201',
      {
        evidenceUrl: 'https://example.com/proof.jpg',
      },
      { withCurrentUser: false },
    );
  });

  it.each([
    ['file:///proof.PNG?cache=1', 'image/png', 'checkin-1770000000000.png'],
    ['file:///proof.webp', 'image/webp', 'checkin-1770000000000.webp'],
    ['file:///proof.jpg', 'image/jpeg', 'checkin-1770000000000.jpg'],
    ['file:///proof.jpeg', 'image/jpeg', 'checkin-1770000000000.jpg'],
    ['file:///proof.unknown', 'image/jpeg', 'checkin-1770000000000.jpg'],
  ])('builds multipart proof data for %s', async (photoUri, mimeType, name) => {
    mockApiClient.post.mockResolvedValue({ checkin: { id: 'checkin-1' } });

    await submitCheckinWithPhoto('challenge-1', {
      photoUri,
      caption: '  Proof caption  ',
      userId: 'member-1',
    });

    const [route, body, options] = mockApiClient.post.mock.calls[0];

    expect(route).toBe('/challenges/challenge-1/checkins?user_id=member-1');
    expect(options).toEqual({
      withCurrentUser: false,
      isMultipart: true,
    });
    expect(body).toBeInstanceOf(FormData);

    expect(appendedParts).toEqual([
      ['proof', { uri: photoUri, name, type: mimeType }],
      ['caption', 'Proof caption'],
    ]);
  });

  it('omits blank photo captions and uses current-user auth by default', async () => {
    mockApiClient.post.mockResolvedValue({ checkin: { id: 'checkin-1' } });

    await submitCheckinWithPhoto('challenge-1', {
      photoUri: 'file:///proof.jpg',
      caption: '   ',
    });

    const [, body, options] = mockApiClient.post.mock.calls[0];

    expect(options).toEqual({
      withCurrentUser: true,
      isMultipart: true,
    });
    expect(body).toBeInstanceOf(FormData);

    expect(appendedParts).toEqual([
      [
        'proof',
        {
          uri: 'file:///proof.jpg',
          name: 'checkin-1770000000000.jpg',
          type: 'image/jpeg',
        },
      ],
    ]);
  });
});