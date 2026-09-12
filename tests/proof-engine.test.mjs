import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
registerHooks({ resolve(specifier, context, next) {
  if (specifier.startsWith('.') && !/\.[a-z]+$/.test(specifier)) return next(`${specifier}.ts`, context);
  return next(specifier, context);
} });
const engine = await import('../lib/proof/engine.ts');
const replay = await import('../lib/proof/replay.ts');
const scenario = { cacheAgeSeconds: 45, responseMs: 800 };

test('the three approved requirement examples produce their actual winners', () => {
  for (const [deadlineMs, maxAgeSeconds, verdict] of [[150,120,'cache-first'],[150,null,'neither'],[1000,null,'network-first']]) {
    assert.equal(engine.compare({deadlineMs,maxAgeSeconds}, scenario).verdict, verdict);
  }
});
test('freshness describes first display even after background verification', () => {
  const result = engine.compare({deadlineMs:150,maxAgeSeconds:null}, {cacheAgeSeconds:0,responseMs:80});
  assert.equal(result.strategies['cache-first'].predicates.freshness, false);
  assert.deepEqual(result.strategies['cache-first'].failedPredicates, ['freshness']);
  assert.equal(result.strategies['network-first'].verifiedThisVisit,true);
  assert.ok(result.events.some(e => e.strategy === 'cache-first' && e.kind === 'verified' && e.atMs === 80));
});
test('inclusive deadline and maximum age boundaries can admit both strategies', () => {
  const result = engine.compare({deadlineMs:800,maxAgeSeconds:45},scenario);
  assert.equal(result.verdict,'both');
  assert.equal(result.strategies['cache-first'].displayAtMs,0);
  assert.equal(result.strategies['network-first'].displayAtMs,800);
});
test('events are stable, unique, time ordered and mark the first missed deadline', () => {
  const result = engine.compare({deadlineMs:150,maxAgeSeconds:120},scenario);
  assert.deepEqual(result,engine.compare({deadlineMs:150,maxAgeSeconds:120},scenario));
  assert.equal(new Set(result.events.map(e=>e.id)).size,result.events.length);
  assert.deepEqual(result.events.map(e=>e.atMs),[...result.events.map(e=>e.atMs)].sort((a,b)=>a-b));
  assert.ok(result.events.some(e=>e.kind==='violation' && e.predicate==='waiting' && e.atMs===150));
});
test('bounded challenge finds the first failing age then response, and reports honest exhaustion', () => {
  const fail = engine.searchCounterexample('cache-first',{deadlineMs:150,maxAgeSeconds:120});
  assert.deepEqual(fail.counterexample.scenario,{cacheAgeSeconds:121,responseMs:80});
  assert.deepEqual(fail.counterexample.failedPredicates,['freshness']);
  assert.equal(fail.testedScenarios.length,7);
  const empty=engine.searchCounterexample('network-first',{deadlineMs:1500,maxAgeSeconds:null});
  assert.equal(empty.counterexample,null);
  assert.equal(empty.testedScenarios.length,9);
  assert.equal(empty.message,'No counterexample found in the tested scenarios.');
});
test('malformed, nonfinite and out of bounds settings never enter the engine', () => {
  for (const deadlineMs of [NaN,Infinity,-1,60001,'150',null]) assert.throws(()=>engine.compare({deadlineMs,maxAgeSeconds:120},scenario));
  for (const maxAgeSeconds of [NaN,Infinity,-1,86401,'120']) assert.throws(()=>engine.compare({deadlineMs:150,maxAgeSeconds},scenario));
  for (const responseMs of [-1,60001,NaN]) assert.throws(()=>engine.compare({deadlineMs:150,maxAgeSeconds:120},{cacheAgeSeconds:45,responseMs}));
  assert.throws(()=>engine.compare({deadlineMs:150,maxAgeSeconds:120},{cacheAgeSeconds:86401,responseMs:80}));
  assert.throws(()=>engine.searchCounterexample('invented',{deadlineMs:150,maxAgeSeconds:120}));
});
test('replay round trip regenerates evidence and rejects versions, prompts and altered config', () => {
  const config = replay.createReplay({deadlineMs:150,maxAgeSeconds:120},scenario,'cache-first',42);
  const parsed = replay.parseReplay(replay.serializeReplay(config));
  assert.deepEqual(replay.replayComparison(parsed),engine.compare({deadlineMs:150,maxAgeSeconds:120},scenario));
  for (const bad of [{...config,experimentVersion:99},{...config,contentVersion:99},{...config,question:'private text'},{...config,seed:-1},{...config,scenario:{...scenario,responseMs:null}}]) {
    assert.throws(()=>replay.parseReplay(JSON.stringify(bad)));
  }
  assert.throws(()=>replay.parseReplay('x'.repeat(5000)));
});
