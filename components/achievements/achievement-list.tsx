"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useI18n } from "@/components/providers/lang-provider";
import { accentBg, card } from "@/components/ui/styles";
import { ACHIEVEMENTS, parseStore, readRaw, subscribe } from "@/lib/achievements";
import { fmt, num, t } from "@/lib/i18n/core";

/** Locked + unlocked achievements from this device's storage. */
export function AchievementList() {
  const { lang, d } = useI18n();
  // null on the server → render a neutral "all locked" view, then hydrate.
  const raw = useSyncExternalStore(subscribe, readRaw, () => null);
  const store = useMemo(() => parseStore(raw), [raw]);
  const unlockedCount = ACHIEVEMENTS.filter((a) => store.unlocked[a.id]).length;
  const dateFmt = useMemo(
    () => new Intl.DateTimeFormat(lang === "bn" ? "bn-BD" : "en-GB", { day: "numeric", month: "short", year: "numeric" }),
    [lang],
  );

  const stats = [
    { key: "games", label: d.achStatGames, value: store.stats.gamesPlayed },
    { key: "distinct", label: d.achStatDistinct, value: store.stats.games.length },
    { key: "sims", label: d.achStatSims, value: store.stats.simsPlayed },
  ];

  return (
    <div>
      <div className={`${card} p-5`}>
        <p className="font-display text-3xl font-black tabular-nums">
          🏆 {fmt(d.achProgress, { n: num(unlockedCount, lang), total: num(ACHIEVEMENTS.length, lang) })}
        </p>
        <div
          className="mt-3 h-4 overflow-hidden rounded-pill border-2 border-ink bg-surface-2"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={ACHIEVEMENTS.length}
          aria-valuenow={unlockedCount}
          aria-label={d.achTitle}
        >
          <span className="block h-full bg-lime" style={{ width: `${(unlockedCount / ACHIEVEMENTS.length) * 100}%` }} />
        </div>
        <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
          {stats.map((s) => (
            <div key={s.key} className="rounded-xl border-2 border-ink bg-surface-2 px-1 py-2">
              <dt className="text-[10px] font-extrabold uppercase leading-tight tracking-wide text-ink-muted sm:text-xs">{s.label}</dt>
              <dd className="font-display text-xl font-extrabold tabular-nums">{num(s.value, lang)}</dd>
            </div>
          ))}
        </dl>
      </div>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {ACHIEVEMENTS.map((a, i) => {
          const at = store.unlocked[a.id];
          if (at) {
            return (
              <li key={a.id} className={`${card} ${i % 2 ? "rotate-[0.5deg]" : "-rotate-[0.5deg]"} flex gap-3 p-4`}>
                <span aria-hidden className={`${accentBg.marigold} grid size-14 shrink-0 place-items-center rounded-xl border-2 border-ink text-3xl`}>
                  {a.emoji}
                </span>
                <div className="min-w-0">
                  <h2 className="font-display text-lg font-extrabold leading-tight">{t(a.title, lang)}</h2>
                  <p className="text-sm text-ink-muted">{t(a.description, lang)}</p>
                  <p className="mt-1 text-xs font-extrabold text-cng-deep">✅ {fmt(d.achOn, { date: dateFmt.format(at) })}</p>
                </div>
              </li>
            );
          }
          return (
            <li key={a.id} className="flex gap-3 rounded-card border-2 border-dashed border-ink/50 bg-surface/60 p-4">
              <span aria-hidden className="grid size-14 shrink-0 place-items-center rounded-xl border-2 border-dashed border-ink/50 text-3xl grayscale">
                {a.hidden ? "❓" : a.emoji}
              </span>
              <div className="min-w-0">
                <h2 className="font-display text-lg font-extrabold leading-tight text-ink-muted">
                  {a.hidden ? d.achSecret : t(a.title, lang)} <span className="sr-only">({d.achLocked})</span>
                </h2>
                <p className="text-sm text-ink-muted">{a.hidden ? d.achSecretBody : t(a.description, lang)}</p>
                <p aria-hidden className="mt-1 text-xs font-extrabold text-ink-muted">🔒 {d.achLocked}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
