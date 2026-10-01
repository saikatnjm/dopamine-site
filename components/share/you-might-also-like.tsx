"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { ActivityCard } from "@/components/experience/activity-card";
import { useActivities } from "@/components/providers/activities-provider";
import { useI18n } from "@/components/providers/lang-provider";
import { parseStore, readRaw } from "@/lib/achievements";
import { track } from "@/lib/analytics";
import { createRng, newSeed } from "@/lib/random";
import { readRecent } from "@/lib/recent-plays";
import { recommend } from "@/lib/recommend";

const pathOf = (href: string) => href.split(/[?#]/)[0] ?? href;
const noSubscribe = () => () => {};
// "1" once hydrated in the browser, null during SSR → nothing rendered on the server.
const clientSnapshot = () => "1";
const serverSnapshot = () => null;

/**
 * "😂 LIKED THAT?" — 3 related activities for the one just finished
 * (identified by its page path, e.g. "/games/cng-catch"). Prefers ones not
 * played recently (localStorage, lib/recent-plays.ts). Hidden when fewer
 * than 3 related activities exist.
 */
export function YouMightAlsoLike({ path }: { path: string }) {
  const { lang, d } = useI18n();
  const activities = useActivities();
  const hydrated = useSyncExternalStore(noSubscribe, clientSnapshot, serverSnapshot);
  const [seed] = useState(newSeed);

  const current = activities.find((a) => pathOf(a.href) === path);
  const picks = useMemo(() => {
    if (!hydrated || !current) return [];
    const stats = parseStore(readRaw()).stats;
    const completed = new Set([...stats.games.map((g) => `g:${g}`), ...stats.sims.map((s) => `x:${s}`)]);
    return recommend(current.key, activities, readRecent(), completed, createRng(seed));
  }, [hydrated, current, activities, seed]);

  if (!current || picks.length === 0) return null;

  return (
    <section aria-labelledby="also-like-title" className="mt-2">
      <h2 id="also-like-title" className="font-display text-2xl font-extrabold">
        {d.alsoLikeTitle}
      </h2>
      <p className="text-sm text-ink-muted">{d.alsoLikeSub}</p>
      <ul className="mt-3 grid gap-3 sm:grid-cols-3">
        {picks.map((a, i) => (
          <li key={a.key}>
            <ActivityCard
              activity={a}
              lang={lang}
              index={i}
              onClick={() => track("recommendation_click", { source: "also_like", activity: a.key, from: current.key, position: i + 1 })}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
