"use client";

import Link from "@/components/i18n/link";
import { useSyncExternalStore } from "react";
import { useI18n } from "@/components/providers/lang-provider";
import { accentBg, btnPrimary, card } from "@/components/ui/styles";
import { gdCopy as copy } from "@/data/games/guess-district";
import { bdDateKey, formatCountdown, msUntilNextDay, nowSecond, subscribeSecond } from "@/lib/daily";
import { dailyNumber, GD_SLUG, parseGdRecord, readGdRaw, subscribeGd } from "@/lib/games/guess-district-daily";
import { fmt, num, t } from "@/lib/i18n/core";

// Homepage card (under the Daily card): today's puzzle number, or this
// device's score + countdown once played. Light on purpose: no district map.

const noSubscribe = () => () => {};

function Countdown({ score }: { score: number }) {
  const { lang } = useI18n();
  const now = useSyncExternalStore(subscribeSecond, nowSecond, () => 0);
  return <>{fmt(t(copy.todayDone, lang), { score: num(score, lang), time: now ? formatCountdown(msUntilNextDay(now)) : "--:--:--" })}</>;
}

export function GuessDistrictCard() {
  const { lang } = useI18n();
  const dateKey = useSyncExternalStore(noSubscribe, () => bdDateKey(Date.now()), () => null);
  const record = parseGdRecord(useSyncExternalStore(subscribeGd, () => (dateKey ? readGdRaw(dateKey) : null), () => null));
  if (!dateKey) {
    return (
      <div className={`${card} min-h-24 animate-pulse bg-surface-2 p-5`} aria-busy="true">
        <p className="font-bold text-ink-muted">{t(copy.cardLoading, lang)}</p>
      </div>
    );
  }
  const n = dailyNumber(dateKey);
  return (
    <article className={`${card} flex min-h-24 flex-wrap items-center justify-between gap-3 rotate-[0.4deg] p-5`}>
      <div className="min-w-0">
        <p className="text-xs font-extrabold uppercase tracking-wider text-sky-deep">{t(copy.cardKicker, lang)}</p>
        <p className="font-display text-2xl font-black">{fmt(t(copy.dailyTitle, lang), { n: num(n, lang) })}</p>
        {record ? (
          <p className="text-sm font-bold">
            <Countdown score={record.first} /> <span className="ml-1 tracking-wider">{record.grid}</span>
          </p>
        ) : (
          <p className="text-sm font-bold text-ink-muted">{t(copy.intro, lang)}</p>
        )}
      </div>
      <Link href={`/games/${GD_SLUG}`} className={`${btnPrimary} ${accentBg.sky} px-5 text-base`}>
        {record ? t(copy.practice, lang) : fmt(t(copy.playToday, lang), { n: num(n, lang) })}
      </Link>
    </article>
  );
}
