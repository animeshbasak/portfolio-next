import { Resend } from 'resend'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Missing API Key' }, { status: 500 })
  }
  
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { name, email, message, opportunityType } = await req.json()

  // Validate
  if (!name || !email || !message || !opportunityType) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL_TO!,
      replyTo: email,
      subject: `[Portfolio] New message from ${name} — ${opportunityType}`,
      html: `
        <h2>New contact from portfolio</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Opportunity:</strong> ${opportunityType}</p>
        <p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
      `,
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Resend error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
