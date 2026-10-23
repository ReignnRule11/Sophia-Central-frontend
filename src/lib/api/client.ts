import { appConfig } from '../../config/env';

export type ApiRequestOptions = RequestInit;
let csrfToken: string | null = null;

export function setCsrfToken(token: string | null) { csrfToken = token; }

function buildUrl(endpoint: string) {
  const baseUrl = appConfig.apiBaseUrl.replace(/\/$/, '');
  const normalized = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${normalized}`;
}

export async function apiRequest<T>(endpoint: string, options: ApiRequestOptions = {}, _legacyToken?: string | null): Promise<T> {
  const { headers, ...rest } = options;
  const method = (rest.method ?? 'GET').toUpperCase();
  const requestHeaders: HeadersInit = {
    Accept: 'application/json',
    ...(rest.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(csrfToken && !['GET', 'HEAD', 'OPTIONS'].includes(method) ? { 'X-CSRF-Token': csrfToken } : {}),
    ...headers,
  };

  const response = await fetch(buildUrl(endpoint), { ...rest, credentials: 'include', headers: requestHeaders });
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const payload = await response.json();
      message = payload?.message ?? payload?.error ?? message;
    } catch { /* use HTTP fallback */ }
    throw new Error(message);
  }
  if (response.status === 204) return undefined as T;
  const payload = await response.json();
  return payload?.data ?? payload ?? (undefined as T);
}
