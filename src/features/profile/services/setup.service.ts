import { STORAGE_KEYS } from '@shared/constants/storageKeys';
import { session } from '@services/api';
import { storage } from '@services/storage/storage.service';

export type SetupFlags = {
  profileSetupCompleted: boolean;
  permissionsSetupCompleted: boolean;
};

const TRUE_VALUE = 'true';

function getUserScopedKey(baseKey: string, userId: string): string {
  return `${baseKey}:${userId}`;
}

async function getCurrentUserScopedKey(baseKey: string): Promise<string> {
  const user = await session.getCurrentUser();
  return user?.id ? getUserScopedKey(baseKey, user.id) : baseKey;
}

async function getBoolean(key: string): Promise<boolean> {
  return (await storage.getItem(key)) === TRUE_VALUE;
}

export async function getSetupFlags(): Promise<SetupFlags> {
  const profileKey = await getCurrentUserScopedKey(STORAGE_KEYS.PROFILE_SETUP_COMPLETED);
  const permissionsKey = await getCurrentUserScopedKey(STORAGE_KEYS.PERMISSIONS_SETUP_COMPLETED);
  const [profileSetupCompleted, permissionsSetupCompleted] = await Promise.all([
    getBoolean(profileKey),
    getBoolean(permissionsKey),
  ]);

  return { profileSetupCompleted, permissionsSetupCompleted };
}

export async function markProfileSetupCompleted(): Promise<void> {
  await storage.setItem(await getCurrentUserScopedKey(STORAGE_KEYS.PROFILE_SETUP_COMPLETED), TRUE_VALUE);
}

export async function markPermissionsSetupCompleted(): Promise<void> {
  await storage.setItem(await getCurrentUserScopedKey(STORAGE_KEYS.PERMISSIONS_SETUP_COMPLETED), TRUE_VALUE);
}

export const setupService = {
  getSetupFlags,
  markProfileSetupCompleted,
  markPermissionsSetupCompleted,
};
