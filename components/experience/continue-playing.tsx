"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { ActivityCard } from "@/components/experience/activity-card";
import { useActivities } from "@/components/providers/activities-provider";
import { useI18n } from "@/components/providers/lang-provider";
import { accentBg, btnPrimary, card } from "@/components/ui/styles";
import { track } from "@/lib/analytics";
import { fmt, type Lang } from "@/lib/i18n/core";
import type { Dict } from "@/lib/i18n/dictionary";
import { dismissContinue, dismissedSnapshot, parseRecent, recentSnapshot, subscribeRecent } from "@/lib/recent-plays";

const SHOWN = 3;
const noServerSnapshot = () => null;

function ago(at: number, now: number, lang: Lang): string {
  const rtf = new Intl.RelativeTimeFormat(lang === "bn" ? "bn-BD" : "en", { numeric: "auto" });
  const min = Math.round((now - at) / 60_000);
  if (min < 60) return rtf.format(-Math.max(1, min), "minute");
  const h = Math.round(min / 60);
  if (h < 24) return rtf.format(-h, "hour");
  return rtf.format(-Math.round(h / 24), "day");
}

function scoreText(n: number, lang: Lang): string {
  return lang === "bn" ? n.toLocaleString("bn-BD") : n.toLocaleString("en-US");
}

function status(done: boolean, score: number | undefined, when: string, d: Dict, lang: Lang): string {
  return [done ? d.contDone : d.contStarted, score !== undefined ? fmt(d.contScore, { score: scoreText(score, lang) }) : null, when]
    .filter(Boolean)
    .join(" · ");
}

/**
 * "👀 CONTINUE PLAYING" on the homepage. Client-only: renders nothing on the
 * server and nothing for new visitors (no history), so it never clutters the
 * page for them. Dismissible until something newer is played.
 */
export function ContinuePlaying() {
  const { lang, d } = useI18n();
  const activities = useActivities();
  const raw = useSyncExternalStore(subscribeRecent, recentSnapshot, noServerSnapshot);
  const dismissed = useSyncExternalStore(subscribeRecent, dismissedSnapshot, noServerSnapshot);
  const [now] = useState(() => Date.now());

  if (raw === null) return null; // server / before hydration
  const byKey = new Map(activities.map((a) => [a.key, a]));
  // Only entries that still map to a real activity (removed ones are skipped).
  const recent = parseRecent(raw, now).flatMap((r) => {
    const activity = byKey.get(r.key);
    return activity ? [{ ...r, activity }] : [];
  });
  const latest = recent[0];
  if (!latest || latest.at <= Number(dismissed || 0)) return null;
  const shown = recent.slice(0, SHOWN);

  return (
    <section aria-labelledby="continue-title" className="mx-auto max-w-5xl px-4 pb-12">
      <div className={`${card} relative p-5 sm:p-6`}>
        <button
          type="button"
          onClick={() => dismissContinue()}
          aria-label={d.contDismiss}
          className="absolute right-2 top-2 grid size-11 place-items-center rounded-pill text-xl font-black text-ink hover:bg-ink/10"
        >
          <span aria-hidden>✕</span>
        </button>
        <h2 id="continue-title" className="pr-10 font-display text-2xl font-extrabold sm:text-3xl">
          {d.contTitle}
        </h2>
        <ul className={`mt-4 grid gap-3 ${shown.length > 1 ? "grid-cols-2 sm:grid-cols-3" : "max-w-xs"}`}>
          {shown.map((r, i) => (
            <li key={r.key} className="flex flex-col gap-1.5">
              <ActivityCard
                activity={r.activity}
                lang={lang}
                index={i}
                onClick={() => track("recommendation_click", { source: "continue", activity: r.key, position: i + 1 })}
              />
              <p className="px-1 text-xs font-bold text-ink-muted">{status(r.done, r.score, ago(r.at, now, lang), d, lang)}</p>
            </li>
          ))}
        </ul>
        <Link
          href={latest.activity.href}
          onClick={() => track("recommendation_click", { source: "continue", activity: latest.key, position: 0 })}
          className={`${btnPrimary} ${accentBg[latest.activity.accent]} mt-4 w-full sm:w-auto`}
        >
          {fmt(d.contCta, { title: latest.activity.title })}
        </Link>
      </div>
    </section>
  );
}
