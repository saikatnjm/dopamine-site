"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/providers/lang-provider";
import { getAchievement, recordEvent } from "@/lib/achievements";
import { onTrack } from "@/lib/analytics";
import { t } from "@/lib/i18n/core";

const SHOW_MS = 3800;

/**
 * Mounted once in the root layout. Listens to tracked events (in-browser only),
 * records achievement progress and shows a small toast for each new unlock.
 */
export function AchievementToaster() {
  const { lang, d } = useI18n();
  const [queue, setQueue] = useState<string[]>([]);
  const timer = useRef<number | undefined>(undefined);

  useEffect(
    () =>
      onTrack((event, params) => {
        const fresh = recordEvent(event, params);
        if (fresh.length) setQueue((q) => [...q, ...fresh]);
      }),
    [],
  );

  const current = queue[0];
  useEffect(() => {
    if (!current) return;
    timer.current = window.setTimeout(() => setQueue((q) => q.slice(1)), SHOW_MS);
    return () => window.clearTimeout(timer.current);
  }, [current]);

  const a = current ? getAchievement(current) : undefined;

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
