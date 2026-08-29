/**
 * Assembles per-category corpus files from the raw per-subreddit dumps in
 * data/raw/. Run after collecting: `node scripts/build-corpus.ts`
 *
 * Raw dumps are acquired from the browser session today and from an OAuth
 * client once credentials exist; both write the same RawDiscussion[] shape,
 * so this step is unchanged either way.
 */
import { readFileSync, existsSync } from "node:fs";
import {
  CATEGORIES,
  SUBREDDIT_MAP,
  CATEGORY_ANCHORS,
  CATEGORY_EXCLUSIONS,
  type CategoryId,
} from "../lib/options.ts";
import { normaliseDiscussions } from "../lib/corpus/normalise.ts";
import { saveCorpus, statsFor, describeWindow, rawPath } from "../lib/corpus/store.ts";
import type { Discussion, RawDiscussion } from "../lib/corpus/types.ts";

const only = process.argv[2] as CategoryId | undefined;
const targets = only ? [only] : CATEGORIES.map((c) => c.id as CategoryId);

for (const categoryId of targets) {
  const sources = SUBREDDIT_MAP[categoryId];
  if (!sources) {
    console.error(`unknown category: ${categoryId}`);
    process.exitCode = 1;
    continue;
  }

  const discussions: Discussion[] = [];
  const missing: string[] = [];

  for (const src of sources) {
    const file = rawPath(categoryId, src.name);
    if (!existsSync(file)) {
      missing.push(src.name);
      continue;
    }
    const raw = JSON.parse(readFileSync(file, "utf8")) as RawDiscussion[];
    discussions.push(
      ...normaliseDiscussions(
        raw,
        src.name,
        src.locality,
        CATEGORY_ANCHORS[categoryId],
        CATEGORY_EXCLUSIONS[categoryId] ?? [],
        src.general === true,
      ),
    );
  }

  if (discussions.length === 0) {
    console.log(`${categoryId}: no raw data yet (missing: ${missing.join(", ") || "—"})`);
    continue;
  }

  const stats = statsFor(discussions);
  const file = saveCorpus({
    categoryId,
    collectedAt: new Date().toISOString(),
    window: describeWindow(discussions),
    discussions,
  });

  console.log(
    `${categoryId}: ${stats.total} discussions (${stats.uk} UK / ${stats.global} Global) -> ${file}`,
  );
  if (missing.length) console.log(`  not yet collected: ${missing.join(", ")}`);
}
