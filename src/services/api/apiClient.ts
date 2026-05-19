import { Platform } from 'react-native';

import { normalizeApiError } from './apiError';
import { session } from './session';

declare const process:
  | {
      env?: Record<string, string | undefined>;
    }
  | undefined;

export const LOCAL_BACKEND_URLS = {
  androidEmulator: 'http://10.0.2.2:3000/api',
  browserOrLocalMachine: 'http://localhost:3000/api',
  physicalDeviceTemplate: 'http://<LAN_IP>:3000/api',
} as const;

export type QueryValue = string | number | boolean | null | undefined;
export type QueryParams = Record<string, QueryValue | QueryValue[]>;

export type RequestOptions = {
  query?: QueryParams;
  body?: unknown;
  headers?: Record<string, string>;
  withCurrentUser?: boolean;
};

const DEFAULT_API_BASE_URL =
  Platform.OS === 'android'
    ? LOCAL_BACKEND_URLS.androidEmulator
    : LOCAL_BACKEND_URLS.browserOrLocalMachine;

function normalizeBaseUrl(baseUrl: string): string {
  const trimmed = baseUrl.replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
}

export function getApiBaseUrl(): string {
  return normalizeBaseUrl(
    process?.env?.EXPO_PUBLIC_API_BASE_URL ??
      process?.env?.API_BASE_URL ??
      DEFAULT_API_BASE_URL,
  );
}

function normalizePath(path: string): string {
  const withoutOrigin = path.replace(/^https?:\/\/[^/]+/i, '');
  const withoutApi = withoutOrigin.replace(/^\/api(?=\/|$)/, '');
  return withoutApi.startsWith('/') ? withoutApi : `/${withoutApi}`;
}

function appendQuery(url: URL, query?: QueryParams): void {
  if (!query) return;

  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => {
        if (entry !== null && entry !== undefined) {
          url.searchParams.append(key, String(entry));
        }
      });
      return;
    }

    if (value !== null && value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });
}

async function buildUrl(path: string, options: RequestOptions): Promise<string> {
  const baseUrl = getApiBaseUrl();
  const url = new URL(`${baseUrl}${normalizePath(path)}`);
  appendQuery(url, options.query);

  if (options.withCurrentUser && !url.searchParams.has('user_id')) {
    url.searchParams.set('user_id', await session.getCurrentUserId());
  }

  return url.toString();
}

async function parseResponse(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined;

  const text = await response.text();
  if (!text) return undefined;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const token = await session.getAccessToken();
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...options.headers,
  };

  let body: BodyInit | undefined;
  if (options.body !== undefined) {
    headers['Content-Type'] = headers['Content-Type'] ?? 'application/json';
    body = JSON.stringify(options.body);
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(await buildUrl(path, options), {
    method,
    headers,
    body,
  });
  const parsed = await parseResponse(response);

  if (!response.ok) {
    throw normalizeApiError(response.status, parsed);
  }

  return parsed as T;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>('GET', path, options),
  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'body'>) =>
    request<T>('POST', path, { ...options, body }),
  put: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'body'>) =>
    request<T>('PUT', path, { ...options, body }),
  patch: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'body'>) =>
    request<T>('PATCH', path, { ...options, body }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>('DELETE', path, options),
};
