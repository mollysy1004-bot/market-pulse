import { z } from "zod";

/**
 * What the model is allowed to return.
 *
 * The model never writes a subreddit name, a locality tag or a count. It cites
 * discussion IDs (`D1`, `D2`, …) from the serialised corpus, and resolve.ts
 * turns those into real sources. A model that invents a source therefore fails
 * to resolve instead of producing a brief that looks sourced and is not.
 */

const DiscussionId = z.string().regex(/^D\d+$/, "must be a corpus discussion id like D7");

const ModelQuote = z.object({
  /** Quoted verbatim from the cited discussion. */
  text: z.string(),
  discussionId: DiscussionId,
});

const ModelEvidence = z.object({
  confidence: z.enum(["High", "Medium", "Low"]),
  /** One line on how the rating was reached, in terms of the evidence balance. */
  basis: z.string(),
  discussionIds: z.array(DiscussionId).min(1),
});

const ModelBarrier = z.object({
  name: z.string(),
  /** Count of discussions mentioning this barrier, never comments. */
  discussionsMentioning: z.number().int().min(1),
  quote: ModelQuote,
  implication: z.string(),
});

const ModelContentAngle = z.object({
  hook: z.string(),
  why: z.string(),
  format: z.string(),
});

const ModelCreatorSignal = z.object({
  signal: z.string(),
  evidenceNote: z.string(),
  profile: z.string(),
  platform: z.string(),
  scale: z.string(),
});

const ModelCompetitor = z.object({
  name: z.string(),
  discussions: z.number().int().min(1),
  summary: z.string(),
  strengths: z.array(ModelQuote),
  weaknesses: z.array(ModelQuote),
});

const SOURCE_SECTIONS = [
  "Consumer Sentiment",
  "Key Concerns & Barriers",
  "Content Opportunities",
  "Creator Signals",
  "Competitive Landscape",
] as const;

const ModelEvidenceLink = z.object({
  section: z.enum(SOURCE_SECTIONS),
  detail: z.string(),
  discussionId: DiscussionId,
});

const ModelPositioning = z.object({
  recommendation: z.string(),
  rationale: z.string(),
  /** Non-empty by construction: section 6 may not assert without citing 1-5. */
  supportedBy: z.array(ModelEvidenceLink).min(1),
});

export const ModelBriefSchema = z.object({
  sentiment: z.object({
    label: z.enum(["Positive", "Mixed", "Cautious", "Negative"]),
    headline: z.string(),
    summary: z.string(),
    quotes: z.array(ModelQuote).min(1),
    evidence: ModelEvidence,
  }),
  barriers: z.object({
    items: z.array(ModelBarrier).min(1),
    evidence: ModelEvidence,
  }),
  content: z.object({
    items: z.array(ModelContentAngle).min(1),
    evidence: ModelEvidence,
  }),
  creators: z.object({
    items: z.array(ModelCreatorSignal).min(1),
    evidence: ModelEvidence,
  }),
  competitive: z.object({
    items: z.array(ModelCompetitor).min(1),
    gap: z.string(),
    evidence: ModelEvidence,
  }),
  positioning: z.object({
    /** Three directions, never more — see README, "Section 6 must cite sections 1-5". */
    items: z.array(ModelPositioning).min(1).max(3),
    evidence: ModelEvidence,
  }),
});

export type ModelBrief = z.infer<typeof ModelBriefSchema>;
