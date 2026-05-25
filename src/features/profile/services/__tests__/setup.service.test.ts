import { session } from '@services/api';
import { storage } from '@services/storage/storage.service';

import {
  getSetupFlags,
  markPermissionsSetupCompleted,
  markProfileSetupCompleted,
} from '../setup.service';

jest.mock('@services/api', () => ({
  session: {
    getCurrentUser: jest.fn(),
  },
}));

jest.mock('@services/storage/storage.service', () => ({
  storage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

const mockedSession = session as unknown as jest.Mocked<Pick<typeof session, 'getCurrentUser'>>;
const mockedStorage = storage as unknown as jest.Mocked<Pick<typeof storage, 'getItem' | 'setItem'>>;

describe('setup.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('reads setup flags from user-scoped storage keys', async () => {
    mockedSession.getCurrentUser.mockResolvedValue({ id: 'user-1' });
    mockedStorage.getItem
      .mockResolvedValueOnce('true')
      .mockResolvedValueOnce(null);

    await expect(getSetupFlags()).resolves.toEqual({
      profileSetupCompleted: true,
      permissionsSetupCompleted: false,
    });

    expect(mockedStorage.getItem).toHaveBeenNthCalledWith(
      1,
      'sos.profileSetupCompleted:user-1',
    );
    expect(mockedStorage.getItem).toHaveBeenNthCalledWith(
      2,
      'sos.permissionsSetupCompleted:user-1',
    );
  });

  it('falls back to global keys when no current user is available', async () => {
    mockedSession.getCurrentUser.mockResolvedValue(null);
    mockedStorage.getItem.mockResolvedValue('true');

    await expect(getSetupFlags()).resolves.toEqual({
      profileSetupCompleted: true,
      permissionsSetupCompleted: true,
    });

    expect(mockedStorage.getItem).toHaveBeenNthCalledWith(1, 'sos.profileSetupCompleted');
    expect(mockedStorage.getItem).toHaveBeenNthCalledWith(2, 'sos.permissionsSetupCompleted');
  });

  it('marks profile and permission setup as completed', async () => {
    mockedSession.getCurrentUser.mockResolvedValue({ id: 'user-2' });

    await markProfileSetupCompleted();
    expect(mockedStorage.setItem).toHaveBeenCalledWith(
      'sos.profileSetupCompleted:user-2',
      'true',
    );

    await markPermissionsSetupCompleted();
    expect(mockedStorage.setItem).toHaveBeenLastCalledWith(
      'sos.permissionsSetupCompleted:user-2',
      'true',
    );
  });
});
