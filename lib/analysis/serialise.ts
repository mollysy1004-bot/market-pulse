import type { CategoryCorpus, Discussion } from "../corpus/types";

/**
 * Renders the corpus as the text block the analysis prompt reads.
 *
 * Every discussion is numbered and carries its subreddit and locality tag, so
 * the model can cite a specific discussion for each finding and so locality
 * survives into the output. The brief's confidence ratings depend on the model
 * being able to tell a UK-oriented discussion from a global one; dropping the
 * tag here would make those ratings unfalsifiable.
 */
export function serialiseCorpus(corpus: CategoryCorpus): string {
  return corpus.discussions.map(renderDiscussion).join("\n\n---\n\n");
}

function renderDiscussion(d: Discussion, i: number): string {
  const head = `[D${i + 1}] r/${d.subreddit} (${d.locality}) — ${d.title}`;
  const body = d.selftext ? `\n${d.selftext}` : "";
  const comments = d.comments
    .map((c) => `  • (${c.score}) ${c.body}`)
    .join("\n");
  return `${head}${body}\n${comments}`;
}

/** The discussion index the model cites, mapped back to real sources. */
export function citationIndex(
  corpus: CategoryCorpus,
): Record<string, { subreddit: string; postTitle: string; locality: string }> {
  const index: Record<
    string,
    { subreddit: string; postTitle: string; locality: string }
  > = {};
  corpus.discussions.forEach((d, i) => {
    index[`D${i + 1}`] = {
      subreddit: d.subreddit,
      postTitle: d.title,
      locality: d.locality,
    };
  });
  return index;
}
