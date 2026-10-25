// 🔥 HOT RIGHT NOW (homepage) — hand-picked, NOT measured popularity.
// Edit this list to change what's featured. Keys are activity keys from
// lib/activities.ts ("g:<game>", "x:<simulator>", "p:dhaka-person",
// "p:excuses"); titles, emoji, routes and colours come from the registries.
// Show 3–5. A key that no longer exists fails the dev server/build.
// Never add counts like "12,492 playing" unless real analytics back them.

export type HotLabel = "hot" | "try" | "quick" | "friend";

export const HOT_RIGHT_NOW: readonly { key: string; label: HotLabel }[] = [
  // Riding the district-map trend (Oct 2026) — remove when it fades.
  { key: "g:my-bangladesh", label: "hot" },
  { key: "x:dhaka-cng-simulator", label: "hot" },
  { key: "g:cng-catch", label: "quick" },
  { key: "p:dhaka-person", label: "friend" },
  // During Bangladesh's South Africa tour (Nov 15 – Dec 13, 2026); swap back afterwards.
  { key: "g:book-cricket", label: "hot" },
];

export const HOT_MIN = 3;
export const HOT_MAX = 5;
