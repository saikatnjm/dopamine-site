"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/providers/lang-provider";
import type { Achievement } from "@/lib/achievements";
import { onTrack } from "@/lib/analytics";
import { t } from "@/lib/i18n/core";

const SHOW_MS = 3800;

// lib/achievements (the full list + unlock rules) is loaded lazily, off the
// critical path of every page. One shared promise keeps events in order.
type AchievementsModule = typeof import("@/lib/achievements");
let achievementsModule: Promise<AchievementsModule> | null = null;
const loadAchievements = () =>
  (achievementsModule ??= import("@/lib/achievements").catch((error: unknown) => {
    achievementsModule = null; // allow a retry after a failed chunk load
    throw error;
  }));

/**
 * Mounted once in the root layout. Listens to tracked events (in-browser only),
 * records achievement progress and shows a small toast for each new unlock.
 */
export function AchievementToaster() {
  const { lang, d } = useI18n();
  const [queue, setQueue] = useState<Achievement[]>([]);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    let active = true;
    // Warm the chunk once the browser is idle so a fast unlock isn't delayed.
    const warm = () => void loadAchievements().catch(() => {});
    const ric = typeof window.requestIdleCallback === "function";
    const idle = ric ? window.requestIdleCallback(warm) : window.setTimeout(warm, 2000);
    const off = onTrack((event, params) => {
      loadAchievements()
        .then(({ getAchievement, recordEvent }) => {
          const fresh = recordEvent(event, params)
            .map(getAchievement)
            .filter((x): x is Achievement => x !== undefined);
          if (active && fresh.length) setQueue((q) => [...q, ...fresh]);
        })
        .catch(() => {
          // Achievements are a nice-to-have; never break the page.
        });
    });
    return () => {
      active = false;
      off();
      if (ric) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, []);

  const a = queue[0];
  useEffect(() => {
    if (!a) return;
    timer.current = window.setTimeout(() => setQueue((q) => q.slice(1)), SHOW_MS);
    return () => window.clearTimeout(timer.current);
  }, [a]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[60] flex justify-center px-4" role="status" aria-live="polite">
      {a && (
        <div
          key={a.id}
          className="pointer-events-auto flex w-full max-w-sm rotate-[-1deg] items-center gap-3 rounded-2xl border-2 border-ink bg-marigold p-3 shadow-pop-lg"
        >
          <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-xl border-2 border-ink bg-surface text-3xl motion-safe:animate-wiggle">
            {a.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-extrabold uppercase tracking-wider">{d.achUnlocked}</p>
            <p className="truncate font-display text-lg font-extrabold leading-tight">{t(a.title, lang)}</p>
            <Link href="/achievements" className="text-xs font-bold underline underline-offset-2">
              {d.achViewAll}
            </Link>
          </div>
          <button
            type="button"
            onClick={() => setQueue((q) => q.slice(1))}
            aria-label={d.achDismiss}
            className="grid size-9 shrink-0 place-items-center rounded-full font-black hover:bg-ink/10"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
