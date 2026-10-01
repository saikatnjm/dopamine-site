import type { ReactNode, Ref } from "react";
import { accentBg, card } from "@/components/ui/styles";
import { MAX_CARD_STATS, type ResultCardData } from "@/lib/result-card";

// The shared, screenshot-friendly result card (server- or client-rendered).
// Layout: HOTTOGOL bar → game chip → big headline + funny title → stats →
// quote → extras (children) → footer URL. Fits a 360 px phone without
// horizontal scroll. The PNG in lib/result-image.ts mirrors this layout.

export function ResultCard({
  data,
  host,
  headingId,
  headingRef,
  level = 1,
  children,
}: {
  data: ResultCardData;
  /** Site host for the footer (e.g. window.location.host or siteConfig host). */
  host: string;
  headingId?: string;
  headingRef?: Ref<HTMLHeadingElement>;
  /** Heading level used for the headline when there is no separate title. */
  level?: 1 | 2;
  /** Game-specific extras (challenge outcome, new best, codes…). */
  children?: ReactNode;
}) {
  const Heading = level === 2 ? "h2" : "h1";
  // 2–4 stats read best (same cap as the PNG in lib/result-image.ts).
  const stats = data.stats.slice(0, MAX_CARD_STATS);
  return (
    <article className={`${card} overflow-hidden`} aria-labelledby={headingId}>
      <div className="flex items-center justify-between gap-2 bg-ink px-4 py-2 text-bg">
        <span className="font-display text-lg font-black tracking-[0.25em]">HOTTOGOL</span>
        <span className="text-xs font-extrabold opacity-80">হট্টগোল</span>
      </div>
      <div className={`${accentBg[data.accent]} border-y-2 border-ink px-5 pb-6 pt-4 text-center`}>
        <p className="mx-auto w-fit max-w-full -rotate-1 truncate rounded-pill border-2 border-ink bg-surface px-3 py-0.5 text-sm font-extrabold uppercase tracking-wide">
          <span aria-hidden>{data.emoji}</span> {data.game}
        </p>
        {data.badge && (
          <p className="mx-auto mt-2 w-fit rotate-[2deg] rounded-pill border-2 border-ink bg-marigold px-3 py-0.5 text-sm font-extrabold shadow-pop">
            {data.badge}
          </p>
        )}
        {data.titleEmoji && (
          <p aria-hidden className="mt-3 text-6xl leading-none drop-shadow-[3px_3px_0_rgb(26_19_37)] motion-safe:animate-wiggle">
            {data.titleEmoji}
          </p>
        )}
        {data.headlineLabel && <p className="mt-3 text-xs font-extrabold uppercase tracking-wider">{data.headlineLabel}</p>}
        {data.title ? (
          <p className={`font-display font-black leading-tight tabular-nums ${data.headline.length > 18 ? "text-3xl" : "text-5xl"}`}>{data.headline}</p>
        ) : (
          // No separate title (simulator outcomes): the headline is the page heading.
          <Heading id={headingId} ref={headingRef} tabIndex={headingRef ? -1 : undefined} className="font-display text-3xl font-black leading-tight outline-none sm:text-4xl">
            {data.headline}
          </Heading>
        )}
        {data.title && (
          <h2 id={headingId} ref={headingRef} tabIndex={headingRef ? -1 : undefined} className="mt-2 font-display text-2xl font-extrabold leading-tight outline-none sm:text-3xl">
            {data.title}
          </h2>
        )}
        {data.rank && (
          <p className="mx-auto mt-2 w-fit rotate-1 rounded-pill border-2 border-ink bg-surface px-3 py-0.5 text-sm font-extrabold">{data.rank}</p>
        )}
      </div>
      <div className="grid gap-4 p-5">
        {data.blurb && <p className="text-center text-ink-muted">{data.blurb}</p>}
        {stats.length > 0 && (
          <dl className="grid grid-cols-2 gap-2 text-center">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`rounded-xl border-2 border-ink bg-surface-2 px-1 py-2 ${i === stats.length - 1 && stats.length % 2 === 1 ? "col-span-2" : ""}`}
              >
                <dt className="text-[11px] font-extrabold uppercase leading-tight tracking-wide text-ink-muted sm:text-xs">{s.label}</dt>
                <dd className={`font-display font-extrabold tabular-nums leading-tight ${s.value.length > 14 ? "text-base" : "text-xl"}`}>{s.value}</dd>
              </div>
            ))}
          </dl>
        )}
        {data.quote && (
          <blockquote className="-rotate-1 rounded-2xl border-2 border-ink bg-surface px-4 py-3 text-center font-display text-xl font-extrabold leading-snug">
            “{data.quote}”
          </blockquote>
        )}
        {children}
      </div>
      <p className="border-t-2 border-dashed border-ink/30 px-4 py-2 text-center text-xs font-extrabold text-ink-muted">
        🧠 Hottogol · {host}
        {data.path}
      </p>
    </article>
  );
}
