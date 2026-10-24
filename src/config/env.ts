
const backendUrl =
  import.meta.env.VITE_API_BASE_URL ||
  'https://sophia-central-backend.onrender.com';

export const appConfig = {
  apiBaseUrl: backendUrl,
  useMockData: true,
};