import type { Locality } from "../options";
import type { Discussion, RawDiscussion, RawPost } from "./types";

/** Comment bodies longer than this are truncated at collection time. */
const MAX_COMMENT_CHARS = 500;
/** Post bodies longer than this are truncated at collection time. */
const MAX_SELFTEXT_CHARS = 1200;
/** Comments kept per discussion, highest score first. */
const MAX_COMMENTS_PER_DISCUSSION = 12;
/** A thread with fewer replies than this carries no discussion signal. */
const MIN_COMMENTS = 3;

const DELETED = new Set(["[deleted]", "[removed]", ""]);

function truncate(text: string, limit: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length <= limit ? clean : `${clean.slice(0, limit - 1)}…`;
}

/**
 * Posts that are about the community rather than the category. These carry a
 * subreddit's own meta-discussion into the corpus and read as consumer signal
 * once the analysis prompt sees them, so they are dropped before storage.
 */
function isMetaPost(title: string): boolean {
  return /^\s*(\[?(meta|mod|announcement|megathread)\]?|weekly|daily|monthly|welcome to|read the rules|our discord)/i.test(
    title,
  );
}

/**
 * Whether a discussion is actually about the category, rather than merely
 * matching a search term somewhere.
 *
 * Reddit's search is loose, and ranking the matches by comment count pulls in
 * a community's biggest threads regardless of topic — a r/UKPersonalFinance
 * thread about retirement outranks every real discussion of AI pricing. A
 * discussion qualifies only if the category is what the thread is about — a
 * term in the title or body. Allowing comment-level matches instead let
 * general threads in whenever a few commenters mentioned the category in
 * passing, which is not the same as the community discussing it.
 */
function isOnTopic(post: RawPost, terms: string[]): boolean {
  if (terms.length === 0) return true;
  const patterns = terms.map((t) => {
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
  relevanceTerms: string[] = [],
): Discussion[] {
  const seen = new Set<string>();
  const out: Discussion[] = [];

  for (const { post, comments } of raw) {
    if (!post?.id || seen.has(post.id)) continue;
    if (isMetaPost(post.title)) continue;
    if (!isOnTopic(post, relevanceTerms)) continue;

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
