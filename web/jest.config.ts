import type { Config } from 'jest';

export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@emotion/(?!hash).*$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.app.json',
    }],
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/main.tsx',
    '!src/**/*.d.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
} as Config;