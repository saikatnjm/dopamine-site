"use client";

import { useEffect } from "react";
import { onTrack } from "@/lib/analytics";
import { playEventFor, recordPlay } from "@/lib/recent-plays";

/** Keeps the local play history (starts + finishes) from existing events. Renders nothing. */
export function RecentPlaysRecorder() {
  useEffect(
    () =>
      onTrack((event, params) => {
        const ev = playEventFor(event, params);
        if (ev) recordPlay(ev);
      }),
    [],
  );
  return null;
}
