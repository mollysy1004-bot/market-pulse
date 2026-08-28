export type Locality = "UK" | "Global";

export type CategoryId =
  | "ai-app"
  | "consumer-electronics"
  | "charging-power"
  | "audio-earbuds"
  | "smart-home"
  | "3d-printer"
  | "action-camera";

export interface Option {
  id: string;
  label: string;
  hint?: string;
  available?: boolean;
}

export const CATEGORIES: Option[] = [
  { id: "ai-app", label: "AI App", hint: "Doubao, ChatGPT competitors", available: true },
  // Consumer Electronics is the odd entry here: the other categories name a
  // product type, and this one names a shelf. It collected cookware and car
  // finance before the anchor gate, and reads thin afterwards because it was
  // never one category. Charging & Power and Audio are the two slices where
  // Chinese brands actually compete and where dedicated communities exist, so
  // they are collected separately rather than pooled.
  { id: "consumer-electronics", label: "Consumer Electronics", hint: "broad — see Charging or Audio", available: true },
  { id: "charging-power", label: "Charging & Power", hint: "Anker, Ugreen, Baseus", available: false },
  { id: "audio-earbuds", label: "Audio & Earbuds", hint: "Soundcore, Edifier, QCY", available: false },
  { id: "smart-home", label: "Smart Home", hint: "Dreame, Roborock", available: true },
  { id: "3d-printer", label: "3D Printer", hint: "Bambu Lab", available: true },
  { id: "action-camera", label: "Action Camera", hint: "Insta360, GoPro competitors", available: true },
];

export const MARKETS: Option[] = [
  { id: "uk", label: "United Kingdom", available: true },
  { id: "us", label: "United States", hint: "coming soon", available: false },
  { id: "de", label: "Germany", hint: "coming soon", available: false },
  { id: "id", label: "Indonesia", hint: "coming soon", available: false },
  { id: "mx", label: "Mexico", hint: "coming soon", available: false },
];

export const AUDIENCES: Option[] = [
  { id: "gen-z", label: "Gen Z (18–25)", available: true },
  { id: "students", label: "Students", available: true },
  { id: "tech-enthusiasts", label: "Tech Enthusiasts", available: true },
  { id: "creators", label: "Creators / Makers", available: true },
  { id: "parents", label: "Parents", available: true },
  { id: "professionals", label: "Professionals (25–40)", available: true },
];

export interface SubredditRef {
  name: string;
  locality: Locality;
  note: string;
}

/**
 * Category to subreddit mapping, tagged by locality.
 * This mapping is domain knowledge, not a technical detail: it encodes where
 * UK consumers actually discuss each category, and which sources can only
 * support general category signals.
 */
export const SUBREDDIT_MAP: Record<CategoryId, SubredditRef[]> = {
  "ai-app": [
    { name: "UniUK", locality: "UK", note: "UK university students, study tools, AI in education" },
    { name: "AskUK", locality: "UK", note: "General UK consumer attitudes" },
    { name: "6thForm", locality: "UK", note: "Younger UK students (A-level), tech adoption" },
    { name: "UKPersonalFinance", locality: "UK", note: "Subscription and pricing sensitivity signals" },
    { name: "ChatGPT", locality: "Global", note: "General AI tool discussion, comparisons, complaints" },
    { name: "artificial", locality: "Global", note: "AI industry and product discussion" },
    { name: "productivity", locality: "Global", note: "Workflow and tool recommendations" },
  ],
  "consumer-electronics": [
    // r/UKTech was listed here as the primary UK source. It has 186 subscribers,
    // is restricted, and returned nothing for any category term — the mapping was
    // written from assumption rather than checked. Replaced with communities that
    // actually carry UK purchase discussion.
    { name: "AskUK", locality: "UK", note: "Purchase decisions, brand perception" },
    { name: "CasualUK", locality: "UK", note: "Everyday UK product talk and recommendations" },
    { name: "UKPersonalFinance", locality: "UK", note: "Value, warranty and replacement decisions" },
    { name: "gadgets", locality: "Global", note: "Product discovery and reviews" },
    { name: "technology", locality: "Global", note: "Broader tech discussion" },
    { name: "BuyItForLife", locality: "Global", note: "Quality and value discussions" },
  ],
  "charging-power": [
    { name: "AskUK", locality: "UK", note: "UK purchase decisions and brand perception" },
    { name: "CasualUK", locality: "UK", note: "Everyday UK product talk and recommendations" },
    { name: "UKPersonalFinance", locality: "UK", note: "Value, warranty and replacement decisions" },
    { name: "UsbCHardware", locality: "Global", note: "Charging standards, cable and adapter quality" },
    { name: "anker", locality: "Global", note: "Anker owners — the incumbent this category competes with" },
    { name: "gadgets", locality: "Global", note: "Product discovery and reviews" },
    { name: "BuyItForLife", locality: "Global", note: "Durability and after-sales experience" },
  ],
  "audio-earbuds": [
    { name: "AskUK", locality: "UK", note: "UK purchase decisions and brand perception" },
    { name: "CasualUK", locality: "UK", note: "Everyday UK product talk and recommendations" },
    { name: "headphones", locality: "Global", note: "General audio discussion and reviews" },
    { name: "HeadphoneAdvice", locality: "Global", note: "Purchase advice — stated needs and budgets" },
    { name: "BudgetAudiophile", locality: "Global", note: "Value tier, where Chinese brands compete" },
    { name: "earbuds", locality: "Global", note: "True wireless specifically" },
  ],
  "smart-home": [
    // r/UKsmarthome does not exist, and no UK-specific smart home community of
    // usable size does — the largest candidates have 16 and 427 members. UK
    // evidence for this category comes from general UK communities instead, and
    // the category is treated as thin on UK coverage.
    { name: "AskUK", locality: "UK", note: "Home tech adoption attitudes" },
    { name: "DIYUK", locality: "UK", note: "UK installation, wiring and home-tech practicalities" },
    { name: "homeautomation", locality: "Global", note: "Smart home setup and products" },
    { name: "smarthome", locality: "Global", note: "Product recommendations and reviews" },
  ],
  "3d-printer": [
    { name: "3Dprinting", locality: "Global", note: "General 3D printing community" },
    { name: "BambuLab", locality: "Global", note: "Bambu Lab specific (competitor intelligence)" },
    { name: "ender3", locality: "Global", note: "Budget 3D printing (price sensitivity signals)" },
    { name: "functionalprint", locality: "Global", note: "Use cases and applications" },
  ],
  "action-camera": [
    { name: "gopro", locality: "Global", note: "Dominant brand community (competitor intel)" },
    { name: "Insta360", locality: "Global", note: "Insta360 specific community" },
    { name: "videography", locality: "Global", note: "Creator perspective on cameras" },
    { name: "MTB", locality: "Global", note: "Action sports use cases" },
  ],
};

/** Categories with thin UK-specific coverage must say so on the brief. */
export const THIN_UK_COVERAGE: CategoryId[] = [
  "3d-printer",
  "action-camera",
  // No UK smart home community of usable size exists; UK evidence here comes
  // only from general UK communities discussing the category in passing.
  "smart-home",
];

export function labelFor(options: Option[], id: string | undefined): string {
  return options.find((o) => o.id === id)?.label ?? "—";
}

/**
 * Search terms per category, used to find category-relevant discussions inside
 * each source community.
 *
 * This exists because listing endpoints do not work for this product: the hot
 * and top listings of a general community like r/AskUK are about whatever that
 * community is talking about, which is almost never the category. Sources are
 * searched, not browsed, and this mapping is what makes a general UK community
 * usable as evidence for a specific category.
 *
 * How broad a term can safely be depends on where it is searched. Inside a
 * category-specific community — r/UsbCHardware, r/BambuLab — everything is on
 * topic already, so "worth buying" and "warranty" retrieve real discussion. In
 * a general community the same terms retrieve whatever that community argues
 * about: searching r/AskUK for them returned threads on hard-boiled eggs and
 * what people's parents refused to buy, and every one was correctly rejected
 * by the relevance gate. There, the search itself has to carry the category,
 * which is why these lists lead with brands and product terms.
 */
export const CATEGORY_QUERIES: Record<CategoryId, string[]> = {
  // Each list mixes three kinds of term, because a category surfaces through
  // all three and any one alone returns a narrow slice: the brands people name,
  // the products they shop for, and the worries they voice. Competitor brands
  // include Chinese ones — whether UK consumers name them at all is one of the
  // things a brief for a Chinese brand most needs to answer.
  "ai-app": [
    "ChatGPT", "Copilot", "Gemini",
    "AI tool", "AI app", "AI subscription",
    "trust AI", "AI privacy", "AI detector", "AI hallucination",
    "worth paying", "cancel subscription",
  ],
  "consumer-electronics": [
    "Anker", "Ugreen", "Baseus",
    "power bank", "charger", "earbuds",
    "worth buying", "warranty", "customer support",
    "build quality", "refurbished", "cheap brand",
  ],
  "charging-power": [
    "Anker", "Ugreen", "Baseus",
    "power bank", "portable charger", "USB-C charger", "charging brick",
    "worth buying", "warranty", "battery life", "fast charging", "GaN charger",
  ],
  "audio-earbuds": [
    "Soundcore", "Anker earbuds", "Edifier", "QCY",
    "wireless earbuds", "budget earbuds", "noise cancelling",
    "worth buying", "sound quality", "build quality", "comfort", "battery life",
  ],
  "smart-home": [
    "Roborock", "Dreame", "Eufy", "Aqara",
    "robot vacuum", "smart home", "smart plug", "security camera",
    "privacy camera", "cloud subscription", "works offline", "local control",
  ],
  "3d-printer": [
    "Bambu Lab", "Creality", "Prusa", "Elegoo",
    "first printer", "print quality", "filament",
    "worth it", "customer support", "firmware", "cloud", "reliability",
  ],
  "action-camera": [
    "Insta360", "GoPro", "DJI Osmo", "Akaso",
    "action camera", "360 camera", "helmet mount",
    "battery life", "worth upgrading", "overheating", "app", "mounts",
  ],
};

/**
 * Category anchors: the terms that decide whether a discussion is about the
 * category at all.
 *
 * These are deliberately not the search terms. Retrieval wants breadth, so
 * CATEGORY_QUERIES includes the language of buying — "worth buying",
 * "warranty", "customer support" — which finds real discussion inside a
 * category's own communities. Those words prove a thread is about a purchase;
 * they do not prove what was purchased. Used as a relevance test in a
 * general-purpose community they admitted cookware, a razor and a car finance
 * dispute into the consumer electronics corpus.
 *
 * Anchors name product entities and brands instead, so the gate asks the
 * question it is actually for: is this discussion about this category?
 * Retrieval stays broad, validation stays strict, and the two no longer share
 * a list that cannot serve both.
 */
export const CATEGORY_ANCHORS: Record<CategoryId, string[]> = {
  "ai-app": [
    "AI", "LLM", "ChatGPT", "Copilot", "Gemini", "Claude",
    "chatbot", "AI tool", "AI app", "prompt",
  ],
  // Bare everyday nouns — charger, phone, laptop — are not anchors in a general
  // community: everyone owns one and mentions it in passing, which readmitted
  // "what do you carry in your work bag" and "what has your kid lost at
  // school". Anchors here are brands and compound product terms. Phones and
  // laptops drop out with them, which matches the product's scope: a Chinese
  // phone brand entering the UK already has brand mentions to monitor, and this
  // is a tool for categories where it has none.
  "consumer-electronics": [
    "Anker", "Ugreen", "Baseus", "EcoFlow", "Belkin", "Soundcore",
    "power bank", "portable charger", "charging station", "wall charger",
    "USB-C cable", "earbuds", "headphones", "earphones",
    "SSD", "hard drive", "external drive",
  ],
  "charging-power": [
    "Anker", "Ugreen", "Baseus", "EcoFlow", "Belkin", "Nitecore",
    "power bank", "portable charger", "charging brick", "wall charger",
    "USB-C", "GaN", "power delivery", "battery pack", "charging cable",
  ],
  "audio-earbuds": [
    "Soundcore", "Edifier", "QCY", "Moondrop", "Sennheiser", "AirPods",
    "earbuds", "headphones", "earphones", "IEM", "ANC",
    "noise cancelling", "true wireless", "over-ear", "in-ear",
  ],
  "smart-home": [
    "Roborock", "Dreame", "Eufy", "Aqara", "Alexa", "Home Assistant",
    "robot vacuum", "smart home", "smart plug", "smart bulb",
    "security camera", "doorbell", "thermostat", "smart lock", "hub",
  ],
  "3d-printer": [
    "Bambu", "Creality", "Prusa", "Elegoo", "Ender",
    "3D print", "3D printer", "filament", "nozzle", "resin",
    "PLA", "PETG", "slicer", "bed levelling", "bed leveling",
  ],
  "action-camera": [
    "GoPro", "Insta360", "Osmo", "Akaso", "DJI",
    "action camera", "action cam", "360 camera", "helmet mount",
    "chest mount", "gimbal", "Hero",
  ],
};
