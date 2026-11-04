export const INTAKE_FIELDS = [
  {key: 'agency', label: 'Your agency', maxLength: 120, required: true, multiline: false, hint: 'An agency or studio name.'},
  {key: 'client', label: 'Client or working label', maxLength: 120, required: true, multiline: false, hint: 'Use an alias if this project is confidential.'},
  {key: 'project', label: 'Project', maxLength: 160, required: true, multiline: false, hint: 'A short name for the work.'},
  {key: 'owner', label: 'Onboarding owner', maxLength: 100, required: true, multiline: false, hint: 'A name or role; no email address needed.'},
  {key: 'goal', label: 'What should be ready at kickoff?', maxLength: 600, required: true, multiline: true, hint: 'Describe the outcome and what is usually missing.'},
  {key: 'tools', label: 'Current tools and handoffs', maxLength: 240, required: true, multiline: true, hint: 'For example: a form → a spreadsheet → a manual email.'},
  {key: 'targetDate', label: 'Preferred kickoff timing', maxLength: 80, required: false, multiline: false, hint: 'A preferred date or “to be agreed”; this is not a booking.'},
  {key: 'approvals', label: 'Who needs to review?', maxLength: 240, required: false, multiline: true, hint: 'Roles and approval steps, if known.'},
  {key: 'blockers', label: 'Open questions or constraints', maxLength: 400, required: false, multiline: true, hint: 'Missing decisions, tool limits, or anything to confirm.'},
] as const

export type IntakeKey = typeof INTAKE_FIELDS[number]['key']
export type Intake = Record<IntakeKey, string>
export type IntakeErrors = Partial<Record<IntakeKey, string>>

export const EMPTY_INTAKE: Intake = {agency: '', client: '', project: '', owner: '', goal: '', tools: '', targetDate: '', approvals: '', blockers: ''}
export const DEMO_INTAKE: Intake = {
  agency: 'Northstar Studio (fictional)', client: 'Cedar Café (fictional)', project: 'Website refresh', owner: 'Studio project lead',
  goal: 'Have the page list, approved copy, brand assets and one named reviewer ready before the design kickoff.',
  tools: 'An intake form → a shared spreadsheet → a manually reviewed kickoff email.',
  targetDate: 'To be agreed after assets are reviewed', approvals: 'The client owner approves the page list and copy; the studio lead reviews the kickoff brief.',
  blockers: 'Logo files and the final menu are still needed. Confirm who can approve copy.',
}

export function validateIntake(input: unknown): {ok: true; value: Intake} | {ok: false; errors: IntakeErrors} {
  const source = input !== null && typeof input === 'object' && !Array.isArray(input) ? input as Record<string, unknown> : {}
  const errors: IntakeErrors = {}
  const value = {...EMPTY_INTAKE}
  for (const field of INTAKE_FIELDS) {
    const entered = source[field.key]
    if (typeof entered !== 'string') errors[field.key] = `Enter ${field.label.toLowerCase()} as text.`
    else if (field.required && !entered.trim()) errors[field.key] = `${field.label} is required.`
    else if (entered.length > field.maxLength) errors[field.key] = `Use ${field.maxLength} characters or fewer.`
    else value[field.key] = entered
  }
  return Object.keys(errors).length ? {ok: false, errors} : {ok: true, value}
}

function checked(input: unknown): Intake {
  const result = validateIntake(input)
  if (!result.ok) throw new Error('Check the intake fields before generating a brief.')
  return result.value
}

// A longer fence keeps user-authored Markdown literal without changing their text.
function literal(value: string): string {
  if (!value.trim()) return 'Not provided — confirm at kickoff.'
  const fence = '`'.repeat(Math.max(3, ...Array.from(value.matchAll(/`+/g), match => match[0].length + 1)))
  return `${fence}text\n${value}\n${fence}`
}

export function createKickoffBrief(input: unknown): string {
  const intake = checked(input)
  return [
    '# Client onboarding · kickoff brief',
    'Draft for human review. This document contains supplied facts and a reusable checklist, not an agreed scope or a booked engagement.',
    '## Supplied details',
    ...INTAKE_FIELDS.map(field => `### ${field.label}\n\n${literal(intake[field.key])}`),
    'Not agreed delivery dates: the preferred timing above is a request to confirm.',
    '## Review checklist',
    '- [ ] Confirm the goal, deliverables, exclusions and acceptance criteria with the client.\n- [ ] Confirm the onboarding owner and the person who can approve the brief.\n- [ ] List missing assets and decisions; give each an owner and an agreed due date.\n- [ ] Confirm which intake form and tracker will be the source of truth.\n- [ ] Check permission and access requirements without copying credentials into this brief.\n- [ ] Review the preferred timing and agree an actual kickoff date.\n- [ ] Review every supplied detail before sharing this document.',
    '## Suggested tracker columns',
    'Client / project · Onboarding owner · Status · Missing item · Next action · Action owner · Agreed due date · Review status',
    '## Handoff checklist',
    '- [ ] Test one fictional intake through the agreed workflow.\n- [ ] Test missing information and show where a person reviews it.\n- [ ] Document how to update the form, tracker and kickoff template.\n- [ ] Confirm the delivery scope is accepted and identify any separately quoted follow-up.',
    '---\nCreated locally with the Client onboarding workflow sprint demo. Nothing has been submitted or sent. The demo does not connect your tools or create a live tracker.',
  ].join('\n\n') + '\n'
}

export function createInquiryMailto(input: unknown): string {
  const intake = checked(input)
  const body = `Hi Animesh,\n\nI would like to discuss the Client onboarding workflow sprint.\n\nAgency: ${intake.agency}\nDesired kickoff outcome:\n${intake.goal}\n\nI understand the ₹15,000 one-time pilot is a proposed price; final scope, timing and total price need confirmation before work or payment.\n\nI can attach the downloaded brief after reviewing it.\n\nThanks`
  return `mailto:animeshsbasak@gmail.com?subject=${encodeURIComponent('Client onboarding workflow sprint enquiry')}&body=${encodeURIComponent(body)}`
}
