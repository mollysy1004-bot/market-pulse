import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SectionNumber } from "@/components/Tags";

export const metadata: Metadata = {
  title: "How it was built — Market Pulse",
  description:
    "The decisions behind Market Pulse: what the evidence would not support, and what changed because of it.",
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

/** A decision that changed the product, stated as what was found and what followed. */
function Finding({
  found,
  changed,
}: {
  found: string;
  changed: string;
}) {
  return (
    <div className="border-l-2 border-rule pl-5">
      <p className="font-mono text-[10px] tracking-[0.1em] text-muted uppercase">
        What the data showed
      </p>
      <p className="mt-1.5 text-ink">{found}</p>
      <p className="mt-4 font-mono text-[10px] tracking-[0.1em] text-muted uppercase">
        What changed
      </p>
      <p className="mt-1.5">{changed}</p>
    </div>
  );
}

export default function ProcessPage() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="pt-16 pb-10">
          <SectionNumber n="How it was built" />
          <h1 className="mt-4 max-w-3xl font-display text-[38px] leading-[1.12] font-medium tracking-[-0.02em] text-balance sm:text-[48px]">
            Most of the work was finding out what the evidence would not
            support.
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-[1.7] text-ink-soft">
            Market Pulse took one build to get running and several passes to
            become trustworthy. The interesting part was not the pipeline — it
            was each point where the output looked sound and was not, and what
            had to change as a result. This page is that record.
          </p>
        </div>

        <Block n="01" title="The problem">
          <p>
            Overseas marketing roles at Chinese tech brands — market research,
            product marketing, content, KOL — all begin at the same question:
            what do consumers in this market already think about this category?
          </p>
          <p>
            Today that question is answered by browsing. Someone opens Reddit,
            reads reviews, scrolls TikTok, and builds an intuition over a couple
            of days. It is slow, it is shaped by whoever did the scrolling, and
            it cannot be handed to a colleague or repeated for the next market.
          </p>
          <p>
            Market Pulse replaces the scrolling, not the judgement: a category,
            a market and an audience in, and a structured brief out — sentiment,
            barriers, content angles, creator signals, competitors, positioning.
          </p>
        </Block>

        <Block n="02" title="Reddit refused, and the architecture absorbed it">
          <p>
            The plan assumed Reddit&rsquo;s free API. App registration could not
            be completed on this account, and the public JSON endpoints now
            refuse unauthenticated clients — 403, or a redirect to a login page.
            Both routes closed before a line of collection code ran.
          </p>
          <Finding
            found="Neither documented route to Reddit data was available."
            changed="Collection moved into an authenticated browser session, but writes the same RawDiscussion shape an OAuth client would return. The transport is the only layer that knows the difference, so credentials can be restored later without touching anything above it."
          />
          <p>
            This was the first decision that mattered more than it looked. A
            quicker fix would have parsed whatever the browser returned; keeping
            the shape meant the workaround stayed contained.
          </p>
        </Block>

        <Block n="03" title="Two of the sources did not exist">
          <p>
            The subreddit mapping was written from domain knowledge — which UK
            communities discuss which category. It looked reasonable. Checked
            against Reddit, two entries did not hold discussion at all.
          </p>
          <Finding
            found="r/UKTech has 186 subscribers, is restricted, and returned nothing for any category term. r/UKsmarthome does not exist — the largest UK smart-home candidates have 16 and 427 members. Between them they were the primary UK source for two of the five categories."
            changed="Consumer electronics moved to r/CasualUK and r/UKPersonalFinance alongside r/AskUK, taking its UK evidence from 3 discussions to 7. Smart home added r/DIYUK and is now marked as thin on UK coverage, because no usable UK smart-home community exists to fix it."
          />
          <p>
            The lesson generalises past this project: a source list written from
            plausibility will contain sources that do not exist, and nothing
            downstream will notice. Verifying them is cheap and nobody does it.
          </p>
        </Block>

        <Block n="04" title="Searching for a category is not the same as being in it">
          <p>
            Discussions are found by searching each community for category
            terms. The first version used one word list for both finding
            discussions and deciding whether they belonged.
          </p>
          <Finding
            found="Consumer electronics had collected Le Creuset cookware, a razor, a Breville kettle and a car finance dispute. They matched on 'warranty', 'worth buying' and 'build quality' — terms that prove a thread is about a purchase, not what was purchased."
            changed="Retrieval and validation were separated. Search terms stay broad; a second list of category anchors — brands and compound product terms — decides membership. Consumer electronics fell from 22 discussions to 12, and its UK evidence from 7 to 2."
          />
          <p>
            The drop is the finding, not a regression. Half that corpus was
            never about consumer electronics, and the category had been
            presenting thin evidence as though it were sound. A first attempt at
            anchors kept everyday nouns — charger, phone, laptop — and readmitted
            &ldquo;what do you carry in your work bag&rdquo;: everyone owns one
            and mentions it in passing.
          </p>
        </Block>

        <Block n="05" title="The model was made unable to invent a source">
          <p>
            An analysis model asked for market intelligence will produce
            confident, well-written findings that the evidence does not support.
            The output reads the same either way, which is what makes it
            dangerous.
          </p>
          <p>
            So the model never writes a subreddit name, a locality tag or a
            count. It cites discussion IDs from the corpus it was given, and a
            resolution step turns those into real sources — checking that every
            quote appears verbatim in the discussion it is attributed to. A
            brief with a citation that does not check out is not written at all.
          </p>
          <Finding
            found="The first run produced two quotes that did not appear in their cited discussions. It was rejected before anything reached the site."
            changed="Comparison now normalises markdown and typographic characters, which are formatting rather than paraphrase, and tolerates a quote running past the collection-time truncation of a long comment. Substituted words still fail. Every published brief has passed this check."
          />
        </Block>

        <Block n="06" title="Two places where the interface claimed work it had not done">
          <p>
            Both were found by looking at the product as a reader rather than as
            its author, and both are the same failure the citation check exists
            to prevent — moved up into the page, where nothing was checking.
          </p>
          <Finding
            found="Selecting Parents and selecting Students returned pages that differed by five bytes: the word in the heading. The audience was a display parameter, so the page asserted an analysis of parents over findings drawn from student discussions."
            changed="The audience a brief was analysed for is written into the brief at generation time, and the page renders that audience rather than the requested one. The form offers only audiences that exist. A hand-typed URL cannot relabel a brief."
          />
          <Finding
            found="The button read 'Generate brief', and 'Generating brief…' while routing. It routes to a static page. Nothing was generated and no API was called."
            changed="It reads 'View brief', and the form says briefs are generated ahead of time. The About page explains why, rather than burying it — on-demand generation would put every page view behind two external services, and this is a pre-entry research tool, not a monitoring dashboard."
          />
        </Block>

        <Block n="07" title="One section the data cannot support">
          <p>
            Creator Signals was specified to serve the KOL question: what kind
            of creator should a brand look for? Every category rates it Low
            confidence, and widening the corpus did not move it.
          </p>
          <Finding
            found="Across 55 discussions in the strongest category, no creator, influencer or channel is named — not rarely, but never. Reddit discusses products constantly and creators almost not at all."
            changed="The section now opens by saying what it can and cannot show. It reports whose contributions carry weight inside these communities, which is a weaker and different claim than creator selection. Answering the original question needs a source that carries creator data; Reddit is not one."
          />
          <p>
            The alternative was to keep the promise and let the model fill it.
            That would have produced a creator shortlist with quotes and
            confidence ratings attached, and no evidence underneath.
          </p>
        </Block>

        <Block n="08" title="Where it stands">
          <p>
            266 discussions across 26 communities, seven categories, one market.
            Every brief names the window its evidence came from and the balance
            of UK to global sources behind each section, and every one matches
            the corpus it was built from — checked, not assumed.
          </p>
          <p>
            Briefs are generated ahead of time and bundled at build time, so the
            deployed site makes no API calls, costs nothing to serve, and cannot
            fail because someone else&rsquo;s service is down.
          </p>
          <p>
            The honest headline is the UK column. Of 266 discussions, 21 are
            UK-located, and 18 of those sit in one category. This is a tool for
            reading a market before entering it, and it currently reads one
            category&rsquo;s market well and six categories&rsquo; global
            conversation. That is not a gap in the collection — it is what UK
            Reddit contains. British users discuss AI constantly, because it
            arrived in their coursework; they mention chargers and earbuds
            constantly and discuss them as a purchase almost never.
          </p>
        </Block>

        <Block n="09" title="What the gate still cannot see">
          <p>
            The relevance gate reads a post&rsquo;s title and body. Some of the
            best evidence is in neither.
          </p>
          <Finding
            found="A UK thread about cooling a house at night mentions smart home once in its body and carries a real discussion of smart switches and relays in its comments. The gate dropped it, correctly by its own rule and wrongly in substance."
            changed="Nothing yet, deliberately. An earlier version did test comments and was removed for admitting noise — but it tested with the broad search terms, and with category anchors the same test would be far cleaner. The gate was revised three times in one sitting; a fourth pass without evidence it improves things is churn, not care."
          />
          <p>
            It is recorded here rather than fixed because a known limitation
            someone can act on is worth more than an untested change, and
            because the next person to touch this should know the shape of what
            it misses.
          </p>
        </Block>

        <Block n="10" title="What I would tell someone starting this">
          <p>
            The build was days; the trust was the rest. Every problem worth
            fixing had the same shape — output that looked sound, presented in a
            way that gave a reader no way to tell.
          </p>
          <p>
            The habit that caught all of them was cheap: read your own product
            as the person who has to act on it, and check the claim it is
            quietly making. Does this page know the audience it names? Does this
            quote exist? Is this category the thing this thread is about? Each
            took minutes to ask and each was answered no.
          </p>
        </Block>

        <div className="border-t border-rule py-14">
          <p className="text-[16px] leading-[1.75] text-ink-soft">
            The briefs themselves are on the{" "}
            <Link
              href="/#generate"
              className="underline decoration-rule underline-offset-[5px] transition-colors hover:text-ink hover:decoration-muted"
            >
              home page
            </Link>
            , and the reasoning behind the evidence framework is in{" "}
            <Link
              href="/about"
              className="underline decoration-rule underline-offset-[5px] transition-colors hover:text-ink hover:decoration-muted"
            >
              About
            </Link>
            .
          </p>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
