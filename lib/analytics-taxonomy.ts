// Analytics taxonomy: maps the app's internal track() events onto one small,
// consistent set of GA4 events, with an allowlist of non-sensitive params.
//
// Internal events (game_complete, quiz_complete, …) stay as they are — local
// features (achievements, recent plays, daily, challenge banner) listen to
// them via onTrack(). Only the normalised event below reaches GA4.
//
// Never sent: names, emails, phone numbers, locations, free text, full URLs.
// Unknown events and unknown params are dropped. Pure — no DOM access.

import type { AnalyticsEvent, AnalyticsParams } from "@/lib/analytics";

export const GA_EVENTS = [
  "page_view", // sent automatically by GA4 (enhanced measurement), incl. utm_*
  "activity_view",
  "activity_start",
  "activity_complete",
  "activity_retry",
  "result_view",
  "result_share",
  "challenge_created",
  "challenge_opened",
  "challenge_started",
  "challenge_completed",
  "challenge_shared",
  "daily_challenge_view",
  "daily_challenge_start",
  "daily_challenge_complete",
  "recommendation_click",
  "surprise_me_click",
  "mood_selection",
  // UI experiment (lib/experiments.ts) — remove with the experiment.
  "homepage_cta_view",
  "homepage_cta_click",
] as const;
export type GaEvent = (typeof GA_EVENTS)[number];

export type ActivityType = "game" | "simulator" | "quiz" | "tool";
export type CatalogEntry = { key: string; category: string };

let catalog = new Map<string, string>();

/** Activity key → category, so every GA event can carry `category`. Idempotent. */
export function setAnalyticsCatalog(entries: readonly CatalogEntry[]): void {
  if (entries.length === catalog.size && entries.every((e) => catalog.get(e.key) === e.category)) return;
  catalog = new Map(entries.map((e) => [e.key, e.category]));
}

/** Short, boring token: lowercase letters, digits, "-", "_", ":", "/", "." (max 40). */
export function cleanToken(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const s = v
    .toLowerCase()
    .replace(/[^a-z0-9_:./-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return s || undefined;
}

const KEY_RE = /^[gxp]:[a-z0-9-]{1,40}$/;
const NOT_GAMES: Record<string, string> = { "dhaka-person": "p:dhaka-person" };
const TYPE_BY_PREFIX: Record<string, ActivityType> = { g: "game", x: "simulator" };

function str(v: unknown): string | undefined {
  return typeof v === "string" && v ? v : undefined;
}

/** Activity key ("g:cng-catch", "x:…", "p:…") from whichever param the event used. */
export function activityKeyOf(event: AnalyticsEvent, p: AnalyticsParams): string | undefined {
  const explicit = str(p.activity);
  if (explicit && KEY_RE.test(explicit)) return explicit;
  const game = str(p.game);
  if (game) return NOT_GAMES[game] ?? `g:${game}`;
  const exp = str(p.experience);
  if (exp) return KEY_RE.test(exp) ? exp : `x:${exp}`; // roulette sends a key
  const quiz = str(p.quiz);
  if (quiz) return `p:${quiz}`;
  if (event.startsWith("excuse_")) return "p:excuses";
  return undefined;
}

export function activityTypeOf(key: string): ActivityType {
  if (key === "p:excuses") return "tool";
  return TYPE_BY_PREFIX[key[0] ?? ""] ?? "quiz";
}

/** Internal event → GA event (null = not sent to GA: duplicate or noise). */
function gaName(event: AnalyticsEvent, p: AnalyticsParams): GaEvent | null {
  switch (event) {
    case "game_start":
    case "experience_start":
      return "activity_start";
    case "game_retry":
    case "experience_retry":
      return "activity_retry";
    case "game_complete":
    case "experience_complete":
    case "quiz_complete":
    case "excuse_generate":
      return "activity_complete";
    case "game_share":
    case "excuse_share":
    case "excuse_copy":
    case "result_share":
      return "result_share";
    case "daily_challenge_share":
      // The challenge-link variant is already sent as challenge_shared.
      return p.kind === "result" ? "result_share" : null;
    case "daily_complete": // = daily_challenge_complete
    case "daily_share": // = daily_challenge_share (result)
    case "challenge_won": // = challenge_completed {result: "win"}
    case "viral_landing_view": // GA page_view already carries utm_*
      return null;
    default:
      return (GA_EVENTS as readonly string[]).includes(event) ? (event as GaEvent) : null;
  }
}

/** Params that may reach GA, and how to read each one. */
const STRING_PARAMS = ["method", "source", "mood", "surface", "day", "viewer", "utm_source", "referrer", "from", "experiment", "variant"] as const;
const NUMBER_PARAMS = ["score", "position", "attempt", "target", "best"] as const;
const BOOL_PARAMS = ["again", "retry"] as const;

export type GaPayload = { name: GaEvent; params: Record<string, string | number | boolean> };

/** Normalise one internal event for GA4, or null if it shouldn't be sent. Never throws. */
export function normalizeEvent(event: AnalyticsEvent, p: AnalyticsParams): GaPayload | null {
  try {
    const name = gaName(event, p);
    if (!name) return null;
    const out: Record<string, string | number | boolean> = {};

    const key = activityKeyOf(event, p);
    if (key && KEY_RE.test(key)) {
      out.activity = key;
      out.activity_type = activityTypeOf(key);
      const category = catalog.get(key) ?? cleanToken(p.category);
      if (category) out.category = category;
    } else if (str(p.activity)) {
      // e.g. a link href on /viral — keep it as a short path token only
      const a = cleanToken(p.activity);
      if (a) out.activity = a;
    }

    // Result type: rank / outcome / quiz result / challenge win-tie-lose.
    const result = cleanToken(p.result ?? p.rank ?? p.outcome);
    if (result) out.result = result;

    // Share context (daily / challenge / copy text).
    if (event === "daily_challenge_share") out.context = "daily";
    if (event === "excuse_copy") out.method = "copy-text";

    for (const k of STRING_PARAMS) {
      if (out[k] !== undefined) continue;
      const v = cleanToken(p[k]);
      if (v) out[k] = v;
    }
    for (const k of NUMBER_PARAMS) {
      const v = p[k];
      if (typeof v === "number" && Number.isFinite(v)) out[k] = Math.round(v);
    }
    for (const k of BOOL_PARAMS) {
      const v = p[k];
      if (typeof v === "boolean") out[k] = v;
    }
    return { name, params: out };
  } catch {
    return null;
  }
}
