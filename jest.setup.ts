import '@testing-library/jest-native/extend-expect';
import { cleanup } from '@testing-library/react-native';

type TimeoutHandle = ReturnType<typeof setTimeout>;

const realSetTimeout = global.setTimeout;
const realClearTimeout = global.clearTimeout;
const realTimeouts = new Set<TimeoutHandle>();

global.setTimeout = (((handler: TimerHandler, timeout?: number, ...args: unknown[]) => {
  const timer = realSetTimeout(() => {
    realTimeouts.delete(timer);

    if (typeof handler === 'function') {
      handler(...args);
    }
  }, timeout);

  (timer as TimeoutHandle & { unref?: () => void }).unref?.();
  realTimeouts.add(timer);
  return timer;
}) as unknown) as typeof setTimeout;

global.clearTimeout = ((id?: number | TimeoutHandle) => {
  if (id !== undefined) {
    realTimeouts.delete(id as TimeoutHandle);
  }

  return realClearTimeout(id as TimeoutHandle);
}) as typeof clearTimeout;

const animationFrameTimers = new Set<ReturnType<typeof setTimeout>>();

global.requestAnimationFrame = ((callback: (time: number) => void) => {
  const timer = setTimeout(() => {
    animationFrameTimers.delete(timer);
    callback(Date.now());
  }, 0);

  timer.unref?.();
  animationFrameTimers.add(timer);
  return timer as unknown as number;
}) as typeof requestAnimationFrame;

global.cancelAnimationFrame = ((id: number) => {
  const timer = id as unknown as ReturnType<typeof setTimeout>;
  animationFrameTimers.delete(timer);
  clearTimeout(timer);
}) as typeof cancelAnimationFrame;

function clearAnimationFrameTimers() {
  animationFrameTimers.forEach((timer) => clearTimeout(timer));
  animationFrameTimers.clear();
}

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native-safe-area-context', () => {
  const actual = jest.requireActual('react-native-safe-area-context');

  return {
    ...actual,
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
    SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
    useSafeAreaInsets: () => ({
      top: 24,
      right: 0,
      bottom: 24,
      left: 0,
    }),
    useSafeAreaFrame: () => ({
      x: 0,
      y: 0,
      width: 390,
      height: 844,
    }),
  };
});

// jest.mock('expo-secure-store', () => ({
//   setItemAsync: jest.fn(),
//   getItemAsync: jest.fn(),
//   deleteItemAsync: jest.fn(),
// }));

jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  setNotificationHandler: jest.fn(),
  addNotificationReceivedListener: jest.fn(),
  addNotificationResponseReceivedListener: jest.fn(),
  removeNotificationSubscription: jest.fn(),
}));

jest.mock('expo-camera', () => ({
  CameraView: 'CameraView',
  useCameraPermissions: jest.fn(() => [
    { granted: true, canAskAgain: true },
    jest.fn(),
  ]),
}));

jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: jest.fn(),
  requestMediaLibraryPermissionsAsync: jest.fn(),
  getCameraPermissionsAsync: jest.fn().mockResolvedValue({
    granted: false,
    status: 'undetermined',
    canAskAgain: true,
  }),
  getMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({
    granted: false,
    status: 'undetermined',
    canAskAgain: true,
  }),
  launchCameraAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: {
    Images: 'Images',
  },
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');

  const MockIcon = ({ name }: { name: string }) =>
    React.createElement(Text, null, name);

  return {
    Ionicons: MockIcon,
    MaterialIcons: MockIcon,
    Feather: MockIcon,
  };
});

afterEach(() => {
  cleanup();
  clearAnimationFrameTimers();
  jest.clearAllMocks();
  jest.clearAllTimers();
});
