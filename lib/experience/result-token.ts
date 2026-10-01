// Share-link tokens: /result/<token>
//
// Format v1 (readable, URL-safe, no encoding needed):
//   1.<slug>.<seed base36>.<outcomeId>.<choice1>~<choice2>~...
// Choices are listed in choice-step order.
//
// The outcome id is stored, not recomputed, so tweaking probabilities later
// never changes a result someone already shared. Tokens can be hand-edited;
// that is harmless, but everything is validated before rendering.

import { ID_PATTERN, choiceSteps } from "./engine";
import { getExperience } from "./registry";
import { RESULT_TOKEN_VERSION } from "./result-token-encode";
import { t, type Lang } from "@/lib/i18n/core";
import type { Experience, ExperienceOutcome } from "./types";

export { encodeResultToken } from "./result-token-encode";

const VERSION = RESULT_TOKEN_VERSION;
const MAX_TOKEN_LENGTH = 400;

export type ResultData = {
  experience: Experience;
  /** Selected option id per choice-step id. */
  choices: Record<string, string>;
  seed: number;
  outcome: ExperienceOutcome;
};

/** Returns null for anything malformed, unknown or stale. Never throws. */
export function decodeResultToken(raw: string): ResultData | null {
  let token: string;
  try {
    token = decodeURIComponent(raw);
  } catch {
    return null;
  }
  if (token.length === 0 || token.length > MAX_TOKEN_LENGTH) return null;

  const parts = token.split(".");
  if (parts.length !== 5) return null;
  const [version, slug, seedPart, outcomeId, choicePart] = parts;
  if (version !== VERSION || !slug || !seedPart || !outcomeId || choicePart === undefined) {
    return null;
  }
  if (!ID_PATTERN.test(slug) || !ID_PATTERN.test(outcomeId)) return null;
  if (!/^[0-9a-z]{1,7}$/.test(seedPart)) return null;

  const seed = parseInt(seedPart, 36);
  if (!Number.isSafeInteger(seed) || seed > 0xffffffff) return null;

  const experience = getExperience(slug);
  if (!experience) return null;

  const outcome = experience.outcomes.find((o) => o.id === outcomeId);
  if (!outcome) return null;

  const steps = choiceSteps(experience);
  const values = steps.length === 0 ? [] : choicePart.split("~");
  if (values.length !== steps.length) return null;

  const choices: Record<string, string> = {};
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const value = values[i];
    if (!step || !value || !step.options.some((o) => o.id === value)) return null;
    choices[step.id] = value;
  }

  return { experience, choices, seed, outcome };
}

/** Lines for the result card: the player's choices, then outcome extras. */
export function resultCardLines(
  { experience, choices, outcome }: ResultData,
  lang: Lang,
): { label: string; value: string }[] {
  return [
    ...choiceSteps(experience).map((step) => {
      const option = step.options.find((o) => o.id === choices[step.id]);
      return {
        label: t(step.cardLabel, lang),
        value: `${option?.emoji ?? ""} ${option ? t(option.label, lang) : ""}`.trim(),
      };
    }),
    ...(outcome.card ?? []).map((line) => ({ label: t(line.label, lang), value: t(line.value, lang) })),
  ];
}
