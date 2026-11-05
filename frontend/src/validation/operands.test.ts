import { describe, expect, it } from 'vitest';
import { validateOperand } from './operands';

describe('validateOperand', () => {
  it.each(['0', '-0', '-2.5', '.5', '+4', '1e3', ' 2 ', '1.'])('accepts %s', value => {
    expect(validateOperand(value)).toBeUndefined();
  });
  it.each(['', '   '])('requires a number: %s', value => {
    expect(validateOperand(value)).toBe('Enter a number.');
  });
  it.each(['abc', 'Infinity', 'NaN', '1e999', '0x10', '2,5', '1e', '1 2'])('rejects %s', value => {
    expect(validateOperand(value)).toContain('finite number');
  });
});
