import type { SectionEvidence } from "@/lib/mockBrief";
import { LocalityTag } from "./Tags";

/**
 * Every insight must be traceable back to the discussions behind it.
 * This panel is what separates a brief from an unsourced summary.
 */
export function EvidencePanel({ evidence }: { evidence: SectionEvidence }) {
  return (
    <details className="group mt-8 border-t border-rule-soft pt-5">
      <summary className="inline-flex items-center gap-2 text-[13px] text-muted transition-colors hover:text-ink">
        <svg
          aria-hidden="true"
          viewBox="0 0 10 10"
          className="h-2 w-2 transition-transform group-open:rotate-90"
        >
          <path
            d="M3 1.5 7 5 3 8.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="font-mono text-[11px] tracking-[0.08em] uppercase">
          View evidence
        </span>
        <span className="text-muted">
          ({evidence.sources.length} source{evidence.sources.length === 1 ? "" : "s"})
        </span>
      </summary>

      <ul className="mt-5 space-y-3">
        {evidence.sources.map((source) => (
          <li
            key={`${source.subreddit}-${source.postTitle}`}
            className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[14px]"
          >
            <LocalityTag locality={source.locality} />
            <span className="font-mono text-[12px] text-muted">
              r/{source.subreddit}
            </span>
            <span className="text-ink-soft">{source.postTitle}</span>
          </li>
        ))}
      </ul>

      <p className="mt-5 text-[13px] leading-relaxed text-muted">
        In the live version each source links to the original discussion so any
        claim in this brief can be checked at its origin.
      </p>
    </details>
  );
}
