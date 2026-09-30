// Achievements — local only (this device, localStorage). No backend.
//
// Achievements unlock from the same events the app already reports through
// track() (lib/analytics.ts → onTrack). Nothing here sends data anywhere.
// If you change a game's track("game_complete", …) params, check the rules below.
//
// Storage is versioned: localStorage["hottogol:achievements"] = { v: 1, … }.
// To change the shape, bump STORE_VERSION and add a case to migrate().
// Never rename or reuse an achievement id (stored ids would be orphaned).

import type { AnalyticsEvent, AnalyticsParams } from "@/lib/analytics";
import type { Text } from "@/lib/i18n/core";

const STORAGE_KEY = "hottogol:achievements";
const STORE_VERSION = 1;
const BD_OFFSET_MS = 6 * 60 * 60 * 1000;

export type Stats = {
  /** Finished games (any game, any mode). */
  gamesPlayed: number;
  /** Distinct game slugs finished. */
  games: string[];
  /** Finished story simulators. */
  simsPlayed: number;
  /** Distinct simulator slugs finished (added later; older stores migrate to []). */
  sims: string[];
};

type StoreV1 = {
  v: 1;
  /** Achievement id → unlock time (ms since epoch). */
  unlocked: Record<string, number>;
  stats: Stats;
};
export type Store = StoreV1;

type Ev = { name: AnalyticsEvent; params: AnalyticsParams };

export type Achievement = {
  id: string;
  emoji: string;
  title: Text;
  /** Shown when unlocked, and when locked unless `hidden`. */
  description: Text;
  /** Secret: locked view shows "???" and no condition. */
  hidden?: boolean;
  unlocks: (e: Ev, s: Stats) => boolean;
};

const isGame = (e: Ev, game?: string) => e.name === "game_complete" && (game === undefined || e.params.game === game);
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : NaN);

/** Central list. Order = display order. */
export const ACHIEVEMENTS: readonly Achievement[] = [
  {
    id: "first-chaos",
    emoji: "🌀",
    title: { en: "First Chaos", bn: "প্রথম হট্টগোল" },
    description: { en: "Finish your first simulator.", bn: "প্রথম সিমুলেটর শেষ করুন।" },
    unlocks: (e) => e.name === "experience_complete",
  },
  {
    id: "first-game",
    emoji: "🎮",
    title: { en: "First Game", bn: "প্রথম গেম" },
    description: { en: "Finish any game.", bn: "যেকোনো একটা গেম শেষ করুন।" },
    unlocks: (e) => isGame(e),
  },
  {
    id: "cng-catcher",
    emoji: "🛺",
    title: { en: "CNG Catcher", bn: "সিএনজি শিকারি" },
    description: { en: "Become a “Professional Passenger” or better in CNG Catch.", bn: "সিএনজি ক্যাচে “পেশাদার যাত্রী” বা তার চেয়ে ভালো হোন।" },
    unlocks: (e) => isGame(e, "cng-catch") && (e.params.rank === "pro-passenger" || e.params.rank === "cng-magnet"),
  },
  {
    id: "traffic-survivor",
    emoji: "🛵",
    title: { en: "Traffic Survivor", bn: "ট্রাফিক সারভাইভার" },
    description: { en: "Survive 30 seconds in Traffic Dodge.", bn: "ট্রাফিক ডজে ৩০ সেকেন্ড টিকে থাকুন।" },
    unlocks: (e) => isGame(e, "traffic-dodge") && num(e.params.seconds) >= 30,
  },
  {
    id: "bargain-master",
    emoji: "🛒",
    title: { en: "Bargain Master", bn: "দরদামের ওস্তাদ" },
    description: { en: "Finish Bazar Bargain as a sharp bargainer (or better).", bn: "বাজার বার্গেইন শেষ করুন তীক্ষ্ণ দরদামবাজ (বা আরও ভালো) হয়ে।" },
    unlocks: (e) =>
      isGame(e, "bazar-bargain") && ["sharp-bargainer", "amma-approved", "free-lemon"].includes(String(e.params.rank)),
  },
  {
    id: "tea-survivor",
    emoji: "☕",
    title: { en: "Tea Survivor", bn: "চা সারভাইভার" },
    description: { en: "Deliver the tea in Tea Balance.", bn: "টি ব্যালেন্সে চা পৌঁছে দিন।" },
    unlocks: (e) => isGame(e, "tea-balance") && e.params.delivered === true,
  },
  {
    id: "reaction-machine",
    emoji: "⚡",
    title: { en: "Reaction Machine", bn: "রিঅ্যাকশন মেশিন" },
    description: { en: "Average under 300 ms in Don't Tap.", bn: "ডোন্ট ট্যাপে গড় ৩০০ মি.সে.-এর নিচে।" },
    unlocks: (e) => isGame(e, "dont-tap") && num(e.params.avg_ms) < 300 && e.params.rank !== "signal-jumper",
  },
  {
    id: "legendary-ending",
    emoji: "✨",
    title: { en: "Legendary Ending", bn: "কিংবদন্তি এন্ডিং" },
    description: { en: "Found a legendary ending. Rarer than an empty Dhaka road.", bn: "কিংবদন্তি এন্ডিং পেয়েছেন। ঢাকার ফাঁকা রাস্তার চেয়েও বিরল।" },
    hidden: true,
    unlocks: (e) =>
      (isGame(e, "bazar-bargain") && (e.params.rank === "amma-approved" || e.params.rank === "free-lemon")) ||
      (isGame(e, "chaos-machine") && e.params.outcome === "early-miracle") ||
      (isGame(e, "delivery-sim") && e.params.outcome === "legendary") ||
      (isGame(e, "queue-sim") && e.params.outcome === "front-legend") ||
      (isGame(e, "programmer-rage") && e.params.outcome === "legendary-3am"),
  },
  {
    id: "ten-games",
    emoji: "🔟",
    title: { en: "10 Games Played", bn: "১০টা গেম খেলা" },
    description: { en: "Finish 10 games.", bn: "১০টা গেম শেষ করুন।" },
    unlocks: (_e, s) => s.gamesPlayed >= 10,
  },
  {
    id: "three-games",
    emoji: "🎲",
    title: { en: "Game Hopper", bn: "গেম হপার" },
    description: { en: "Finish 3 different games.", bn: "৩টা আলাদা গেম শেষ করুন।" },
    unlocks: (_e, s) => s.games.length >= 3,
  },
  {
    id: "daily-regular",
    emoji: "📅",
    title: { en: "Daily Regular", bn: "ডেইলি নিয়মিত" },
    description: { en: "Complete a Daily Hottogol challenge.", bn: "একটা ডেইলি হট্টগোল চ্যালেঞ্জ শেষ করুন।" },
    unlocks: (e) => e.name === "daily_complete",
  },
  {
    id: "rival-defeated",
    emoji: "⚔️",
    title: { en: "Rival Defeated", bn: "প্রতিদ্বন্দ্বী পরাজিত" },
    description: { en: "Beat a friend's challenge.", bn: "বন্ধুর চ্যালেঞ্জ হারান।" },
    unlocks: (e) => e.name === "challenge_won",
  },
  {
    id: "chaos-engineer",
    emoji: "🔥",
    title: { en: "Chaos Engineer", bn: "হট্টগোল ইঞ্জিনিয়ার" },
    description: { en: "Survive a run of the Chaos Machine.", bn: "কেওস মেশিনের একটা যাত্রা পার করুন।" },
    unlocks: (e) => isGame(e, "chaos-machine"),
  },
  {
    id: "night-owl",
    emoji: "🦉",
    title: { en: "Night Owl", bn: "রাত জাগা পেঁচা" },
    description: { en: "Finished a game between midnight and 4 AM (Dhaka time). Go to sleep.", bn: "রাত ১২টা থেকে ভোর ৪টার মধ্যে গেম শেষ করেছেন (ঢাকা সময়)। ঘুমান এবার।" },
    hidden: true,
    unlocks: (e) => isGame(e) && new Date(Date.now() + BD_OFFSET_MS).getUTCHours() < 4,
  },
  {
    id: "dhaka-certified",
    emoji: "🏙️",
    title: { en: "Certified Dhaka Person", bn: "সার্টিফায়েড ঢাকাবাসী" },
    description: { en: "Finish the “What Kind of Dhaka Person Are You?” quiz.", bn: "“আপনি কেমন ঢাকাবাসী?” কুইজ শেষ করুন।" },
    unlocks: (e) => e.name === "quiz_complete" && e.params.quiz === "dhaka-person",
  },
  {
    id: "identity-crisis",
    emoji: "🎭",
    title: { en: "Identity Crisis", bn: "পরিচয় সংকট" },
    description: { en: "Got 3 different Dhaka personalities. Who are you, really?", bn: "৩টা আলাদা ঢাকা পার্সোনালিটি পেয়েছেন। আসলে আপনি কে?" },
    hidden: true,
    unlocks: (e) => e.name === "quiz_complete" && e.params.quiz === "dhaka-person" && num(e.params.distinct) >= 3,
  },
  {
    id: "five-star-rider",
    emoji: "🏍️",
    title: { en: "Five-Star Rider", bn: "ফাইভ-স্টার রাইডার" },
    description: { en: "Get a 5-star rating in the Delivery Simulator.", bn: "ডেলিভারি সিমুলেটরে ৫ স্টার রেটিং পান।" },
    unlocks: (e) => isGame(e, "delivery-sim") && num(e.params.rating) >= 5,
  },
  {
    id: "road-crosser",
    emoji: "🐔",
    title: { en: "Why Did the Chicken…", bn: "মুরগি কেন…" },
    description: { en: "Reach level 3 in Chicken Crossing Dhaka.", bn: "চিকেন ক্রসিং ঢাকায় লেভেল ৩-এ পৌঁছান।" },
    unlocks: (e) => isGame(e, "chicken-crossing") && num(e.params.level) >= 3,
  },
  {
    id: "junction-hero",
    emoji: "🚦",
    title: { en: "Junction Hero", bn: "মোড়ের হিরো" },
    description: { en: "Survive a full 60-second shift in Dhaka Traffic Controller.", bn: "ঢাকা ট্রাফিক কন্ট্রোলারে পুরো ৬০ সেকেন্ডের ডিউটি টিকে থাকুন।" },
    unlocks: (e) => isGame(e, "traffic-controller") && e.params.survived === true,
  },
  {
    id: "cutter-detector",
    emoji: "🕵️",
    title: { en: "Line Cutter Detector", bn: "লাইন-কাটার শনাক্তকারী" },
    description: { en: "Catch 3 line-cutters in one Queue Simulator run.", bn: "এক লাইন সিমুলেটর রানে ৩ জন লাইন-কাটার ধরুন।" },
    unlocks: (e) => isGame(e, "queue-sim") && num(e.params.detected) >= 3,
  },
  {
    id: "shipped-it",
    emoji: "🚀",
    title: { en: "Shipped It", bn: "শিপ করে দিয়েছি" },
    description: { en: "Deploy successfully in the Programmer Rage Simulator.", bn: "প্রোগ্রামার রেজ সিমুলেটরে সফলভাবে ডিপ্লয় করুন।" },
    unlocks: (e) => isGame(e, "programmer-rage") && (e.params.outcome === "success" || e.params.outcome === "legendary-3am"),
  },
  {
    id: "boss-slayer",
    emoji: "👹",
    title: { en: "Boss Slayer", bn: "বস শিকারি" },
    description: { en: "Defeat a Weekly Boss.", bn: "একটি সাপ্তাহিক বস পরাজিত করুন।" },
    unlocks: (e) => isGame(e, "traffic-boss") && e.params.defeated === true,
  },
  {
    id: "flawless-boss",
    emoji: "🛡️",
    title: { en: "Untouchable", bn: "অছুঁত" },
    description: { en: "Defeat a Weekly Boss without losing a life.", bn: "কোনো জীবন না হারিয়ে একটি সাপ্তাহিক বস পরাজিত করুন।" },
    hidden: true,
    unlocks: (e) => isGame(e, "traffic-boss") && e.params.defeated === true && num(e.params.lives) >= 3,
  },
];

const BY_ID = new Map(ACHIEVEMENTS.map((a) => [a.id, a]));

export function getAchievement(id: string): Achievement | undefined {
  return BY_ID.get(id);
}

// ---------------------------------------------------------------------------
// Storage (versioned, defensive: bad data never throws)
// ---------------------------------------------------------------------------

export function emptyStore(): Store {
  return { v: STORE_VERSION, unlocked: {}, stats: { gamesPlayed: 0, games: [], simsPlayed: 0, sims: [] } };
}

/** Bring any stored value up to the current version, or start fresh. */
export function migrate(raw: unknown): Store {
  if (!raw || typeof raw !== "object") return emptyStore();
  const data = raw as Partial<StoreV1> & { v?: unknown };
  switch (data.v) {
    case 1: {
      const fresh = emptyStore();
      const unlocked: Record<string, number> = {};
      if (data.unlocked && typeof data.unlocked === "object") {
        for (const [id, at] of Object.entries(data.unlocked)) {
          if (BY_ID.has(id) && typeof at === "number" && Number.isFinite(at)) unlocked[id] = at;
        }
      }
      const s = data.stats ?? fresh.stats;
      return {
        v: 1,
        unlocked,
        stats: {
          gamesPlayed: Number.isInteger(s.gamesPlayed) && s.gamesPlayed >= 0 ? s.gamesPlayed : 0,
          games: Array.isArray(s.games) ? [...new Set(s.games.filter((g): g is string => typeof g === "string"))].slice(0, 50) : [],
          simsPlayed: Number.isInteger(s.simsPlayed) && s.simsPlayed >= 0 ? s.simsPlayed : 0,
          sims: Array.isArray(s.sims) ? [...new Set(s.sims.filter((g): g is string => typeof g === "string"))].slice(0, 50) : [],
        },
      };
    }
    // Future: case 2 → convert v1 fields here.
    default:
      return emptyStore();
  }
}

export function parseStore(raw: string | null): Store {
  if (!raw) return emptyStore();
  try {
    return migrate(JSON.parse(raw));
  } catch {
    return emptyStore();
  }
}

/** Raw JSON (stable string for useSyncExternalStore). */
export function readRaw(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

const listeners = new Set<() => void>();

export function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function save(store: Store) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // storage blocked: achievements just won't persist
  }
  listeners.forEach((l) => l());
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

/** Update stats from an event, unlock anything newly earned. Returns new ids. */
export function recordEvent(name: AnalyticsEvent, params: AnalyticsParams): string[] {
  const relevant = name === "game_complete" || name === "experience_complete" || name === "daily_complete" || name === "challenge_won" || name === "quiz_complete";
  if (!relevant) return [];
  const store = parseStore(readRaw());
  const stats = store.stats;
  if (name === "game_complete") {
    stats.gamesPlayed += 1;
    const game = typeof params.game === "string" ? params.game : null;
    if (game && !stats.games.includes(game)) stats.games.push(game);
  }
  if (name === "experience_complete") {
    stats.simsPlayed += 1;
    const sim = typeof params.experience === "string" ? params.experience : null;
    if (sim && !stats.sims.includes(sim)) stats.sims.push(sim);
  }

  const ev: Ev = { name, params };
  const now = Date.now();
  const fresh: string[] = [];
  for (const a of ACHIEVEMENTS) {
    if (store.unlocked[a.id]) continue;
    let ok = false;
    try {
      ok = a.unlocks(ev, stats);
    } catch {
      ok = false;
    }
    if (ok) {
      store.unlocked[a.id] = now;
      fresh.push(a.id);
    }
  }
  save(store);
  return fresh;
}
