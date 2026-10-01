// Shared schema for every experience. Experience content lives in
// data/experiences/*.ts and must satisfy these types.
//
// Human-readable fields are `Text`: one string (same in both languages,
// e.g. a Bangla quote) or { en, bn }. Render with t(text, lang).
//
// ID RULES (important for shared links):
// - All ids match /^[a-z0-9-]{1,40}$/.
// - Never rename or reuse an outcome id or option id once shipped.
//   Old share links store them. Retire ids by marking `retired: true`.

import type { Text } from "@/lib/i18n/core";

export type CategorySlug =
  | "bangladesh"
  | "food"
  | "travel"
  | "work"
  | "shopping"
  | "random";

/** How an activity plays (for "You might also like"). */
export type Mechanic = "reflex" | "choices" | "quiz" | "generator";

/** Topic tags shared by games, simulators and tools (keep the list short). */
export type ActivityTag =
  | "cng"
  | "bus"
  | "bike"
  | "traffic"
  | "haggling"
  | "money"
  | "food"
  | "delivery"
  | "office"
  | "tech"
  | "queue"
  | "reaction"
  | "shopping"
  | "life";

export type Category = {
  slug: CategorySlug;
  title: Text;
  emoji: string;
  description: Text;
};

export type ChoiceOption = {
  id: string;
  label: Text;
  emoji?: string;
  /** Small helper line under the label. */
  hint?: Text;
};

/** The user picks one option. */
export type ChoiceStep = {
  kind: "choice";
  id: string;
  prompt: Text;
  /** Short label used on the result card, e.g. "Destination". */
  cardLabel: Text;
  options: ChoiceOption[];
};

/** Context available when weighting random beats and outcomes. */
export type RunContext = {
  /** Selected option id per choice-step id. */
  choices: Readonly<Record<string, string>>;
  /** Picked beat id per beat-step id (only beats picked so far). */
  beats: Readonly<Record<string, string>>;
};

export type Weight = number | ((ctx: RunContext) => number);

export type Beat = {
  id: string;
  emoji?: string;
  /** Who is "speaking", e.g. "Driver". Omit for narration. */
  speaker?: Text;
  text: Text;
  weight: Weight;
};

/** The app picks one beat at random (seeded). Pure flavour between choices. */
export type BeatStep = {
  kind: "beat";
  id: string;
  title: Text;
  beats: Beat[];
};

export type ExperienceStep = ChoiceStep | BeatStep;

export type CardLine = { label: Text; value: Text };

export type ExperienceOutcome = {
  id: string;
  emoji: string;
  title: Text;
  message: Text;
  /** Optional punchline quote shown big on the card (often Bangla). */
  quote?: Text;
  /** Extra lines on the result card, e.g. "Driver arrived: ❌". */
  card?: CardLine[];
  /** Text prefilled when sharing. The URL is appended automatically. */
  shareText: Text;
  /** Relative weight (not a percentage). Can depend on choices/beats. */
  weight: Weight;
  /** Kept only so old share links still render. Never picked in new runs. */
  retired?: boolean;
};

export type Experience = {
  slug: string;
  title: Text;
  /** One-line hook for cards and listings. */
  tagline: Text;
  description: Text;
  /** Label on the start button, e.g. "Start the ride 🛺". */
  startLabel: Text;
  category: CategorySlug;
  /** Topic tags for recommendations (1–3). */
  tags: readonly ActivityTag[];
  emoji: string;
  /** Rough play time in seconds, for display. */
  durationSec: number;
  /** Primary colour token for this experience's accent. */
  accent: "cng" | "marigold" | "chili" | "violet" | "sky" | "tangerine" | "lime";
  steps: ExperienceStep[];
  outcomes: ExperienceOutcome[];
  /** English SEO copy (crawlers see English by default). */
  seo: {
    title: string;
    description: string;
  };
};
