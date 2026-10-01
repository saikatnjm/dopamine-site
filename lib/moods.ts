// "What are you in the mood for?" — maps each mood to activity KEYS from
// lib/activities.ts. No titles, routes or emoji here: those come from the real
// registries via listActivities(), so nothing is duplicated. Keys that don't
// resolve to a registered activity are dropped (never a dead link).

import type { Activity } from "@/lib/activities";
import type { Text } from "@/lib/i18n/core";

export const MOOD_IDS = ["bored", "laugh", "challenge", "test", "dhaka", "friend"] as const;
export type MoodId = (typeof MOOD_IDS)[number];

export type Mood = { id: MoodId; emoji: string; label: Text };

export const moods: readonly Mood[] = [
  { id: "bored", emoji: "😴", label: { en: "I'm bored", bn: "বোর হচ্ছি" } },
  { id: "laugh", emoji: "😂", label: { en: "Make me laugh", bn: "হাসাও" } },
  { id: "challenge", emoji: "🔥", label: { en: "I want a challenge", bn: "চ্যালেঞ্জ চাই" } },
  { id: "test", emoji: "🧠", label: { en: "Test me", bn: "আমাকে পরীক্ষা করো" } },
  { id: "dhaka", emoji: "🇧🇩", label: { en: "Give me Dhaka chaos", bn: "ঢাকার হট্টগোল দাও" } },
  { id: "friend", emoji: "👥", label: { en: "Something to send my friend", bn: "বন্ধুকে পাঠানোর মতো কিছু" } },
];

/** Activity keys per mood, best fits first. */
const MOOD_KEYS: Record<MoodId, readonly string[]> = {
  bored: [
    "g:chaos-machine",
    "x:random-life-decision",
    "g:delivery-sim",
    "g:queue-sim",
    "x:fake-shopping-spree",
    "x:food-delivery-simulator",
    "g:bazar-bargain",
  ],
  laugh: [
    "p:excuses",
    "x:job-resignation-simulator",
    "g:programmer-rage",
    "x:random-life-decision",
    "x:fake-shopping-spree",
    "g:chaos-machine",
    "x:food-delivery-simulator",
  ],
  challenge: [
    "g:traffic-boss",
    "g:traffic-dodge",
    "g:cng-catch",
    "g:dont-tap",
    "g:tea-balance",
    "g:chicken-crossing",
    "g:traffic-controller",
  ],
  test: ["p:dhaka-person", "g:dont-tap", "g:tea-balance", "g:traffic-controller", "g:bazar-bargain", "g:cng-catch"],
  dhaka: [
    "x:dhaka-cng-simulator",
    "x:dhaka-bus-simulator",
    "x:house-rent-simulator",
    "g:traffic-dodge",
    "g:cng-catch",
    "g:bazar-bargain",
    "g:queue-sim",
    "g:traffic-boss",
  ],
  friend: [
    "p:dhaka-person",
    "p:excuses",
    "g:traffic-boss",
    "g:cng-catch",
    "g:traffic-dodge",
    "x:job-resignation-simulator",
    "g:chicken-crossing",
  ],
};

export const MOOD_PICKS = 3;

/** Registered activities for a mood, in priority order. Unknown keys are skipped. */
export function activitiesForMood(mood: MoodId, all: readonly Activity[]): Activity[] {
  const byKey = new Map(all.map((a) => [a.key, a]));
  return MOOD_KEYS[mood].flatMap((key) => {
    const a = byKey.get(key);
    return a ? [a] : [];
  });
}

/**
 * Pick `count` activities: a random sample biased toward the top of the mood
 * list, so the best fits show up often but repeat visits still vary.
 * Tops up from the rest of the registry if a mood has too few matches.
 * `rand` returns floats in [0, 1).
 */
export function recommendForMood(
  mood: MoodId,
  all: readonly Activity[],
  rand: () => number,
  count: number = MOOD_PICKS,
): Activity[] {
  const pool = activitiesForMood(mood, all);
  // Weighted sample without replacement: earlier = slightly more likely.
  const weighted = pool.map((a, i) => ({ a, w: 1 / (1 + i * 0.25) }));
  const picks: Activity[] = [];
  while (picks.length < count && weighted.length > 0) {
    const total = weighted.reduce((s, x) => s + x.w, 0);
    let roll = rand() * total;
    let idx = weighted.length - 1;
    for (let i = 0; i < weighted.length; i++) {
      roll -= weighted[i]?.w ?? 0;
      if (roll < 0) {
        idx = i;
        break;
      }
    }
    const [hit] = weighted.splice(idx, 1);
    if (hit) picks.push(hit.a);
  }
  if (picks.length < count) {
    const taken = new Set(picks.map((p) => p.key));
    const rest = all.filter((a) => !taken.has(a.key));
    while (picks.length < count && rest.length > 0) {
      const [extra] = rest.splice(Math.floor(rand() * rest.length), 1);
      if (extra) picks.push(extra);
    }
  }
  return picks;
}

/** Keys referenced by MOOD_KEYS that are not in the registry (for build-time checks). */
export function unknownMoodKeys(all: readonly Activity[]): string[] {
  const known = new Set(all.map((a) => a.key));
  return [...new Set(Object.values(MOOD_KEYS).flat())].filter((k) => !known.has(k));
}
