"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { BOSS_GAMES } from "@/components/boss/boss-games";
import type { BossRunResult } from "@/components/boss/types";
import { ChallengeBanner, ChallengeOutcome, ShareActions } from "@/components/games/challenge-ui";
import { useI18n } from "@/components/providers/lang-provider";
import { ResultCard } from "@/components/share/result-card";
import { ResultShareKit, useHost, useOrigin } from "@/components/share/result-share-kit";
import { accentBg, btnGhost, btnPrimary, card } from "@/components/ui/styles";
import { bossCopy as copy, bosses } from "@/data/bosses";
import { track } from "@/lib/analytics";
import { challengePath, type FriendChallenge } from "@/lib/challenge";
import { nowSecond, subscribeSecond } from "@/lib/daily";
import { createBestStore, prefersReducedMotion } from "@/lib/games/shared";
import { fmt, num, t } from "@/lib/i18n/core";
import type { ResultCardData } from "@/lib/result-card";
import {
  bdWeekKey,
  formatBossCountdown,
  getPinnedWeek,
  msUntilNextBoss,
  parseBossRecord,
  readBossRaw,
  recordBossResult,
  repinWeek,
  startBossAttempt,
  subscribeBoss,
  subscribePinnedWeek,
  weeklyBoss,
  type BossId,
} from "@/lib/weekly-boss";

export type BossArenaMode = { kind: "weekly" } | { kind: "challenge"; challenge: FriendChallenge; bossId: BossId };

type Phase = "intro" | "fight" | "result";

// All-time best per boss on this device (kept beside the weekly record).
const bestStores: Partial<Record<BossId, ReturnType<typeof createBestStore>>> = {};
function bestStore(id: BossId) {
  return (bestStores[id] ??= createBestStore(`hottogol:${id}:best`));
}

/** "2d 05:07:09" until the next boss; ticks on its own so the fight never re-renders. */
function BossCountdown({ className = "" }: { className?: string }) {
  const now = useSyncExternalStore(subscribeSecond, nowSecond, () => 0);
  return <span className={`tabular-nums ${className}`}>{now === 0 ? "—" : formatBossCountdown(msUntilNextBoss(now))}</span>;
}

/** Shown when the Bangladesh week has moved past the pinned one. */
function NewWeekBanner({ weekKey }: { weekKey: string }) {
  const { lang } = useI18n();
  const now = useSyncExternalStore(subscribeSecond, nowSecond, () => 0);
  if (now === 0 || bdWeekKey(now) === weekKey) return null;
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-ink bg-violet p-4 text-center font-bold shadow-pop sm:flex-row sm:justify-between sm:text-left">
      <p>{t(copy.newWeek, lang)}</p>
      <button type="button" onClick={repinWeek} className={`${btnPrimary} bg-surface`}>
        {t(copy.loadNew, lang)}
      </button>
    </div>
  );
}

export function BossArena({ mode }: { mode: BossArenaMode }) {
  const { lang } = useI18n();
  const host = useHost();
  const origin = useOrigin();

  const weekKey = useSyncExternalStore(subscribePinnedWeek, getPinnedWeek, () => "");
  const rawRecord = useSyncExternalStore(
    subscribeBoss,
    () => (mode.kind === "weekly" && weekKey ? readBossRaw(weekKey) : null),
    () => null,
  );

  const [phase, setPhase] = useState<Phase>("intro");
  const [attempt, setAttempt] = useState(0);
  const [runId, setRunId] = useState(0);
  const [result, setResult] = useState<BossRunResult | null>(null);
  const [newBest, setNewBest] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Scroll the arena into view and focus the result heading when the phase changes.
  useEffect(() => {
    if (phase === "intro") return;
    rootRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    if (phase === "result") headingRef.current?.focus({ preventScroll: true });
  }, [phase]);

  const isWeekly = mode.kind === "weekly";
  if (isWeekly && weekKey === "") {
    return (
      <div className={`${card} min-h-80 animate-pulse bg-surface-2 p-6`} aria-busy="true">
        <p className="font-bold text-ink-muted">{t(copy.loading, lang)}</p>
      </div>
    );
  }

  const week = isWeekly ? weeklyBoss(weekKey) : null;
  const bossId: BossId = mode.kind === "challenge" ? mode.bossId : week!.boss;
  const seed = mode.kind === "challenge" ? mode.challenge.seed : week!.seed;
  const challenge = mode.kind === "challenge" ? mode.challenge : null;
  const boss = bosses[bossId];
  const record = parseBossRecord(rawRecord);
  const Game = BOSS_GAMES[bossId];
  const modeName = isWeekly ? "weekly" : "challenge";

  function startFight() {
    const n = week ? startBossAttempt(week) : attempt + 1;
    track(runId === 0 ? "game_start" : "game_retry", { game: bossId, mode: modeName });
    setAttempt(n);
    setRunId(runId + 1);
    setResult(null);
    setNewBest(false);
    setPhase("fight");
  }

  function handleEnd(r: BossRunResult) {
    let best = false;
    if (week) best = recordBossResult(week, r.score, r.defeated).newBest;
    const store = bestStore(bossId);
    if (r.score > store.read()) store.write(r.score);
    track("game_complete", { game: bossId, score: r.score, defeated: r.defeated, weekly: isWeekly, ...r.analytics });
    setNewBest(best);
    setResult(r);
    setPhase("result");
  }

  const stats = (
    <dl className="grid grid-cols-2 gap-2 text-center">
      <div className="col-span-2 rounded-xl border-2 border-ink bg-surface-2 px-2 py-2">
        <dt className="text-[11px] font-extrabold uppercase tracking-wide text-ink-muted sm:text-xs">{t(copy.nextBoss, lang)}</dt>
        <dd>
          <BossCountdown className="font-display text-2xl font-black" />
        </dd>
      </div>
      <div className="rounded-xl border-2 border-ink bg-surface-2 px-2 py-2">
        <dt className="text-[11px] font-extrabold uppercase tracking-wide text-ink-muted sm:text-xs">{t(copy.bestWeek, lang)}</dt>
        <dd className="font-display text-xl font-extrabold tabular-nums">{num(record?.best ?? 0, lang)}</dd>
      </div>
      <div className="rounded-xl border-2 border-ink bg-surface-2 px-2 py-2">
        <dd className="text-sm font-extrabold leading-tight">
          {record ? fmt(t(copy.attempts, lang), { n: num(record.attempts, lang) }) : t(copy.noAttempts, lang)}
        </dd>
        {record?.defeated && (
          <dd className="mt-1 text-xs font-extrabold text-cng-deep">🏆 {t(copy.beatenBadge, lang)}</dd>
        )}
      </div>
    </dl>
  );

  const playThisWeek = challenge && (
    <Link href="/boss" className={`${btnPrimary} bg-surface`}>
      {t(copy.playThisWeek, lang)}
    </Link>
  );

  // ---------------------------------------------------------------- intro
  if (phase === "intro") {
    return (
      <div ref={rootRef} className="grid scroll-mt-4 gap-5">
        {isWeekly && <NewWeekBanner weekKey={weekKey} />}
        {challenge && <ChallengeBanner challenge={challenge} />}
        <section className={`${card} overflow-hidden`} aria-labelledby="boss-intro">
          <div className={`${accentBg[boss.accent]} border-b-2 border-ink px-5 py-4`}>
            <p className="w-fit -rotate-2 rounded-pill border-2 border-ink bg-ink px-3 py-0.5 text-sm font-black tracking-widest text-bg">
              👹 {t(copy.weeklyBoss, lang).toUpperCase()}
            </p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <div>
                {week && <p className="text-sm font-extrabold">{fmt(t(copy.bossNumber, lang), { n: num(week.number, lang) })}</p>}
                <h2 id="boss-intro" className="font-display text-3xl font-extrabold leading-tight">
                  {t(boss.name, lang)}
                </h2>
                <p className="mt-1 font-bold">{t(boss.tagline, lang)}</p>
              </div>
              <span aria-hidden className="text-6xl drop-shadow-[3px_3px_0_rgb(26_19_37)]">
                {boss.emoji}
              </span>
            </div>
          </div>
          <div className="grid gap-4 p-5">
            <ul className="grid gap-2">
              {boss.rules.map((rule, i) => (
                <li key={i} className="flex gap-2 font-bold">
                  <span aria-hidden>👉</span>
                  <span>{t(rule, lang)}</span>
                </li>
              ))}
            </ul>
            {stats}
            <button type="button" onClick={startFight} className={`${btnPrimary} ${accentBg[boss.accent]} text-xl`}>
              {boss.emoji} {t(copy.fight, lang)}
            </button>
            <p className="text-center text-xs text-ink-muted">{t(copy.localNote, lang)}</p>
          </div>
        </section>
        {playThisWeek}
      </div>
    );
  }

  // ---------------------------------------------------------------- fight
  if (phase === "fight") {
    return (
      <div ref={rootRef} className="grid scroll-mt-4 gap-3">
        <p className="w-fit rotate-1 rounded-pill border-2 border-ink bg-marigold px-3 py-0.5 text-sm font-extrabold shadow-pop">
          {boss.emoji} {fmt(t(copy.attempt, lang), { n: num(attempt, lang) })}
        </p>
        <Game key={runId} seed={seed} onEnd={handleEnd} />
      </div>
    );
  }

  // --------------------------------------------------------------- result
  if (!result) return null;
  const defeated = result.defeated;
  const score = result.score;
  const rankEn = t(result.rank.title, "en");
  const cardData: ResultCardData = {
    game: t(boss.name, lang),
    emoji: boss.emoji,
    accent: defeated ? "lime" : "chili",
    headlineLabel: t(copy.score, lang),
    headline: `${num(score, lang)} ${t(copy.pts, lang)}`,
    title: t(defeated ? copy.bossDefeated : copy.bossWon, lang),
    titleEmoji: defeated ? "🏆" : "💀",
    rank: `${result.rank.emoji} ${t(result.rank.title, lang)}`,
    blurb: result.line ? t(result.line, lang) : undefined,
    stats: result.stats.map((s) => ({ label: t(s.label, lang), value: s.value })),
    path: "/boss",
  };
  const challengeUrl = `${origin}${challengePath({ game: bossId, seed, score }) ?? "/boss"}`;
  const shareText = fmt(t(copy.shareText, lang), {
    boss: t(boss.name, lang),
    emoji: boss.emoji,
    result: t(defeated ? copy.resultWin : copy.resultLose, lang),
    score: num(score, lang),
  });

  return (
    <div ref={rootRef} className="grid scroll-mt-4 gap-5">
      <ResultCard data={cardData} host={host} headingId="boss-result" headingRef={headingRef} level={2}>
        {isWeekly && newBest && (
          <p className="mx-auto w-fit -rotate-1 rounded-xl border-2 border-ink bg-marigold px-3 py-1.5 text-center font-extrabold">
            ⭐ {t(copy.newBest, lang)}
          </p>
        )}
        <p className="text-center text-xs font-extrabold text-ink-muted">{fmt(t(copy.attempt, lang), { n: num(attempt, lang) })}</p>
        {challenge && <ChallengeOutcome challenge={challenge} seed={seed} score={score} />}
      </ResultCard>

      <ResultShareKit
        data={cardData}
        url={challengeUrl}
        fileName="weekly-boss-result"
        onShared={(method) => track("game_share", { game: bossId, method, rank: rankEn })}
      />
      <ShareActions game={bossId} seed={seed} score={score} text={shareText} accent={cardData.accent} rank={rankEn} />

      <button type="button" onClick={startFight} className={`${btnPrimary} ${accentBg[boss.accent]}`}>
        🔁 {t(copy.retry, lang)}
      </button>

      {isWeekly && <section className={`${card} p-4`}>{stats}</section>}
      {playThisWeek}
      <Link href="/" className={`${btnGhost} justify-self-center`}>
        {t(copy.home, lang)}
      </Link>
    </div>
  );
}
