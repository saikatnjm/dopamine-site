"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { BossGameProps } from "@/components/boss/types";
import type { BossId } from "@/lib/weekly-boss";

/** Boss fight components, code-split. Add new bosses here and in BOSS_ROTATION. */
export const BOSS_GAMES: Record<BossId, ComponentType<BossGameProps>> = {
  "traffic-boss": dynamic(() => import("@/components/boss/traffic-boss-game").then((m) => m.TrafficBossGame), { ssr: false }),
};
