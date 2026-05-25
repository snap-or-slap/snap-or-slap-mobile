import { apiClient, session } from '@services/api';

import {
  changePassword,
  checkUsername,
  login,
  refreshToken,
  register,
  signout,
} from '../auth.service';

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
    session: {
      setSession: jest.fn(),
      setAccessToken: jest.fn(),
      setRefreshToken: jest.fn(),
      getRefreshToken: jest.fn(),
      clearSession: jest.fn(),
    },
    mapAuthSession: jest.fn((response) => ({
      user: {
        id: response.user.id,
        email: response.user.email,
        username: response.user.username,
      },
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
    })),
    mapTokenResponse: jest.fn((response) => ({
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
    })),
  };
});

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;
const mockedSession = session as jest.Mocked<typeof session>;

describe('auth.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('logs in, maps the backend response, and stores the session', async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      user: { id: 'user-1', email: 'a@example.com', username: 'snapper' },
      access_token: 'access-token',
      refresh_token: 'refresh-token',
    });

    await expect(login({ email: 'a@example.com', password: 'secret' })).resolves.toEqual({
      user: { id: 'user-1', email: 'a@example.com', username: 'snapper' },
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });

    expect(mockedApiClient.post).toHaveBeenCalledWith('/auth/login', {
      email: 'a@example.com',
      password: 'secret',
    });
    expect(mockedSession.setSession).toHaveBeenCalledWith({
      user: { id: 'user-1', email: 'a@example.com', username: 'snapper' },
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
  });

  it('registers with terms agreed before storing the session', async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      user: { id: 'user-2', email: 'b@example.com', username: 'newbie' },
      access_token: 'new-access',
      refresh_token: 'new-refresh',
    });

    await register({
      email: 'b@example.com',
      password: 'secret',
      username: 'newbie',
    });

    expect(mockedApiClient.post).toHaveBeenCalledWith('/auth/register', {
      email: 'b@example.com',
      password: 'secret',
      username: 'newbie',
      terms_agreed: true,
    });
    expect(mockedSession.setSession).toHaveBeenCalled();
  });

  it('checks username availability with query params', async () => {
    mockedApiClient.get.mockResolvedValueOnce({ available: true });

    await expect(checkUsername('snapper')).resolves.toEqual({ available: true });

    expect(mockedApiClient.get).toHaveBeenCalledWith('/auth/check-username', {
      query: { username: 'snapper' },
    });
  });

  it('refreshes tokens and persists both returned token values', async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      access_token: 'next-access',
      refresh_token: 'next-refresh',
    });

    await expect(refreshToken('old-refresh')).resolves.toEqual({
      accessToken: 'next-access',
      refreshToken: 'next-refresh',
    });

    expect(mockedApiClient.post).toHaveBeenCalledWith('/auth/refresh', {
      refresh_token: 'old-refresh',
    });
    expect(mockedSession.setAccessToken).toHaveBeenCalledWith('next-access');
    expect(mockedSession.setRefreshToken).toHaveBeenCalledWith('next-refresh');
  });

  it('signs out with an explicit token and always clears the session', async () => {
    await signout('refresh-token');

    expect(mockedApiClient.post).toHaveBeenCalledWith('/auth/signout', {
      refresh_token: 'refresh-token',
    });
    expect(mockedSession.getRefreshToken).not.toHaveBeenCalled();
    expect(mockedSession.clearSession).toHaveBeenCalled();
  });

  it('uses the stored refresh token for signout and skips the API call when absent', async () => {
    mockedSession.getRefreshToken.mockResolvedValueOnce('stored-refresh');
    await signout();

    expect(mockedApiClient.post).toHaveBeenCalledWith('/auth/signout', {
      refresh_token: 'stored-refresh',
    });

    jest.clearAllMocks();
    mockedSession.getRefreshToken.mockResolvedValueOnce(null);
    await signout();

    expect(mockedApiClient.post).not.toHaveBeenCalled();
    expect(mockedSession.clearSession).toHaveBeenCalled();
  });

  it('changes password through the current-user endpoint', async () => {
    mockedApiClient.post.mockResolvedValueOnce({ message: 'Password changed' });

    await expect(
      changePassword({ currentPassword: 'old', newPassword: 'new' }),
    ).resolves.toEqual({ message: 'Password changed' });

    expect(mockedApiClient.post).toHaveBeenCalledWith(
      '/auth/change-password',
      { currentPassword: 'old', newPassword: 'new' },
      { withCurrentUser: true },
    );
  });
});
