import { getBrief as getSampleBrief, type Brief } from "./mockBrief";
import type { CategoryId } from "./options";
import aiApp from "../data/briefs/ai-app.json";
import consumerElectronics from "../data/briefs/consumer-electronics.json";
import smartHome from "../data/briefs/smart-home.json";
import printer3d from "../data/briefs/3d-printer.json";
import actionCamera from "../data/briefs/action-camera.json";
import chargingPower from "../data/briefs/charging-power.json";
import audioEarbuds from "../data/briefs/audio-earbuds.json";

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
type BriefFile = Brief & { audienceId: string };

const FILES: Partial<Record<CategoryId, BriefFile>> = {
  "ai-app": aiApp as unknown as BriefFile,
  "consumer-electronics": consumerElectronics as unknown as BriefFile,
  "smart-home": smartHome as unknown as BriefFile,
  "3d-printer": printer3d as unknown as BriefFile,
  "action-camera": actionCamera as unknown as BriefFile,
  "charging-power": chargingPower as unknown as BriefFile,
  "audio-earbuds": audioEarbuds as unknown as BriefFile,
};

/** The audience a category has been generated for, or null if none has. */
export function generatedAudienceFor(categoryId: string | undefined): string | null {
  const file = categoryId ? FILES[categoryId as CategoryId] : undefined;
  return file?.audienceId ?? null;
}

/**
 * Returns the brief to render and the audience it belongs to.
 *
 * The audience is returned rather than accepted. It is not a display parameter:
 * the same corpus asked about students and about parents yields different
 * findings, so a brief generated for one must not be shown under the other.
 * Presenting it that way asserts an analysis that was never run — the failure
 * the citation checks exist to prevent, moved up into the page header — and
 * returning the real audience means a hand-typed ?audience= cannot cause it.
 */
export function getBriefFor(categoryId: string | undefined): {
  brief: Brief;
  source: BriefSource;
  audienceId: string | null;
} {
  const file = categoryId ? FILES[categoryId as CategoryId] : undefined;
  return file
    ? { brief: file, source: "generated", audienceId: file.audienceId }
    : { brief: getSampleBrief(categoryId), source: "sample", audienceId: null };
}
