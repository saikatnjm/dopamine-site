"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Activity } from "@/lib/activities";

// Every playable activity (lib/activities.ts), resolved once on the server by
// the root layout — used by "Play another" and "You might also like".

const ActivitiesContext = createContext<readonly Activity[]>([]);

export function ActivitiesProvider({ activities, children }: { activities: readonly Activity[]; children: ReactNode }) {
  return <ActivitiesContext.Provider value={activities}>{children}</ActivitiesContext.Provider>;
}

/** Every playable activity (empty outside the root layout). */
export function useActivities(): readonly Activity[] {
  return useContext(ActivitiesContext);
}
