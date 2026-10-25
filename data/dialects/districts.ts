import type { District } from "@/lib/dialects/types";

// Districts with dialect content. APPEND-ONLY: a district's position in this
// list is packed into quiz challenge seeds (lib/games/ancholik-quiz.ts), so
// reordering or removing one would change what old challenge links play.
// Adding a district here (plus a words file) is all the quiz needs.

export const DISTRICTS: readonly District[] = [
  { id: "jashore", name: { en: "Jashore", bn: "যশোর" }, division: "khulna", aliases: ["jessore"], emoji: "🌼" },
  { id: "khulna", name: { en: "Khulna", bn: "খুলনা" }, division: "khulna", aliases: [], emoji: "🐅" },
  { id: "barishal", name: { en: "Barishal", bn: "বরিশাল" }, division: "barishal", aliases: ["barisal"], emoji: "🛶" },
  { id: "noakhali", name: { en: "Noakhali", bn: "নোয়াখালী" }, division: "chattogram", aliases: [], emoji: "🌾" },
  { id: "sylhet", name: { en: "Sylhet", bn: "সিলেট" }, division: "sylhet", aliases: [], emoji: "🍃" },
  { id: "chattogram", name: { en: "Chattogram", bn: "চট্টগ্রাম" }, division: "chattogram", aliases: ["chittagong", "chottogram"], emoji: "⛰️" },
];
