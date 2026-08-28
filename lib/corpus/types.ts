import type { CategoryId, Locality } from "../options";

/**
 * A comment kept in the corpus. Bodies are truncated at collection time —
 * the analysis prompt reads for themes, not for full threads, and untruncated
 * threads blow the context budget without changing the findings.
 */
export interface CorpusComment {
  id: string;
  body: string;
  score: number;
}

/**
 * One discussion: a post plus its top comments. This is the unit that
 * frequency is counted in. One thread with fifty comments about privacy is
 * one discussion mentioning privacy — see README, "Discussion-level frequency".
 */
export interface Discussion {
  id: string;
  subreddit: string;
  locality: Locality;
  title: string;
  selftext: string;
  permalink: string;
  createdUtc: number;
  score: number;
  numComments: number;
  comments: CorpusComment[];
}

export interface CategoryCorpus {
  categoryId: CategoryId;
  collectedAt: string;
  /** Human-readable description of the time window, shown on the brief. */
  window: string;
  discussions: Discussion[];
}

export interface CorpusStats {
  total: number;
  uk: number;
  global: number;
  bySubreddit: Record<string, number>;
}

/**
 * The subset of Reddit's listing payload the corpus needs. Both acquisition
 * paths — the browser session now, an OAuth client later — return this same
 * shape, so only the transport changes when credentials arrive.
 */
export interface RawPost {
  id: string;
  title: string;
  selftext?: string;
  permalink: string;
  created_utc: number;
  score: number;
  num_comments: number;
}

export interface RawComment {
  id: string;
  body: string;
  score: number;
}

export interface RawDiscussion {
  post: RawPost;
  comments: RawComment[];
}
