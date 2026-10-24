import { appConfig } from "../../config/env";

export type ApiRequestOptions = RequestInit & {
  token?: string;
};

const JSON_CONTENT_TYPE = 'application/json';

function buildUrl(endpoint: string) {
  const baseUrl = appConfig.apiBaseUrl.replace(/\/$/, '');
  const normalized = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${normalized}`;
}

export async function apiRequest<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;

  const requestHeaders: HeadersInit = {
    Accept: JSON_CONTENT_TYPE,
    ...(rest.body instanceof FormData ? {} : { 'Content-Type': JSON_CONTENT_TYPE }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  const response = await fetch(buildUrl(endpoint), {
    ...rest,
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

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = await response.json();
  return payload?.data ?? payload ?? (undefined as T);
}
