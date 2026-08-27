export function SiteFooter() {
  return (
    <footer className="mt-28 border-t border-rule-soft">
      <div className="mx-auto max-w-6xl px-6 py-14 lg:px-10">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-[17px] font-medium">Market Pulse</p>
            <p className="mt-2.5 text-[14px] leading-relaxed text-muted">
              A prototype exploring how AI can help global marketing teams
              understand a new market before they enter it.
            </p>
          </div>
          <div className="text-[14px] leading-relaxed text-muted">
            <p className="text-ink-soft">Built by Sijia Huang</p>
            <p className="mt-1">MSc Marketing Management with Advertising</p>
            <p>University of Leeds</p>
          </div>
        </div>
        <p className="mt-12 font-mono text-[11px] tracking-[0.06em] text-muted">
          Prototype — briefs shown are sample data, not live Reddit analysis.
        </p>
      </div>
    </footer>
  );
}
