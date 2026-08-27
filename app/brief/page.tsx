import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { EvidencePanel } from "@/components/EvidencePanel";
import { PullQuote } from "@/components/Quote";
import { ConfidenceBadge, LocalityTag, SectionNumber } from "@/components/Tags";
import { getBrief } from "@/lib/mockBrief";
import {
  AUDIENCES,
  CATEGORIES,
  MARKETS,
  SUBREDDIT_MAP,
  THIN_UK_COVERAGE,
  labelFor,
  type CategoryId,
} from "@/lib/options";

export const metadata: Metadata = {
  title: "Market Entry Brief — Market Pulse",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function SectionShell({
  n,
  title,
  purpose,
  children,
}: {
  n: string;
  title: string;
  purpose: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-rule py-16">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-16">
        <div className="lg:sticky lg:top-10 lg:self-start">
          <SectionNumber n={n} />
          <h2 className="mt-2.5 font-display text-[26px] leading-[1.2] font-medium tracking-[-0.01em]">
            {title}
          </h2>
          <p className="mt-3 text-[14px] leading-[1.6] text-muted">{purpose}</p>
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

export default async function BriefPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const categoryId = first(params.category) ?? "ai-app";
  const marketId = first(params.market) ?? "uk";
  const audienceId = first(params.audience) ?? "students";

  const brief = getBrief(categoryId);
  const categoryLabel = labelFor(CATEGORIES, brief.categoryId);
  const marketLabel = labelFor(MARKETS, marketId);
  const audienceLabel = labelFor(AUDIENCES, audienceId);

  const subreddits = SUBREDDIT_MAP[brief.categoryId as CategoryId];
  const thinCoverage = THIN_UK_COVERAGE.includes(brief.categoryId as CategoryId);

  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 lg:px-10">
        {/* Brief header */}
        <div className="pt-16 pb-12">
          <SectionNumber n="Market entry brief" />
          <h1 className="mt-4 font-display text-[36px] leading-[1.12] font-medium tracking-[-0.02em] text-balance sm:text-[46px]">
            {categoryLabel} <span className="text-muted">×</span> {marketLabel}{" "}
            <span className="text-muted">×</span> {audienceLabel}
          </h1>

          <dl className="mt-10 grid gap-x-10 gap-y-6 border-t border-rule pt-7 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="font-mono text-[11px] tracking-[0.1em] text-muted uppercase">
                Discussions analysed
              </dt>
              <dd className="mt-1.5 text-[15px] text-ink">
                {brief.discussionsAnalysed}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] tracking-[0.1em] text-muted uppercase">
                Evidence split
              </dt>
              <dd className="mt-1.5 flex items-center gap-2 text-[15px] text-ink">
                <LocalityTag locality="UK" /> {brief.ukDiscussions}
                <span className="text-rule">|</span>
                <LocalityTag locality="Global" /> {brief.globalDiscussions}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] tracking-[0.1em] text-muted uppercase">
                Data window
              </dt>
              <dd className="mt-1.5 text-[15px] text-ink">Last 90 days</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] tracking-[0.1em] text-muted uppercase">
                Sources
              </dt>
              <dd className="mt-1.5 text-[15px] text-ink">
                {subreddits.length} communities
              </dd>
            </div>
          </dl>

          {/* Honesty notice — this is sample data, not live analysis. */}
          <p className="mt-8 border-l-2 border-rule bg-surface-sunk px-5 py-4 text-[14px] leading-relaxed text-ink-soft">
            <span className="font-medium">Sample brief.</span> This prototype
            renders the brief structure using illustrative data. The Reddit
            pipeline and AI analysis are not connected yet, so the quotes and
            figures below are written examples rather than live results.
          </p>

          {thinCoverage && (
            <p className="mt-4 border-l-2 border-conf-medium bg-surface-sunk px-5 py-4 text-[14px] leading-relaxed text-ink-soft">
              <span className="font-medium">Limited UK coverage.</span> This
              category is discussed almost entirely in global communities. The
              insights below describe category-wide attitudes and have not been
              validated against UK-specific discussion.
            </p>
          )}
        </div>

        {/* 1 — Sentiment */}
        <SectionShell
          n="Section 1"
          title="Consumer sentiment"
          purpose="How this market feels about the category right now."
        >
          <p className="font-display text-[28px] leading-[1.25] font-medium tracking-[-0.01em]">
            {brief.sentiment.label} &mdash; {brief.sentiment.headline}.
          </p>
          <p className="mt-5 max-w-2xl text-[16px] leading-[1.7] text-ink-soft">
            {brief.sentiment.summary}
          </p>
          <div className="mt-9 space-y-7">
            {brief.sentiment.quotes.map((quote) => (
              <PullQuote key={quote.text} quote={quote} />
            ))}
          </div>
          <div className="mt-9">
            <ConfidenceBadge
              confidence={brief.sentiment.evidence.confidence}
              basis={brief.sentiment.evidence.basis}
            />
          </div>
          <EvidencePanel evidence={brief.sentiment.evidence} />
        </SectionShell>

        {/* 2 — Barriers */}
        <SectionShell
          n="Section 2"
          title="Key concerns & barriers"
          purpose="What is stopping adoption, ranked by how often it is raised."
        >
          <ol className="space-y-10">
            {brief.barriers.items.map((barrier, index) => (
              <li key={barrier.name}>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="font-mono text-[12px] text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-[21px] font-medium">
                    {barrier.name}
                  </h3>
                  <span className="font-mono text-[11px] tracking-[0.06em] text-muted">
                    {barrier.frequency}
                  </span>
                </div>
                <div className="mt-4 pl-0 sm:pl-9">
                  <PullQuote quote={barrier.quote} />
                  <p className="mt-4 max-w-2xl text-[15px] leading-[1.7] text-ink-soft">
                    <span className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase">
                      Implication&nbsp;&nbsp;
                    </span>
                    {barrier.implication}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-10">
            <ConfidenceBadge
              confidence={brief.barriers.evidence.confidence}
              basis={brief.barriers.evidence.basis}
            />
          </div>
          <EvidencePanel evidence={brief.barriers.evidence} />
        </SectionShell>

        {/* 3 — Content opportunities */}
        <SectionShell
          n="Section 3"
          title="Content opportunities"
          purpose="Angles worth making, each grounded in a discussion pattern."
        >
          <div className="space-y-9">
            {brief.content.items.map((angle) => (
              <article
                key={angle.hook}
                className="border border-rule bg-surface p-6 sm:p-7"
              >
                <h3 className="font-display text-[20px] leading-[1.35] font-medium">
                  &ldquo;{angle.hook}&rdquo;
                </h3>
                <p className="mt-3.5 text-[15px] leading-[1.7] text-ink-soft">
                  <span className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase">
                    Why&nbsp;&nbsp;
                  </span>
                  {angle.why}
                </p>
                <p className="mt-4 font-mono text-[11px] tracking-[0.06em] text-muted uppercase">
                  Format &middot; {angle.format}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-10">
            <ConfidenceBadge
              confidence={brief.content.evidence.confidence}
              basis={brief.content.evidence.basis}
            />
          </div>
          <EvidencePanel evidence={brief.content.evidence} />
        </SectionShell>

        {/* 4 — Creator signals */}
        <SectionShell
          n="Section 4"
          title="Creator signals"
          purpose="What the conversations reveal about who this audience listens to — observed preference, not a hiring list."
        >
          <div className="space-y-10">
            {brief.creators.items.map((signal) => (
              <article key={signal.signal}>
                <h3 className="font-display text-[20px] leading-[1.35] font-medium">
                  {signal.signal}
                </h3>
                <p className="mt-3 max-w-2xl text-[15px] leading-[1.7] text-ink-soft">
                  {signal.evidenceNote}
                </p>
                <dl className="mt-5 grid gap-x-8 gap-y-4 border-t border-rule-soft pt-4 sm:grid-cols-3">
                  <div>
                    <dt className="font-mono text-[10px] tracking-[0.1em] text-muted uppercase">
                      Fitting profile
                    </dt>
                    <dd className="mt-1 text-[14px] text-ink-soft">
                      {signal.profile}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] tracking-[0.1em] text-muted uppercase">
                      Platform
                    </dt>
                    <dd className="mt-1 text-[14px] text-ink-soft">
                      {signal.platform}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] tracking-[0.1em] text-muted uppercase">
                      Scale
                    </dt>
                    <dd className="mt-1 text-[14px] text-ink-soft">
                      {signal.scale}
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
          <div className="mt-10">
            <ConfidenceBadge
              confidence={brief.creators.evidence.confidence}
              basis={brief.creators.evidence.basis}
            />
          </div>
          <EvidencePanel evidence={brief.creators.evidence} />
        </SectionShell>

        {/* 5 — Competitive landscape */}
        <SectionShell
          n="Section 5"
          title="Competitive landscape"
          purpose="Who consumers raise unprompted, and where the gap sits."
        >
          <div className="space-y-9">
            {brief.competitive.items.map((competitor) => (
              <article
                key={competitor.name}
                className="border-t border-rule-soft pt-6 first:border-t-0 first:pt-0"
              >
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h3 className="font-display text-[21px] font-medium">
                    {competitor.name}
                  </h3>
                  <span className="font-mono text-[11px] tracking-[0.06em] text-muted">
                    mentioned in {competitor.discussions} discussions
                  </span>
                </div>
                <p className="mt-2.5 text-[15px] leading-[1.7] text-ink-soft">
                  {competitor.summary}
                </p>
                <div className="mt-5 grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.1em] text-muted uppercase">
                      Perceived strengths
                    </p>
                    <ul className="mt-2.5 space-y-2.5">
                      {competitor.strengths.map((quote) => (
                        <li
                          key={quote.text}
                          className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 text-[14px] leading-relaxed"
                        >
                          <LocalityTag locality={quote.locality} />
                          <span className="text-ink-soft italic">
                            &ldquo;{quote.text}&rdquo;
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.1em] text-muted uppercase">
                      Perceived weaknesses
                    </p>
                    <ul className="mt-2.5 space-y-2.5">
                      {competitor.weaknesses.map((quote) => (
                        <li
                          key={quote.text}
                          className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 text-[14px] leading-relaxed"
                        >
                          <LocalityTag locality={quote.locality} />
                          <span className="text-ink-soft italic">
                            &ldquo;{quote.text}&rdquo;
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 border border-rule bg-surface p-6 sm:p-7">
            <p className="font-mono text-[11px] tracking-[0.1em] text-muted uppercase">
              Identified gap
            </p>
            <p className="mt-3 text-[16px] leading-[1.7] text-ink">
              {brief.competitive.gap}
            </p>
          </div>

          <div className="mt-10">
            <ConfidenceBadge
              confidence={brief.competitive.evidence.confidence}
              basis={brief.competitive.evidence.basis}
            />
          </div>
          <EvidencePanel evidence={brief.competitive.evidence} />
        </SectionShell>

        {/* Sources */}
        <section className="border-t border-rule py-16">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-16">
            <div>
              <SectionNumber n="Appendix" />
              <h2 className="mt-2.5 font-display text-[26px] leading-[1.2] font-medium tracking-[-0.01em]">
                Communities analysed
              </h2>
              <p className="mt-3 text-[14px] leading-[1.6] text-muted">
                Where this category is discussed, and how each source is
                classified.
              </p>
            </div>
            <ul className="space-y-3.5">
              {subreddits.map((subreddit) => (
                <li
                  key={subreddit.name}
                  className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-rule-soft pb-3.5 text-[14px]"
                >
                  <LocalityTag locality={subreddit.locality} />
                  <span className="font-mono text-[13px] text-ink">
                    r/{subreddit.name}
                  </span>
                  <span className="text-ink-soft">{subreddit.note}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="border-t border-rule py-14">
          <Link
            href="/#generate"
            className="inline-flex items-center justify-center rounded-sm bg-ink px-7 py-3.5 text-[15px] font-medium text-paper transition-opacity hover:opacity-88"
          >
            Generate a new brief
          </Link>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
