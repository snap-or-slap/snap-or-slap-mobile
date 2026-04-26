import '@testing-library/jest-native/extend-expect';

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