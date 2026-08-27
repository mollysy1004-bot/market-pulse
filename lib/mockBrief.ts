import type { CategoryId, Locality } from "./options";

export type Confidence = "High" | "Medium" | "Low";
export type SentimentLabel = "Positive" | "Mixed" | "Cautious" | "Negative";

export interface Quote {
  text: string;
  subreddit: string;
  locality: Locality;
}

export interface SourceRef {
  subreddit: string;
  postTitle: string;
  locality: Locality;
}

export interface SectionEvidence {
  confidence: Confidence;
  /** One-line explanation of how the confidence level was reached. */
  basis: string;
  sources: SourceRef[];
}

export interface Barrier {
  name: string;
  /** Discussion-level frequency, never comment-level. */
  frequency: string;
  quote: Quote;
  implication: string;
}

export interface ContentAngle {
  hook: string;
  why: string;
  format: string;
}

export interface CreatorSignal {
  signal: string;
  evidenceNote: string;
  profile: string;
  platform: string;
  scale: string;
}

export interface Competitor {
  name: string;
  discussions: number;
  summary: string;
  strengths: Quote[];
  weaknesses: Quote[];
}

export interface Brief {
  categoryId: CategoryId;
  discussionsAnalysed: number;
  ukDiscussions: number;
  globalDiscussions: number;
  dataWindow: string;
  sentiment: {
    label: SentimentLabel;
    headline: string;
    summary: string;
    quotes: Quote[];
    evidence: SectionEvidence;
  };
  barriers: { items: Barrier[]; evidence: SectionEvidence };
  content: { items: ContentAngle[]; evidence: SectionEvidence };
  creators: { items: CreatorSignal[]; evidence: SectionEvidence };
  competitive: { items: Competitor[]; gap: string; evidence: SectionEvidence };
}

const BRIEFS: Record<CategoryId, Brief> = {
  "ai-app": {
    categoryId: "ai-app",
    discussionsAnalysed: 31,
    ukDiscussions: 8,
    globalDiscussions: 23,
    dataWindow: "Posts and comment threads from the last 90 days",
    sentiment: {
      label: "Mixed",
      headline: "Curious but sceptical",
      summary:
        "UK students are actively experimenting with AI productivity tools, but trust remains low. The dominant concern is output reliability — several report that checking AI-generated work takes as long as doing it themselves. Privacy is a secondary but growing concern, particularly for tools that require a login or document access.",
      quotes: [
        {
          text: "Half my flatmates use ChatGPT for essays but none of them trust it",
          subreddit: "UniUK",
          locality: "UK",
        },
        {
          text: "I've tried 6 AI writing tools and they all hallucinate the same way",
          subreddit: "ChatGPT",
          locality: "Global",
        },
        {
          text: "My lecturer said he can tell when something's AI-generated, not worth the risk",
          subreddit: "6thForm",
          locality: "UK",
        },
      ],
      evidence: {
        confidence: "Medium",
        basis: "8 UK-oriented discussions and 23 global discussions",
        sources: [
          { subreddit: "UniUK", postTitle: "Does anyone actually trust AI for coursework?", locality: "UK" },
          { subreddit: "UniUK", postTitle: "Uni's new AI policy — what does this actually mean", locality: "UK" },
          { subreddit: "6thForm", postTitle: "Using ChatGPT for A-level revision", locality: "UK" },
          { subreddit: "ChatGPT", postTitle: "Which AI writing tool has the least hallucination?", locality: "Global" },
          { subreddit: "productivity", postTitle: "My honest AI tool stack after a year", locality: "Global" },
        ],
      },
    },
    barriers: {
      items: [
        {
          name: "Output reliability",
          frequency: "18 of 31 discussions",
          quote: {
            text: "I still have to fact-check everything, so what's the point?",
            subreddit: "ChatGPT",
            locality: "Global",
          },
          implication:
            "Messaging that claims speed will be discounted. Lead with verification and sourcing, not raw output volume.",
        },
        {
          name: "Subscription fatigue",
          frequency: "12 of 31 discussions",
          quote: {
            text: "Another £20/month tool? I already pay for ChatGPT Plus.",
            subreddit: "UKPersonalFinance",
            locality: "UK",
          },
          implication:
            "A free tier or student pricing is close to mandatory for this audience. Price is discussed before features.",
        },
        {
          name: "Privacy and data concerns",
          frequency: "9 of 31 discussions",
          quote: {
            text: "I don't want to give my university essays to some company I've never heard of",
            subreddit: "UniUK",
            locality: "UK",
          },
          implication:
            "Highest-stakes barrier for a Chinese brand entering the UK. Data residency and retention policy should be a first-screen claim, not buried in a settings page.",
        },
        {
          name: "Academic integrity risk",
          frequency: "7 of 31 discussions",
          quote: {
            text: "It's not worth getting pulled into an academic misconduct meeting over a shortcut",
            subreddit: "UniUK",
            locality: "UK",
          },
          implication:
            "UK-specific and under-served. Positioning around study support rather than writing output sidesteps the risk entirely.",
        },
      ],
      evidence: {
        confidence: "Medium",
        basis:
          "Two of four barriers rest primarily on UK-oriented discussions; the top two are global category signals",
        sources: [
          { subreddit: "UniUK", postTitle: "Is using AI for essays actually cheating now?", locality: "UK" },
          { subreddit: "UKPersonalFinance", postTitle: "How many subscriptions is too many", locality: "UK" },
          { subreddit: "ChatGPT", postTitle: "Fact-checking takes longer than writing it myself", locality: "Global" },
          { subreddit: "artificial", postTitle: "Why do all these tools feel identical", locality: "Global" },
        ],
      },
    },
    content: {
      items: [
        {
          hook: "I tested 5 AI tools on my actual coursework — here's what happened",
          why: "UK students are sceptical of AI claims [UK, r/UniUK]. Authentic comparative testing mirrors how they already evaluate tools — comparison threads consistently draw the highest engagement [Global, r/ChatGPT].",
          format: "TikTok / YouTube short, 2–3 min",
        },
        {
          hook: "What your university's AI policy actually says",
          why: "Policy confusion appears in 7 of 31 discussions and is almost entirely UK-specific [UK, r/UniUK and r/6thForm]. No competitor is addressing it, so the topic is uncontested.",
          format: "Short explainer or carousel",
        },
        {
          hook: "Where your essay actually goes when you paste it into an AI tool",
          why: "Privacy is raised in 9 of 31 discussions, and users describe it in concrete terms rather than abstract principle [UK, r/UniUK]. Addressing it directly converts the top objection into a differentiator.",
          format: "Long-form video or written explainer",
        },
      ],
      evidence: {
        confidence: "Medium",
        basis: "Angles derive from 8 UK-oriented discussions, supported by global engagement patterns",
        sources: [
          { subreddit: "UniUK", postTitle: "Does anyone actually trust AI for coursework?", locality: "UK" },
          { subreddit: "6thForm", postTitle: "Using ChatGPT for A-level revision", locality: "UK" },
          { subreddit: "ChatGPT", postTitle: "Which AI writing tool has the least hallucination?", locality: "Global" },
        ],
      },
    },
    creators: {
      items: [
        {
          signal: "Peer-led, first-hand testing outperforms polished review formats",
          evidenceNote:
            "Discussions in r/UniUK [UK] show students evaluating tools through peer recommendation and personal testing. The most-engaged threads are 'I actually tried this' accounts from other students, not reviewer round-ups. [8 UK discussions, 14 global discussions]",
          profile: "UK university student productivity creators",
          platform: "TikTok, YouTube",
          scale: "10K–100K (micro)",
        },
        {
          signal: "Audiences discount claims made without a visible failure case",
          evidenceNote:
            "Across r/ChatGPT and r/productivity [Global], comparison posts that name what a tool did badly draw markedly more replies than uniformly positive posts. [11 global discussions]",
          profile: "Creators who publish limitations alongside benefits",
          platform: "YouTube, Reddit-native",
          scale: "Any",
        },
        {
          signal: "Subject-specific demonstration is preferred over generic productivity framing",
          evidenceNote:
            "Requests in r/UniUK [UK] specify degree context — law reading lists, lab reports, dissertation structure — rather than 'productivity' in the abstract. [5 UK discussions]",
          profile: "Course-specific student creators (law, medicine, engineering)",
          platform: "TikTok, Instagram",
          scale: "5K–50K (nano to micro)",
        },
      ],
      evidence: {
        confidence: "Medium",
        basis: "8 UK-oriented discussions and 14 global discussions describe creator and format preference",
        sources: [
          { subreddit: "UniUK", postTitle: "Best study-tool accounts to follow?", locality: "UK" },
          { subreddit: "UniUK", postTitle: "Does anyone actually trust AI for coursework?", locality: "UK" },
          { subreddit: "productivity", postTitle: "My honest AI tool stack after a year", locality: "Global" },
        ],
      },
    },
    competitive: {
      items: [
        {
          name: "ChatGPT",
          discussions: 22,
          summary: "Dominant awareness. Treated as the default rather than a choice.",
          strengths: [{ text: "it just works for most things", subreddit: "ChatGPT", locality: "Global" }],
          weaknesses: [
            { text: "expensive for what I actually use it for", subreddit: "UKPersonalFinance", locality: "UK" },
            { text: "too general — it doesn't know my course", subreddit: "UniUK", locality: "UK" },
          ],
        },
        {
          name: "Notion AI",
          discussions: 7,
          summary: "Liked by power users, dismissed by everyone else.",
          strengths: [{ text: "great if you already live in Notion", subreddit: "productivity", locality: "Global" }],
          weaknesses: [{ text: "overkill for simple tasks", subreddit: "productivity", locality: "Global" }],
        },
        {
          name: "Gemini",
          discussions: 5,
          summary: "Growing mentions, trust framed around the parent company.",
          strengths: [{ text: "the free tier is genuinely usable", subreddit: "artificial", locality: "Global" }],
          weaknesses: [{ text: "Google will just use my data", subreddit: "ChatGPT", locality: "Global" }],
        },
      ],
      gap: "No tool is positioning around UK student-specific use cases. Price sensitivity and academic-integrity anxiety are both high in UK discussions and unaddressed by the current market leaders.",
      evidence: {
        confidence: "Low",
        basis: "Competitor mentions come mostly from global communities — 6 UK-oriented against 28 global mentions",
        sources: [
          { subreddit: "ChatGPT", postTitle: "Which AI writing tool has the least hallucination?", locality: "Global" },
          { subreddit: "artificial", postTitle: "Gemini vs GPT for study use", locality: "Global" },
          { subreddit: "UniUK", postTitle: "Is ChatGPT Plus worth it as a student?", locality: "UK" },
        ],
      },
    },
  },

  "consumer-electronics": {
    categoryId: "consumer-electronics",
    discussionsAnalysed: 27,
    ukDiscussions: 11,
    globalDiscussions: 16,
    dataWindow: "Posts and comment threads from the last 90 days",
    sentiment: {
      label: "Positive",
      headline: "Value-driven and brand-agnostic",
      summary:
        "UK buyers in this category are notably unattached to established brands and will name a challenger brand unprompted if the price-to-spec ratio holds. Scepticism attaches to warranty and after-sales handling rather than to product quality, which is a materially different objection from the one HQ teams usually anticipate.",
      quotes: [
        {
          text: "Bought the cheaper one and honestly can't tell the difference",
          subreddit: "UKTech",
          locality: "UK",
        },
        {
          text: "My only worry with these brands is what happens when it breaks in year two",
          subreddit: "AskUK",
          locality: "UK",
        },
        {
          text: "Build quality has caught up, the gap now is software",
          subreddit: "gadgets",
          locality: "Global",
        },
      ],
      evidence: {
        confidence: "High",
        basis: "11 UK-oriented discussions and 16 global discussions",
        sources: [
          { subreddit: "UKTech", postTitle: "Is it worth paying for the brand name any more?", locality: "UK" },
          { subreddit: "AskUK", postTitle: "Warranty experiences with newer brands", locality: "UK" },
          { subreddit: "gadgets", postTitle: "Challenger brands have closed the gap", locality: "Global" },
        ],
      },
    },
    barriers: {
      items: [
        {
          name: "After-sales and warranty uncertainty",
          frequency: "14 of 27 discussions",
          quote: {
            text: "Who do I even contact if it fails? That's the bit that puts me off",
            subreddit: "AskUK",
            locality: "UK",
          },
          implication:
            "The leading UK objection, and it is a service question rather than a product one. A visible UK returns and repair path outranks any spec claim.",
        },
        {
          name: "Retail availability and trust signals",
          frequency: "9 of 27 discussions",
          quote: {
            text: "If it's not on Currys or Argos I assume it's a gamble",
            subreddit: "UKTech",
            locality: "UK",
          },
          implication:
            "UK-specific. Presence in a known retailer functions as a trust proxy — worth more than review volume on a brand's own site.",
        },
        {
          name: "Software and app quality",
          frequency: "8 of 27 discussions",
          quote: {
            text: "Hardware is great, the app is where it falls apart",
            subreddit: "gadgets",
            locality: "Global",
          },
          implication:
            "The most common global criticism of challenger brands. An unusually cheap differentiator, since expectations are low.",
        },
      ],
      evidence: {
        confidence: "High",
        basis: "Two of three barriers rest primarily on UK-oriented discussions",
        sources: [
          { subreddit: "AskUK", postTitle: "Warranty experiences with newer brands", locality: "UK" },
          { subreddit: "UKTech", postTitle: "Where do you actually buy these", locality: "UK" },
          { subreddit: "gadgets", postTitle: "Why is the companion app always bad", locality: "Global" },
        ],
      },
    },
    content: {
      items: [
        {
          hook: "What actually happens when you claim a warranty in the UK",
          why: "After-sales uncertainty leads UK discussions at 14 of 27 [UK, r/AskUK]. No competitor is making this visible, so demonstrating the process directly answers the top objection.",
          format: "Documentary-style short or written walkthrough",
        },
        {
          hook: "Two years in — what has actually broken",
          why: "Longevity and repairability recur across r/BuyItForLife [Global] and r/UKTech [UK]. Durability evidence outperforms launch-spec content with this audience.",
          format: "Long-form video",
        },
        {
          hook: "Same spec, half the price — where does the money actually go?",
          why: "Price-to-spec reasoning is how this audience already argues in-thread [UK, r/UKTech]. Meeting them inside their own comparison frame is more persuasive than a feature list.",
          format: "Comparison video or carousel",
        },
      ],
      evidence: {
        confidence: "High",
        basis: "Angles derive from 11 UK-oriented discussions with global corroboration",
        sources: [
          { subreddit: "AskUK", postTitle: "Warranty experiences with newer brands", locality: "UK" },
          { subreddit: "UKTech", postTitle: "Is it worth paying for the brand name any more?", locality: "UK" },
          { subreddit: "BuyItForLife", postTitle: "Two years with a budget brand", locality: "Global" },
        ],
      },
    },
    creators: {
      items: [
        {
          signal: "Long-term ownership updates carry more weight than launch reviews",
          evidenceNote:
            "Across r/BuyItForLife and r/gadgets [Global], and echoed in r/UKTech [UK], commenters explicitly discount day-one reviews and ask for six- and twelve-month follow-ups. [6 UK discussions, 10 global discussions]",
          profile: "Reviewers who publish revisit content on a fixed schedule",
          platform: "YouTube",
          scale: "50K–500K",
        },
        {
          signal: "UK-specific purchase context is asked for explicitly",
          evidenceNote:
            "Threads in r/UKTech and r/AskUK [UK] repeatedly ask for UK pricing, UK warranty terms and UK retail availability, and dismiss US-based reviews as inapplicable. [7 UK discussions]",
          profile: "UK-based tech reviewers covering local pricing and retail",
          platform: "YouTube, TikTok",
          scale: "20K–200K",
        },
      ],
      evidence: {
        confidence: "High",
        basis: "7 UK-oriented discussions state the preference directly, with 10 global discussions agreeing",
        sources: [
          { subreddit: "UKTech", postTitle: "Where do you actually buy these", locality: "UK" },
          { subreddit: "AskUK", postTitle: "Warranty experiences with newer brands", locality: "UK" },
          { subreddit: "BuyItForLife", postTitle: "Two years with a budget brand", locality: "Global" },
        ],
      },
    },
    competitive: {
      items: [
        {
          name: "Anker",
          discussions: 13,
          summary: "The reference point for a challenger brand that earned trust.",
          strengths: [{ text: "never had one fail on me", subreddit: "gadgets", locality: "Global" }],
          weaknesses: [{ text: "the range has got confusing, too many sub-brands", subreddit: "UKTech", locality: "UK" }],
        },
        {
          name: "Established incumbents",
          discussions: 10,
          summary: "Bought for reassurance rather than performance.",
          strengths: [{ text: "you know the warranty will be honoured", subreddit: "AskUK", locality: "UK" }],
          weaknesses: [{ text: "paying twice as much for the logo", subreddit: "UKTech", locality: "UK" }],
        },
      ],
      gap: "Trust in this category is won through after-sales visibility, not specification. No brand in these discussions is marketing its UK service experience, despite it being the most frequently raised UK objection.",
      evidence: {
        confidence: "Medium",
        basis: "Competitor mentions split 9 UK-oriented against 14 global",
        sources: [
          { subreddit: "UKTech", postTitle: "Is it worth paying for the brand name any more?", locality: "UK" },
          { subreddit: "gadgets", postTitle: "Challenger brands have closed the gap", locality: "Global" },
        ],
      },
    },
  },

  "smart-home": {
    categoryId: "smart-home",
    discussionsAnalysed: 24,
    ukDiscussions: 9,
    globalDiscussions: 15,
    dataWindow: "Posts and comment threads from the last 90 days",
    sentiment: {
      label: "Cautious",
      headline: "Enthusiastic in principle, wary of lock-in",
      summary:
        "UK smart-home discussion is dominated by interoperability and by the housing stock itself — older properties, rented flats and landlord restrictions come up constantly. Interest in the category is high, but purchases are deferred by fear of committing to an ecosystem that will be abandoned.",
      quotes: [
        { text: "Half my flat is rented so anything I screw into a wall is a no", subreddit: "UKsmarthome", locality: "UK" },
        { text: "I've been burned once by a cloud service shutting down", subreddit: "homeautomation", locality: "Global" },
        { text: "Does it work without the app is my first question now", subreddit: "smarthome", locality: "Global" },
      ],
      evidence: {
        confidence: "Medium",
        basis: "9 UK-oriented discussions and 15 global discussions",
        sources: [
          { subreddit: "UKsmarthome", postTitle: "Renting — what can I actually install?", locality: "UK" },
          { subreddit: "homeautomation", postTitle: "What happens when the company shuts down", locality: "Global" },
          { subreddit: "smarthome", postTitle: "Local control or nothing", locality: "Global" },
        ],
      },
    },
    barriers: {
      items: [
        {
          name: "Ecosystem lock-in and service shutdown risk",
          frequency: "15 of 24 discussions",
          quote: { text: "I've been burned once by a cloud service shutting down", subreddit: "homeautomation", locality: "Global" },
          implication: "Local control and open-standard support are the strongest available reassurance, and are read as a proxy for company seriousness.",
        },
        {
          name: "Rental and older-property constraints",
          frequency: "8 of 24 discussions",
          quote: { text: "Half my flat is rented so anything I screw into a wall is a no", subreddit: "UKsmarthome", locality: "UK" },
          implication: "Distinctly UK. Non-permanent installation is a marketable feature here in a way it is not in most markets.",
        },
        {
          name: "Setup complexity",
          frequency: "7 of 24 discussions",
          quote: { text: "Spent an evening getting two devices to talk to each other", subreddit: "smarthome", locality: "Global" },
          implication: "Time-to-first-use is a credible headline claim, and is rarely made by competitors.",
        },
      ],
      evidence: {
        confidence: "Medium",
        basis: "One of three barriers is UK-specific; the remainder are global category signals",
        sources: [
          { subreddit: "UKsmarthome", postTitle: "Renting — what can I actually install?", locality: "UK" },
          { subreddit: "homeautomation", postTitle: "What happens when the company shuts down", locality: "Global" },
        ],
      },
    },
    content: {
      items: [
        {
          hook: "Smart home setup for a UK rental — nothing drilled, nothing permanent",
          why: "Rental and older-property constraints appear in 8 of 24 discussions and are close to absent from competitor content [UK, r/UKsmarthome].",
          format: "Room-by-room video walkthrough",
        },
        {
          hook: "What still works if the company disappears tomorrow",
          why: "Shutdown anxiety leads the category at 15 of 24 discussions [Global, r/homeautomation]. Addressing it directly converts the top objection into a trust claim.",
          format: "Written explainer or short video",
        },
      ],
      evidence: {
        confidence: "Medium",
        basis: "9 UK-oriented discussions with global corroboration",
        sources: [
          { subreddit: "UKsmarthome", postTitle: "Renting — what can I actually install?", locality: "UK" },
          { subreddit: "homeautomation", postTitle: "What happens when the company shuts down", locality: "Global" },
        ],
      },
    },
    creators: {
      items: [
        {
          signal: "Audiences follow whole-home build series rather than single-product reviews",
          evidenceNote:
            "In r/homeautomation and r/smarthome [Global], recommendations are framed around creators documenting an evolving setup over months. [11 global discussions]",
          profile: "Creators running an ongoing home build series",
          platform: "YouTube",
          scale: "50K–300K",
        },
        {
          signal: "UK housing context is treated as a qualifying credential",
          evidenceNote:
            "Commenters in r/UKsmarthome [UK] discount US creators specifically on housing differences — wiring, radiators, room size. [6 UK discussions]",
          profile: "UK-based creators working in typical UK housing stock",
          platform: "YouTube, TikTok",
          scale: "10K–100K",
        },
      ],
      evidence: {
        confidence: "Medium",
        basis: "6 UK-oriented discussions and 11 global discussions describe creator preference",
        sources: [
          { subreddit: "UKsmarthome", postTitle: "UK-specific smart home channels?", locality: "UK" },
          { subreddit: "smarthome", postTitle: "Local control or nothing", locality: "Global" },
        ],
      },
    },
    competitive: {
      items: [
        {
          name: "Philips Hue",
          discussions: 11,
          summary: "The reliability benchmark, and the price complaint.",
          strengths: [{ text: "it just never drops off the network", subreddit: "homeautomation", locality: "Global" }],
          weaknesses: [{ text: "the price per bulb is hard to justify", subreddit: "UKsmarthome", locality: "UK" }],
        },
        {
          name: "Home Assistant ecosystem",
          discussions: 9,
          summary: "The default recommendation of experienced users.",
          strengths: [{ text: "everything works locally and nothing phones home", subreddit: "homeautomation", locality: "Global" }],
          weaknesses: [{ text: "not something I'd set my parents up with", subreddit: "smarthome", locality: "Global" }],
        },
      ],
      gap: "The category splits between expensive-but-reliable and cheap-but-fragile, with reliability discussed almost entirely in terms of network stability. A brand that made local control legible to non-technical buyers would sit in an unoccupied position.",
      evidence: {
        confidence: "Low",
        basis: "Competitor mentions come mostly from global communities — 5 UK-oriented against 20 global",
        sources: [
          { subreddit: "homeautomation", postTitle: "What happens when the company shuts down", locality: "Global" },
          { subreddit: "UKsmarthome", postTitle: "Cheaper alternatives to Hue?", locality: "UK" },
        ],
      },
    },
  },

  "3d-printer": {
    categoryId: "3d-printer",
    discussionsAnalysed: 26,
    ukDiscussions: 2,
    globalDiscussions: 24,
    dataWindow: "Posts and comment threads from the last 90 days",
    sentiment: {
      label: "Positive",
      headline: "Enthusiastic, and unusually well-informed",
      summary:
        "This category's discussion is highly technical and largely brand-loyal. Participants compare print quality, slicer software and support responsiveness in detail, and are quick to identify marketing claims that do not match observed behaviour. UK-specific discussion is thin, so most of the below reflects category-wide attitudes rather than UK consumers specifically.",
      quotes: [
        { text: "First layer is everything and most reviews skip it entirely", subreddit: "3Dprinting", locality: "Global" },
        { text: "The slicer is half the product and nobody markets it that way", subreddit: "BambuLab", locality: "Global" },
        { text: "Support response time is the actual differentiator now", subreddit: "3Dprinting", locality: "Global" },
      ],
      evidence: {
        confidence: "Low",
        basis: "Only 2 UK-oriented discussions against 24 global discussions — UK validation is limited",
        sources: [
          { subreddit: "3Dprinting", postTitle: "What do reviews consistently get wrong", locality: "Global" },
          { subreddit: "BambuLab", postTitle: "Slicer software is underrated", locality: "Global" },
        ],
      },
    },
    barriers: {
      items: [
        {
          name: "Marketing claims that do not survive testing",
          frequency: "14 of 26 discussions",
          quote: { text: "Advertised speed is never the speed you get a clean print at", subreddit: "3Dprinting", locality: "Global" },
          implication: "Headline performance numbers actively damage credibility here. Publish the qualified figure instead.",
        },
        {
          name: "Support and spare-parts availability",
          frequency: "11 of 26 discussions",
          quote: { text: "Waited three weeks for a replacement part", subreddit: "ender3", locality: "Global" },
          implication: "Regional parts availability is a purchase criterion, and is where a European presence can be made concrete.",
        },
        {
          name: "Proprietary consumables",
          frequency: "8 of 26 discussions",
          quote: { text: "If it only takes their own filament that's an instant no", subreddit: "3Dprinting", locality: "Global" },
          implication: "Openness is a positioning asset in this category, not a concession.",
        },
      ],
      evidence: {
        confidence: "Low",
        basis: "Barriers rest almost entirely on global discussions; UK-specific validation is not available",
        sources: [
          { subreddit: "3Dprinting", postTitle: "What do reviews consistently get wrong", locality: "Global" },
          { subreddit: "ender3", postTitle: "Spare parts wait times", locality: "Global" },
        ],
      },
    },
    content: {
      items: [
        {
          hook: "The unedited first print, straight out of the box",
          why: "Scepticism toward staged demonstrations is the strongest signal in the category at 14 of 26 discussions [Global, r/3Dprinting].",
          format: "Unedited long-form video",
        },
        {
          hook: "What broke in the first 500 hours, and how long the part took to arrive",
          why: "Support and parts availability appears in 11 of 26 discussions and is rarely covered by manufacturer content [Global, r/ender3].",
          format: "Written teardown or long-form video",
        },
      ],
      evidence: {
        confidence: "Low",
        basis: "Derived from 24 global discussions with almost no UK-specific input",
        sources: [
          { subreddit: "3Dprinting", postTitle: "What do reviews consistently get wrong", locality: "Global" },
          { subreddit: "ender3", postTitle: "Spare parts wait times", locality: "Global" },
        ],
      },
    },
    creators: {
      items: [
        {
          signal: "Technical depth is a credibility requirement, not a niche preference",
          evidenceNote:
            "Recommendations in r/3Dprinting [Global] consistently favour creators who publish test methodology and failed prints alongside successes. [16 global discussions]",
          profile: "Technical reviewers who publish their test method",
          platform: "YouTube",
          scale: "20K–200K",
        },
        {
          signal: "Application-led content reaches beyond the existing hobbyist base",
          evidenceNote:
            "r/functionalprint [Global] shows that use-case content circulates well outside the core community, where specification content does not. [7 global discussions]",
          profile: "Makers documenting practical end-use projects",
          platform: "YouTube, Instagram",
          scale: "10K–100K",
        },
      ],
      evidence: {
        confidence: "Low",
        basis: "Creator signals rest on 23 global discussions with no UK-specific corroboration",
        sources: [
          { subreddit: "3Dprinting", postTitle: "Which reviewers do you actually trust", locality: "Global" },
          { subreddit: "functionalprint", postTitle: "Prints that earned their keep", locality: "Global" },
        ],
      },
    },
    competitive: {
      items: [
        {
          name: "Bambu Lab",
          discussions: 15,
          summary: "The current benchmark for out-of-the-box reliability.",
          strengths: [{ text: "it just prints, which used to be a fantasy", subreddit: "3Dprinting", locality: "Global" }],
          weaknesses: [{ text: "the cloud dependency worries me long term", subreddit: "BambuLab", locality: "Global" }],
        },
        {
          name: "Creality / Ender line",
          discussions: 9,
          summary: "The budget entry point, valued for openness rather than polish.",
          strengths: [{ text: "you can fix anything on it yourself", subreddit: "ender3", locality: "Global" }],
          weaknesses: [{ text: "quality control is a lottery", subreddit: "ender3", locality: "Global" }],
        },
      ],
      gap: "The category is split between closed-and-reliable and open-but-inconsistent. Cloud dependency is the most frequent unaddressed anxiety about the current leader.",
      evidence: {
        confidence: "Low",
        basis: "All competitor mentions are from global communities — no UK-specific evidence available",
        sources: [
          { subreddit: "BambuLab", postTitle: "Cloud dependency concerns", locality: "Global" },
          { subreddit: "ender3", postTitle: "QC lottery thread", locality: "Global" },
        ],
      },
    },
  },

  "action-camera": {
    categoryId: "action-camera",
    discussionsAnalysed: 23,
    ukDiscussions: 3,
    globalDiscussions: 20,
    dataWindow: "Posts and comment threads from the last 90 days",
    sentiment: {
      label: "Mixed",
      headline: "Loyal to a category, sceptical of iteration",
      summary:
        "Buyers are committed to the category but openly doubtful that each generation adds real value. Discussion centres on mounting ecosystems, battery behaviour in cold conditions and the workflow after capture. As with 3D printers, UK-specific discussion is sparse, so these are largely category-wide signals.",
      quotes: [
        { text: "Every year it's the same camera with a new number", subreddit: "gopro", locality: "Global" },
        { text: "Battery life in the cold is the only spec I actually care about", subreddit: "gopro", locality: "Global" },
        { text: "Stabilisation is solved — the editing workflow is not", subreddit: "videography", locality: "Global" },
      ],
      evidence: {
        confidence: "Low",
        basis: "Only 3 UK-oriented discussions against 20 global discussions — UK validation is limited",
        sources: [
          { subreddit: "gopro", postTitle: "Is the upgrade actually worth it this year", locality: "Global" },
          { subreddit: "videography", postTitle: "Post-production is the bottleneck", locality: "Global" },
        ],
      },
    },
    barriers: {
      items: [
        {
          name: "Perceived lack of generational improvement",
          frequency: "13 of 23 discussions",
          quote: { text: "Every year it's the same camera with a new number", subreddit: "gopro", locality: "Global" },
          implication: "Iteration framing is actively counterproductive. Lead with a changed workflow, not an incremented spec.",
        },
        {
          name: "Battery performance in cold conditions",
          frequency: "9 of 23 discussions",
          quote: { text: "Dies in twenty minutes on a winter ride", subreddit: "MTB", locality: "Global" },
          implication: "The most concrete unmet need in the category, and directly relevant to UK and Northern European use.",
        },
        {
          name: "Post-capture workflow friction",
          frequency: "8 of 23 discussions",
          quote: { text: "I've got 200GB of footage I'll never edit", subreddit: "videography", locality: "Global" },
          implication: "The bottleneck has moved from capture to editing. Software is where differentiation is available.",
        },
      ],
      evidence: {
        confidence: "Low",
        basis: "Barriers rest almost entirely on global discussions; UK-specific validation is not available",
        sources: [
          { subreddit: "gopro", postTitle: "Is the upgrade actually worth it this year", locality: "Global" },
          { subreddit: "MTB", postTitle: "Winter riding kit thread", locality: "Global" },
        ],
      },
    },
    content: {
      items: [
        {
          hook: "A full winter season on one camera — cold, wet, and unedited",
          why: "Cold-weather battery behaviour appears in 9 of 23 discussions and is the most concrete unmet need in the category [Global, r/MTB].",
          format: "Long-form video",
        },
        {
          hook: "From 200GB of footage to one watchable clip",
          why: "Post-capture workflow friction appears in 8 of 23 discussions, and no competitor is addressing it in marketing [Global, r/videography].",
          format: "Tutorial or short series",
        },
      ],
      evidence: {
        confidence: "Low",
        basis: "Derived from 20 global discussions with almost no UK-specific input",
        sources: [
          { subreddit: "MTB", postTitle: "Winter riding kit thread", locality: "Global" },
          { subreddit: "videography", postTitle: "Post-production is the bottleneck", locality: "Global" },
        ],
      },
    },
    creators: {
      items: [
        {
          signal: "Sport-community credibility outweighs camera expertise",
          evidenceNote:
            "In r/MTB and adjacent sport communities [Global], footage is judged on the riding first and the camera second; camera-first channels are treated as advertising. [12 global discussions]",
          profile: "Athletes and sport creators who happen to film",
          platform: "YouTube, Instagram",
          scale: "20K–200K",
        },
        {
          signal: "Sustained-use footage is trusted over launch content",
          evidenceNote:
            "r/gopro [Global] threads repeatedly ask for season-long footage rather than launch reviews, and dismiss brand-supplied clips. [9 global discussions]",
          profile: "Creators publishing a full season on one setup",
          platform: "YouTube",
          scale: "10K–150K",
        },
      ],
      evidence: {
        confidence: "Low",
        basis: "Creator signals rest on 21 global discussions with no UK-specific corroboration",
        sources: [
          { subreddit: "gopro", postTitle: "Season-long footage thread", locality: "Global" },
          { subreddit: "MTB", postTitle: "Winter riding kit thread", locality: "Global" },
        ],
      },
    },
    competitive: {
      items: [
        {
          name: "GoPro",
          discussions: 14,
          summary: "The default, and the target of most iteration fatigue.",
          strengths: [{ text: "the mounting ecosystem is unbeatable", subreddit: "gopro", locality: "Global" }],
          weaknesses: [{ text: "the subscription model annoys everyone", subreddit: "gopro", locality: "Global" }],
        },
        {
          name: "Insta360",
          discussions: 10,
          summary: "Seen as the more inventive option, with a software-first reputation.",
          strengths: [{ text: "the reframing workflow is genuinely different", subreddit: "videography", locality: "Global" }],
          weaknesses: [{ text: "the app does too much and it shows", subreddit: "Insta360", locality: "Global" }],
        },
      ],
      gap: "Both leaders are judged on software rather than optics, yet neither markets on it. Cold-weather endurance is raised repeatedly and claimed by nobody.",
      evidence: {
        confidence: "Low",
        basis: "All competitor mentions are from global communities — no UK-specific evidence available",
        sources: [
          { subreddit: "gopro", postTitle: "Subscription model thread", locality: "Global" },
          { subreddit: "Insta360", postTitle: "App complexity complaints", locality: "Global" },
        ],
      },
    },
  },
};

export function getBrief(categoryId: string | undefined): Brief {
  if (categoryId && categoryId in BRIEFS) {
    return BRIEFS[categoryId as CategoryId];
  }
  return BRIEFS["ai-app"];
}
