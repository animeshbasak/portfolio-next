import { boundedNumber, compare, record, validateRequirements, validateScenario, validateStrategy } from './engine';
import type { Requirements, Scenario, Strategy } from './engine';

export type Replay = { experimentVersion: 1; contentVersion: 1; seed: number; requirements: Requirements; scenario: Scenario; strategy: Strategy };
export const REPLAY_STORAGE_KEY = 'portfolio:proof:replay:v1';

export function createReplay(requirements: Requirements, scenario: Scenario, strategy: Strategy, seed = 0): Replay {
  boundedNumber(seed, 4294967295);
  if (!Number.isInteger(seed)) throw new Error('Replay seed must be an integer.');
  return { experimentVersion: 1, contentVersion: 1, seed, requirements: validateRequirements(requirements), scenario: validateScenario(scenario), strategy: validateStrategy(strategy) };
}
function validateReplay(value: unknown): Replay {
  const item = record(value, ['experimentVersion', 'contentVersion', 'seed', 'requirements', 'scenario', 'strategy']);
  if (item.experimentVersion !== 1 || item.contentVersion !== 1) throw new Error('Unsupported replay version.');
  return createReplay(validateRequirements(item.requirements), validateScenario(item.scenario), validateStrategy(item.strategy), boundedNumber(item.seed, 4294967295));
}
export function serializeReplay(replay: Replay): string { return JSON.stringify(validateReplay(replay)); }
export function parseReplay(json: string): Replay {
  if (typeof json !== 'string' || json.length > 4096) throw new Error('Replay exceeds its size limit.');
  return validateReplay(JSON.parse(json));
}
export function replayComparison(replay: Replay) {
  const valid = validateReplay(replay);
  return compare(valid.requirements, valid.scenario);
}
