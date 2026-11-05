export type Operation = 'add' | 'subtract' | 'multiply' | 'divide';
export type Calculation = { operation: Operation; a: number; b: number };

export class ApiError extends Error {
  constructor(message: string, public readonly status: number, public readonly code: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function calculate(input: Calculation, signal?: AbortSignal): Promise<number> {
  const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/+$/, '');
  let response: Response;
  try {
    response = await fetch(`${baseUrl}/api/v1/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      signal,
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new Error('Unable to connect to the calculator. Check your connection and try again.');
  }

  let body: unknown;
  try { body = await response.json(); } catch {
    throw new Error('The calculator returned an unexpected response. Please try again.');
  }
  if (!response.ok) {
    if (typeof body === 'object' && body !== null && 'error' in body) {
      const detail = body.error;
      if (typeof detail === 'object' && detail !== null && 'message' in detail &&
          typeof detail.message === 'string' && detail.message.trim() &&
          'code' in detail && typeof detail.code === 'string') {
        throw new ApiError(detail.message, response.status, detail.code);
      }
    }
    throw new ApiError('The calculation failed. Please try again.', response.status, 'unexpected_error');
  }
  if (typeof body !== 'object' || body === null || !('result' in body) ||
      typeof body.result !== 'number' || !Number.isFinite(body.result)) {
    throw new Error('The calculator returned an unexpected response. Please try again.');
  }
  return body.result;
}
