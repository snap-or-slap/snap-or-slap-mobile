import { apiClient, mapKeysToCamel } from '@services/api';

import { getSummary } from '../widget.service';

jest.mock('@services/api', () => {
  const actual = jest.requireActual('@services/api');

  return {
    ...actual,
    apiClient: {
      get: jest.fn(),
    },
    mapKeysToCamel: jest.fn((value) => value),
  };
});

const mockedApiClient = apiClient as jest.Mocked<Pick<typeof apiClient, 'get'>>;

describe('widget.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads the dashboard summary for the current user', async () => {
    mockedApiClient.get.mockResolvedValueOnce({ current_streak: 4 });

    await expect(getSummary()).resolves.toEqual({ current_streak: 4 });

    expect(mockedApiClient.get).toHaveBeenCalledWith('/widget/summary', {
      withCurrentUser: true,
    });
    expect(mapKeysToCamel).toHaveBeenCalledWith({ current_streak: 4 });
  });
});
