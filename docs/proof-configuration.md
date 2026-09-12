# Proof Studio configuration and contract

The synthetic reading-board experiment and authored guide work without accounts, API keys, model downloads or network inference. Provider adapters are disabled by default. Local Groq activation was subsequently authorized after the operator confirmed a Free organization; the server-only credential and enablement flags live in ignored `.env.local`. Billing settings were not changed. A real local `/api/proof` request returned `mode: ai` using Groq-hosted `openai/gpt-oss-20b`. Account quotas are not independently verified. Cloudflare remains unconfigured, so the active fallback is the authored guide. Production Vercel configuration has not been changed.

Live validation exposed numeric explanation IDs from the original prompt. The provider contract now explicitly lists the allowed string IDs and gives a valid array example; strict response validation still rejects invalid selections. The 22 proof tests cover the outgoing contract, invalid output, provider errors, timeouts and authored fallback. These mocked failure tests complement the live success check; they do not establish provider uptime or future output quality.

## Engine and replay

Import client-safe functions and types from `lib/proof/engine.ts` and `lib/proof/replay.ts`. Do not import `guide.ts` into a client component: it belongs to the server route only.

```ts
type Requirements = { deadlineMs: number; maxAgeSeconds: number | null };
type Scenario = { cacheAgeSeconds: number; responseMs: number };
type Strategy = 'cache-first' | 'network-first';
```

`DEFAULT_REQUIREMENTS` is `{deadlineMs:150,maxAgeSeconds:120}`; `DEFAULT_SCENARIO` is `{cacheAgeSeconds:45,responseMs:800}`. Milliseconds must be finite in `[0,60000]`; ages must be finite in `[0,86400]`. Decimal values are allowed. Inputs are exact objects; extra or missing fields are rejected. `null` means verified during this visit, including when a saved copy has age zero.

`compare(requirements,scenario)` returns `{requirements,scenario,verdict,strategies,events}`. `strategies` is keyed by the two strategy IDs. Each result has `id`, `displayAtMs`, `displayAgeSeconds`, `verifiedThisVisit`, `predicates:{waiting,freshness}`, `passes` and `failedPredicates`. Verdict is `cache-first`, `network-first`, `both` or `neither`. Predicates evaluate **first display**. Cache-first displays immediately and refreshes at the response time; a later refresh does not erase its initial violation. The waiting deadline and age limit are inclusive. At a zero-millisecond response, the cache-first display is still ordered before its refresh and therefore was not verified this visit.

Events have `{id,atMs,strategy,kind,message,predicate?}`. Times are synthetic offsets from visit start, never measured browser performance or wall-clock timestamps. IDs and ordering are stable. A missed waiting deadline emits a violation at the deadline; a freshness violation emits at first display. Ties retain the deterministic insertion order. Rendering or replaying these events does not make a real network request.

`searchCounterexample(strategy,requirements)` returns `{strategy,requirements,testedScenarios,totalScenarios,counterexample,message}`. It searches ages `[0,45,121]`, then delays `[80,800,1500]` within each age, stopping at the first failure. `totalScenarios` is 9; `testedScenarios` contains only the actual examined prefix. `counterexample` is either null or `{scenario,result,failedPredicates}`. With no failure, the message is “No counterexample found in the tested scenarios.” All scenarios assume successful responses; these bounds are not an impossibility theorem or performance benchmark.

`createReplay(requirements,scenario,strategy,seed=0)` creates `{experimentVersion:1,contentVersion:1,seed,requirements,scenario,strategy}`. `serializeReplay`, `parseReplay` and `replayComparison` validate this contract. Seed must be a uint32 integer; this deterministic version does not use random variation. Parsing rejects unsupported versions, extra fields and strings longer than 4096 characters. Events regenerate from the exact version and settings, which prevents stored text or injected events from becoming trusted evidence. Changing event semantics requires a version bump.

The UI can store `serializeReplay(config)` under `REPLAY_STORAGE_KEY` (`portfolio:proof:replay:v1`) and recover with `parseReplay`. Catch unavailable browser storage and invalid/old data gracefully. Store only this payload, never questions, personal text, provider output, reading history or résumé material. Share links are not implemented.

## Endpoint

`POST /api/proof` accepts `application/json` with exactly `{question,requirements,scenario}`. Question length is 1–600 characters. The body is limited to 4096 bytes with a 1.5-second read timeout. An explicit cross-origin `Origin` is rejected. The server computes the comparison itself; supplied results, fetch URLs and additional fields are rejected.

Successful response: `{mode,answer,result,citations,clarification}`. `mode` is `authored`, `ai` or `scope`. Label `ai` as **AI-selected guide**: the model chooses from approved explanation IDs and a clarification ID; trusted authored clauses supply the text. It does not freely generate Animesh's opinions. A correct verdict and all three allowed evidence IDs are required. Unknown IDs, extra fields, invalid JSON or mismatched verdicts fail closed. Valid evidence IDs are `result:cache-first`, `result:network-first` and `source:reading-board-v1` (the experiment contract in this document). UI code should map these to its displayed result and source sections.

Question interpretation is intentionally bounded. The server classifies freshness, waiting or comparison intent locally. The raw question is never sent to a provider, logged by this code or saved in replay. Out-of-scope and recognized private questions return a scope answer. Provider input contains only the enumerated intent, synthetic settings/events/results and authored experiment explanations. No filesystem reads, employer context, résumé, blog body, arbitrary URL retrieval, model tools, generated code execution or conversation history enter this route. The user confirms requirement changes with visible controls; neither model nor endpoint silently changes them.

Unavailable inference returns HTTP 200 with `mode:authored`. Malformed requests return 400, cross-origin requests 403, wrong media type 415, and local request limiting 429 with `Retry-After:60`. Keep local compare/challenge/replay usable on all endpoint failures.

## Optional free-account adapters

These are **server environment variables**, never `NEXT_PUBLIC_*`. No environment file is created by this feature. Default off: omit `PROOF_AI_ENABLED` or set it to `false`.

| Variable | Purpose |
|---|---|
| `PROOF_AI_ENABLED=true` | Enables the optional configured adapter chain. |
| `PROOF_GROQ_FREE_PLAN_CONFIRMED=true` | Operator confirms this key belongs to a Free organization, with no paid route. |
| `GROQ_API_KEY` | Server-only Groq credential for that organization. |
| `PROOF_CLOUDFLARE_FREE_PLAN_CONFIRMED=true` | Operator confirms the account uses Workers Free with no paid usage route. |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID, exactly 32 hex characters. |
| `CLOUDFLARE_API_TOKEN` | Server-only token authorized for Workers AI on that account. |

A provider is skipped unless its free-plan confirmation and credentials are present. The route never creates accounts, upgrades plans, purchases credits, sets paid service tiers or routes through an AI Gateway. Confirmation flags are operator attestations, **not an API-backed billing check**. Before enabling, verify free-only status and model access in each provider dashboard. Leave adapters disabled if that cannot be verified. Rate limiting is not a spending guarantee.

The fixed chain is Groq-hosted `openai/gpt-oss-20b` at `https://api.groq.com/openai/v1/chat/completions`, then Cloudflare `@cf/meta/llama-3.1-8b-instruct-fast` at the account-scoped Workers AI REST endpoint, then the authored guide. The Groq model name is an open-weight model hosted by Groq; there is no OpenAI API call. There are no configurable fetch hosts or model names. Redirects are rejected. The adapter accepts only bounded structured selections and does not request tools or browsing.

Official documentation checked 12 September 2026: Groq lists this model in its [Free plan rate limits](https://console.groq.com/docs/rate-limits) and documents its [structured output support](https://console.groq.com/docs/structured-outputs) and [compatible endpoint](https://console.groq.com/docs/openai). Groq's Llama 3.1 8B is currently shown as Enterprise in its [model inventory](https://console.groq.com/docs/models), so it is not the free adapter default. Availability and organization limits must be rechecked before activation.

Cloudflare documents the selected model's [REST payload](https://developers.cloudflare.com/workers-ai/models/llama-3.1-8b-instruct-fast/) and [JSON mode support](https://developers.cloudflare.com/workers-ai/features/json-mode/). Its [pricing page](https://developers.cloudflare.com/workers-ai/platform/pricing/) states a 10,000-neuron daily free allocation: Workers Free requires an upgrade for more usage, while Workers Paid can bill excess usage. The no-incremental-inference-cost design therefore requires the actual Free account, not simply an account with a free allocation.

Both provider attempts share a 4.5-second total budget including body reads. Groq receives at most half the available budget when both adapters are configured; Cloudflare receives the remainder. Each provider is attempted once. Errors, 429s, timeout and invalid selections fall through. Groq output is capped at 600 completion tokens and Cloudflare at 350. Response bodies are bounded to 16 KiB. Provider errors, headers and credentials are never returned to visitors.

## Operational limits and verification

The endpoint has a per-instance memory limiter: 8 requests per visitor hash per minute, plus 30 requests total per instance per minute. It retains truncated SHA-256 hashes of the forwarded address, counts and timestamps in memory, prunes expired buckets, and caps bucket count at 2000. There is no persistent prompt or address logging in this feature. The deployment proxy must overwrite untrusted forwarded-address headers. Multiple instances, cold starts and address changes can bypass these local quotas; production abuse controls need trusted edge or shared rate limiting. Provider Free plan caps remain the cost boundary.

Run `node --experimental-strip-types --test tests/proof-*.test.mjs` on Node 22.22 or later. Tests resolve extensionless TypeScript imports through Node's registration hook, leaving Next's import conventions unchanged. The existing package lacks a module type, so Node prints a typeless-package warning; it is not a test failure. Tests cover approved verdicts, zero-age strict freshness, inclusive bounds, trace determinism, finite search, replay rejection, provider disablement/fallback/validation/timeouts, privacy scope, body validation and rate limiting. They do not prove external provider availability or deployment-scale quota behavior.
