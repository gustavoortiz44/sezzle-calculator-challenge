import { useEffect, useRef, useState } from 'react';
import { calculate, type Calculation } from './api/calculator';
import { CalculatorForm } from './components/CalculatorForm';
import { CalculationResult, type CompletedCalculation } from './components/CalculationResult';

export default function App() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState<CompletedCalculation | null>(null);
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);

  async function handleCalculate(input: Calculation) {
    if (request.current) return;
    const controller = new AbortController();
    request.current = controller;
    setPending(true);
    setError('');
    setCompleted(null);
    try {
      const result = await calculate(input, controller.signal);
      if (!controller.signal.aborted) setCompleted({ ...input, result });
    } catch (failure) {
      if (!controller.signal.aborted) setError(failure instanceof Error ? failure.message : 'The calculation failed. Please try again.');
    } finally {
      if (!controller.signal.aborted) { request.current = null; setPending(false); }
    }
  }

  return <main>
    <header className="brand"><span className="brand-mark" aria-hidden="true">s.</span>SEZZLE <span className="brand-divider">/</span> CALCULATOR</header>
    <div className="intro"><p className="eyebrow">A LITTLE CLARITY, ONE NUMBER AT A TIME</p><h1>Make it add up.</h1><p>Four simple operations. One clear answer.</p></div>
    <div className="calculator">
      <CalculatorForm pending={pending} onAttempt={() => setError('')} onCalculate={handleCalculate} />
      {pending && <p role="status" className="hint">Calculating your answer…</p>}
      {error && <p role="alert" className="api-error">{error}</p>}
      <CalculationResult calculation={completed} />
    </div>
    <footer>Built with React & TypeScript · Calculated by Go</footer>
  </main>;
}
