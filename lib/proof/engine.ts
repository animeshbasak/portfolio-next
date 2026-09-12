export type Requirements = { deadlineMs: number; maxAgeSeconds: number | null };
export type Scenario = { cacheAgeSeconds: number; responseMs: number };
export type Strategy = 'cache-first' | 'network-first';
export type Predicate = 'waiting' | 'freshness';
export type StrategyResult = {
  id: Strategy; displayAtMs: number; displayAgeSeconds: number; verifiedThisVisit: boolean;
  predicates: Record<Predicate, boolean>; passes: boolean; failedPredicates: Predicate[];
};
export type ProofEvent = {
  id: string; atMs: number; strategy: Strategy;
  kind: 'display' | 'refresh-start' | 'verified' | 'violation'; message: string; predicate?: Predicate;
};
export type Comparison = {
  requirements: Requirements; scenario: Scenario; verdict: Strategy | 'both' | 'neither';
  strategies: Record<Strategy, StrategyResult>; events: ProofEvent[];
};
export const DEFAULT_REQUIREMENTS: Requirements = Object.freeze({ deadlineMs: 150, maxAgeSeconds: 120 });
export const DEFAULT_SCENARIO: Scenario = Object.freeze({ cacheAgeSeconds: 45, responseMs: 800 });

export function record(value: unknown, keys: string[]): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Expected settings object.');
  const item = value as Record<string, unknown>;
  if (Object.keys(item).length !== keys.length || keys.some(key => !Object.hasOwn(item, key))) throw new Error('Unexpected settings fields.');
  return item;
}
export function boundedNumber(value: unknown, max: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > max) throw new Error(`Expected a finite number between 0 and ${max}.`);
  return value;
}
export function validateRequirements(value: unknown): Requirements {
  const item = record(value, ['deadlineMs', 'maxAgeSeconds']);
  return { deadlineMs: boundedNumber(item.deadlineMs, 60000), maxAgeSeconds: item.maxAgeSeconds === null ? null : boundedNumber(item.maxAgeSeconds, 86400) };
}
export function validateScenario(value: unknown): Scenario {
  const item = record(value, ['cacheAgeSeconds', 'responseMs']);
  return { cacheAgeSeconds: boundedNumber(item.cacheAgeSeconds, 86400), responseMs: boundedNumber(item.responseMs, 60000) };
}
export function validateStrategy(value: unknown): Strategy {
  if (value !== 'cache-first' && value !== 'network-first') throw new Error('Unknown strategy.');
  return value;
}

/** Predicates apply at first display. Later refresh never erases an initial violation. */
export function compare(requirements: Requirements, scenario: Scenario): Comparison {
  const req = validateRequirements(requirements);
  const input = validateScenario(scenario);
  function evaluate(id: Strategy): StrategyResult {
    const network = id === 'network-first';
    const displayAtMs = network ? input.responseMs : 0;
    const displayAgeSeconds = network ? 0 : input.cacheAgeSeconds;
    const predicates = {
      waiting: displayAtMs <= req.deadlineMs,
      freshness: req.maxAgeSeconds === null ? network : displayAgeSeconds <= req.maxAgeSeconds,
    };
    const failedPredicates = (['waiting', 'freshness'] as Predicate[]).filter(key => !predicates[key]);
    return { id, displayAtMs, displayAgeSeconds, verifiedThisVisit: network, predicates, passes: failedPredicates.length === 0, failedPredicates };
  }
  const cache = evaluate('cache-first');
  const network = evaluate('network-first');
  const events: ProofEvent[] = [
    { id: 'cache-first:display', atMs: 0, strategy: 'cache-first', kind: 'display', message: `Saved copy appears, last verified ${input.cacheAgeSeconds} seconds ago.` },
    { id: 'cache-first:refresh-start', atMs: 0, strategy: 'cache-first', kind: 'refresh-start', message: 'Background verification starts; the saved copy remains visible.' },
    { id: 'network-first:refresh-start', atMs: 0, strategy: 'network-first', kind: 'refresh-start', message: 'Waiting for verification before showing the reading board.' },
    { id: 'cache-first:verified', atMs: input.responseMs, strategy: 'cache-first', kind: 'verified', message: 'Background response replaces the saved copy with a copy verified this visit.' },
    { id: 'network-first:verified', atMs: input.responseMs, strategy: 'network-first', kind: 'verified', message: 'The synthetic response is verified this visit.' },
    { id: 'network-first:display', atMs: input.responseMs, strategy: 'network-first', kind: 'display', message: 'The verified reading board appears for the first time.' },
  ];
  for (const strategy of [cache, network]) {
    for (const predicate of strategy.failedPredicates) {
      events.push({ id: `${strategy.id}:violation:${predicate}`, atMs: predicate === 'waiting' ? req.deadlineMs : strategy.displayAtMs,
        strategy: strategy.id, kind: 'violation', predicate,
        message: predicate === 'waiting' ? 'The waiting deadline is reached without a displayed board.' : 'The first displayed copy misses the freshness requirement.' });
    }
  }
  events.sort((a, b) => a.atMs - b.atMs);
  return { requirements: req, scenario: input, verdict: cache.passes ? (network.passes ? 'both' : 'cache-first') : (network.passes ? 'network-first' : 'neither'), strategies: { 'cache-first': cache, 'network-first': network }, events };
}

export type CounterexampleSearch = {
  strategy: Strategy; requirements: Requirements; testedScenarios: Scenario[]; totalScenarios: 9;
  counterexample: { scenario: Scenario; result: Comparison; failedPredicates: Predicate[] } | null; message: string;
};
export function searchCounterexample(strategy: Strategy, requirements: Requirements): CounterexampleSearch {
  validateStrategy(strategy);
  const req = validateRequirements(requirements);
  const testedScenarios: Scenario[] = [];
  for (const cacheAgeSeconds of [0, 45, 121]) {
    for (const responseMs of [80, 800, 1500]) {
      const scenario = { cacheAgeSeconds, responseMs };
      testedScenarios.push(scenario);
      const result = compare(req, scenario);
      const failedPredicates = result.strategies[strategy].failedPredicates;
      if (failedPredicates.length) return { strategy, requirements: req, testedScenarios, totalScenarios: 9, counterexample: { scenario, result, failedPredicates }, message: `Found a failure of ${failedPredicates.join(' and ')} in scenario ${testedScenarios.length} of 9.` };
    }
  }
  return { strategy, requirements: req, testedScenarios, totalScenarios: 9, counterexample: null, message: 'No counterexample found in the tested scenarios.' };
}
