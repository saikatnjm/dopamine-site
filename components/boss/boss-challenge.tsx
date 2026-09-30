"use client";

import { BossArena } from "@/components/boss/boss-arena";
import type { FriendChallenge } from "@/lib/challenge";

/** Rendered by /c/<token> for the "traffic-boss" challenge code. */
export function TrafficBossChallenge({ challenge }: { challenge: FriendChallenge | null }) {
  if (challenge === null) return <BossArena mode={{ kind: "weekly" }} />;
  return <BossArena mode={{ kind: "challenge", challenge, bossId: "traffic-boss" }} />;
}
