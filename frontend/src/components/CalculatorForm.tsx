import { useState, type FormEvent } from 'react';
import type { Calculation, Operation } from '../api/calculator';
import { validateOperand } from '../validation/operands';

export const operations: { value: Operation; label: string; symbol: string }[] = [
  { value: 'add', label: 'Add', symbol: '+' },
  { value: 'subtract', label: 'Subtract', symbol: '−' },
  { value: 'multiply', label: 'Multiply', symbol: '×' },
  { value: 'divide', label: 'Divide', symbol: '÷' },
];

type Props = { pending: boolean; onAttempt: () => void; onCalculate: (input: Calculation) => void };

export function CalculatorForm({ pending, onAttempt, onCalculate }: Props) {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [operation, setOperation] = useState<Operation>('add');
  const [errors, setErrors] = useState<{ a?: string; b?: string }>({});

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    onAttempt();
    const nextErrors = { a: validateOperand(a), b: validateOperand(b) };
    setErrors(nextErrors);
    if (nextErrors.a || nextErrors.b) return;
    onCalculate({ operation, a: Number(a), b: Number(b) });
  }

  return <form onSubmit={submit} noValidate aria-busy={pending}>
    <fieldset disabled={pending}>
      <legend>Choose an operation</legend>
      <div className="operations">
        {operations.map(item => <label className="operation" key={item.value}>
          <input type="radio" name="operation" value={item.value} checked={operation === item.value}
            onChange={() => setOperation(item.value)} />
          <span><strong aria-hidden="true">{item.symbol}</strong>{item.label}</span>
        </label>)}
      </div>
      <div className="operands">
        <div>
          <label htmlFor="operand-a">First number</label>
          <input id="operand-a" type="text" inputMode="decimal" value={a} placeholder="e.g. 10"
            aria-invalid={!!errors.a} aria-describedby={errors.a ? 'error-a' : 'number-hint'}
            onChange={event => { setA(event.target.value); setErrors(current => ({ ...current, a: undefined })); }} />
          {errors.a && <p id="error-a" className="field-error" role="alert">{errors.a}</p>}
        </div>
        <div>
          <label htmlFor="operand-b">Second number</label>
          <input id="operand-b" type="text" inputMode="decimal" value={b} placeholder="e.g. 5"
            aria-invalid={!!errors.b} aria-describedby={errors.b ? 'error-b' : 'number-hint'}
            onChange={event => { setB(event.target.value); setErrors(current => ({ ...current, b: undefined })); }} />
          {errors.b && <p id="error-b" className="field-error" role="alert">{errors.b}</p>}
        </div>
      </div>
      <p id="number-hint" className="hint">Negative numbers and decimals are welcome. Use a dot for decimals.</p>
      <button type="submit">{pending ? 'Calculating…' : 'Calculate'}<span aria-hidden="true"> →</span></button>
    </fieldset>
  </form>;
}
