# Market Pulse

Overseas market intelligence for Chinese tech and AI brands. Choose a product
category, target market and audience segment, and get back a structured
**Market Entry Brief** grounded in real consumer discussions.

Spec: v0.3 (Feishu).

## Status

| Phase | Scope | State |
|-------|-------|-------|
| 1 | Frontend structure, routing, mock brief | **Done** |
| 2 | Reddit collection → locality tagging → corpus | **Done** |
| 3 | Claude analysis → verified structured JSON | **Done** |
| 4 | Pre-generated briefs and deployment | In progress |

`ai-app` renders a generated brief built from 23 collected discussions. The
other four categories still render sample data, and each brief states on the
page which of the two it is.

**On Reddit credentials.** Reddit's app registration could not be completed for
this account, and the public JSON endpoints now refuse unauthenticated clients
(403, or a redirect to login). Collection therefore runs in an authenticated
browser session and writes `data/raw/*.json`. That is the only step affected:
the raw dumps use the same `RawDiscussion` shape an OAuth client would produce,
so restoring credentials later replaces the transport and nothing above it.

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
| `app/brief/page.tsx` | Brief layout — the six sections |
| `app/about/page.tsx` | About page copy |
| `app/globals.css` | Colour, type and spacing tokens |

## The six sections

| # | Section | Answers | Serves |
|---|---------|---------|--------|
| 1 | Consumer Sentiment | How does this market feel about the category? | Market Research |
| 2 | Key Concerns & Barriers | What is stopping adoption? | Product Marketing |
| 3 | Content Opportunities | What content should we make? | Content / Social |
| 4 | Creator Signals | Who does this audience listen to, and why? | KOL |
| 5 | Competitive Landscape | Who are we up against, and where is the gap? | Brand / GTM |
| 6 | Positioning Suggestions | So how should we position ourselves? | Product Marketing / Brand |

Sections 1–5 report what the market is doing. Section 6 turns that into what a
brand could do about it.

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

**Section 6 must cite sections 1-5.** Positioning Suggestions is the only
section that infers rather than reports, so it is the only one that can quietly
become an opinion. Each direction carries a `supportedBy` list pointing at the
findings that produced it, typed as a non-empty tuple — a direction citing no
prior finding fails to compile. Three directions, never more: the product
promises three decisions in ten minutes, and a list of ten is a list nobody
acts on.

## Generating a brief

Collection needs an authenticated browser session (see above) and writes
per-subreddit dumps into `data/raw/`. Then:

```bash
npx tsx scripts/build-corpus.mts ai-app                       # raw -> corpus
npx tsx --env-file=.env.local scripts/generate-brief.mts ai-app students
```

`build-corpus` applies the relevance gate and locality tags; `generate-brief`
calls Claude, verifies every citation, and writes `data/briefs/<category>.json`
only if all of them check out. Add the new file to `GENERATED` in `lib/brief.ts`
to put it on the site.

## Next steps

1. Collect and generate the remaining four categories
2. Deploy — briefs are imported statically, so the deployed site makes no API
   calls and cannot fail live
3. Restore Reddit OAuth if app registration becomes possible, replacing the
   browser-session collection step

**Citations are verified, not trusted.** The model never writes a subreddit
name, locality tag or count. It cites discussion IDs, and `lib/analysis/resolve.ts`
resolves them to real sources and checks that each quote appears verbatim in the
discussion it is attributed to. A brief with a citation that does not check out
is not written. Counts on the page come from the corpus, never from the model.

**Sources are searched, not browsed.** The hot and top listings of a general
community like r/AskUK are about whatever that community is talking about, which
is almost never the category — an early corpus built that way returned threads
about student loans and canteen pizza. Each source is searched with the category
terms in `CATEGORY_QUERIES`, and a discussion qualifies only if a term appears in
its title or body.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4
