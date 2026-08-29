export type Locality = "UK" | "Global";

export type CategoryId =
  | "ai-app"
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
  /**
   * An optional heading this option sits under in the selector.
   *
   * Markets use it; categories deliberately do not. A region genuinely contains
   * its countries and has no evidence of its own, so it can be a heading. The
   * category list has no such relationship left in it — every entry there names
   * one product type, and the last entry that tried to be both a heading and a
   * choice is the one that was removed.
   */
  group?: string;
}

/**
 * Every entry names one product type, and no entry contains another.
 *
 * The list was chosen by surveying which Chinese tech companies are actually
 * expanding overseas, not by subdividing a product taxonomy. Each category has
 * a Chinese brand already competing in it — Doubao, Anker, Soundcore, Dreame,
 * Bambu Lab, Insta360 — which is what makes a brief about it worth generating.
 * A category with no such brand would be market research about nobody.
 *
 * "Consumer Electronics" sat here until it did not survive its own evidence.
 * It named a shelf rather than a product, so it read as a parent of Charging &
 * Power and Audio & Earbuds while being offered as their sibling, and the
 * corpus behind it was not independent: of eleven collected discussions eight
 * were already in charging-power, one belonged in audio-earbuds, one was a
 * hard drive warranty dispute and one was a thread about work bags. Two
 * unique, on-topic discussions cannot carry a category, and a selector that
 * mixes levels cannot tell a reader what they are choosing. Its data files are
 * left in data/ rather than deleted.
 *
 * Phones and laptops are deliberately absent, and this is a scope decision
 * rather than a gap waiting to be filled. Two independent reasons agree. The
 * survey above found phones to be the exception among expanding Chinese tech
 * companies: the momentum, and the brands still establishing themselves, are
 * in the other categories. And a Chinese phone brand entering the UK already
 * has brand mentions to monitor and a research budget to read them with; this
 * is a tool for categories where it has neither. The everyday nouns
 * those categories turn on — phone, laptop, charger — are also the words
 * general UK communities use in passing lists, so they retrieve possession
 * rather than discussion.
 */
export const CATEGORIES: Option[] = [
  { id: "ai-app", label: "AI Apps", hint: "Doubao, ChatGPT competitors", available: true },
  { id: "charging-power", label: "Charging & Power", hint: "Anker, Ugreen, Baseus", available: true },
  { id: "audio-earbuds", label: "Audio & Earbuds", hint: "Soundcore, Edifier, QCY", available: true },
  { id: "smart-home", label: "Smart Home", hint: "Dreame, Roborock", available: true },
  { id: "3d-printer", label: "3D Printers", hint: "Bambu Lab", available: true },
  { id: "action-camera", label: "Action Cameras", hint: "Insta360, GoPro competitors", available: true },
];

/**
 * Markets are countries, never regions.
 *
 * Evidence in this product is located per country: a discussion is UK-located
 * or it is not, and the source mapping that decides where to look is a list of
 * communities that a particular country's consumers actually use. "North
 * America" names no such set — the US and Canada do not share a consumer
 * conversation, and "Southeast Asia" is five languages and five different
 * platform mixes. A region cannot be selected because the collector would not
 * know where to go.
 *
 * Regions still appear, as headings. They are how overseas marketing roles are
 * actually scoped — a job is for Southeast Asia, or for the Middle East — so
 * grouping the countries under them says what this tool is for without
 * pretending a region is a market. The heading is not selectable, which is the
 * whole difference between this and a category list that mixed the two.
 *
 * Everything but the UK is shown and disabled. Listing the intended scope is
 * worth more than hiding it, and greying it out is what keeps that honest.
 */
export const MARKETS: Option[] = [
  { id: "uk", label: "United Kingdom", group: "Western Europe", available: true },
  { id: "de", label: "Germany", group: "Western Europe", hint: "coming soon", available: false },
  { id: "us", label: "United States", group: "North America", hint: "coming soon", available: false },
  { id: "ca", label: "Canada", group: "North America", hint: "coming soon", available: false },
  { id: "id", label: "Indonesia", group: "Southeast Asia", hint: "coming soon", available: false },
  { id: "vn", label: "Vietnam", group: "Southeast Asia", hint: "coming soon", available: false },
  { id: "ae", label: "United Arab Emirates", group: "Middle East", hint: "coming soon", available: false },
  { id: "mx", label: "Mexico", group: "Latin America", hint: "coming soon", available: false },
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
  /**
   * A community that is not about any one category — r/AskUK, r/CasualUK.
   *
   * These need a stricter relevance test than a specialist community does. In
   * r/UsbCHardware an anchor anywhere in a post is a safe signal because the
   * whole community is on topic. In a general community the same match is
   * usually a passing mention: a backpack thread listing a power bank, a sleep
   * thread mentioning headphones. Requiring the anchor in the title asks
   * whether the thread is about the category rather than whether the category
   * came up in it.
   */
  general?: boolean;
}

/**
 * Category to subreddit mapping, tagged by locality.
 * This mapping is domain knowledge, not a technical detail: it encodes where
 * UK consumers actually discuss each category, and which sources can only
 * support general category signals.
 */
export const SUBREDDIT_MAP: Record<CategoryId, SubredditRef[]> = {
  "ai-app": [
    { name: "UniUK", general: true, locality: "UK", note: "UK university students, study tools, AI in education" },
    { name: "AskUK", general: true, locality: "UK", note: "General UK consumer attitudes" },
    { name: "6thForm", general: true, locality: "UK", note: "Younger UK students (A-level), tech adoption" },
    { name: "UKPersonalFinance", general: true, locality: "UK", note: "Subscription and pricing sensitivity signals" },
    { name: "ChatGPT", locality: "Global", note: "General AI tool discussion, comparisons, complaints" },
    { name: "artificial", locality: "Global", note: "AI industry and product discussion" },
    { name: "productivity", locality: "Global", note: "Workflow and tool recommendations" },
  ],
  "charging-power": [
    { name: "AskUK", general: true, locality: "UK", note: "UK purchase decisions and brand perception" },
    { name: "CasualUK", general: true, locality: "UK", note: "Everyday UK product talk and recommendations" },
    { name: "UKPersonalFinance", general: true, locality: "UK", note: "Value, warranty and replacement decisions" },
    { name: "UsbCHardware", locality: "Global", note: "Charging standards, cable and adapter quality" },
    { name: "anker", locality: "Global", note: "Anker owners — the incumbent this category competes with" },
    { name: "gadgets", locality: "Global", note: "Product discovery and reviews" },
    { name: "BuyItForLife", locality: "Global", note: "Durability and after-sales experience" },
  ],
  "audio-earbuds": [
    { name: "AskUK", general: true, locality: "UK", note: "UK purchase decisions and brand perception" },
    { name: "CasualUK", general: true, locality: "UK", note: "Everyday UK product talk and recommendations" },
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
    { name: "AskUK", general: true, locality: "UK", note: "Home tech adoption attitudes" },
    { name: "DIYUK", general: true, locality: "UK", note: "UK installation, wiring and home-tech practicalities" },
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
  // UK consumers mention chargers and earbuds constantly and discuss them as a
  // purchase category rarely; both rest almost entirely on global communities.
  "charging-power",
  "audio-earbuds",
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
 * dispute as category evidence.
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
  // Bare "charger" was tried here and reverted. It is the definitional term for
  // this category and still a poor anchor in a general community, because that
  // is where the word appears as an item in a list — keys, wallet, charger —
  // rather than as the subject of a thread. It bought two real UK discussions
  // and eleven about backpacks, hospital bags and a barber. The category keeps
  // compound terms, and its UK evidence stays thin as a result, which is the
  // honest reading: UK consumers mention chargers constantly and discuss them
  // as a purchase rarely.
  "charging-power": [
    "Anker", "Ugreen", "Baseus", "EcoFlow", "Belkin", "Nitecore",
    "power bank", "portable charger", "charging brick", "wall charger",
    "charging cable", "plug adapter", "rechargeable batter",
    "USB-C", "GaN", "power delivery", "battery pack",
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

/**
 * Terms that disqualify a discussion even when an anchor matched.
 *
 * Anchors say what counts as the category; exclusions say what does not, and
 * they exist because some anchors are unavoidably ambiguous. "charger" is the
 * definitional term for charging accessories and also the word for the thing
 * that fills a car battery: adding it pulled in salary-sacrifice EV leases and
 * electricity-bill threads, a different category wearing the same noun.
 * Narrowing the anchor instead would have lost the real discussions it was
 * added for, so the ambiguity is resolved on the other side.
 */
export const CATEGORY_EXCLUSIONS: Partial<Record<CategoryId, string[]>> = {
  "charging-power": [
    "EV", "electric car", "electric vehicle", "salary sacrifice",
    "electricity bill", "energy bill", "heat pump", "solar panel",
  ],
};
