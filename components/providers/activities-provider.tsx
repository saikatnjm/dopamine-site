"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Activity } from "@/lib/activities";
import { setAnalyticsCatalog } from "@/lib/analytics-taxonomy";

// Every playable activity (lib/activities.ts), resolved once on the server by
// the root layout — used by "Play another" and "You might also like".

const ActivitiesContext = createContext<readonly Activity[]>([]);

export function ActivitiesProvider({ activities, children }: { activities: readonly Activity[]; children: ReactNode }) {
  // Lets every analytics event carry `category` (idempotent, no React state).
  setAnalyticsCatalog(activities);
  return <ActivitiesContext.Provider value={activities}>{children}</ActivitiesContext.Provider>;
}

/** Every playable activity (empty outside the root layout). */
export function useActivities(): readonly Activity[] {
  return useContext(ActivitiesContext);
}
