import { createHash } from 'node:crypto';
import { answerQuestion, parseAssistantRequest } from '../../../lib/assistant/engine';
import { createRateLimiter, readBoundedText } from '../../../lib/proof/guide';

export const runtime = 'nodejs';
export const maxDuration = 30;
const acceptVisitor = createRateLimiter(8);
const acceptInstance = createRateLimiter(24);
const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };

function sameOrigin(request: Request, origin: string): boolean {
  const url = new URL(request.url);
  if (origin === url.origin) return true;
  // Next can construct Request.url from its configured hostname (localhost),
  // while the browser visited 127.0.0.1. Trust the original Host only for an
  // exact loopback alias at the same port and protocol, never arbitrary hosts.
  const loopback = new Set(['localhost', '127.0.0.1', '[::1]']);
  const host = request.headers.get('host');
  if (!host || !loopback.has(url.hostname)) return false;
  try {
    const original = new URL(`${url.protocol}//${host}`);
    return original.host === host && loopback.has(original.hostname) && original.port === url.port && origin === original.origin;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if ((origin && !sameOrigin(request, origin)) || request.headers.get('sec-fetch-site') === 'cross-site') return Response.json({ error: 'Same-origin requests only.' }, { status: 403, headers });
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return Response.json({ error: 'Use application/json.' }, { status: 415, headers });
  // Per-instance protection, not authentication. A production proxy must overwrite forwarded addresses.
  const address = (request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown').slice(0, 128);
  const key = createHash('sha256').update(address).digest('hex').slice(0, 24);
  if (!acceptVisitor(key) || !acceptInstance('instance')) return Response.json({ error: 'A few too many questions at once. Please try again in a minute.' }, { status: 429, headers: { ...headers, 'Retry-After': '60' } });
  try {
    const text = await readBoundedText(request.body, 32768, AbortSignal.any([request.signal, AbortSignal.timeout(1500)]));
    const input = parseAssistantRequest(JSON.parse(text));
    return Response.json(await answerQuestion(input, { signal: request.signal }), { headers });
  } catch {
    return Response.json({ error: 'Provide a question of 1–1200 characters and up to six bounded user or assistant messages.' }, { status: 400, headers });
  }
}
