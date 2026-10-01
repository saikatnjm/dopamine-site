"use client";

import { Suspense, use } from "react";
import { card } from "@/components/ui/styles";
import { MotionProvider } from "@/components/providers/motion-provider";
import type { Experience } from "@/lib/experience/types";
import { ExperiencePlayer } from "./experience-player";

// One code-split chunk per experience, so an experience page only downloads
// its own data (not all of data/experiences). Still server-rendered: the
// server resolves the import, and the client hydrates once the chunk arrives
// (clicks made before that are replayed by React).
// Adding an experience: register it in data/experiences/index.ts AND here.

const LOADERS: Readonly<Record<string, () => Promise<Experience>>> = {
  "dhaka-cng-simulator": () => import("@/data/experiences/dhaka-cng").then((m) => m.dhakaCng),
  "food-delivery-simulator": () => import("@/data/experiences/food-delivery").then((m) => m.foodDelivery),
  "dhaka-bus-simulator": () => import("@/data/experiences/dhaka-bus").then((m) => m.dhakaBus),
  "job-resignation-simulator": () => import("@/data/experiences/job-resignation").then((m) => m.jobResignation),
  "fake-shopping-spree": () => import("@/data/experiences/fake-shopping").then((m) => m.fakeShopping),
  "house-rent-simulator": () => import("@/data/experiences/house-rent").then((m) => m.houseRent),
  "random-life-decision": () => import("@/data/experiences/life-decision").then((m) => m.lifeDecision),
};

// Stable promise per slug (use() needs the same promise across renders).
const cache = new Map<string, Promise<Experience>>();
function loadExperience(slug: string, load: () => Promise<Experience>): Promise<Experience> {
  let promise = cache.get(slug);
  if (!promise) {
    promise = load().catch((error: unknown) => {
      cache.delete(slug); // allow a retry after a failed chunk load
      throw error;
    });
    cache.set(slug, promise);
  }
  return promise;
}

function LoadedPlayer({ slug, load }: { slug: string; load: () => Promise<Experience> }) {
  const experience = use(loadExperience(slug, load));
  return (
    <MotionProvider>
      <ExperiencePlayer experience={experience} />
    </MotionProvider>
  );
}

export function ExperiencePlayerBySlug({ slug }: { slug: string }) {
  const load = LOADERS[slug];
  if (!load) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`No player registered for experience "${slug}" in components/experience/experience-players.tsx`);
    }
    return null;
  }
  return (
    // Same footprint as the player's intro card, so client navigation doesn't shift layout.
    <Suspense fallback={<div className={`${card} min-h-56 animate-pulse bg-surface-2 p-6`} aria-busy="true" />}>
      <LoadedPlayer slug={slug} load={load} />
    </Suspense>
  );
}
