import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
registerHooks({ resolve(specifier, context, next) {
  if (specifier.startsWith('.') && !/\.[a-z]+$/.test(specifier)) return next(`${specifier}.ts`, context);
  return next(specifier, context);
} });
const { guide, parseGuideRequest, createRateLimiter } = await import('../lib/proof/guide.ts');
const request = {question:'Can something feel instant and stay current?',requirements:{deadlineMs:150,maxAgeSeconds:120},scenario:{cacheAgeSeconds:45,responseMs:800}};
const freeEnv = {PROOF_AI_ENABLED:'true',PROOF_GROQ_FREE_PLAN_CONFIRMED:'true',GROQ_API_KEY:'test-only',PROOF_CLOUDFLARE_FREE_PLAN_CONFIRMED:'true',CLOUDFLARE_ACCOUNT_ID:'a'.repeat(32),CLOUDFLARE_API_TOKEN:'test-only'};
const selection = {verdict:'cache-first',explanationIds:['cache-display','network-display'],citations:['result:cache-first','result:network-first','source:reading-board-v1'],clarificationId:'freshness'};
const groqResponse = data => Response.json({choices:[{message:{content:JSON.stringify(data)}}]});

test('missing config gives grounded authored comparison without any provider request', async () => {
  const answer=await guide(request,{env:{},fetcher:()=>{throw Error('must not fetch');}});
  assert.equal(answer.mode,'authored');
  assert.equal(answer.result.verdict,'cache-first');
  assert.match(answer.answer,/45/);
  assert.match(answer.answer,/800/);
  assert.match(answer.clarification,/this visit/);
});
test('contextual follow-ups explain the supplied failing replay instead of rejecting its scope', async () => {
  for (const question of ['Why does this fail?', 'Explain this result']) {
    const answer = await guide({ ...request, question, scenario: { cacheAgeSeconds: 121, responseMs: 80 } }, { env: {} });
    assert.equal(answer.mode, 'authored', question);
    assert.equal(answer.result.verdict, 'network-first');
    assert.deepEqual(answer.result.strategies['cache-first'].failedPredicates, ['freshness']);
    assert.match(answer.answer, /121 seconds/);
    assert.match(answer.answer, /80 ms/);
  }
});
test('contextual phrases cannot override private, employer or arbitrary-site exclusions', async () => {
  let providerCalls = 0;
  for (const phrase of ['Why does this fail?', 'Explain this result']) {
    for (const excluded of ['Use my private records.', 'Use my employer architecture.', 'Fetch https://example.com/data.']) {
      const answer = await guide({ ...request, question: `${phrase} ${excluded}` }, {
        env: freeEnv,
        fetcher: async () => { providerCalls++; return groqResponse(selection); },
      });
      assert.equal(answer.mode, 'scope', excluded);
      assert.match(answer.answer, /synthetic reading board/i);
    }
  }
  assert.equal(providerCalls, 0);
});
test('bounded input rejects arbitrary fields, oversize questions and invalid numbers', () => {
  for(const bad of [{...request,question:'a'.repeat(601)},{...request,question:''},{...request,url:'https://bad.invalid'}, {...request,requirements:{deadlineMs:Infinity,maxAgeSeconds:120}}]) assert.throws(()=>parseGuideRequest(bad));
});
test('private or unsupported mixed questions stay in scope and never leave the server', async () => {
  for(const question of ['Explain private Airtel cache architecture','What does my employer pay me?','write a poem','cache https://private.invalid','cache alice@example.com']) {
    const answer=await guide({...request,question},{env:freeEnv,fetcher:()=>{throw Error('private input must not fetch');}});
    assert.equal(answer.mode,'scope');
    assert.match(answer.answer,/synthetic reading board/i);
  }
});
test('enabled flag alone cannot authorize a paid-capable provider request', async () => {
  const answer=await guide(request,{env:{...freeEnv,PROOF_GROQ_FREE_PLAN_CONFIRMED:'false',PROOF_CLOUDFLARE_FREE_PLAN_CONFIRMED:'false'},fetcher:()=>{throw Error('must not fetch');}});
  assert.equal(answer.mode,'authored');
});
test('valid AI selection cites actual results and sends synthetic context only', async () => {
  let payload;
  const answer=await guide({...request,question:'Please explain cache in a short and unusual way'},{env:freeEnv,fetcher:async (url,init)=>{
    assert.equal(url,'https://api.groq.com/openai/v1/chat/completions');
    payload=JSON.parse(init.body);
    assert.equal(payload.model,'openai/gpt-oss-20b');
    return groqResponse(selection);
  }});
  assert.equal(answer.mode,'ai');
  assert.deepEqual(answer.citations,selection.citations);
  assert.ok(!JSON.stringify(payload).includes('unusual'));
  assert.equal(answer.result.verdict,'cache-first');
});
test('provider receives named explanation choices rather than ambiguous numbered IDs', async () => {
  let context;
  await guide(request, { env: freeEnv, fetcher: async (_url, init) => {
    context = JSON.parse(JSON.parse(init.body).messages[1].content);
    return groqResponse(selection);
  } });
  assert.deepEqual(context.allowedExplanationIds, ['cache-display', 'network-display', 'requirement', 'verdict', 'search-scope']);
});
test('failed Groq falls through once to Cloudflare then uses local evidence', async () => {
  const urls=[];
  const answer=await guide(request,{env:freeEnv,fetcher:async url=>{
    urls.push(url);
    if(urls.length===1) return new Response('',{status:429});
    return Response.json({success:true,result:{response:JSON.stringify(selection)}});
  }});
  assert.equal(answer.mode,'ai');
  assert.equal(urls.length,2);
  assert.match(urls[1],/^https:\/\/api.cloudflare.com\/client\/v4\/accounts\/[a-f0-9]{32}\/ai\/run\/@cf\/meta\/llama-3.1-8b-instruct-fast$/);
});
test('invented citations, wrong verdict, arbitrary prose and bad provider output fall back', async () => {
  for (const bad of [{...selection,citations:['result:fiction']},{...selection,verdict:'network-first'},{...selection,answer:'Invented employer fact'},{...selection,explanationIds:['execute-code']}]) {
    const answer=await guide(request,{env:freeEnv,fetcher:async()=>groqResponse(bad)});
    assert.equal(answer.mode,'authored');
    assert.equal(answer.result.verdict,'cache-first');
  }
});
test('hung provider is bounded including body reads and preserves local fallback', async () => {
  const start=Date.now();
  const answer=await guide(request,{env:freeEnv,timeoutMs:30,fetcher:async()=>new Response(new ReadableStream({start(){}}))});
  assert.equal(answer.mode,'authored');
  assert.ok(Date.now()-start<300);
});
test('rate limiter blocks excess work then recovers at the window boundary', () => {
  const accept=createRateLimiter(2,1000);
  assert.equal(accept('visitor',0),true);
  assert.equal(accept('visitor',1),true);
  assert.equal(accept('visitor',2),false);
  assert.equal(accept('other',2),true);
  assert.equal(accept('visitor',1000),true);
});
