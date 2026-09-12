// Server module: only the route imports this at runtime. No client component may import it.
import { compare, record, validateRequirements, validateScenario } from './engine';
import type { Comparison, Requirements, Scenario } from './engine';

export type GuideRequest = { question: string; requirements: Requirements; scenario: Scenario };
export type GuideResponse = { mode: 'authored' | 'ai' | 'scope'; answer: string; result: Comparison; citations: string[]; clarification: string | null };
type GuideOptions = { env?: Record<string, string | undefined>; fetcher?: typeof fetch; timeoutMs?: number };
const SOURCE_ID = 'source:reading-board-v1';
const CLARIFICATION = 'Does current mean verified during this visit, or is a copy up to two minutes old acceptable? Confirm with the freshness control.';
const SCOPE_ANSWER = 'This guide covers the independent, synthetic reading board: waiting time, saved-copy age and verification. It cannot access employer systems, private documents, personal records or arbitrary websites. Use the controls to compare the two supported choices.';

export function parseGuideRequest(value: unknown): GuideRequest {
  const item = record(value, ['question', 'requirements', 'scenario']);
  if (typeof item.question !== 'string' || !item.question.trim() || item.question.length > 600) throw new Error('Question must contain 1–600 characters.');
  return { question: item.question.trim(), requirements: validateRequirements(item.requirements), scenario: validateScenario(item.scenario) };
}

function questionIntent(question: string): 'freshness' | 'waiting' | 'compare' | 'unsupported' {
  // This controls scope, not data loss prevention: raw questions never enter provider payloads.
  if (/(https?:|www\.|\S+@\S+|private|confidential|employer|resume|résumé|salary|airtel|paytm|makemytrip|infosys|sparklin|secret|api.?key|password|ignore.*instruction|system prompt|poem)/i.test(question)) return 'unsupported';
  if (/current|fresh|verif|stale|age|old/i.test(question)) return 'freshness';
  if (/wait|deadline|instant|slow|fast|latency|delay|response/i.test(question)) return 'waiting';
  if (/cache|network|board|experiment|compar|strateg|choice|trade.?off|result|\b(?:this|that|it)\s+fail(?:s|ed)?\b/i.test(question)) return 'compare';
  return 'unsupported';
}

function explanations(result: Comparison): Record<string, string> {
  const { requirements: req, scenario } = result;
  const freshness = req.maxAgeSeconds === null ? 'verification during this visit' : `a maximum verification age of ${req.maxAgeSeconds} seconds`;
  const verdicts = {
    'cache-first': 'Cache-first meets both requirements in this scenario.',
    'network-first': 'Network-first meets both requirements in this scenario.',
    both: 'Both choices meet both requirements in this scenario.',
    neither: 'Neither offered choice meets both requirements in this scenario.',
  };
  return {
    'cache-display': `Cache-first displays immediately with a visible age of ${scenario.cacheAgeSeconds} seconds. Its background refresh completes at ${scenario.responseMs} ms; that does not erase a first-display freshness failure.`,
    'network-display': `Network-first displays a copy verified this visit at ${scenario.responseMs} ms, against a ${req.deadlineMs} ms waiting deadline.`,
    'requirement': `The shared freshness requirement is ${freshness}. Freshness is checked at first display; zero seconds old is distinct from verified this visit.`,
    'verdict': verdicts[result.verdict],
    'search-scope': 'The challenge searches saved-copy ages 0, 45 and 121 seconds, each with response delays 80, 800 and 1500 ms. Successful responses only; an empty search is not a universal guarantee.',
  };
}

/** Reads bounded UTF-8 payloads without trusting Content-Length. Caller owns timeout. */
export async function readBoundedText(body: ReadableStream<Uint8Array> | null, maxBytes: number, signal?: AbortSignal): Promise<string> {
  if (!body) return '';
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let output = '';
  const abort = () => { void reader.cancel().catch(() => undefined); };
  signal?.addEventListener('abort', abort, { once: true });
  try {
    while (true) {
      if (signal?.aborted) throw new Error('Request timed out.');
      const chunk = await reader.read();
      if (signal?.aborted) throw new Error('Request timed out.');
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > maxBytes) { await reader.cancel(); throw new Error('Payload too large.'); }
      output += decoder.decode(chunk.value, { stream: true });
    }
    return output + decoder.decode();
  } finally { signal?.removeEventListener('abort', abort); reader.releaseLock(); }
}

type Selection = { verdict: Comparison['verdict']; explanationIds: string[]; citations: string[]; clarificationId: 'freshness' | null };
function parseSelection(text: string, result: Comparison): Selection {
  const item = record(JSON.parse(text), ['verdict', 'explanationIds', 'citations', 'clarificationId']);
  const allowed = explanations(result);
  const citations = ['result:cache-first', 'result:network-first', SOURCE_ID];
  if (item.verdict !== result.verdict || (item.clarificationId !== 'freshness' && item.clarificationId !== null)) throw new Error('Ungrounded guide result.');
  if (!Array.isArray(item.explanationIds) || item.explanationIds.length < 1 || item.explanationIds.length > 4 || item.explanationIds.some(id => typeof id !== 'string' || !Object.hasOwn(allowed, id))) throw new Error('Unknown explanation.');
  if (!Array.isArray(item.citations) || item.citations.length !== 3 || new Set(item.citations).size !== 3 || item.citations.some(id => !citations.includes(id))) throw new Error('Unknown evidence.');
  return item as Selection;
}

async function selectWithProvider(
  url: string, token: string, provider: 'groq' | 'cloudflare', payload: object,
  result: Comparison, fetcher: typeof fetch, timeoutMs: number,
): Promise<Selection> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const operation = async () => {
    const response = await fetcher(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload), signal: controller.signal, redirect: 'error', cache: 'no-store' });
    if (!response.ok) { void response.body?.cancel(); throw new Error('Provider unavailable.'); }
    const body = JSON.parse(await readBoundedText(response.body, 16384, controller.signal));
    const content = provider === 'groq' ? body?.choices?.[0]?.message?.content : (body?.success === true ? body?.result?.response : null);
    if (typeof content !== 'string' || content.length > 6000) throw new Error('Invalid provider response.');
    return parseSelection(content, result);
  };
  try {
    return await Promise.race([operation(), new Promise<never>((_, reject) => { timer = setTimeout(() => { controller.abort(); reject(new Error('Provider timed out.')); }, timeoutMs); })]);
  } finally { if (timer) clearTimeout(timer); }
}

export async function guide(input: GuideRequest, options: GuideOptions = {}): Promise<GuideResponse> {
  if (typeof window !== 'undefined') throw new Error('Guide providers are server-only.');
  const request = parseGuideRequest(input);
  const result = compare(request.requirements, request.scenario);
  const intent = questionIntent(request.question);
  const clauses = explanations(result);
  const local: GuideResponse = { mode: 'authored', answer: `${clauses.verdict} ${clauses['cache-display']} ${clauses['network-display']}`, result, citations: ['result:cache-first', 'result:network-first', SOURCE_ID], clarification: intent === 'freshness' ? CLARIFICATION : null };
  if (intent === 'unsupported') return { ...local, mode: 'scope', answer: SCOPE_ANSWER, clarification: null };
  const env = options.env ?? process.env;
  if (env.PROOF_AI_ENABLED !== 'true') return local;

  // Only an enumerated intent, synthetic settings/results and authored public clauses leave the server.
  // The model selects wording IDs; no provider-generated prose or code is executed or published.
  const messages = [
    { role: 'system', content: 'Select a concise guide for this synthetic reading-board experiment. Return JSON only with exactly verdict, explanationIds, citations, clarificationId. explanationIds must be an array containing one to four exact strings from allowedExplanationIds, for example ["cache-display","network-display"]. Never return numeric IDs or array positions. citations must contain all three supplied citation strings. clarificationId must be "freshness" or null. Copy the trusted verdict exactly. Do not invent IDs. Select freshness clarification if the intent is freshness. All data are synthetic. You have no biography, employer or website context.' },
    { role: 'user', content: JSON.stringify({ intent, result, allowedExplanationIds: Object.keys(clauses), explanations: clauses, citations: local.citations }) },
  ];
  const providers: { url: string; token: string; name: 'groq' | 'cloudflare'; payload: object }[] = [];
  if (env.PROOF_GROQ_FREE_PLAN_CONFIRMED === 'true' && env.GROQ_API_KEY) providers.push({ name: 'groq', url: 'https://api.groq.com/openai/v1/chat/completions', token: env.GROQ_API_KEY, payload: { model: 'openai/gpt-oss-20b', messages, max_completion_tokens: 600, reasoning_effort: 'low', temperature: 0, response_format: { type: 'json_object' } } });
  if (env.PROOF_CLOUDFLARE_FREE_PLAN_CONFIRMED === 'true' && env.CLOUDFLARE_API_TOKEN && /^[a-f0-9]{32}$/i.test(env.CLOUDFLARE_ACCOUNT_ID ?? '')) providers.push({ name: 'cloudflare', url: `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.1-8b-instruct-fast`, token: env.CLOUDFLARE_API_TOKEN, payload: { messages, max_tokens: 350, temperature: 0, response_format: { type: 'json_object' } } });
  const timeout = Number.isFinite(options.timeoutMs) ? Math.max(1, Math.min(4500, options.timeoutMs!)) : 4500;
  const end = Date.now() + timeout;
  for (const [index, provider] of providers.entries()) {
    const remaining = end - Date.now();
    if (remaining <= 0) break;
    try {
      const selection = await selectWithProvider(provider.url, provider.token, provider.name, provider.payload, result, options.fetcher ?? fetch, Math.max(1, Math.floor(remaining / (providers.length - index))));
      return { ...local, mode: 'ai', answer: `${clauses.verdict} ${[...new Set(selection.explanationIds)].filter(id => id !== 'verdict').map(id => clauses[id]).join(' ')}`.trim(), citations: selection.citations, clarification: selection.clarificationId === 'freshness' ? CLARIFICATION : local.clarification };
    } catch { /* Fail closed to the next free-configured provider, then the authored guide. Never expose provider errors. */ }
  }
  return local;
}

/** Best effort per-instance protection, not a billing control or distributed quota. */
export function createRateLimiter(limit = 8, windowMs = 60000) {
  const buckets = new Map<string, { count: number; start: number }>();
  return (key: string, now = Date.now()): boolean => {
    for (const [id, bucket] of buckets) if (now - bucket.start >= windowMs) buckets.delete(id);
    const bucket = buckets.get(key);
    if (!bucket) {
      if (buckets.size >= 2000) return false;
      buckets.set(key, { count: 1, start: now });
      return true;
    }
    if (bucket.count >= limit) return false;
    bucket.count += 1;
    return true;
  };
}
