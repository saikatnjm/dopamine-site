import Link from "next/link";
import { accentBg, cardHover } from "@/components/ui/styles";
import type { Activity } from "@/lib/activities";
import { fmt, num, type Lang } from "@/lib/i18n/core";
import { getDictionary } from "@/lib/i18n/dictionary";

const tilts = ["rotate-1", "-rotate-1", "rotate-0"] as const;

/** Compact card for any registry activity (no hooks: works in server and client components). */
export function ActivityCard({
  activity: a,
  lang,
  index = 0,
  onClick,
}: {
  activity: Activity;
  lang: Lang;
  index?: number;
  /** Optional (client callers only), e.g. analytics on click. */
  onClick?: () => void;
}) {
  const d = getDictionary(lang);
  const time =
    a.durationSec === undefined
      ? null
      : a.durationSec >= 90
        ? fmt(d.minutes, { n: num(Math.round(a.durationSec / 60), lang) })
        : fmt(d.gameSeconds, { n: num(a.durationSec, lang) });
  return (
    <Link
      href={a.href}
      onClick={onClick}
      className={`${accentBg[a.accent]} ${cardHover} ${tilts[index % tilts.length]} flex h-full min-h-36 flex-col rounded-card border-2 border-ink p-4 shadow-pop hover:rotate-0`}
    >
      <span className="flex items-start justify-between gap-2">
        <span aria-hidden className="text-4xl leading-none">{a.emoji}</span>
        {time ? (
          <span className="rounded-pill border-2 border-ink bg-surface px-2 py-0.5 text-xs font-extrabold whitespace-nowrap">⏱️ {time}</span>
        ) : null}
      </span>
      <span className="mt-3 text-xs font-extrabold uppercase">{a.kindLabel}</span>
      <span className="font-display text-lg font-extrabold leading-tight sm:text-xl">{a.title}</span>
    </Link>
  );
}
