import { createHash } from 'node:crypto';
import { createRateLimiter, guide, parseGuideRequest, readBoundedText } from '../../../lib/proof/guide';

export const runtime = 'nodejs';
export const maxDuration = 10;
const acceptVisitor = createRateLimiter();
const acceptInstance = createRateLimiter(30);
const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: 'Same-origin requests only.' }, { status: 403, headers });
  if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) return Response.json({ error: 'Use application/json.' }, { status: 415, headers });
  // On Vercel this header is normalized by the edge. Other hosts must overwrite it at their trusted proxy.
  const address = (request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown').slice(0, 128);
  const key = createHash('sha256').update(address).digest('hex').slice(0, 24);
  if (!acceptVisitor(key) || !acceptInstance('instance')) return Response.json({ error: 'Guide request limit reached. The local experiment remains available.' }, { status: 429, headers: { ...headers, 'Retry-After': '60' } });
  try {
    const text = await readBoundedText(request.body, 4096, AbortSignal.timeout(1500));
    const input = parseGuideRequest(JSON.parse(text));
    return Response.json(await guide(input), { headers });
  } catch {
    return Response.json({ error: 'Invalid request. Provide a question of 1–600 characters and bounded reading-board settings.' }, { status: 400, headers });
  }
}
