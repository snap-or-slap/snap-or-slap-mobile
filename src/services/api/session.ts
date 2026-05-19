import { storage } from '../storage/storage.service';

const SESSION_KEYS = {
  currentUser: 'snap-or-slap.session.currentUser',
  accessToken: 'snap-or-slap.session.accessToken',
  refreshToken: 'snap-or-slap.session.refreshToken',
} as const;

export type SessionUser = {
  id: string;
  email?: string | null;
  username?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  isPrivate?: boolean;
};

export type AuthSession = {
  user: SessionUser;
  accessToken: string;
  refreshToken: string;
};

export async function getCurrentUser(): Promise<SessionUser | null> {
  const value = await storage.getItem(SESSION_KEYS.currentUser);
  if (!value) return null;

  try {
    return JSON.parse(value) as SessionUser;
  } catch {
    await storage.removeItem(SESSION_KEYS.currentUser);
    return null;
  }
}

export async function setCurrentUser(user: SessionUser): Promise<void> {
  await storage.setItem(SESSION_KEYS.currentUser, JSON.stringify(user));
}

export async function getAccessToken(): Promise<string | null> {
  return storage.getItem(SESSION_KEYS.accessToken);
}

export async function setAccessToken(token: string): Promise<void> {
  await storage.setItem(SESSION_KEYS.accessToken, token);
}

export async function getRefreshToken(): Promise<string | null> {
  return storage.getItem(SESSION_KEYS.refreshToken);
}

export async function setRefreshToken(token: string): Promise<void> {
  await storage.setItem(SESSION_KEYS.refreshToken, token);
}

export async function setSession(session: AuthSession): Promise<void> {
  await Promise.all([
    setCurrentUser(session.user),
    setAccessToken(session.accessToken),
    setRefreshToken(session.refreshToken),
  ]);
}

export async function getSession(): Promise<AuthSession | null> {
  const [user, accessToken, refreshToken] = await Promise.all([
    getCurrentUser(),
    getAccessToken(),
    getRefreshToken(),
  ]);

  if (!user || !accessToken || !refreshToken) return null;
  return { user, accessToken, refreshToken };
}

export async function clearSession(): Promise<void> {
  await Promise.all([
    storage.removeItem(SESSION_KEYS.currentUser),
    storage.removeItem(SESSION_KEYS.accessToken),
    storage.removeItem(SESSION_KEYS.refreshToken),
  ]);
}

export async function getCurrentUserId(): Promise<string> {
  const user = await getCurrentUser();
  if (!user?.id) {
    throw new Error('No current user in session. Login or set a session before calling user-scoped APIs.');
  }

  return user.id;
}

export const session = {
  getCurrentUser,
  setCurrentUser,
  getAccessToken,
  setAccessToken,
  getRefreshToken,
  setRefreshToken,
  getSession,
  setSession,
  clearSession,
  getCurrentUserId,
};
