"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

// Reads source/UTM parameters from the landing URL and sends them with the
// existing track(). Nothing is stored (no cookies, localStorage or
// sessionStorage) — GA4 also reads utm_* from the page URL by itself.

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;

/** Keep only short, boring tokens: letters, digits, "-", "_" (max 40). */
function clean(v: string | null): string | undefined {
  if (!v) return undefined;
  const s = v.toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
  return s || undefined;
}

/** Click handler for any play link inside `[data-viral-links]` (delegated, no per-card JS). */
export function ViralTracker({ featured, deepLink }: { featured: string; deepLink: boolean }) {
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const utm = Object.fromEntries(UTM_KEYS.map((k) => [k, clean(q.get(k))]));
    track("viral_landing_view", { ...utm, featured, deep_link: deepLink });

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("[data-viral-links] a[href]");
      if (!a) return;
      track("recommendation_click", { source: "viral", activity: a.getAttribute("href") ?? "", utm_source: utm.utm_source });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [featured, deepLink]);
  return null;
}
