"use client";

import { useEffect } from "react";
import { onTrack } from "@/lib/analytics";
import { activityKeyForEvent, recordPlay } from "@/lib/recent-plays";

/** Keeps the local "recently finished" list from existing completion events. Renders nothing. */
export function RecentPlaysRecorder() {
  useEffect(
    () =>
      onTrack((event, params) => {
        const key = activityKeyForEvent(event, params);
        if (key) recordPlay(key);
      }),
    [],
  );
  return null;
}
