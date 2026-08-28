"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AUDIENCES, CATEGORIES, MARKETS, type Option } from "@/lib/options";
import { generatedAudienceFor } from "@/lib/brief";

function Field({
  label,
  name,
  options,
  value,
  onChange,
}: {
  label: string;
  name: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] tracking-[0.12em] text-muted uppercase">
        {label}
      </span>
      <div className="relative mt-2">
        <select
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-sm border border-rule bg-surface py-3 pr-10 pl-3.5 text-[15px] text-ink transition-colors hover:border-muted focus:border-accent"
        >
          {options.map((option) => (
            <option
              key={option.id}
              value={option.id}
              disabled={option.available === false}
            >
              {option.label}
              {option.hint ? ` — ${option.hint}` : ""}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 12 8"
          className="pointer-events-none absolute top-1/2 right-3.5 h-2 w-3 -translate-y-1/2 text-muted"
        >
          <path
            d="M1 1.5 6 6.5 11 1.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </label>
  );
}

export function BriefForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [category, setCategory] = useState("ai-app");
  const [market, setMarket] = useState("uk");
  const [audience, setAudience] = useState(
    () => generatedAudienceFor("ai-app") ?? "students",
  );

  /**
   * Each category has been analysed for one audience. Offering the rest as
   * selectable would promise an analysis that does not exist, so they are
   * shown — the intended scope is worth seeing — and disabled.
   */
  const analysedAudience = generatedAudienceFor(category);
  const audienceOptions: Option[] = AUDIENCES.map((option) =>
    analysedAudience === null || option.id === analysedAudience
      ? option
      : { ...option, available: false, hint: "not yet generated" },
  );

  /** Changing category changes which audience exists; follow it. */
  function handleCategoryChange(next: string) {
    setCategory(next);
    const nextAudience = generatedAudienceFor(next);
    if (nextAudience) setAudience(nextAudience);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const query = new URLSearchParams({ category, market, audience });
    startTransition(() => {
      router.push(`/brief?${query.toString()}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10">
      <div className="grid gap-6 sm:grid-cols-3">
        <Field
          label="Product category"
          name="category"
          options={CATEGORIES}
          value={category}
          onChange={handleCategoryChange}
        />
        <Field
          label="Market"
          name="market"
          options={MARKETS}
          value={market}
          onChange={setMarket}
        />
        <Field
          label="Target audience"
          name="audience"
          options={audienceOptions}
          value={audience}
          onChange={setAudience}
        />
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-sm bg-ink px-7 py-3.5 text-[15px] font-medium text-paper transition-opacity hover:opacity-88 disabled:opacity-60"
        >
          {isPending ? "Generating brief…" : "Generate brief"}
        </button>
        <p className="text-[13px] leading-relaxed text-muted">
          Only the United Kingdom is supported in this version, and each
          category has been analysed for one audience. The other options are
          listed to show the intended scope.
        </p>
      </div>
    </form>
  );
}
