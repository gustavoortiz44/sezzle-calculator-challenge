import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import App from './App';

function mockResponse(body: unknown, status = 200) {
  const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status }));
  vi.stubGlobal('fetch', fetch);
  return fetch;
}
async function enterNumbers(a = '10', b = '5') {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('First number'), a);
  await user.type(screen.getByLabelText('Second number'), b);
  return user;
}

describe('calculator interface', () => {
  it('renders the accessible form and initial result', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'Make it add up.' })).toBeVisible();
    expect(screen.getAllByRole('radio')).toHaveLength(4);
    expect(screen.getByRole('radio', { name: 'Add' })).toBeChecked();
    expect(screen.getByRole('region', { name: 'Calculation result' })).toHaveTextContent('Your next answer starts here.');
  });
  it('validates blank fields without a request', async () => {
    const fetch = mockResponse({ result: 0 });
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: /Calculate/ }));
    expect(screen.getAllByRole('alert')).toHaveLength(2);
    expect(screen.getByLabelText('First number')).toHaveAttribute('aria-invalid', 'true');
    expect(fetch).not.toHaveBeenCalled();
  });
  it('rejects invalid numbers and clears field errors when edited', async () => {
    const fetch = mockResponse({ result: 0 });
    render(<App />);
    const user = await enterNumbers('abc', '1e999');
    await user.click(screen.getByRole('button', { name: /Calculate/ }));
    expect(screen.getAllByRole('alert')).toHaveLength(2);
    expect(fetch).not.toHaveBeenCalled();
    await user.clear(screen.getByLabelText('First number'));
    await user.type(screen.getByLabelText('First number'), '2');
    expect(screen.getByLabelText('First number')).toHaveAttribute('aria-invalid', 'false');
  });
  it.each([
    ['Add', 'add', 15], ['Subtract', 'subtract', 5], ['Multiply', 'multiply', 50], ['Divide', 'divide', 2],
  ])('selects %s and shows the API result', async (label, operation, result) => {
    const fetch = mockResponse({ result });
    render(<App />);
    const user = await enterNumbers();
    await user.click(screen.getByRole('radio', { name: label as string }));
    await user.click(screen.getByRole('button', { name: /Calculate/ }));
    const region = screen.getByRole('region', { name: 'Calculation result' });
    await waitFor(() => expect(within(region).getByText(String(result), { selector: '.result-number' })).toBeVisible());
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ operation, a: 10, b: 5 });
  });
  it('displays a zero result with negative and decimal operands', async () => {
    const fetch = mockResponse({ result: 0 });
    render(<App />);
    const user = await enterNumbers('-0.5', '.5');
    await user.click(screen.getByRole('button', { name: /Calculate/ }));
    await waitFor(() => expect(screen.getByText('0', { selector: '.result-number' })).toBeVisible());
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toMatchObject({ a: -0.5, b: 0.5 });
  });
  it('shows division-by-zero errors and allows retry', async () => {
    const fetch = mockResponse({ error: { code: 'division_by_zero', message: 'Division by zero is not allowed.' } }, 422);
    render(<App />);
    const user = await enterNumbers('1', '0');
    await user.click(screen.getByRole('radio', { name: 'Divide' }));
    await user.click(screen.getByRole('button', { name: /Calculate/ }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Division by zero is not allowed.');
    fetch.mockResolvedValue(new Response(JSON.stringify({ result: 2 })));
    await user.clear(screen.getByLabelText('Second number'));
    await user.type(screen.getByLabelText('Second number'), '0.5');
    await user.click(screen.getByRole('button', { name: /Calculate/ }));
    await waitFor(() => expect(screen.getByText('2', { selector: '.result-number' })).toBeVisible());
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
  it.each(['First number', 'Second number'])('clears previous API errors when %s is empty on retry', async label => {
    const fetch = mockResponse({ error: { code: 'division_by_zero', message: 'Division by zero is not allowed.' } }, 422);
    render(<App />);
    const user = await enterNumbers('1', '0');
    await user.click(screen.getByRole('radio', { name: 'Divide' }));
    await user.click(screen.getByRole('button', { name: /Calculate/ }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Division by zero is not allowed.');

    await user.clear(screen.getByLabelText(label));
    await user.click(screen.getByRole('button', { name: /Calculate/ }));

    expect(screen.queryByText('Division by zero is not allowed.')).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a number.');
    expect(screen.getByLabelText(label)).toHaveAttribute('aria-invalid', 'true');
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it('shows a connection error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
    render(<App />);
    const user = await enterNumbers();
    await user.click(screen.getByRole('button', { name: /Calculate/ }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Unable to connect');
  });
  it('shows unexpected response errors', async () => {
    mockResponse({ unexpected: 2 });
    render(<App />);
    const user = await enterNumbers();
    await user.click(screen.getByRole('button', { name: /Calculate/ }));
    expect(await screen.findByRole('alert')).toHaveTextContent('unexpected response');
  });
  it('blocks duplicate submissions and restores controls after completion', async () => {
    let resolve!: (value: Response) => void;
    const fetch = vi.fn().mockImplementation(() => new Promise<Response>(done => { resolve = done; }));
    vi.stubGlobal('fetch', fetch);
    const { container } = render(<App />);
    await enterNumbers();
    act(() => { fireEvent.submit(container.querySelector('form')!); fireEvent.submit(container.querySelector('form')!); });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: /Calculating/ })).toBeDisabled();
    expect(screen.getByLabelText('First number')).toBeDisabled();
    expect(screen.getByRole('status')).toHaveTextContent('Calculating');
    await act(async () => { resolve(new Response(JSON.stringify({ result: 15 }))); });
    expect(screen.getByRole('button', { name: /Calculate/ })).toBeEnabled();
  });
  it('clears stale results while a new calculation is pending', async () => {
    const fetch = mockResponse({ result: 15 });
    render(<App />);
    const user = await enterNumbers();
    await user.click(screen.getByRole('button', { name: /Calculate/ }));
    await screen.findByText('15', { selector: '.result-number' });
    fetch.mockImplementation(() => new Promise(() => {}));
    await user.click(screen.getByRole('button', { name: /Calculate/ }));
    expect(screen.queryByText('15', { selector: '.result-number' })).not.toBeInTheDocument();
  });
  it('aborts a pending request on unmount', async () => {
    const fetch = vi.fn().mockImplementation((_url, options) => new Promise((_resolve, reject) => {
      options.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
    }));
    vi.stubGlobal('fetch', fetch);
    const { unmount } = render(<App />);
    const user = await enterNumbers();
    await user.click(screen.getByRole('button', { name: /Calculate/ }));
    await act(async () => { unmount(); });
    expect(fetch.mock.calls[0][1].signal.aborted).toBe(true);
  });
});
