// Small helpers shared by games (share-link params, best score, motion pref).

/** Seed ⇄ short base36 string for share links. */
export function encodeSeed(seed: number): string {
  return (seed >>> 0).toString(36);
}

export function decodeSeed(value: unknown): number | null {
  if (typeof value !== "string" || !/^[0-9a-z]{1,7}$/.test(value)) return null;
  const n = parseInt(value, 36);
  return Number.isSafeInteger(n) && n >= 0 && n <= 0xffffffff ? n : null;
}

export function decodeScore(value: unknown): number | null {
  if (typeof value !== "string" || !/^\d{1,6}$/.test(value)) return null;
  return Number(value);
}

/**
 * Personal best in localStorage, shaped for useSyncExternalStore
 * (server snapshot = 0). Blocked storage never throws.
 */
export function createBestStore(key: string) {
  const listeners = new Set<() => void>();
  return {
    subscribe(cb: () => void) {
      listeners.add(cb);
      window.addEventListener("storage", cb);
      return () => {
        listeners.delete(cb);
        window.removeEventListener("storage", cb);
      };
    },
    read(): number {
      try {
        const n = Number(window.localStorage.getItem(key));
        return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
      } catch {
        return 0;
      }
    },
    write(n: number) {
      try {
        window.localStorage.setItem(key, String(n));
      } catch {
        // best score is a nice-to-have
      }
      listeners.forEach((l) => l());
    },
  };
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Opt-in "Daily Hottogol" mode for a game component. When set, the game plays
 * `seed`, retries replay the same seed, and results are reported/shared via
 * the daily page instead of the game's own seed link.
 */
export type DailyMode = {
  seed: number;
  onComplete: (score: number) => void;
  onShare: (score: number) => void;
  /** Label for the retry button, e.g. "Try today's challenge again". */
  retryLabel: string;
};
