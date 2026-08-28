import type { Locality } from "../options";
import type { Discussion, RawDiscussion, RawPost } from "./types";

/** Comment bodies longer than this are truncated at collection time. */
const MAX_COMMENT_CHARS = 500;
/** Post bodies longer than this are truncated at collection time. */
const MAX_SELFTEXT_CHARS = 1200;
/** Comments kept per discussion, highest score first. */
const MAX_COMMENTS_PER_DISCUSSION = 14;
/** A thread with fewer replies than this carries no discussion signal. */
const MIN_COMMENTS = 3;

const DELETED = new Set(["[deleted]", "[removed]", ""]);

function truncate(text: string, limit: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length <= limit ? clean : `${clean.slice(0, limit - 1)}…`;
}

/**
 * Posts that are about the community, or are promotion, rather than the
 * category. Both carry something other than consumer opinion into the corpus
 * and read as signal once the analysis prompt sees them — the comments under a
 * giveaway are entries, not attitudes — so they are dropped before storage.
 */
function isMetaPost(title: string): boolean {
  const meta =
    /^\s*[\[【]?\s*(meta|mod|announcement|megathread|weekly|daily|monthly|welcome to|read the rules|our discord)/i;
  const promo = /giveaway|sweepstake|\bwin a\b|discount code|coupon|\bsponsored\b|\bpromo\b/i;
  return meta.test(title) || promo.test(title);
}

/**
 * Whether a discussion is actually about the category.
 *
 * Retrieval and validation are separate steps with separate word lists.
 * Searching is broad on purpose — the language of buying finds real discussion
 * — but those same words cannot decide what was bought: "worth buying" and
 * "warranty" matched cookware, a razor and a car finance dispute, all of which
 * entered the consumer electronics corpus looking like evidence.
 *
 * The gate therefore tests category anchors — product entities and brands —
 * and only in the title or body, so the discussion is about the category
 * rather than merely mentioning it once in a reply.
 */
function isOnTopic(post: RawPost, anchors: string[]): boolean {
  if (anchors.length === 0) return true;
  const patterns = anchors.map((t) => {
    const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Acronyms match case-sensitively: a case-insensitive "AI" also matches
    // air, aid and aim, which quietly readmits every off-topic thread.
    const flags = /^[A-Z]{2,}/.test(t) ? "" : "i";
    return new RegExp(`\\b${escaped}\\b`, flags);
  });
  const head = `${post.title} ${post.selftext ?? ""}`;
  return patterns.some((re) => re.test(head));
}

export function normaliseDiscussions(
  raw: RawDiscussion[],
  subreddit: string,
  locality: Locality,
  anchors: string[] = [],
): Discussion[] {
  const seen = new Set<string>();
  const out: Discussion[] = [];

  for (const { post, comments } of raw) {
    if (!post?.id || seen.has(post.id)) continue;
    if (isMetaPost(post.title)) continue;
    if (!isOnTopic(post, anchors)) continue;

    const kept = comments
      .filter((c) => c.body && !DELETED.has(c.body.trim()))
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_COMMENTS_PER_DISCUSSION)
      .map((c) => ({
        id: c.id,
        body: truncate(c.body, MAX_COMMENT_CHARS),
        score: c.score,
      }));

    if (kept.length < MIN_COMMENTS) continue;

    seen.add(post.id);
    out.push({
      id: post.id,
      subreddit,
      locality,
      title: truncate(post.title, 300),
      selftext: truncate(post.selftext ?? "", MAX_SELFTEXT_CHARS),
      permalink: post.permalink.startsWith("http")
        ? post.permalink
        : `https://www.reddit.com${post.permalink}`,
      createdUtc: post.created_utc,
      score: post.score,
      numComments: post.num_comments,
      comments: kept,
    });
  }

  return out;
}
