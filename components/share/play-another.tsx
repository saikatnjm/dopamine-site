"use client";

import { usePathname, useRouter } from "next/navigation";
import { useActivities } from "@/components/providers/activities-provider";
import { btnPrimary } from "@/components/ui/styles";
import { track } from "@/lib/analytics";
import { useI18n } from "@/components/providers/lang-provider";
import { pickRandom } from "@/lib/random";

/** Path part of an activity href ("/excuses?go=1" → "/excuses"). */
const pathOf = (href: string) => href.split(/[?#]/)[0] ?? href;

/**
 * "🎲 Play another" — jumps to a random *different* activity from the real
 * registry (passed down once by the root layout). Picks on click, so server
 * and client render the same markup.
 */
export function PlayAnother({ exclude, className = "" }: { /** Extra path to skip, e.g. the simulator behind a /result page. */ exclude?: string; className?: string }) {
  const { d } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const activities = useActivities();
  if (activities.length === 0) return null;

  function go() {
    const skip = new Set([pathname, exclude].filter(Boolean));
    const pool = activities.filter((a) => !skip.has(pathOf(a.href)));
    const next = pickRandom(pool.length ? pool : activities);
    if (!next) return;
    track("recommendation_click", { source: "play_another", activity: next.key, from: pathname });
    router.push(next.href);
  }

  return (
    <button type="button" onClick={go} className={`${btnPrimary} bg-violet ${className}`}>
      <span aria-hidden>🎲</span>
      {d.playAnother}
    </button>
  );
}
