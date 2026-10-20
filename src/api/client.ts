import { storage } from '../lib/storage';
import type { User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

type ApiError = Error & {
  status?: number;
  code?: string;
};

type RefreshResponse = {
  accessToken: string;
  refreshToken?: string;
  user?: User;
};

let refreshPromise: Promise<void> | null = null;

export function getAccessToken(): string | null {
  return storage.get<string>('access_token') ?? null;
}

function setAuthSession(response: { accessToken: string; refreshToken?: string; user?: User }) {
  if (response.accessToken) {
    storage.set('access_token', response.accessToken);
  }
  if (response.refreshToken) {
    storage.set('refresh_token', response.refreshToken);
  }
  if (response.user) {
    storage.set('user', response.user);
  }
}

function clearAuthSession() {
  storage.remove('access_token');
  storage.remove('refresh_token');
  storage.remove('user');
}

async function refreshAccessToken(): Promise<void> {
  const refreshToken = storage.get<string>('refresh_token');

  if (!refreshToken) {
    clearAuthSession();
    throw new Error('No refresh token available.');
  }

  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    })
      .then(async (response) => {
        if (!response.ok) {
          clearAuthSession();
          throw new Error('Session expired. Please sign in again.');
        }

        const payload = (await response.json()) as RefreshResponse;
        setAuthSession(payload);
      })
      .catch((error) => {
        clearAuthSession();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  await refreshPromise;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  tokenOverride?: string | null
): Promise<T> {
  const token = tokenOverride ?? getAccessToken();

  const headers = new Headers(options.headers ?? {});
  headers.set('Accept', 'application/json');

  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    try {
      await refreshAccessToken();
      const refreshedToken = getAccessToken();

      const retriedHeaders = new Headers(options.headers ?? {});
      retriedHeaders.set('Accept', 'application/json');

      if (!(options.body instanceof FormData)) {
        retriedHeaders.set('Content-Type', 'application/json');
      }

      if (refreshedToken) {
        retriedHeaders.set('Authorization', `Bearer ${refreshedToken}`);
      }

      const retried = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: retriedHeaders,
      });

      if (!retried.ok) {
        const payload = await retried.json().catch(() => null);
        const err = new Error(payload?.message ?? 'Request failed.') as ApiError;
        err.status = retried.status;
        err.code = payload?.code ?? 'REQUEST_ERROR';
        throw err;
      }

      if (retried.status === 204) {
        return undefined as T;
      }

      return (await retried.json()) as T;
    } catch (error) {
      const err = error as ApiError;
      err.message = err.message || 'Session expired. Please sign in again.';
      throw err;
    }
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const err = new Error(payload?.message ?? 'Request failed.') as ApiError;
    err.status = response.status;
    err.code = payload?.code ?? 'REQUEST_ERROR';
    throw err;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
