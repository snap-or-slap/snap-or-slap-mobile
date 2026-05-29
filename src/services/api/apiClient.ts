import { Platform } from 'react-native';

import { normalizeApiError } from './apiError';
import { session } from './session';

declare const process: {
  env: {
    EXPO_PUBLIC_API_BASE_URL?: string;
  };
};

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
  isMultipart?: boolean;
};

const ENV_API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const DEFAULT_API_BASE_URL =
  Platform.OS === 'android'
    ? LOCAL_BACKEND_URLS.androidEmulator
    : LOCAL_BACKEND_URLS.browserOrLocalMachine;

function normalizeBaseUrl(baseUrl: string): string {
  const trimmed = baseUrl.replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
}

export function getApiBaseUrl(): string {
  const apiBaseUrl = ENV_API_BASE_URL;

  if (!apiBaseUrl) {
    console.warn(
      '[API] EXPO_PUBLIC_API_BASE_URL is missing. Falling back to local URL:',
      DEFAULT_API_BASE_URL,
    );
  }

  return normalizeBaseUrl(apiBaseUrl || DEFAULT_API_BASE_URL);
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

function isFormDataBody(body: unknown): body is FormData {
  return typeof FormData !== 'undefined' && body instanceof FormData;
}

function removeContentTypeHeader(headers: Record<string, string>): void {
  Object.keys(headers).forEach((key) => {
    if (key.toLowerCase() === 'content-type') {
      delete headers[key];
    }
  });
}

async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const token = await session.getAccessToken();

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
    ...options.headers,
  };

  let body: BodyInit | undefined;

  if (options.body !== undefined) {
    const shouldSendMultipart =
      options.isMultipart === true || isFormDataBody(options.body);

    if (shouldSendMultipart) {
      removeContentTypeHeader(headers);
      body = options.body as BodyInit;
    } else {
      headers['Content-Type'] = headers['Content-Type'] ?? 'application/json';
      body = JSON.stringify(options.body);
    }
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const finalUrl = await buildUrl(path, options);
  console.log(`[API Request] Method: ${method}, Path: ${path}, FinalURL: ${finalUrl}, HasToken: ${!!token}`);

  const response = await fetch(finalUrl, {
    method,
    headers,
    body,
  });

  const parsed = await parseResponse(response);

  console.log(`[API Response] Status: ${response.status}`);

  if (!response.ok) {
    console.error(`[API Error Response] Status: ${response.status}, Body: ${JSON.stringify(parsed)}`);
    throw normalizeApiError(response.status, parsed);
  }

  return parsed as T;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>('GET', path, options),

  post: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'body'>,
  ) => request<T>('POST', path, { ...options, body }),

  put: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'body'>,
  ) => request<T>('PUT', path, { ...options, body }),

  patch: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'body'>,
  ) => request<T>('PATCH', path, { ...options, body }),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>('DELETE', path, options),
};