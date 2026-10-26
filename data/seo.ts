import type { PageSeo } from "@/lib/seo";

// Search titles + descriptions for the site's own pages (games, experiences and
// guides keep theirs in their registries). English for now; Phase 49 step B adds
// Bangla. Titles get " · Hottogol" appended (except `home`). Only claim what the
// page really offers. Limits are checked by tests/seo.test.ts.

export const PAGE_SEO = {
  home: {
    title: "Hottogol — Funny Bangladeshi Games & Simulators Online",
    description:
      "Free funny games, simulators and quizzes about everyday Bangladesh: Dhaka traffic, CNG, bazar, book cricket, marbles, latim and dialects. No sign-up.",
  },
  about: {
    title: "About Hottogol",
    description:
      "What Hottogol is: free, funny one-minute games and simulators about everyday Bangladeshi chaos, who makes them, and how to get in touch.",
  },
  privacy: {
    title: "Privacy",
    description:
      "What Hottogol collects (very little) and why: anonymous Google Analytics events, and game progress kept only in your own browser. No accounts.",
  },
  terms: {
    title: "Terms of Use",
    description: "The simple rules for using Hottogol's free games, simulators and quizzes: what's allowed, what we promise, and what we don't.",
  },
  achievements: {
    title: "Achievements",
    description: "Your Hottogol achievements, saved on this device only. No accounts, no leaderboards — just badges for the chaos you caused.",
  },
  daily: {
    title: "Daily Hottogol — One Mini-Game Challenge a Day",
    description:
      "One identical mini-game challenge for everyone, every day (Bangladesh time). Play, share your score, keep your streak and come back tomorrow.",
  },
  games: {
    title: "Free Funny Games from Bangladesh — Play in Your Browser",
    description:
      "Quick browser games about everyday Bangladesh: Dhaka traffic, CNG, bazar haggling, book cricket, marbles, latim and dialect quizzes. Free, no sign-up.",
  },
  experiences: {
    title: "Funny Life Simulators — One-Minute Choice Stories",
    description:
      "Every playable simulator in one place: Dhaka CNG, food delivery, Dhaka bus, job resignation, shopping, house rent and more. Free, no sign-up.",
  },
  bored: {
    title: "Bored? Fun Things to Do Online in 30 Seconds",
    description:
      "Bored right now? Play free 30-second reaction games, 1-minute funny simulators and quick quizzes about Dhaka chaos. No sign-up, no downloads.",
  },
  boss: {
    title: "Weekly Boss — Dhaka Traffic Boss Fight",
    description:
      "A new boss every week, the same for everyone. Beat the Dhaka Traffic Boss, chase your best score and challenge a friend. Free, in your browser.",
  },
  "dhaka-person": {
    title: "What Kind of Dhaka Person Are You? — Funny Quiz",
    description:
      "10 quick questions about CNG fares, traffic, biryani, rain and salary day. Find out your Dhaka personality and share it with friends. Free.",
  },
  excuses: {
    title: "Excuse Generator — Funny Bangla & English Excuses",
    description:
      "Need an excuse for office, university, being late, friends or family? Generate a funny Dhaka-style excuse with a credibility score. Free.",
  },
  world: {
    title: "Hottogol World — Every Game & Simulator on One Map",
    description:
      "Explore Hottogol by world: Bangladesh (CNG, bus, bazar, dialects), Life (work, rent, decisions) and Arcade (reaction and flick games). Free.",
  },
  blog: {
    title: "Blog — Traditional Games, Places & Words of Bangladesh",
    description:
      "Researched articles on the games we grew up with, Bangladesh's districts and regional words — the rules, the history and where to play them.",
  },
  viral: {
    title: "You Saw the Video. Now Try It Yourself.",
    description: "Play the Dhaka chaos from the video — traffic dodging, chicken crossing, CNG catching. Free, in your browser, no sign-up.",
  },
} as const satisfies Record<string, PageSeo>;

export type PageSeoId = keyof typeof PAGE_SEO;

/** Pages kept out of search (personal or deliberately minimal). */
export const NOINDEX_PAGES: readonly PageSeoId[] = ["achievements", "viral"];
