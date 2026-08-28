/**
 * Generates a Market Entry Brief from a collected corpus.
 *
 *   node --env-file=.env.local scripts/generate-brief.ts ai-app [audience]
 *
 * Writes data/briefs/<category>.json. Refuses to write a brief whose citations
 * do not check out.
 */
import { writeFileSync } from "node:fs";
import path from "node:path";
import { CATEGORIES, AUDIENCES, labelFor, type CategoryId } from "../lib/options.ts";
import { loadCorpus, statsFor } from "../lib/corpus/store.ts";
import { generateModelBrief } from "../lib/analysis/generate.ts";
import { resolveBrief } from "../lib/analysis/resolve.ts";

const categoryId = (process.argv[2] ?? "ai-app") as CategoryId;
const audienceId = process.argv[3] ?? "students";

const corpus = loadCorpus(categoryId);
if (!corpus) {
  console.error(`No corpus for ${categoryId}. Collect it first.`);
  process.exit(1);
}

const stats = statsFor(corpus.discussions);
const categoryLabel = labelFor(CATEGORIES, categoryId);
const audienceLabel = labelFor(AUDIENCES, audienceId);

console.log(
  `Analysing ${stats.total} discussions (${stats.uk} UK / ${stats.global} Global) — ${categoryLabel} / ${audienceLabel}`,
);

const { brief: modelBrief, usage } = await generateModelBrief(
  corpus,
  categoryLabel,
  audienceLabel,
);

// Persist the raw model output before verification: a run that fails the
// citation check has still been paid for, and this is what you debug against.
const rawOut = path.join(process.cwd(), "data", "briefs", `${categoryId}.model.json`);
writeFileSync(rawOut, `${JSON.stringify(modelBrief, null, 2)}\n`, "utf8");

const { brief, warnings } = resolveBrief(modelBrief, corpus, stats);

// The audience is part of what was analysed, not just how the run was invoked:
// the same corpus asked about a different audience is a different brief. Record
// it so the site can never present a brief under an audience it did not analyse.
const briefWithAudience = { ...brief, audienceId };

const inCost = ((usage.input_tokens ?? 0) / 1e6) * 5;
const outCost = ((usage.output_tokens ?? 0) / 1e6) * 25;
console.log(
  `Tokens: ${usage.input_tokens} in / ${usage.output_tokens} out  (~$${(inCost + outCost).toFixed(3)})`,
);

if (warnings.length) {
  console.error(`\n${warnings.length} citation problem(s):`);
  for (const w of warnings) console.error(`  [${w.kind}] ${w.detail}`);
  console.error("\nBrief not written. Fix the prompt or re-run.");
  process.exit(1);
}

const out = path.join(process.cwd(), "data", "briefs", `${categoryId}.json`);
writeFileSync(out, `${JSON.stringify(briefWithAudience, null, 2)}\n`, "utf8");
console.log(`\nAll citations check out. Wrote ${out}`);
