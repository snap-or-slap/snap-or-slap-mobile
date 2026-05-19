import {
  apiClient,
  apiRoutes,
  mapAuthSession,
  mapTokenResponse,
  session,
  type AuthSession,
  type BackendAuthResponse,
  type BackendTokenResponse,
} from '@services/api';

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  username: string;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export async function login(payload: LoginPayload): Promise<AuthSession> {
  const response = await apiClient.post<BackendAuthResponse>(apiRoutes.auth.login, payload);
  const nextSession = mapAuthSession(response);
  await session.setSession(nextSession);
  return nextSession;
}

export async function register(payload: RegisterPayload): Promise<AuthSession> {
  const response = await apiClient.post<BackendAuthResponse>(apiRoutes.auth.register, {
    ...payload,
    terms_agreed: true,
  });
  const nextSession = mapAuthSession(response);
  await session.setSession(nextSession);
  return nextSession;
}

export async function checkUsername(username: string): Promise<{ available: boolean }> {
  return apiClient.get<{ available: boolean }>(apiRoutes.auth.checkUsername, {
    query: { username },
  });
}

export async function refreshToken(refreshTokenValue: string): Promise<Pick<AuthSession, 'accessToken' | 'refreshToken'>> {
  const response = await apiClient.post<BackendTokenResponse>(apiRoutes.auth.refresh, {
    refresh_token: refreshTokenValue,
  });
  const tokens = mapTokenResponse(response);
  await Promise.all([
    session.setAccessToken(tokens.accessToken),
    session.setRefreshToken(tokens.refreshToken),
  ]);
  return tokens;
}

export async function signout(refreshTokenValue?: string): Promise<void> {
  const token = refreshTokenValue ?? (await session.getRefreshToken());
  if (token) {
    await apiClient.post(apiRoutes.auth.signout, { refresh_token: token });
  }
  await session.clearSession();
}

export async function changePassword(payload: ChangePasswordPayload): Promise<{ message: string }> {
  return apiClient.post<{ message: string }>(apiRoutes.auth.changePassword, payload, {
    withCurrentUser: true,
  });
}

export const authService = {
  login,
  register,
  checkUsername,
  refreshToken,
  signout,
  changePassword,
};
