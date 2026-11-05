export function validateOperand(value: string): string | undefined {
  if (!value.trim()) return 'Enter a number.';
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value.trim()) ||
      !Number.isFinite(Number(value))) {
    return 'Enter a finite number using a decimal point, such as -2.5.';
  }
  return undefined;
}
