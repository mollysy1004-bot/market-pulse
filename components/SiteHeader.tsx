import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-rule-soft">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-10">
        <Link href="/" className="group flex items-baseline gap-2.5">
          <span className="font-display text-[19px] leading-none font-medium tracking-[-0.01em]">
            Market Pulse
          </span>
          <span className="hidden font-mono text-[10px] tracking-[0.1em] text-muted uppercase sm:inline">
            Prototype
          </span>
        </Link>
        <nav className="flex items-center gap-7 text-[14px]">
          <Link
            href="/#generate"
            className="text-ink-soft transition-colors hover:text-ink"
          >
            Briefs
          </Link>
          <Link
            href="/about"
            className="text-ink-soft transition-colors hover:text-ink"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
