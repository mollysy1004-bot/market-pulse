import Link from "next/link";
import { BriefForm } from "@/components/BriefForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SectionNumber } from "@/components/Tags";

const STAGES = [
  {
    n: "01",
    name: "Listen",
    body: "Pull recent discussions from the communities where consumers in your target market actually talk about your product category.",
  },
  {
    n: "02",
    name: "Analyse",
    body: "Identify sentiment, adoption barriers, competitor perception and the topics an audience raises without being asked.",
  },
  {
    n: "03",
    name: "Act",
    body: "Turn those signals into content angles and creator strategy that a marketing team can brief against the same day.",
  },
];

const OUTPUTS = [
  {
    title: "Consumer Sentiment",
    body: "How this market feels about the category, and the attitude underneath the score.",
    serves: "Market Research",
  },
  {
    title: "Key Concerns & Barriers",
    body: "Ranked adoption barriers with the frequency each is raised, and what it means for messaging.",
    serves: "Product Marketing",
  },
  {
    title: "Content Opportunities",
    body: "Specific angles worth making, each tied to a discussion pattern rather than a hunch.",
    serves: "Content / Social",
  },
  {
    title: "Creator Signals",
    body: "What the conversations reveal about which creators and formats this audience listens to, and why.",
    serves: "KOL",
  },
  {
    title: "Competitive Landscape",
    body: "The competitors consumers raise unprompted, how they are perceived, and where the gap sits.",
    serves: "Brand / GTM",
  },
  {
    title: "Positioning Suggestions",
    body: "Three directions a new entrant could take, each naming the findings above that produced it.",
    serves: "Product Marketing / Brand",
  },
];

const PIPELINE = [
  "Reddit conversations",
  "AI analysis",
  "Market entry brief",
  "Marketing decisions",
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pt-24 pb-20 lg:px-10 lg:pt-32">
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
              Market intelligence for globalising brands
            </p>
            <h1 className="mt-7 font-display text-[44px] leading-[1.08] font-medium tracking-[-0.02em] text-balance sm:text-[58px] lg:text-[68px]">
              Understand the market before you enter it.
            </h1>
            <p className="mt-7 max-w-xl text-[18px] leading-[1.65] text-ink-soft">
              Market Pulse turns real consumer conversations into an
              evidence-backed market entry brief — so a team entering a new
              market can start from what people there already say, not from
              what headquarters assumes.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href="#generate"
                className="inline-flex items-center justify-center rounded-sm bg-ink px-7 py-3.5 text-[15px] font-medium text-paper transition-opacity hover:opacity-88"
              >
                Explore the UK market
              </Link>
              <Link
                href="/about"
                className="text-[15px] text-ink-soft underline decoration-rule underline-offset-[5px] transition-colors hover:text-ink hover:decoration-muted"
              >
                How it works
              </Link>
            </div>
          </div>

          {/* Pipeline */}
          <ol className="mt-24 flex flex-col gap-3 border-t border-rule-soft pt-8 sm:flex-row sm:items-center sm:gap-0">
            {PIPELINE.map((step, index) => (
              <li key={step} className="flex items-center gap-3 sm:flex-1">
                <span className="font-mono text-[12px] tracking-[0.04em] text-ink-soft">
                  {step}
                </span>
                {index < PIPELINE.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="hidden flex-1 border-t border-dashed border-rule sm:block"
                  />
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* Listen / Analyse / Act */}
        <section className="border-t border-rule-soft bg-surface">
          <div className="mx-auto max-w-6xl px-6 py-24 lg:px-10">
            <h2 className="max-w-2xl font-display text-[32px] leading-[1.2] font-medium tracking-[-0.015em] text-balance sm:text-[40px]">
              From scattered conversations to marketing decisions.
            </h2>
            <div className="mt-16 grid gap-12 sm:grid-cols-3 sm:gap-10">
              {STAGES.map((stage) => (
                <div key={stage.n} className="border-t border-rule pt-6">
                  <SectionNumber n={stage.n} />
                  <h3 className="mt-3 font-display text-[23px] font-medium">
                    {stage.name}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.65] text-ink-soft">
                    {stage.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Generate */}
        <section
          id="generate"
          className="scroll-mt-8 border-t border-rule-soft"
        >
          <div className="mx-auto max-w-6xl px-6 py-24 lg:px-10">
            <div className="max-w-2xl">
              <SectionNumber n="Generate" />
              <h2 className="mt-3 font-display text-[32px] leading-[1.2] font-medium tracking-[-0.015em] sm:text-[40px]">
                Generate a market entry brief
              </h2>
              <p className="mt-4 text-[16px] leading-[1.65] text-ink-soft">
                Choose a category, a market and an audience. The brief that
                comes back is structured the same way every time, so two markets
                can be compared without re-reading the analysis.
              </p>
            </div>
            <div className="mt-2 max-w-4xl">
              <BriefForm />
            </div>
          </div>
        </section>

        {/* What you'll get */}
        <section className="border-t border-rule-soft bg-surface">
          <div className="mx-auto max-w-6xl px-6 py-24 lg:px-10">
            <div className="max-w-2xl">
              <SectionNumber n="Output" />
              <h2 className="mt-3 font-display text-[32px] leading-[1.2] font-medium tracking-[-0.015em] sm:text-[40px]">
                What you&rsquo;ll get
              </h2>
              <p className="mt-4 text-[16px] leading-[1.65] text-ink-soft">
                Six sections. The first five report what the market is doing;
                the last one turns that into what a brand could do about it.
              </p>
            </div>

            <div className="mt-14 border-t border-rule">
              {OUTPUTS.map((output) => (
                <div
                  key={output.title}
                  className="grid gap-2 border-b border-rule py-7 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_auto] sm:items-baseline sm:gap-8"
                >
                  <h3 className="font-display text-[21px] font-medium">
                    {output.title}
                  </h3>
                  <p className="text-[15px] leading-[1.65] text-ink-soft">
                    {output.body}
                  </p>
                  <p className="font-mono text-[11px] tracking-[0.08em] whitespace-nowrap text-muted uppercase">
                    {output.serves}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Evidence */}
        <section className="border-t border-rule-soft">
          <div className="mx-auto max-w-6xl px-6 py-24 lg:px-10">
            <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
              <div>
                <SectionNumber n="Method" />
                <h2 className="mt-3 font-display text-[32px] leading-[1.2] font-medium tracking-[-0.015em] sm:text-[40px]">
                  Evidence, not assumptions.
                </h2>
                <p className="mt-5 text-[16px] leading-[1.65] text-ink-soft">
                  Reddit is not a representative sample of any single country.
                  A discussion in a UK community can be attributed to UK
                  consumers with reasonable confidence; the same discussion in a
                  global community cannot.
                </p>
                <p className="mt-4 text-[16px] leading-[1.65] text-ink-soft">
                  Rather than flatten that difference, Market Pulse labels every
                  quote with its source type and rates each section on the
                  balance of evidence behind it. Where UK-specific coverage is
                  thin, the brief says so instead of implying certainty it
                  cannot support.
                </p>
              </div>

              <div className="border-t border-rule pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-20">
                <dl className="space-y-7">
                  <div>
                    <dt className="flex items-center gap-2.5">
                      <span className="inline-flex items-center rounded-sm bg-uk-bg px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-[0.08em] text-uk uppercase">
                        UK
                      </span>
                      <span className="text-[15px] font-medium">
                        UK-specific communities
                      </span>
                    </dt>
                    <dd className="mt-2 text-[15px] leading-[1.65] text-ink-soft">
                      r/UniUK, r/AskUK, r/UKTech and similar. Participants are
                      explicitly UK-based or discussing a UK context.
                    </dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-2.5">
                      <span className="inline-flex items-center rounded-sm bg-global-bg px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-[0.08em] text-global uppercase">
                        Global
                      </span>
                      <span className="text-[15px] font-medium">
                        Global category discussions
                      </span>
                    </dt>
                    <dd className="mt-2 text-[15px] leading-[1.65] text-ink-soft">
                      r/ChatGPT, r/gadgets, r/3Dprinting and similar. Relevant
                      to the category, but the participants could be anywhere.
                    </dd>
                  </div>
                </dl>

                <div className="mt-10 border-t border-rule pt-7">
                  <p className="font-mono text-[11px] tracking-[0.12em] text-muted uppercase">
                    Section confidence
                  </p>
                  <ul className="mt-4 space-y-2.5 text-[15px] leading-relaxed">
                    <li className="flex gap-3">
                      <span className="w-[4.5rem] shrink-0 font-mono text-[11px] tracking-[0.08em] text-conf-high uppercase">
                        High
                      </span>
                      <span className="text-ink-soft">
                        Mostly UK-specific evidence
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-[4.5rem] shrink-0 font-mono text-[11px] tracking-[0.08em] text-conf-medium uppercase">
                        Medium
                      </span>
                      <span className="text-ink-soft">
                        A mix of UK-specific and global evidence
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-[4.5rem] shrink-0 font-mono text-[11px] tracking-[0.08em] text-conf-low uppercase">
                        Low
                      </span>
                      <span className="text-ink-soft">
                        Mostly global evidence, limited UK data
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
