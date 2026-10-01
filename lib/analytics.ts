// The only place the app talks to analytics. Swap providers here.
// Safe everywhere: no-ops on the server, when GA is not configured,
// or when it is blocked. Never send personal data in params.

export type AnalyticsEvent =
  | "experience_start"
  | "experience_complete"
  | "result_view"
  | "result_share"
  | "experience_retry"
  | "surprise_me_click"
  | "game_start"
  | "game_retry"
  | "game_complete"
  | "game_share"
  | "daily_complete"
  | "daily_share"
  | "challenge_won"
  | "challenge_created"
  | "challenge_opened"
  | "challenge_started"
  | "challenge_completed"
  | "challenge_shared"
  | "excuse_generate"
  | "excuse_copy"
  | "excuse_share"
  | "quiz_complete"
  | "mood_selection"
  | "recommendation_click";
// page_view is sent automatically by GA4 (enhanced measurement).

export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const GA_ID_PATTERN = /^G-[A-Z0-9]{4,20}$/;

export function getGaId(): string | null {
  const id = process.env.NEXT_PUBLIC_GA_ID?.trim();
  return id && GA_ID_PATTERN.test(id) ? id : null;
}

type LocalListener = (event: AnalyticsEvent, params: AnalyticsParams) => void;
const localListeners = new Set<LocalListener>();

/**
 * In-browser subscribers to tracked events (e.g. achievements). They run even
 * when GA is empty or blocked, and nothing they receive leaves the device.
 */
export function onTrack(listener: LocalListener): () => void {
  localListeners.add(listener);
  return () => {
    localListeners.delete(listener);
  };
}

export function track(event: AnalyticsEvent, params: AnalyticsParams = {}): void {
  if (typeof window === "undefined") return;
  localListeners.forEach((listener) => {
    try {
      listener(event, params);
    } catch {
      // A local feature must never break the app.
    }
  });
  if (typeof window.gtag !== "function") return;
  try {
    window.gtag("event", event, params);
  } catch {
    // Analytics must never break the app.
  }
}
