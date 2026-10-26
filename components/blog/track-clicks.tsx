"use client";

import type { ReactNode } from "react";
import { track } from "@/lib/analytics";
import { stripLang } from "@/lib/i18n/paths";

/**
 * Wraps server-rendered activity cards and reports which one was clicked as
 * `recommendation_click` {source, from, activity, position}. `hrefs` maps a
 * card's path to its activity key.
 */
export function TrackClicks({ source, from, hrefs, children }: { source: string; from: string; hrefs: Readonly<Record<string, string>>; children: ReactNode }) {
  return (
    <div
      onClickCapture={(e) => {
        const a = (e.target as HTMLElement).closest("a");
        if (!a) return;
        const path = stripLang(new URL(a.href).pathname);
        const activity = hrefs[path];
        if (!activity) return;
        const position = Object.keys(hrefs).indexOf(path) + 1;
        track("recommendation_click", { source, from, activity, position });
      }}
    >
      {children}
    </div>
  );
}
