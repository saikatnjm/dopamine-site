"use client";

import { createContext, useContext, type ReactNode } from "react";

/** The few fields "Play another" needs — from lib/activities.ts, resolved on the server. */
export type ActivityLink = { key: string; href: string; title: string; emoji: string };

const ActivitiesContext = createContext<readonly ActivityLink[]>([]);

export function ActivitiesProvider({ activities, children }: { activities: readonly ActivityLink[]; children: ReactNode }) {
  return <ActivitiesContext.Provider value={activities}>{children}</ActivitiesContext.Provider>;
}

/** Every playable activity (empty outside the root layout). */
export function useActivities(): readonly ActivityLink[] {
  return useContext(ActivitiesContext);
}
