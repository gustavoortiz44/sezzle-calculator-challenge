import { describe, expect, it, vi } from 'vitest';
import { ApiError, calculate } from './calculator';

const input = { operation: 'add' as const, a: 1, b: 2 };
function respond(body: unknown, status = 200) {
  const mock = vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status }));
  vi.stubGlobal('fetch', mock);
  return mock;
}

describe('calculator API client', () => {
  it('sends the contract to the configured backend', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.test/');
    const fetch = respond({ result: 3 });
    const controller = new AbortController();
    expect(await calculate(input, controller.signal)).toBe(3);
    expect(fetch).toHaveBeenCalledWith('https://api.example.test/api/v1/calculate', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input), signal: controller.signal,
    });
  });
  it('uses the default backend and accepts zero', async () => {
    vi.stubEnv('VITE_API_BASE_URL', '');
    const fetch = respond({ result: 0 });
    expect(await calculate(input)).toBe(0);
    expect(fetch.mock.calls[0][0]).toBe('http://localhost:8080/api/v1/calculate');
  });
  it.each([400, 404, 405, 413, 415, 422, 500])('preserves structured errors for HTTP %i', async status => {
    respond({ error: { code: 'example_error', message: 'Example error.' } }, status);
    await expect(calculate(input)).rejects.toMatchObject({ name: 'ApiError', status, code: 'example_error', message: 'Example error.' });
  });
  it.each([null, {}, { error: null }, { error: { message: 4 } }, { error: { message: '', code: 'bad' } }])('handles unexpected error bodies %j', async body => {
    respond(body, 500);
    const result = calculate(input);
    await expect(result).rejects.toBeInstanceOf(ApiError);
    await expect(result).rejects.toMatchObject({ code: 'unexpected_error', status: 500 });
  });
  it.each([null, {}, { result: '3' }, { result: null }])('rejects invalid success bodies %j', async body => {
    respond(body);
    await expect(calculate(input)).rejects.toThrow('unexpected response');
  });
  it('rejects non-finite results', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ result: Infinity }) }));
    await expect(calculate(input)).rejects.toThrow('unexpected response');
  });
  it('handles non-JSON responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('<html>error</html>', { status: 502 })));
    await expect(calculate(input)).rejects.toThrow('unexpected response');
  });
  it('reports connection failures', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    await expect(calculate(input)).rejects.toThrow('Unable to connect');
  });
  it('preserves cancellation', async () => {
    const controller = new AbortController();
    controller.abort();
    const error = new DOMException('Aborted', 'AbortError');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(error));
    await expect(calculate(input, controller.signal)).rejects.toBe(error);
  });
});
