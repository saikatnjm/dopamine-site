// Encoder half of lib/experience/result-token.ts, kept in its own module so
// client code (the experience player) can build share tokens without pulling
// in the experience registry — i.e. every experience's data — via the decoder.

import { choiceSteps } from "./engine";
import type { Experience } from "./types";

export const RESULT_TOKEN_VERSION = "1";

export function encodeResultToken(input: {
  experience: Experience;
  choices: Record<string, string>;
  seed: number;
  outcomeId: string;
}): string {
  const choicePart = choiceSteps(input.experience)
    .map((step) => input.choices[step.id] ?? "")
    .join("~");
  return [
    RESULT_TOKEN_VERSION,
    input.experience.slug,
    (input.seed >>> 0).toString(36),
    input.outcomeId,
    choicePart,
  ].join(".");
}
