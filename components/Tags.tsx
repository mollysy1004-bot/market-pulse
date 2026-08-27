import type { Locality } from "@/lib/options";
import type { Confidence } from "@/lib/mockBrief";

export function LocalityTag({ locality }: { locality: Locality }) {
  const isUK = locality === "UK";
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-sm px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-[0.08em] uppercase ${
        isUK ? "bg-uk-bg text-uk" : "bg-global-bg text-global"
      }`}
    >
      {isUK ? "UK" : "Global"}
    </span>
  );
}

const CONFIDENCE_STYLES: Record<Confidence, string> = {
  High: "text-conf-high",
  Medium: "text-conf-medium",
  Low: "text-conf-low",
};

export function ConfidenceBadge({
  confidence,
  basis,
}: {
  confidence: Confidence;
  basis: string;
}) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
      <span
        className={`font-mono text-[11px] font-medium tracking-[0.08em] uppercase ${CONFIDENCE_STYLES[confidence]}`}
      >
        {confidence} confidence
      </span>
      <span className="text-[13px] leading-relaxed text-muted">{basis}</span>
    </div>
  );
}

export function SectionNumber({ n }: { n: string }) {
  return (
    <span className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
      {n}
    </span>
  );
}
