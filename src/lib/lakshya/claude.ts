import Anthropic from '@anthropic-ai/sdk';
import type {
  LakshyaJob,
  CompanyInsights,
  InterviewQuestion,
  StudyTopic,
} from '@/lib/lakshya/types';

// ---------------------------------------------------------------------------
// BYOK helpers
// ---------------------------------------------------------------------------

function makeClient(apiKey: string | undefined): Anthropic {
  return new Anthropic({ apiKey });
}

function isCreditError(err: unknown): boolean {
  const e = err as { status?: number; message?: string; error?: { type?: string } };
  if (e.status === 402) return true;
  const msg = (e.message || '').toLowerCase();
  const type = (e.error?.type || '').toLowerCase();
  return (
    msg.includes('credit') ||
    msg.includes('billing') ||
    msg.includes('quota') ||
    msg.includes('insufficient_quota') ||
    type.includes('credit') ||
    type.includes('billing')
  );
}

const CREDIT_ERROR_MSG =
  'Claude API credits exhausted. Add your own Anthropic key in Settings → API Keys to continue.';

/**
 * Runs `fn` with the env key first. If that fails with a credit/billing error,
 * falls back to the user's own BYOK key. Throws a helpful message if neither works.
 */
async function withByok<T>(
  fn: (client: Anthropic) => Promise<T>,
  byokKey?: string | null
): Promise<T> {
  const envKey = process.env.ANTHROPIC_API_KEY;

  if (envKey) {
    try {
      return await fn(makeClient(envKey));
    } catch (err) {
      if (!isCreditError(err)) throw err;
      // Credits exhausted — fall through to byok
      console.warn('[claude] Env key credits exhausted, trying BYOK key...');
    }
  }

  if (byokKey) {
    return await fn(makeClient(byokKey));
  }

  throw new Error(CREDIT_ERROR_MSG);
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ScoringResult {
  matchScore: number;
  interviewProb: number;
  decision: 'Apply Now' | 'Update First' | 'Skip';
  decisionReason: string;
  whyFit: string[];
  gaps: string[];
  resumeUpdates: string[];
  studyTopics: Array<{ topic: string; hours: number; resource: string }>;
  interviewQuestions: Array<{
    q: string;
    angle: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
  }>;
  coldMessage: string;
  isMoonshot: boolean;
  jdSummary: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function stripMarkdownFences(text: string): string {
  return text
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();
}

// ---------------------------------------------------------------------------
// claudeScore
// ---------------------------------------------------------------------------

export async function claudeScore(
  jdText: string,
  profileText: string,
  byokKey?: string | null
): Promise<ScoringResult> {
  const systemPrompt =
    'You are a precision job-resume matching engine for Indian tech professionals. Score strictly and honestly. Return ONLY valid JSON. No markdown. No text outside JSON.';

  const buildUserPrompt = (extra = '') =>
    `CANDIDATE PROFILE:
${profileText}

JOB DESCRIPTION:
${jdText}

Score using these weights:
- Tech Stack overlap: 25%
- Seniority/Title alignment: 20%
- Domain match: 15%
- Leadership/Team scope: 15%
- Salary alignment: 10%
- Location alignment: 10%
- JD keyword density: 5%

Rules:
- matchScore 0-100. Strict. 75+ = genuinely strong fit.
- isMoonshot = true only if score 60-75 AND high upside
- resumeUpdates = specific bullets to add, not vague advice
- studyTopics = only topics actually in this JD
- interviewQuestions = what THIS company asks for THIS role
- coldMessage = 150 word LinkedIn DM, peer-to-peer tone

Return this exact JSON shape:
{
  "matchScore": number,
  "interviewProb": number,
  "decision": "Apply Now" | "Update First" | "Skip",
  "decisionReason": string,
  "whyFit": string[],
  "gaps": string[],
  "resumeUpdates": string[],
  "studyTopics": [{"topic": string, "hours": number, "resource": string}],
  "interviewQuestions": [{"q": string, "angle": string, "difficulty": "Easy"|"Medium"|"Hard"}],
  "coldMessage": string,
  "isMoonshot": boolean,
  "jdSummary": string
}${extra}`;

  const attempt = async (client: Anthropic, userPrompt: string): Promise<ScoringResult> => {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const raw =
      response.content[0].type === 'text' ? response.content[0].text : '';
    const cleaned = stripMarkdownFences(raw);
    return JSON.parse(cleaned) as ScoringResult;
  };

  // First attempt — try with BYOK wrapper
  try {
    return await withByok((client) => attempt(client, buildUserPrompt()), byokKey);
  } catch (err) {
    // If credit/helpful error, rethrow immediately
    if ((err as Error).message === CREDIT_ERROR_MSG) throw err;
    // Otherwise retry once with stricter prompt
    try {
      return await withByok(
        (client) =>
          attempt(client, buildUserPrompt('\nCRITICAL: Return ONLY the JSON object, absolutely nothing else.')),
        byokKey
      );
    } catch (retryErr) {
      throw new Error(
        `claudeScore: failed to parse Claude response after retry — ${(retryErr as Error).message}`
      );
    }
  }
}

// ---------------------------------------------------------------------------
// claudeCoverLetter
// ---------------------------------------------------------------------------

export async function claudeCoverLetter(
  job: Pick<LakshyaJob, 'company' | 'role' | 'jd_text' | 'jd_summary'>,
  profileText: string,
  byokKey?: string | null
): Promise<string> {
  const userPrompt = `Write a cover letter for the following job application.

CANDIDATE PROFILE:
${profileText}

TARGET COMPANY: ${job.company}
TARGET ROLE: ${job.role}
JD SUMMARY: ${job.jd_summary || 'Not provided'}
FULL JD: ${job.jd_text || 'Not provided'}

Requirements:
- Exactly 3 paragraphs, under 300 words total
- Paragraph 1: A specific, researched hook about ${job.company} — what they're building, a recent milestone, or a known product challenge. Show you've done homework.
- Paragraph 2: Exactly two concrete metrics from the candidate's career history that are directly relevant to this role. Lead with numbers.
- Paragraph 3: A confident, direct ask — what you bring, what you want. No hedging.

BANNED phrases (never use any of these):
- "I am writing to"
- "passionate about"
- "team player"
- "hard worker"
- "synergy"

Return only the cover letter text. No subject line. No salutation header. No meta-commentary.`;

  const result = await withByok(async (client) => {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: userPrompt }],
    });

    if (response.content[0].type !== 'text') {
      throw new Error('claudeCoverLetter: unexpected response type from Claude');
    }
    return response.content[0].text.trim();
  }, byokKey);

  return result;
}

// ---------------------------------------------------------------------------
// claudeColdMessage
// ---------------------------------------------------------------------------

export async function claudeColdMessage(
  job: Pick<LakshyaJob, 'company' | 'role' | 'jd_text'>,
  profileText: string,
  byokKey?: string | null
): Promise<string> {
  const userPrompt = `Write a LinkedIn cold DM for a job application.

SENDER PROFILE:
${profileText}

TARGET COMPANY: ${job.company}
TARGET ROLE: ${job.role}
JD CONTEXT: ${job.jd_text ? job.jd_text.slice(0, 500) : 'Not provided'}

Requirements:
- Max 150 words
- Peer-to-peer tone — engineer to engineer, not applicant to gatekeeper
- One specific thing about the company or role that shows you've done research
- One concrete metric from your background
- Clear ask: a 15-min chat or referral
- No "I saw your job posting", no "I'd love to join", no corporate filler

Return only the message text. Nothing else.`;

  const result = await withByok(async (client) => {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{ role: 'user', content: userPrompt }],
    });

    if (response.content[0].type !== 'text') {
      throw new Error('claudeColdMessage: unexpected response type from Claude');
    }
    return response.content[0].text.trim();
  }, byokKey);

  return result;
}

// ---------------------------------------------------------------------------
// claudeCompanyResearch
// ---------------------------------------------------------------------------

export async function claudeCompanyResearch(
  company: string,
  role: string,
  byokKey?: string | null
): Promise<CompanyInsights> {
  const systemPrompt =
    'You are a company research assistant for job seekers. Return ONLY valid JSON. No markdown. No text outside JSON.';

  const userPrompt = `Research the company "${company}" for a candidate interviewing for the role "${role}".

Return this exact JSON shape:
{
  "about": string,
  "tech_stack": string[],
  "culture": string,
  "news": string,
  "glassdoor": string,
  "interview_process": string
}

Field guidance:
- about: 2-3 sentences covering what the company does, business model, scale
- tech_stack: array of known technologies they use
- culture: key cultural traits, work style, values based on public info
- news: most recent notable development (funding, product launch, expansion, etc.)
- glassdoor: summary of common themes from employee reviews (pros/cons)
- interview_process: typical interview stages for engineering roles at this company`;

  try {
    return await withByok(async (client) => {
      const response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      });

      const raw =
        response.content[0].type === 'text' ? response.content[0].text : '';
      const cleaned = stripMarkdownFences(raw);
      return JSON.parse(cleaned) as CompanyInsights;
    }, byokKey);
  } catch (err) {
    throw new Error(
      `claudeCompanyResearch: failed to parse Claude response for "${company}" — ${(err as Error).message}`
    );
  }
}

// ---------------------------------------------------------------------------
// claudeInterviewPrep
// ---------------------------------------------------------------------------

export async function claudeInterviewPrep(
  job: Pick<LakshyaJob, 'company' | 'role' | 'jd_text'>,
  profileText: string,
  count = 5,
  byokKey?: string | null
): Promise<InterviewQuestion[]> {
  const systemPrompt =
    'You are an interview preparation coach. Return ONLY valid JSON array. No markdown. No text outside JSON.';

  const userPrompt = `Generate ${count} interview questions for this specific role and company.

CANDIDATE PROFILE:
${profileText}

TARGET COMPANY: ${job.company}
TARGET ROLE: ${job.role}
JD TEXT: ${job.jd_text ? job.jd_text.slice(0, 1000) : 'Not provided'}

Return a JSON array with this exact shape:
[{"q": string, "angle": string, "difficulty": "Easy"|"Medium"|"Hard"}]

Requirements:
- Questions specific to ${job.company}'s known engineering challenges and product domain
- Mix of technical depth (system design, coding patterns) and behavioural
- angle = the hidden intent behind the question (what the interviewer really wants to know)
- difficulty distribution: roughly 2 Easy, 2 Medium, 1 Hard per 5 questions`;

  try {
    return await withByok(async (client) => {
      const response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      });

      const raw =
        response.content[0].type === 'text' ? response.content[0].text : '';
      const cleaned = stripMarkdownFences(raw);
      return JSON.parse(cleaned) as InterviewQuestion[];
    }, byokKey);
  } catch (err) {
    throw new Error(
      `claudeInterviewPrep: failed to parse Claude response — ${(err as Error).message}`
    );
  }
}

// ---------------------------------------------------------------------------
// claudeSkillsGap
// ---------------------------------------------------------------------------

export async function claudeSkillsGap(
  jobs: Pick<LakshyaJob, 'jd_text'>[],
  userStack: string[],
  byokKey?: string | null
): Promise<string[]> {
  const systemPrompt =
    'You are a skills gap analyzer. Return ONLY a valid JSON array of strings. No markdown. No text outside JSON.';

  const combinedJDs = jobs
    .map((j, i) => `JD ${i + 1}:\n${(j.jd_text || '').slice(0, 500)}`)
    .join('\n\n');

  const userPrompt = `Analyze the following job descriptions and identify skills that appear frequently but are missing from the candidate's current stack.

CANDIDATE'S CURRENT TECH STACK:
${userStack.join(', ')}

JOB DESCRIPTIONS:
${combinedJDs}

Return a JSON array of missing skill strings — only skills that appear in the JDs but are absent from the candidate's stack.
Prioritize by frequency of appearance across JDs.
Be specific: "React Query" not "state management", "Kafka" not "messaging systems".

Example format: ["React Query", "Kafka", "Kubernetes", "Go"]`;

  try {
    return await withByok(async (client) => {
      const response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      });

      const raw =
        response.content[0].type === 'text' ? response.content[0].text : '';
      const cleaned = stripMarkdownFences(raw);
      return JSON.parse(cleaned) as string[];
    }, byokKey);
  } catch (err) {
    throw new Error(
      `claudeSkillsGap: failed to parse Claude response — ${(err as Error).message}`
    );
  }
}

// Satisfy StudyTopic import (used by ScoringResult inline type above)
export type { StudyTopic };
