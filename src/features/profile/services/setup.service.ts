import { STORAGE_KEYS } from '@shared/constants/storageKeys';
import { storage } from '@services/storage/storage.service';

export type SetupFlags = {
  profileSetupCompleted: boolean;
  permissionsSetupCompleted: boolean;
};

const TRUE_VALUE = 'true';

async function getBoolean(key: string): Promise<boolean> {
  return (await storage.getItem(key)) === TRUE_VALUE;
}

export async function getSetupFlags(): Promise<SetupFlags> {
  const [profileSetupCompleted, permissionsSetupCompleted] = await Promise.all([
    getBoolean(STORAGE_KEYS.PROFILE_SETUP_COMPLETED),
    getBoolean(STORAGE_KEYS.PERMISSIONS_SETUP_COMPLETED),
  ]);

  return { profileSetupCompleted, permissionsSetupCompleted };
}

export async function markProfileSetupCompleted(): Promise<void> {
  await storage.setItem(STORAGE_KEYS.PROFILE_SETUP_COMPLETED, TRUE_VALUE);
}

export async function markPermissionsSetupCompleted(): Promise<void> {
  await storage.setItem(STORAGE_KEYS.PERMISSIONS_SETUP_COMPLETED, TRUE_VALUE);
}

export const setupService = {
  getSetupFlags,
  markProfileSetupCompleted,
  markPermissionsSetupCompleted,
};
