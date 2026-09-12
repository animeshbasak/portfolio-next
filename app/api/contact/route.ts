import { Resend } from 'resend'
import { z } from 'zod'
import { createRateLimiter, readBoundedText } from '../../../lib/proof/guide'

const accept = createRateLimiter(5)
const inputSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.email().max(254),
  message: z.string().trim().min(1).max(5000),
  opportunityType: z.string().trim().min(1).max(100),
}).strict()

export async function POST(req: Request) {
  const headers = { 'Cache-Control': 'no-store' }
  if (req.headers.get('origin') && req.headers.get('origin') !== new URL(req.url).origin) {
    return Response.json({ error: 'Invalid origin' }, { status: 403, headers })
  }
  if (!req.headers.get('content-type')?.includes('application/json')) {
    return Response.json({ error: 'Use application/json.' }, { status: 415, headers })
  }
  let input: z.infer<typeof inputSchema>
  try {
    input = inputSchema.parse(JSON.parse(await readBoundedText(req.body, 24000, AbortSignal.timeout(1500))))
  } catch {
    return Response.json({ error: 'Provide a valid name, email, opportunity and message.' }, { status: 400, headers })
  }
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_EMAIL_TO) {
    return Response.json({ error: 'Email delivery is unavailable. Please use the email link.' }, { status: 503, headers })
  }
  if (!accept('instance')) return Response.json({ error: 'Please try again later.' }, { status: 429, headers: { ...headers, 'Retry-After': '60' } })
  try {
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL_TO,
      replyTo: input.email,
      subject: '[Portfolio] New visitor message',
      text: `Name: ${input.name}\nEmail: ${input.email}\nOpportunity: ${input.opportunityType}\n\n${input.message}`,
    })
    if (error) return Response.json({ error: 'Email delivery failed. Please use the email link.' }, { status: 502, headers })
    return Response.json({ success: true }, { headers })
  } catch {
    return Response.json({ error: 'Email delivery failed. Please use the email link.' }, { status: 502, headers })
  }
}
