import { createRng, hashString, weightedPick } from "@/lib/random";
import type {
  Beat,
  BeatStep,
  ChoiceStep,
  Experience,
  ExperienceOutcome,
  RunContext,
  Weight,
} from "./types";

export const ID_PATTERN = /^[a-z0-9-]{1,40}$/;

// Each random decision gets its own RNG derived from (slug, seed, decision key).
// So a beat can be resolved as soon as the choices before it are known, and
// adding a new step later does not shift the rolls of existing steps.
function rngFor(experience: Experience, seed: number, key: string) {
  return createRng(hashString(`${experience.slug}|${seed >>> 0}|${key}`));
}

function resolveWeight(weight: Weight, ctx: RunContext): number {
  const w = typeof weight === "function" ? weight(ctx) : weight;
  return Number.isFinite(w) ? w : 0;
}

export function choiceSteps(experience: Experience): ChoiceStep[] {
  return experience.steps.filter((s): s is ChoiceStep => s.kind === "choice");
}

/** Deterministically pick the beat for one beat step. */
export function pickBeat(
  experience: Experience,
  step: BeatStep,
  ctx: RunContext,
  seed: number,
): Beat | undefined {
  const rng = rngFor(experience, seed, `beat:${step.id}`);
  return weightedPick(step.beats, (b) => resolveWeight(b.weight, ctx), rng);
}

export type RunResult = {
  beats: Record<string, Beat>;
  outcome: ExperienceOutcome;
};

/**
 * Resolve beats in step order, each seeing only the choices/beats before it.
 * Works with partial choices, so the player can reveal beats as it goes.
 */
export function resolveBeats(
  experience: Experience,
  choices: Record<string, string>,
  seed: number,
): { beats: Record<string, Beat>; ctx: RunContext } {
  const seenChoices: Record<string, string> = {};
  const beatIds: Record<string, string> = {};
  const beats: Record<string, Beat> = {};

  for (const step of experience.steps) {
    if (step.kind === "choice") {
      const choice = choices[step.id];
      if (choice !== undefined) seenChoices[step.id] = choice;
      continue;
    }
    const beat = pickBeat(experience, step, { choices: seenChoices, beats: beatIds }, seed);
    if (beat) {
      beats[step.id] = beat;
      beatIds[step.id] = beat.id;
    }
  }
  return { beats, ctx: { choices: seenChoices, beats: beatIds } };
}

/**
 * Full deterministic run: same experience + choices + seed => same result.
 * Throws only if the experience has no pickable outcome (a content bug that
 * validateExperience also reports).
 */
export function runExperience(
  experience: Experience,
  choices: Record<string, string>,
  seed: number,
): RunResult {
  const { beats, ctx } = resolveBeats(experience, choices, seed);
  const outcome = weightedPick(
    experience.outcomes.filter((o) => !o.retired),
    (o) => resolveWeight(o.weight, ctx),
    rngFor(experience, seed, "outcome"),
  );
  if (!outcome) {
    throw new Error(`Experience "${experience.slug}" has no pickable outcome`);
  }
  return { beats, outcome };
}

/** True when every choice step has a valid option selected. */
export function isCompleteChoices(
  experience: Experience,
  choices: Record<string, string>,
): boolean {
  return choiceSteps(experience).every((step) =>
    step.options.some((o) => o.id === choices[step.id]),
  );
}

/** Content checks. The registry runs these in development so bad data fails loudly. */
export function validateExperience(experience: Experience): string[] {
  const problems: string[] = [];
  const where = `experience "${experience.slug}"`;
  const check = (id: string, what: string) => {
    if (!ID_PATTERN.test(id)) problems.push(`${where}: invalid ${what} id "${id}"`);
  };
  const unique = (ids: string[], what: string) => {
    const seen = new Set<string>();
    for (const id of ids) {
      if (seen.has(id)) problems.push(`${where}: duplicate ${what} id "${id}"`);
      seen.add(id);
    }
  };

  check(experience.slug, "slug");
  unique(experience.steps.map((s) => s.id), "step");
  for (const step of experience.steps) {
    check(step.id, "step");
    if (step.kind === "choice") {
      if (step.options.length === 0) problems.push(`${where}: step "${step.id}" has no options`);
      step.options.forEach((o) => check(o.id, "option"));
      unique(step.options.map((o) => o.id), `option (step "${step.id}")`);
    } else {
      if (step.beats.length === 0) problems.push(`${where}: step "${step.id}" has no beats`);
      step.beats.forEach((b) => check(b.id, "beat"));
      unique(step.beats.map((b) => b.id), `beat (step "${step.id}")`);
    }
  }
  experience.outcomes.forEach((o) => check(o.id, "outcome"));
  unique(experience.outcomes.map((o) => o.id), "outcome");
  if (!experience.outcomes.some((o) => !o.retired)) {
    problems.push(`${where}: needs at least one non-retired outcome`);
  }
  return problems;
}
