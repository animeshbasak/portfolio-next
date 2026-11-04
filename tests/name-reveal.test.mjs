import test from 'node:test';
import assert from 'node:assert/strict';
import {NAME_ROWS, NAME_REVEAL_DURATION, namePhase} from '../lib/personal/name-reveal.ts';

test('the legacy reveal resolves each letter before starting the surname', () => {
  assert.equal(namePhase(0, 0, 399), 'hidden');
  assert.equal(namePhase(0, 0, 400), 'scrambling');
  assert.equal(namePhase(0, 0, 800), 'flash');
  assert.equal(namePhase(0, 0, 980), 'done');
  assert.equal(namePhase(0, 6, 1540), 'done');
  assert.equal(namePhase(1, 0, 1659), 'hidden');
  assert.equal(namePhase(1, 0, 1660), 'scrambling');
  assert.equal(namePhase(1, 4, 2420), 'flash');
  for (const elapsed of [NAME_REVEAL_DURATION, Infinity]) {
    NAME_ROWS.forEach((word, row) => [...word].forEach((_, index) => assert.equal(namePhase(row, index, elapsed), 'done')));
  }
});
