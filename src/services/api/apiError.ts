export type ApiErrorDetails = unknown;

export class ApiError extends Error {
  status: number;
  details?: ApiErrorDetails;
  raw?: unknown;

  constructor(params: {
    status: number;
    message: string;
    details?: ApiErrorDetails;
    raw?: unknown;
  }) {
    super(params.message);
    this.name = 'ApiError';
    this.status = params.status;
    this.details = params.details;
    this.raw = params.raw;
  }
}

export function normalizeApiError(status: number, raw: unknown): ApiError {
  if (raw && typeof raw === 'object') {
    const body = raw as { error?: unknown; message?: unknown; details?: unknown };
    const message =
      typeof body.error === 'string'
        ? body.error
        : typeof body.message === 'string'
          ? body.message
          : `Request failed with status ${status}`;

    return new ApiError({
      status,
      message,
      details: body.details,
      raw,
    });
  }

  return new ApiError({
    status,
    message: typeof raw === 'string' && raw.length > 0 ? raw : `Request failed with status ${status}`,
    raw,
  });
}
