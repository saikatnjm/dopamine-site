// The only place the app talks to analytics. Swap providers here.
// Safe everywhere: no-ops on the server, when GA is not configured,
// or when it is blocked. Never send personal data in params.

export type AnalyticsEvent =
  | "experience_start"
  | "experience_complete"
  | "result_view"
  | "result_share"
  | "experience_retry"
  | "surprise_me_click";
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

export function track(event: AnalyticsEvent, params: AnalyticsParams = {}): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  try {
    window.gtag("event", event, params);
  } catch {
    // Analytics must never break the app.
  }
}
