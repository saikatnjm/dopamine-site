// Shared class strings. Literal strings so Tailwind can see them.

/** Loud accent backgrounds (always ink text — all pass AA). */
export const accentBg = {
  cng: "bg-cng text-ink",
  marigold: "bg-marigold text-ink",
  chili: "bg-chili text-ink",
  violet: "bg-violet text-ink",
  sky: "bg-sky text-ink",
  tangerine: "bg-tangerine text-ink",
  lime: "bg-lime text-ink",
} as const;

export type Accent = keyof typeof accentBg;

/** AA-safe coloured text on the cream background. */
export const accentText = {
  cng: "text-cng-deep",
  marigold: "text-marigold-deep",
  chili: "text-chili-deep",
  violet: "text-violet-deep",
  sky: "text-sky-deep",
  tangerine: "text-marigold-deep",
  lime: "text-cng-deep",
} as const satisfies Record<Accent, string>;

/** Chunky primary button with offset shadow and press effect. */
export const btnPrimary =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-pill border-2 border-ink px-6 py-3 text-lg font-extrabold shadow-pop transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-lg active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-60";

export const btnGhost =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-pill px-4 py-2 font-bold text-ink-muted underline-offset-4 transition-colors hover:text-ink hover:underline";

export const card = "rounded-card border-2 border-ink bg-surface shadow-pop";

/** Card that lifts on hover — for clickable cards. */
export const cardHover =
  "transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-none";

export const chip =
  "inline-flex min-h-10 items-center gap-1.5 rounded-pill border-2 border-ink bg-surface px-4 py-1.5 text-sm font-bold shadow-pop transition-transform hover:-rotate-2";
