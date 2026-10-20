export const appConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000',
  appName: import.meta.env.VITE_APP_NAME ?? 'Sophia Central',
  useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'true',
  environment: import.meta.env.MODE ?? 'development',
  isProduction: import.meta.env.PROD ?? false,
} as const;
