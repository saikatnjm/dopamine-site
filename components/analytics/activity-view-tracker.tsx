"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useActivities } from "@/components/providers/activities-provider";
import { track } from "@/lib/analytics";
import { cleanToken } from "@/lib/analytics-taxonomy";

const pathOf = (href: string) => href.split(/[?#]/)[0] ?? href;

/** External referrer's host only (never the full URL), else undefined. */
function referrerHost(): string | undefined {
  try {
    if (!document.referrer) return undefined;
    const host = new URL(document.referrer).hostname;
    return host && host !== window.location.hostname ? cleanToken(host.replace(/^www\./, "")) : undefined;
  } catch {
    return undefined;
  }
}

/**
 * activity_view: once per visit to an activity's own page (game, simulator,
 * boss, quiz, excuses), from the root layout — no per-page wiring. The first
 * view of the session also carries the external referrer host and utm_source.
 * Nothing is stored.
 */
export function ActivityViewTracker() {
  const pathname = usePathname();
  const activities = useActivities();
  const first = useRef(true);

  useEffect(() => {
    const a = activities.find((x) => pathOf(x.href) === pathname);
    const isFirst = first.current;
    first.current = false;
    if (!a) return;
    const extra = isFirst
      ? { referrer: referrerHost(), utm_source: cleanToken(new URLSearchParams(window.location.search).get("utm_source")) }
      : {};
    track("activity_view", { activity: a.key, category: a.category, ...extra });
  }, [pathname, activities]);

  return null;
}
