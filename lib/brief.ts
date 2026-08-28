import { getBrief as getSampleBrief, type Brief } from "./mockBrief";
import type { CategoryId } from "./options";
import aiApp from "../data/briefs/ai-app.json";
import consumerElectronics from "../data/briefs/consumer-electronics.json";
import smartHome from "../data/briefs/smart-home.json";
import printer3d from "../data/briefs/3d-printer.json";
import actionCamera from "../data/briefs/action-camera.json";

/**
 * Where a rendered brief came from.
 *
 * The distinction is load-bearing, not cosmetic: a generated brief is grounded
 * in collected discussions and its every quote has been verified against the
 * source, while a sample brief is written illustration. The page states which
 * one the reader is looking at, so the two can never be mistaken.
 */
export type BriefSource = "generated" | "sample";

/**
 * Briefs produced by scripts/generate-brief.mts, imported statically so they
 * are bundled at build time — the deployed site renders instantly and cannot
 * fail on a missing file or a live API call.
 *
 * To add a category: generate it, then add the import and one entry here.
 */
const GENERATED: Partial<Record<CategoryId, Brief>> = {
  "ai-app": aiApp as unknown as Brief,
  "consumer-electronics": consumerElectronics as unknown as Brief,
  "smart-home": smartHome as unknown as Brief,
  "3d-printer": printer3d as unknown as Brief,
  "action-camera": actionCamera as unknown as Brief,
};

export function getBriefFor(categoryId: string | undefined): {
  brief: Brief;
  source: BriefSource;
} {
  const generated = categoryId ? GENERATED[categoryId as CategoryId] : undefined;
  return generated
    ? { brief: generated, source: "generated" }
    : { brief: getSampleBrief(categoryId), source: "sample" };
}
