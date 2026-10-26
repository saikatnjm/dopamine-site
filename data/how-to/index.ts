import type { HowTo } from "@/lib/how-to";
import { HOW_TO_ARCADE } from "./arcade";
import { HOW_TO_BANGLADESH } from "./bangladesh";
import { HOW_TO_STORIES } from "./stories";
import { HOW_TO_TURN } from "./turn-based";

// "How to play" content per activity key (see lib/how-to.ts for the rules).
export const HOW_TO: Readonly<Record<string, HowTo>> = { ...HOW_TO_ARCADE, ...HOW_TO_TURN, ...HOW_TO_BANGLADESH, ...HOW_TO_STORIES };
