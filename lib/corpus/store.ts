import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import type { CategoryId } from "../options";
import type { CategoryCorpus, CorpusStats, Discussion } from "./types";

/** Server-only module: reads the corpus from disk. Never import from a client component. */

const ROOT = process.cwd();
export const RAW_DIR = path.join(ROOT, "data", "raw");
export const CORPUS_DIR = path.join(ROOT, "data", "corpus");

export function corpusPath(categoryId: CategoryId): string {
  return path.join(CORPUS_DIR, `${categoryId}.json`);
}

export function rawPath(subreddit: string): string {
  return path.join(RAW_DIR, `${subreddit.toLowerCase()}.json`);
}

export function hasCorpus(categoryId: CategoryId): boolean {
  return existsSync(corpusPath(categoryId));
}

export function loadCorpus(categoryId: CategoryId): CategoryCorpus | null {
  const file = corpusPath(categoryId);
  if (!existsSync(file)) return null;
  return JSON.parse(readFileSync(file, "utf8")) as CategoryCorpus;
}

export function saveCorpus(corpus: CategoryCorpus): string {
  mkdirSync(CORPUS_DIR, { recursive: true });
  const file = corpusPath(corpus.categoryId);
  writeFileSync(file, `${JSON.stringify(corpus, null, 2)}\n`, "utf8");
  return file;
}

/**
 * Counts are discussion-level by construction: this walks discussions, never
 * comments, so a single busy thread cannot inflate a category's coverage.
 */
export function statsFor(discussions: Discussion[]): CorpusStats {
  const bySubreddit: Record<string, number> = {};
  let uk = 0;
  for (const d of discussions) {
    bySubreddit[d.subreddit] = (bySubreddit[d.subreddit] ?? 0) + 1;
    if (d.locality === "UK") uk += 1;
  }
  return {
    total: discussions.length,
    uk,
    global: discussions.length - uk,
    bySubreddit,
  };
}

/** The `dataWindow` string the brief displays, derived from the corpus itself. */
export function describeWindow(discussions: Discussion[]): string {
  if (discussions.length === 0) return "No discussions collected";
  const times = discussions.map((d) => d.createdUtc).sort((a, b) => a - b);
  const fmt = (t: number) =>
    new Date(t * 1000).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
    });
  const from = fmt(times[0]);
  const to = fmt(times[times.length - 1]);
  return from === to
    ? `Posts and comment threads from ${from}`
    : `Posts and comment threads from ${from} to ${to}`;
}
