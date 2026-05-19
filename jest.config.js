module.exports = {
  preset: 'jest-expo',

  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.test.tsx',
  ],

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  moduleNameMapper: {
    '^@ds/(.*)$': '<rootDir>/src/design-system/$1',
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@store/(.*)$': '<rootDir>/src/store/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
    '^@mocks/(.*)$': '<rootDir>/src/mocks/$1',
  },

  collectCoverageFrom: [
    'src/features/**/*.{ts,tsx}',
    'src/app/**/*.{ts,tsx}',

    '!src/**/*.types.ts',
    '!src/**/index.ts',
    '!src/**/__tests__/**',
    '!src/**/data/**',
    '!src/**/mocks/**',

    '!src/features/**/hooks/index.ts',
    '!src/app/AppNavigator.tsx',
    '!src/app/RootLayout.tsx',
  ],

  coverageDirectory: 'coverage',

  coverageReporters: ['text', 'lcov', 'html'],
};
