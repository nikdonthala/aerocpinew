# AeroCPI — India's Real-Time Airfare Price Intelligence Platform

AeroCPI is an automated airfare intelligence platform that collects, standardizes and analyzes
flight-price observations to generate a **real-time Airfare Price Index for India**. It is not a
flight-booking comparison site — it is a measurement system.

> ⚠️ **Current status:** the platform runs on a clearly-labelled **demo/simulated dataset** for
> prototype demonstration. No live fares are collected or displayed.

---

## Features

- **Airfare Price Index** — weighted, route-basket index with base period Jan 2025 = 100
- **Route analytics** — per-route index, MoM movement, observation counts
- **Airline comparison** — average fares, volatility, monthly movement
- **Booking-window analysis** — T+1 → T+45 advance-purchase pricing
- **Forecasting** — confidence-bounded price predictions
- **Anomaly detection** — severity-classified unusual price movements
- **AI Assistant** — natural-language Q&A grounded strictly in AeroCPI data (gpt-oss-120b)
- **Source monitor** — data-source health, quality scores, error counts
- **Methodology pages** — transparent index derivation for non-technical users

## Architecture

```
Browser (Next.js UI)
   ↓  fetch
Next.js API routes (server, rate-limited, validated)
   ↓  HTTPS, Authorization header
AI Provider (OpenAI-compatible) — gpt-oss-120b
   ↓
Structured response → grounded in AeroCPI data → UI
```

- **Frontend:** Next.js (App Router) + React 19 + Tailwind CSS 4 + Recharts
- **AI:** server-side provider abstraction (`src/lib/ai/provider.ts`) — model configurable via env
- **Data:** demo-data engine (`src/lib/demo-data.ts`) with deterministic generation

## Local Setup

```bash
npm install
npm run dev          # http://localhost:3000
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in real values:

| Variable        | Required | Purpose                                          |
| --------------- | -------- | ------------------------------------------------ |
| `AI_API_KEY`    | for AI   | Secret key for the AI provider (server-side only) |
| `AI_MODEL`      | no       | Defaults to `gpt-oss-120b`                        |
| `AI_BASE_URL`   | no       | OpenAI-compatible endpoint                        |
| `AI_PROVIDER`   | no       | Display label for the admin console               |
| `AI_TIMEOUT_MS` | no       | Provider timeout, default 30000                   |

**Never** commit `.env.local`, never prefix these with `NEXT_PUBLIC_`, and never place keys in
client code. See the in-app **AI Setup Guide** (`/admin/ai-setup`).

## AI Configuration (gpt-oss-120b)

The assistant targets `gpt-oss-120b` through any OpenAI-compatible provider. The provider is
selected entirely via environment variables — no code changes:

1. Obtain a key from a provider serving `gpt-oss-120b`
2. Set `AI_API_KEY`, `AI_MODEL=gpt-oss-120b`, `AI_BASE_URL`
3. Restart and verify at `/admin/ai-setup` (status panel calls `/api/ai/health`)

The AI is **grounded**: a server-built data snapshot is injected as the system prompt, and the
model is instructed to decline when data is unavailable. The client can never inject its own
system prompt.

## Data Pipeline

`COLLECT → VALIDATE → NORMALIZE → MATCH → STORE → ANALYZE → FORECAST → AGGREGATE → INDEX → REPORT`

- Fare normalization (base + taxes + mandatory fees, INR)
- Canonical flight matching across sources
- Booking-window and cabin-class segmentation
- Duplicate/outlier/stale-data detection hooks
- Every observation carries source, airline, flight number, route, times, fares, currency, cabin

## Index Methodology

- Weighted route basket (weights visible in `/methodology`)
- Base period Jan 2025 = 100
- Aggregation: weighted average of route-level index relatives
- "Why this number?" explanations expose base period, basket, weights and aggregation method
  without exposing internal implementation details

## Security Practices

- **Secrets** live only in server-side env vars — never in client bundles, localStorage, or git
- **Rate limiting** on all API routes (AI: 10 req/min/IP)
- **Input validation** on every user-controlled field (length, format, control chars)
- **Request size limits** (16 KB AI payloads)
- **Safe errors** — no stack traces, keys, provider details or paths reach the client
- **Security headers** — CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy
- **No `dangerouslySetInnerHTML`** — AI output rendered via escaped JSX
- **Parameterized data access** — no string-concatenated queries

Run a dependency vulnerability audit after install:

```bash
npm audit
```

## Responsible Data Acquisition Policy

When connecting real sources, AeroCPI will use:

- Official APIs and permitted/public data where available
- Respect for robots/access policies, reasonable request rates
- Caching, scheduled collection, retry logic, source monitoring
- **No** CAPTCHA bypass, IP spoofing, credential theft, or security-control evasion

## Deployment

### Vercel

1. Push the repository to GitHub
2. Import the project in Vercel (framework auto-detected: Next.js)
3. Add server-side environment variables (Project → Settings → Environment Variables):
   `AI_API_KEY`, `AI_MODEL`, `AI_BASE_URL`, `AI_PROVIDER`
4. Deploy, then smoke-test:
   - Homepage + dashboard load
   - `/api/ai/health` returns `ONLINE`
   - AI assistant answers a grounded question
   - No console errors; mobile layout renders correctly

### Production build check

```bash
npm run build && npm start
```

## Troubleshooting

| Symptom                          | Fix                                                        |
| -------------------------------- | ---------------------------------------------------------- |
| AI status `NOT_CONFIGURED`       | Set `AI_API_KEY` server-side, restart                      |
| `401/403` from provider          | Key invalid or lacks model access — rotate the key         |
| `429` responses                  | Provider quota or app rate limit hit — wait and retry      |
| Model not found                  | Verify `AI_MODEL` matches the provider's exact id          |
| Charts empty                     | Data engine is deterministic — check browser console       |

## Future Scope

- Live source connectors via official airline/OTA APIs
- Persistent storage + scheduled collection jobs
- Real forecasting models on the observation store
- National + regional index publications, alerting webhooks
