import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SectionNumber } from "@/components/Tags";

export const metadata: Metadata = {
  title: "About — Market Pulse",
};

function Block({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-rule py-14">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:gap-16">
        <div className="lg:sticky lg:top-10 lg:self-start">
          <SectionNumber n={n} />
          <h2 className="mt-2.5 font-display text-[24px] leading-[1.2] font-medium tracking-[-0.01em]">
            {title}
          </h2>
        </div>
        <div className="max-w-2xl space-y-5 text-[16px] leading-[1.75] text-ink-soft">
          {children}
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="max-w-3xl pt-20 pb-14">
          <SectionNumber n="About" />
          <h1 className="mt-4 font-display text-[38px] leading-[1.12] font-medium tracking-[-0.02em] text-balance sm:text-[48px]">
            Every overseas marketing role starts with the same question.
          </h1>
          <p className="mt-6 text-[18px] leading-[1.65] text-ink-soft">
            What do local consumers actually think about this product category?
            Market Pulse exists to answer that question before a team has any
            presence in the market to monitor.
          </p>
        </div>

        <Block n="01" title="Why this exists">
          <p>
            Chinese tech and AI companies are expanding overseas at pace. Across
            their marketing chains — market research, product marketing, social,
            KOL, e-commerce — the first step is the same: work out how people in
            the target market think about the category.
          </p>
          <p>
            Today that step is done by hand. A marketing manager browses Reddit,
            scrolls TikTok, reads reviews, and builds an intuition over weeks.
            It is slow, it inherits the assumptions of headquarters, and it is
            almost impossible to hand to the next person or repeat for the next
            market.
          </p>
        </Block>

        <Block n="02" title="What it does">
          <p>
            You choose a product category, a target market and an audience
            segment. Market Pulse collects recent discussions from the
            communities where that category is actually debated, analyses them,
            and returns a structured market entry brief covering sentiment,
            adoption barriers, content opportunities, creator signals, the
            competitive landscape and the positioning directions those findings
            support.
          </p>
          <p>
            The structure is fixed on purpose. A brief that always answers the
            same six questions can be compared across markets and handed to a
            colleague without a walkthrough.
          </p>
        </Block>

        <Block n="03" title="Why Reddit first">
          <p>
            Reddit meets two conditions at once. It is one of the few places
            where consumer attitudes appear in long form and with reasoning
            attached — anonymous, argumentative, and specific about use cases.
            Instagram and TikTok content is performative by design; comment
            sections rarely reveal why someone would or would not buy something.
          </p>
          <p>
            It is also technically accessible. Reddit offers a free API that
            returns structured text, which is directly analysable. Other
            consumer-voice sources — Amazon reviews, TikTok comments — are
            planned, but Reddit was the shortest viable path to a working first
            version.
          </p>
        </Block>

        <Block n="04" title="How confidence is handled">
          <p>
            Reddit does not represent any single country. A thread in r/UniUK
            can be attributed to UK consumers with reasonable confidence; the
            same thread in r/ChatGPT cannot, because the participants could be
            anywhere.
          </p>
          <p>
            Rather than treat all data as equivalent, every source community is
            classified as UK-specific or global, every quote carries that label,
            and each section is rated on the balance of evidence behind it. Where
            UK coverage is thin, the brief states it. Frequency is counted at the
            discussion level rather than the comment level, so a single popular
            thread cannot inflate a barrier into a trend.
          </p>
          <p>
            The final section is the one exception: positioning directions are
            inferred rather than observed. Each one therefore has to name the
            findings in the preceding sections that produced it, so a reader can
            reject the recommendation and still keep the evidence.
          </p>
        </Block>

        <Block n="05" title="What this is not">
          <p>
            This is a prototype, not an enterprise product. It is not a creator
            database, a social listening dashboard, a brand monitoring tool or a
            campaign platform — those categories are well served by Modash,
            Brandwatch, Reddit Community Intelligence and CreatorIQ respectively.
          </p>
          <p>
            It also does not replace local interviews or cross-validation with
            people on the ground. What it replaces is the two days of unstructured
            scrolling that currently precede them — compressing the initial read
            on a market into half an hour, and marking clearly which conclusions
            are too thinly evidenced to act on without checking.
          </p>
        </Block>

        <Block n="06" title="Who built it">
          <p>
            Sijia Huang, MSc Marketing Management with Advertising at the
            University of Leeds. The UK market was built first because it is the
            market I live and study in and can sanity-check against first-hand
            experience. The framework is designed to transfer to other markets.
          </p>
        </Block>

        <div className="border-t border-rule py-14">
          <Link
            href="/#generate"
            className="inline-flex items-center justify-center rounded-sm bg-ink px-7 py-3.5 text-[15px] font-medium text-paper transition-opacity hover:opacity-88"
          >
            Generate a brief
          </Link>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
