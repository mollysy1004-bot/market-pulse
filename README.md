# Market Pulse

Overseas market intelligence for Chinese tech and AI brands. Choose a product
category, target market and audience segment, and get back a structured
**Market Entry Brief** grounded in real consumer discussions.

Spec: v0.3 (Feishu). This repository currently implements **Phase 1 — frontend
structure and routing with mock data.**

## Status

| Phase | Scope | State |
|-------|-------|-------|
| 1 | Frontend structure, routing, mock brief | **Done** |
| 2 | Reddit API → subreddit mapping → cache | Not started |
| 3 | Claude API analysis → structured JSON | Not started |
| 4 | End-to-end generation and deployment | Not started |

Nothing calls Reddit, Supabase or an AI API yet. Every brief on the site is
sample data and is labelled as such on the page.

## Running it

Node.js is installed at `~/.local/node` and added to your `PATH` in `~/.zshrc`.
Open a new terminal window (so the PATH change is picked up), then:

```bash
cd ~/Desktop/market-pulse
npm run dev
```

Then open http://localhost:3000

Other commands:

```bash
npm run build   # production build — run this before deploying
npm run lint    # check code style
```

## Routes

| Route | What it is |
|-------|-----------|
| `/` | Home — hero, Listen/Analyse/Act, brief generator, output preview, method |
| `/brief?category=…&market=…&audience=…` | The generated Market Entry Brief |
| `/about` | Product rationale, source choice, confidence method, scope limits |

## Where the content lives

Editing copy does not require touching the page components.

| File | Contains |
|------|----------|
| `lib/options.ts` | The three dropdowns, and the category → subreddit mapping with `UK` / `Global` locality tags |
| `lib/mockBrief.ts` | The sample brief for each of the five categories |
| `app/page.tsx` | Home page sections |
| `app/brief/page.tsx` | Brief layout — the five sections |
| `app/about/page.tsx` | About page copy |
| `app/globals.css` | Colour, type and spacing tokens |

## Design decisions worth keeping

**Evidence localities.** Every source community is tagged `UK` (participants are
explicitly UK-based) or `Global` (category-relevant, location unknown). Every
quote carries its tag. Reddit is not a representative sample of any country, and
the interface says so rather than implying otherwise.

**Section confidence.** Each section is rated High / Medium / Low with a one-line
explanation of the evidence balance behind it, e.g. "8 UK-oriented discussions
and 23 global discussions".

**Discussion-level frequency.** Barriers and competitor mentions are counted per
discussion, never per comment. One popular thread with fifty comments about
privacy is one discussion mentioning privacy, not fifty. Counting at comment
level would let a single thread manufacture a trend.

**Thin coverage is stated.** Categories with little UK-specific discussion
(3D Printer, Action Camera) show an explicit warning on the brief instead of
presenting global signals as UK findings.

**Creator Signals, not creator recommendations.** Section 4 reports observed
audience preference with the discussion pattern behind it, rather than asserting
who to hire — Reddit data supports the former and not the latter.

## Next steps

1. Register a Reddit script app (client ID + secret) at reddit.com/prefs/apps
2. Create a Supabase project (URL + anon key)
3. Get an Anthropic API key
4. Phase 2: fetch and cache Reddit posts per the mapping in `lib/options.ts`
5. Phase 3: send tagged discussions to the analysis prompt, store structured JSON
6. Phase 4: pre-generate briefs for a set of representative combinations so the
   deployed demo is instant, free to serve, and cannot fail live

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4
