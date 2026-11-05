import type { Calculation } from '../api/calculator';
import { operations } from './CalculatorForm';

export type CompletedCalculation = Calculation & { result: number };

export function CalculationResult({ calculation }: { calculation: CompletedCalculation | null }) {
  return <section className="result" aria-label="Calculation result" aria-live="polite" aria-atomic="true">
    <h2>Result</h2>
    {calculation ? <>
      <p className="expression">{calculation.a} {operations.find(item => item.value === calculation.operation)?.symbol} {calculation.b} =</p>
      <p className="result-number">{String(calculation.result)}</p>
    </> : <p className="empty-result">Your next answer starts here.</p>}
  </section>;
}
