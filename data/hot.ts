// 🔥 HOT RIGHT NOW (homepage) — hand-picked, NOT measured popularity.
// Edit this list to change what's featured. Keys are activity keys from
// lib/activities.ts ("g:<game>", "x:<simulator>", "p:dhaka-person",
// "p:excuses"); titles, emoji, routes and colours come from the registries.
// Show 3–5. A key that no longer exists fails the dev server/build.
// Never add counts like "12,492 playing" unless real analytics back them.

export type HotLabel = "hot" | "try" | "quick" | "friend";

export const HOT_RIGHT_NOW: readonly { key: string; label: HotLabel }[] = [
  { key: "x:dhaka-cng-simulator", label: "hot" },
  { key: "g:cng-catch", label: "quick" },
  { key: "p:dhaka-person", label: "friend" },
  { key: "x:job-resignation-simulator", label: "try" },
];

export const HOT_MIN = 3;
export const HOT_MAX = 5;
