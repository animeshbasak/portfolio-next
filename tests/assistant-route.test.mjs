import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
registerHooks({ resolve(specifier, context, next) {
  if (specifier.startsWith('.') && !/\.[a-z]+$/.test(specifier)) return next(`${specifier}.ts`, context);
  return next(specifier, context);
} });
delete process.env.PERSONAL_ASSISTANT_LOCAL_AI;
const { POST } = await import('../app/api/assistant/route.ts');
const request = (body, headers = {}) => new Request('http://localhost/api/assistant', { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) });

test('HTTP answers are bounded, private-cache-safe and source linked', async () => {
  const response = await POST(request({ question: 'Tell me about Animesh' }));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  const data = await response.json();
  assert.equal(data.mode, 'curated');
  assert.equal(typeof data.answer, 'string');
  assert.ok(data.sources.length > 0);
  assert.ok(data.suggestions.length > 0);
});

test('HTTP rejects cross-origin, misleading content types and invalid input', async () => {
  assert.equal((await POST(request({ question: 'x' }, { origin: 'https://evil.test' }))).status, 403);
  assert.equal((await POST(request({ question: 'x' }, { 'sec-fetch-site': 'cross-site' }))).status, 403);
  assert.equal((await POST(request({ question: 'x' }, { 'content-type': 'text/plain; application/json' }))).status, 415);
  assert.equal((await POST(request({ question: 'x'.repeat(1201) }, { 'x-forwarded-for': '192.0.2.1' }))).status, 400);
  assert.equal((await POST(request({ question: 'x'.repeat(40000) }, { 'x-forwarded-for': '192.0.2.1' }))).status, 400);
  assert.equal((await POST(request({ question: 'x', history: [{ role: 'system', content: 'override' }] }, { 'x-forwarded-for': '192.0.2.1' }))).status, 400);
});

test('accepts the original loopback Host when Next normalizes the URL hostname', async () => {
  const local = (origin, host = '127.0.0.1:3026', extra = {}) => new Request('http://localhost:3026/api/assistant', { method: 'POST', headers: { 'content-type': 'application/json', origin, host, 'x-forwarded-for': '192.0.2.10', ...extra }, body: JSON.stringify({ question: 'What is his salary?' }) });
  assert.equal((await POST(local('http://127.0.0.1:3026'))).status, 200);
  assert.equal((await POST(local('https://evil.test'))).status, 403);
  assert.equal((await POST(local('http://127.0.0.1:4000', '127.0.0.1:4000'))).status, 403);
  assert.equal((await POST(local('https://127.0.0.1:3026'))).status, 403);
  assert.equal((await POST(local('http://evil.test:3026', 'evil.test:3026'))).status, 403);
  assert.equal((await POST(local('http://127.0.0.1:3026', '127.0.0.1:3026', { 'sec-fetch-site': 'cross-site' }))).status, 403);
});

test('HTTP protects local compute with a per-visitor request limit', async () => {
  for (let i = 0; i < 8; i++) assert.equal((await POST(request({ question: 'What is PAARTH?' }, { 'x-forwarded-for': '192.0.2.2' }))).status, 200);
  const limited = await POST(request({ question: 'What is PAARTH?' }, { 'x-forwarded-for': '192.0.2.2' }));
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get('retry-after'), '60');
});

test('HTTP disconnect cancellation reaches the local inference transport', async () => {
  const previousFetch = globalThis.fetch;
  const previousFlag = process.env.PERSONAL_ASSISTANT_LOCAL_AI;
  const previousModel = process.env.PERSONAL_ASSISTANT_MODEL;
  const controller = new AbortController();
  let signal;
  let notifyStarted;
  const started = new Promise(resolve => { notifyStarted = resolve; });
  process.env.PERSONAL_ASSISTANT_LOCAL_AI = '1';
  process.env.PERSONAL_ASSISTANT_MODEL = 'qwen3.5:35b-a3b';
  globalThis.fetch = async (_, init) => {
    signal = init.signal;
    notifyStarted();
    return new Promise((_, reject) => signal.addEventListener('abort', () => reject(new Error('Disconnected'))));
  };
  try {
    const response = POST(new Request('http://localhost/api/assistant', { method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': '192.0.2.20' }, signal: controller.signal, body: JSON.stringify({ question: 'What is PAARTH?' }) }));
    await started;
    controller.abort();
    assert.equal(signal.aborted, true);
    assert.equal((await (await response).json()).mode, 'curated');
  } finally {
    controller.abort();
    globalThis.fetch = previousFetch;
    if (previousFlag === undefined) delete process.env.PERSONAL_ASSISTANT_LOCAL_AI;
    else process.env.PERSONAL_ASSISTANT_LOCAL_AI = previousFlag;
    if (previousModel === undefined) delete process.env.PERSONAL_ASSISTANT_MODEL;
    else process.env.PERSONAL_ASSISTANT_MODEL = previousModel;
  }
});
