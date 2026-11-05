import { afterEach, describe, expect, it, vi } from 'vitest';
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
      body: JSON.stringify(input), signal: expect.any(AbortSignal),
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
    const error = new DOMException('Aborted', 'AbortError');
    controller.abort(error);
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(error));
    await expect(calculate(input, controller.signal)).rejects.toBe(error);
  });
});

describe('request timeout and cancellation', () => {
  afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

  function pendingFetch() {
    const fetch = vi.fn().mockImplementation((_url, options) => new Promise((_resolve, reject) => {
      options.signal.addEventListener('abort', () => reject(options.signal.reason), { once: true });
    }));
    vi.stubGlobal('fetch', fetch);
    return fetch;
  }

  it('aborts after 15 seconds and removes the timer and external listener', async () => {
    vi.useFakeTimers();
    const fetch = pendingFetch();
    const external = new AbortController();
    const add = vi.spyOn(external.signal, 'addEventListener');
    const remove = vi.spyOn(external.signal, 'removeEventListener');
    const promise = calculate(input, external.signal);
    const assertion = expect(promise).rejects.toThrow('The calculation timed out. Please try again.');
    await vi.advanceTimersByTimeAsync(14_999);
    expect(fetch.mock.calls[0][1].signal.aborted).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    await assertion;
    expect(fetch.mock.calls[0][1].signal.aborted).toBe(true);
    expect(external.signal.aborted).toBe(false);
    expect(remove).toHaveBeenCalledWith('abort', add.mock.calls[0][1]);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('covers a stalled response body', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn().mockImplementation((_url, options) => Promise.resolve({
      ok: true,
      json: () => new Promise((_resolve, reject) => {
        options.signal.addEventListener('abort', () => reject(options.signal.reason), { once: true });
      }),
    })));
    const assertion = expect(calculate(input)).rejects.toThrow('timed out');
    await vi.advanceTimersByTimeAsync(15_000);
    await assertion;
    expect(vi.getTimerCount()).toBe(0);
  });

  it('preserves intentional cancellation and clears its resources', async () => {
    vi.useFakeTimers();
    const fetch = pendingFetch();
    const external = new AbortController();
    const remove = vi.spyOn(external.signal, 'removeEventListener');
    const reason = new DOMException('Unmounted', 'AbortError');
    const assertion = expect(calculate(input, external.signal)).rejects.toBe(reason);
    external.abort(reason);
    await assertion;
    await vi.advanceTimersByTimeAsync(15_000);
    expect(fetch.mock.calls[0][1].signal.reason).toBe(reason);
    expect(remove).toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('does not send a request when already cancelled', async () => {
    vi.useFakeTimers();
    const fetch = pendingFetch();
    const external = new AbortController();
    external.abort();
    await expect(calculate(input, external.signal)).rejects.toBe(external.signal.reason);
    expect(fetch).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each(['success', 'API error', 'network error', 'malformed body'])('cleans resources after %s', async outcome => {
    vi.useFakeTimers();
    const external = new AbortController();
    const add = vi.spyOn(external.signal, 'addEventListener');
    const remove = vi.spyOn(external.signal, 'removeEventListener');
    if (outcome === 'network error') vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
    else if (outcome === 'malformed body') vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('not JSON')));
    else respond(outcome === 'success' ? { result: 3 } : { error: { code: 'bad', message: 'Bad request.' } }, outcome === 'success' ? 200 : 400);
    if (outcome === 'success') expect(await calculate(input, external.signal)).toBe(3);
    else await expect(calculate(input, external.signal)).rejects.toBeInstanceOf(Error);
    expect(remove).toHaveBeenCalledWith('abort', add.mock.calls[0][1]);
    expect(vi.getTimerCount()).toBe(0);
  });
});
