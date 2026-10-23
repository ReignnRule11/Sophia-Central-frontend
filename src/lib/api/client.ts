import { appConfig } from '../config/env';

export type ApiRequestOptions = RequestInit;

const JSON_CONTENT_TYPE = 'application/json';
let csrfToken: string | null = null;

export function setCsrfToken(token: string | null) {
  csrfToken = token;
}

function buildUrl(endpoint: string) {
  const baseUrl = appConfig.apiBaseUrl.replace(/\/$/, '');
  const normalized = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${normalized}`;
}

export async function apiRequest<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
  const { headers, ...rest } = options;
  const method = (rest.method ?? 'GET').toUpperCase();
  const requestHeaders: HeadersInit = {
    Accept: JSON_CONTENT_TYPE,
    ...(rest.body instanceof FormData ? {} : { 'Content-Type': JSON_CONTENT_TYPE }),
    ...(csrfToken && !['GET', 'HEAD', 'OPTIONS'].includes(method) ? { 'X-CSRF-Token': csrfToken } : {}),
    ...headers,
  };

  const response = await fetch(buildUrl(endpoint), {
    ...rest,
    credentials: 'include',
    headers: requestHeaders,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const errorPayload = await response.json();
      message = errorPayload?.message ?? errorPayload?.error ?? message;
    } catch {
      // Ignore JSON parsing issues and fall back to the HTTP error message.
    }
    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;
  const payload = await response.json();
  return payload?.data ?? payload ?? (undefined as T);
}
