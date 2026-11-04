import test from 'node:test';
import assert from 'node:assert/strict';

const { briefFromText, briefFromRoute, briefFromHash, SAMPLE, SKILLS } = await import('../lib/paarth/engine.ts');
const text = (row) => row.ask.map((s) => s.t).join('');

test('the sample role is answered with cited work first and the gap last', () => {
  const b = briefFromText(SAMPLE, 'hiring');
  assert.equal(b.rows.length, 7);
  assert.deepEqual(b.rows.map((r) => r.tier), ['work', 'work', 'work', 'work', 'work', 'fit', 'ask']);
  assert.equal(text(b.rows.at(-1)), 'GraphQL APIs');
  assert.ok(b.rows.slice(0, 5).every((r) => r.href), 'every shown answer links to a source');
});

test('gaps and out-of-area roles are flagged, not hidden', () => {
  const b = briefFromText('Staff Frontend Engineer, Bengaluru. 10+ years. Vue, GraphQL and AWS.', 'hiring');
  const proofs = b.rows.map((r) => r.proof);
  assert.ok(proofs.includes('He is looking at roles in Delhi NCR.'));
  assert.ok(proofs.includes('He has 7.5+ years; this asks for 10.'));
  const gap = b.rows.find((r) => r.proof === 'Not on his résumé or this page.');
  assert.equal(gap.ask.filter((s) => s.u).length, 3, 'Vue, GraphQL and AWS share one row');
});

test('a project brief is matched to his part-time hours', () => {
  const b = briefFromText('Freelance: our React app is slow with bugs. Fix performance in 6 weeks.');
  assert.equal(b.mode, 'project');
  assert.ok(b.rows.some((r) => r.proof.startsWith('About 60 to 72 hours')));
  const risky = briefFromText('Contract, full-time onsite, start immediately.', 'project');
  assert.equal(risky.rows[0].tier === 'ask' || risky.rows.some((r) => r.key === 'cap'), true);
});

test('nothing half-built is ever cited', () => {
  const all = JSON.stringify(SKILLS) + JSON.stringify(briefFromRoute('engineer')) + JSON.stringify(briefFromRoute('project')) + JSON.stringify(briefFromRoute('hiring'));
  assert.doesNotMatch(all, /lakshya|insanefit|friday|trader|insanemesh/i);
});

test('a shared link rebuilds the matches without the pasted text', () => {
  const b = briefFromHash('#brief=hiring:react,perf,gap-graphql');
  assert.equal(b.title, 'A briefing someone shared with you');
  assert.deepEqual(b.rows.map((r) => r.key), ['react', 'perf', 'gap-graphql']);
  assert.equal(b.rows[2].tier, 'ask', 'gaps travel with the link too');
  assert.equal(briefFromHash('#brief=engineer').title, 'Answers for a fellow engineer');
  assert.equal(briefFromHash('#nothing'), null);
});

test('Swift and macOS now cite Trinetra instead of a gap', () => {
  const b = briefFromText('Senior engineer. Swift and macOS experience welcome. Kotlin a plus.', 'hiring');
  assert.ok(b.rows.some((r) => r.href === '#work-trinetra'));
  assert.ok(b.rows.some((r) => r.tier === 'ask' && r.ask.some((s) => /kotlin/i.test(s.t))));
});
