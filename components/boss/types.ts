// Contract every weekly boss game implements. The shared shell
// (boss-arena.tsx) renders the intro/countdown/records around it and the
// result screen after it; the boss component only runs the fight.

import type { Text } from "@/lib/i18n/core";

export type BossStat = { label: Text; value: string };

export type BossRunResult = {
  /** Final score (integer ≥ 0). */
  score: number;
  /** True = the player beat the boss. */
  defeated: boolean;
  /** 2–4 stats already formatted for the viewer's language (values). */
  stats: BossStat[];
  /** Funny one-liner about how it ended (optional). */
  line?: Text;
  /** Rank title shown on the result card (the boss's own rank table). */
  rank: { emoji: string; title: Text };
  /** Extra params merged into track("game_complete") — achievements read these. */
  analytics?: Record<string, string | number | boolean>;
};

export type BossGameProps = {
  /** Week seed (or a friend's challenge seed). Same seed ⇒ same fight. */
  seed: number;
  /** Called once when the fight ends. */
  onEnd: (result: BossRunResult) => void;
};
