import type { Quote as QuoteType } from "@/lib/mockBrief";
import { LocalityTag } from "./Tags";

export function PullQuote({ quote }: { quote: QuoteType }) {
  return (
    <figure className="border-l-2 border-rule pl-5">
      <blockquote className="font-display text-[17px] leading-[1.55] text-ink italic">
        &ldquo;{quote.text}&rdquo;
      </blockquote>
      <figcaption className="mt-2.5 flex items-center gap-2.5">
        <LocalityTag locality={quote.locality} />
        <span className="font-mono text-[12px] text-muted">
          r/{quote.subreddit}
        </span>
      </figcaption>
    </figure>
  );
}
