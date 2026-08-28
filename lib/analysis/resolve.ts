import type { CategoryId, Locality } from "../options";
import type { CategoryCorpus, Discussion } from "../corpus/types";
import type { ModelBrief } from "./schema";

/**
 * Turns the model's ID-cited output into the Brief the site renders, and
 * verifies every claim of attribution on the way.
 *
 * Two failures are caught here rather than trusted away: a citation pointing at
 * a discussion that does not exist, and a quote that does not appear in the
 * discussion it is attributed to. Both produce output that reads as sourced,
 * so neither is allowed to pass silently.
 */

export interface ResolveWarning {
  kind: "unknown-discussion" | "quote-not-found";
  detail: string;
}

/**
 * Normalises text before comparing a quote to its source.
 *
 * Reddit comments carry markdown and typographic characters that a model
 * reasonably drops when quoting — asterisks around emphasis, smart quotes,
 * en dashes. Those differences are not paraphrase, and failing them would
 * train the prompt to avoid quoting real text. Word substitution still fails,
 * which is the case the check exists for.
 */
const norm = (s: string) =>
  s
    .replace(/[*_`>]/g, "")
    .replace(/[\u2018\u2019\u201b]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

/**
 * Comment bodies are truncated at collection time, so a long quote can be
 * genuine yet run past the end of what was stored. Matching a substantial
 * leading span keeps that case passing without admitting a reworded quote.
 */
const LEAD_MATCH_CHARS = 120;

export function resolveBrief(
  model: ModelBrief,
  corpus: CategoryCorpus,
  counts: { total: number; uk: number; global: number },
) {
  const byId = new Map<string, Discussion>();
  corpus.discussions.forEach((d, i) => byId.set(`D${i + 1}`, d));
  const warnings: ResolveWarning[] = [];

  const lookup = (id: string): Discussion | null => {
    const d = byId.get(id);
    if (!d) warnings.push({ kind: "unknown-discussion", detail: id });
    return d ?? null;
  };

  const quote = (q: { text: string; discussionId: string }) => {
    const d = lookup(q.discussionId);
    if (d) {
      const haystack = norm(`${d.title} ${d.selftext} ${d.comments.map((c) => c.body).join(" ")}`);
      const needle = norm(q.text);
      const lead = needle.slice(0, LEAD_MATCH_CHARS);
      if (!haystack.includes(needle) && !(needle.length > LEAD_MATCH_CHARS && haystack.includes(lead))) {
        warnings.push({
          kind: "quote-not-found",
          detail: `${q.discussionId}: "${q.text.slice(0, 60)}…"`,
        });
      }
    }
    return {
      text: q.text,
      subreddit: d?.subreddit ?? "unknown",
      locality: (d?.locality ?? "Global") as Locality,
    };
  };

  const evidence = (e: ModelBrief["sentiment"]["evidence"]) => ({
    confidence: e.confidence,
    basis: e.basis,
    sources: e.discussionIds.map((id) => {
      const d = lookup(id);
      return {
        subreddit: d?.subreddit ?? "unknown",
        postTitle: d?.title ?? id,
        locality: (d?.locality ?? "Global") as Locality,
      };
    }),
  });

  const brief = {
    categoryId: corpus.categoryId as CategoryId,
    discussionsAnalysed: counts.total,
    ukDiscussions: counts.uk,
    globalDiscussions: counts.global,
    dataWindow: corpus.window,
    sentiment: {
      label: model.sentiment.label,
      headline: model.sentiment.headline,
      summary: model.sentiment.summary,
      quotes: model.sentiment.quotes.map(quote),
      evidence: evidence(model.sentiment.evidence),
    },
    barriers: {
      items: model.barriers.items.map((b) => ({
        name: b.name,
        frequency: `${b.discussionsMentioning} of ${counts.total} discussions`,
        quote: quote(b.quote),
        implication: b.implication,
      })),
      evidence: evidence(model.barriers.evidence),
    },
    content: { items: model.content.items, evidence: evidence(model.content.evidence) },
    creators: { items: model.creators.items, evidence: evidence(model.creators.evidence) },
    competitive: {
      items: model.competitive.items.map((c) => ({
        name: c.name,
        discussions: c.discussions,
        summary: c.summary,
        strengths: c.strengths.map(quote),
        weaknesses: c.weaknesses.map(quote),
      })),
      gap: model.competitive.gap,
      evidence: evidence(model.competitive.evidence),
    },
    positioning: {
      items: model.positioning.items.map((p) => ({
        recommendation: p.recommendation,
        rationale: p.rationale,
        supportedBy: p.supportedBy.map((l) => ({
          section: l.section,
          detail: l.detail,
          locality: (lookup(l.discussionId)?.locality ?? "Global") as Locality,
        })) as [{ section: string; detail: string; locality: Locality }, ...unknown[]],
      })),
      evidence: evidence(model.positioning.evidence),
    },
  };

  return { brief, warnings };
}
