import test from 'node:test';
import assert from 'node:assert/strict';
const brief = await import('../lib/services/onboarding.ts');

test('accepts the fictional example and preserves every entered character in the brief', () => {
  const input = {...brief.DEMO_INTAKE, goal: '  Keep é & ₹ intact.\nSecond line: [draft](https://example.test)  '};
  const result = brief.validateIntake(input);
  assert.equal(result.ok, true);
  assert.deepEqual(result.value, input);
  const markdown = brief.createKickoffBrief(input);
  for (const value of Object.values(input)) assert.ok(markdown.includes(value));
  assert.match(markdown, /Draft for human review/);
  assert.match(markdown, /Not agreed delivery dates/);
});

test('rejects missing, non-string, whitespace-only and oversized required details', () => {
  for (const input of [null, [], {}, {...brief.DEMO_INTAKE, agency: '  '}, {...brief.DEMO_INTAKE, goal: 2}, {...brief.DEMO_INTAKE, tools: 'x'.repeat(241)}]) {
    assert.equal(brief.validateIntake(input).ok, false);
    assert.throws(() => brief.createKickoffBrief(input), /Check the intake fields/);
  }
});

test('enforces each field boundary without silently truncating or filling missing facts', () => {
  for (const field of brief.INTAKE_FIELDS) {
    const atLimit = {...brief.DEMO_INTAKE, [field.key]: 'x'.repeat(field.maxLength)};
    assert.equal(brief.validateIntake(atLimit).ok, true, field.key);
    const tooLong = {...atLimit, [field.key]: atLimit[field.key] + 'x'};
    assert.equal(brief.validateIntake(tooLong).ok, false, field.key);
  }
  const markdown = brief.createKickoffBrief({...brief.DEMO_INTAKE, targetDate: '', approvals: '', blockers: ''});
  assert.equal((markdown.match(/Not provided — confirm at kickoff\./g) || []).length, 3);
  assert.match(markdown, /\[ \] Confirm/);
});

test('keeps Markdown and HTML-like input inside a literal block in the download', () => {
  const goal = '```\n# Unreviewed heading\n<script>alert(1)</script>\n````';
  const markdown = brief.createKickoffBrief({...brief.DEMO_INTAKE, goal});
  assert.ok(markdown.includes('`````text\n' + goal + '\n`````'));
  assert.ok(markdown.includes('## Review checklist'));
});

test('email draft uses the published address and encodes user content as body text', () => {
  const input = {...brief.DEMO_INTAKE, agency: 'Studio & Co?bcc=other@example.test', goal: 'Keep #1 + ₹15,000\nNew line & subject=changed'};
  const url = new URL(brief.createInquiryMailto(input));
  assert.equal(url.protocol, 'mailto:');
  assert.equal(url.pathname, 'animeshsbasak@gmail.com');
  assert.deepEqual([...url.searchParams.keys()], ['subject', 'body']);
  assert.equal(url.searchParams.get('subject'), 'Client onboarding workflow sprint enquiry');
  assert.ok(url.searchParams.get('body').includes(input.agency));
  assert.ok(url.searchParams.get('body').includes(input.goal));
  assert.match(url.searchParams.get('body'), /attach the downloaded brief/);
});
