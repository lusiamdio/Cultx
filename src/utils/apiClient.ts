export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly requestId?: string,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

type ApiErrorResponse = {
  error?: { message?: string; requestId?: string };
};

export async function postJson<TResponse>(
  path: string,
  body: unknown,
  timeoutMs = 20_000,
): Promise<TResponse> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data: TResponse & ApiErrorResponse = await response.json().catch(() => ({} as TResponse & ApiErrorResponse));

    if (!response.ok) {
      throw new ApiRequestError(
        data.error?.message || "The service could not complete this request.",
        response.status,
        data.error?.requestId || response.headers.get("X-Request-Id") || undefined,
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiRequestError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiRequestError("The request took too long. Please check your connection and try again.");
    }
    throw new ApiRequestError("Unable to reach the service. Please check your connection and try again.");
  } finally {
    window.clearTimeout(timeout);
  }
}
