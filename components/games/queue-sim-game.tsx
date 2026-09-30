"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode, type RefObject } from "react";
import { ChallengeBanner, ChallengeOutcome, ResultStamp, ShareActions } from "@/components/games/challenge-ui";
import { useI18n } from "@/components/providers/lang-provider";
import { accentBg, btnGhost, btnPrimary, card } from "@/components/ui/styles";
import { endings, events, places, queueCopy as copy, ranks, type ChoiceCopy } from "@/data/games/queue-sim";
import { track } from "@/lib/analytics";
import type { FriendChallenge } from "@/lib/challenge";
import {
  GAME_SLUG,
  LEGENDARY_ENDINGS,
  ROUNDS,
  choose,
  createQueue,
  currentEvent,
  endingOf,
  queueScore,
  rankOf,
  startRun,
  type EndingId,
  type Queue,
  type RunState,
} from "@/lib/games/queue-sim";
import { createBestStore, encodeSeed, prefersReducedMotion } from "@/lib/games/shared";
import { fmt, num, t, type Lang, type Text } from "@/lib/i18n/core";
import { newSeed } from "@/lib/random";
import { copyText } from "@/lib/sharing";

const bestStore = createBestStore(`hottogol:${GAME_SLUG}:best`);

type Phase = "idle" | "preview" | "playing" | "over";
type Challenge = FriendChallenge | null;
type Result = { score: number; ending: EndingId; run: RunState; newBest: boolean };

/** Fixed, varied crowd so the strip looks like a real queue. */
const CROWD = ["🧑", "👩", "👨‍🦳", "🧔", "👩‍🦱", "👨", "🧑‍🦱", "👵", "👱", "🧕", "👨‍💼", "👩‍🦰"];

function fill(text: Text, q: Queue, lang: Lang): string {
  return fmt(t(text, lang), { place: t(places[q.place].name, lang), counter: t(places[q.place].counter, lang) });
}

function resultText(c: ChoiceCopy, won: boolean | undefined): Text {
  if ("result" in c) return c.result;
  return won === false ? c.lose : c.win;
}

export function QueueSimGame({ challenge }: { challenge: Challenge }) {
  const { lang } = useI18n();
  const best = useSyncExternalStore(bestStore.subscribe, bestStore.read, () => 0);

  const [seed, setSeed] = useState<number | null>(challenge?.seed ?? null);
  const [phase, setPhase] = useState<Phase>(challenge ? "preview" : "idle");
  const [run, setRun] = useState<RunState | null>(null);
  const [answered, setAnswered] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const queue = useMemo(() => (seed === null ? null : createQueue(seed)), [seed]);
  const rootRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (answered) nextRef.current?.focus();
  }, [answered]);
  useEffect(() => {
    if (phase === "over") headingRef.current?.focus();
  }, [phase]);

  const scrollTop = () => rootRef.current?.scrollIntoView({ block: "start", behavior: prefersReducedMotion() ? "auto" : "smooth" });

  function joinQueue() {
    setSeed(newSeed());
    setRun(null);
    setResult(null);
    setPhase("preview");
    scrollTop();
  }

  function begin(kind: "first" | "retry") {
    if (!queue) return;
    setRun(startRun(queue));
    setAnswered(false);
    setResult(null);
    setPhase("playing");
    track(kind === "first" ? "game_start" : "game_retry", { game: GAME_SLUG, mode: kind });
    scrollTop();
  }

  function pickChoice(i: number) {
    if (!queue || !run || answered) return;
    const next = choose(queue, run, i);
    if (next === run) return;
    setRun(next);
    setAnswered(true);
  }

  function advance() {
    if (!queue || !run) return;
    setAnswered(false);
    if (!run.done) return;
    const score = queueScore(queue, run);
    const ending = endingOf(run);
    const prev = bestStore.read();
    if (score > prev) bestStore.write(score);
    setResult({ score, ending, run, newBest: score > prev });
    setPhase("over");
    track("game_complete", { game: GAME_SLUG, score, rank: rankOf(queue, run), outcome: ending, detected: run.detected });
  }

  const isChallenge = challenge !== null && seed === challenge.seed;

  return (
    <div ref={rootRef} className="scroll-mt-4">
      {phase === "idle" && (
        <section className={`${card} p-6 text-center`} aria-labelledby="qs-intro">
          <p aria-hidden className="text-5xl">
            🧍🧍‍♀️🧍🧍‍♂️🧍
          </p>
          <p id="qs-intro" className="mx-auto mt-3 max-w-sm text-lg font-bold">
            {t(copy.intro, lang)}
          </p>
          <button type="button" onClick={joinQueue} className={`${btnPrimary} ${accentBg.sky} mt-6 min-h-16 w-full text-2xl`}>
            {t(copy.join, lang)}
          </button>
          <p className="mt-4 text-sm font-bold text-ink-muted">
            🏆 {t(copy.best, lang)}: <span className="text-ink">{num(best, lang)}</span>
          </p>
        </section>
      )}

      {phase === "preview" && queue && (
        <section aria-labelledby="qs-queue">
          {isChallenge && <ChallengeBanner challenge={challenge} />}
          <QueueCard queue={queue} />
          <div className="mt-4 grid gap-3">
            <button type="button" onClick={() => begin("first")} className={`${btnPrimary} ${accentBg.marigold} min-h-16 text-2xl`}>
              {t(copy.start, lang)}
            </button>
            <button type="button" onClick={joinQueue} className={btnGhost}>
              {t(copy.another, lang)}
            </button>
          </div>
        </section>
      )}

      {phase === "playing" && queue && run && (
        <Round queue={queue} run={run} answered={answered} nextRef={nextRef} onChoose={pickChoice} onNext={advance} />
      )}

      {phase === "over" && queue && result && (
        <ResultView queue={queue} result={result} challenge={challenge} headingRef={headingRef} onRetry={() => begin("retry")} onNew={joinQueue} />
      )}
    </div>
  );
}

function QueueCard({ queue: q, compact = false }: { queue: Queue; compact?: boolean }) {
  const { lang } = useI18n();
  const p = places[q.place];
  const rows = [
    { key: "where", emoji: p.emoji, label: copy.where, value: t(p.name, lang) },
    { key: "ahead", emoji: "👥", label: copy.ahead, value: fmt(t(copy.people, lang), { n: num(q.start, lang) }) },
    { key: "counters", emoji: "🪟", label: copy.counters, value: num(q.counters, lang) },
  ];
  return (
    <div className={`${card} overflow-hidden`}>
      {!compact && (
        <div className={`${accentBg.sky} flex items-center justify-between border-b-2 border-ink px-4 py-3`}>
          <h2 id="qs-queue" className="font-display text-2xl font-extrabold">
            🧍 {t(copy.queueTitle, lang)}
          </h2>
        </div>
      )}
      <dl className={compact ? "grid grid-cols-1 gap-1 p-3 text-sm sm:grid-cols-3" : "divide-y-2 divide-dashed divide-ink/15"}>
        {rows.map((row) => (
          <div key={row.key} className={compact ? "flex items-baseline gap-1.5" : "flex items-center gap-3 px-4 py-2.5"}>
            <span aria-hidden className={compact ? "" : "grid size-10 shrink-0 place-items-center rounded-xl border-2 border-ink bg-surface-2 text-xl"}>
              {row.emoji}
            </span>
            <dt className={compact ? "font-bold text-ink-muted" : "w-28 shrink-0 text-xs font-extrabold uppercase tracking-wide text-ink-muted"}>
              {t(row.label, lang)}
              {compact && ":"}
            </dt>
            <dd className={compact ? "font-extrabold" : "font-display text-lg font-extrabold leading-tight"}>{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Counter → people ahead → YOU. Shows up to 10 people, then "+n". */
function QueueStrip({ ahead, counters, lang }: { ahead: number; counters: number; lang: Lang }) {
  const shown = Math.min(ahead, 10);
  const extra = ahead - shown;
  return (
    <div className={`${card} overflow-hidden px-3 py-3`} aria-label={`${t(copy.ahead, lang)}: ${num(ahead, lang)}`}>
      <div className="flex items-end gap-1 overflow-hidden" aria-hidden>
        <span className="flex shrink-0 flex-col items-center">
          <span className="text-2xl leading-none">{"🪟".repeat(Math.max(1, counters))}</span>
          <span className="mt-1 h-1.5 w-full rounded bg-ink" />
        </span>
        {Array.from({ length: shown }, (_, i) => (
          <span key={i} className="shrink-0 text-2xl leading-none">
            {CROWD[i % CROWD.length]}
          </span>
        ))}
        {extra > 0 && <span className="shrink-0 self-center rounded-pill border-2 border-ink bg-surface-2 px-1.5 text-xs font-extrabold">+{num(extra, lang)}</span>}
        <span className="flex shrink-0 flex-col items-center">
          <span className="rounded-pill border-2 border-ink bg-marigold px-1.5 text-[10px] font-black leading-tight">{t(copy.you, lang)}</span>
          <span className="text-3xl leading-none">🧍</span>
        </span>
      </div>
    </div>
  );
}

function Round({
  queue: q,
  run,
  answered,
  nextRef,
  onChoose,
  onNext,
}: {
  queue: Queue;
  run: RunState;
  answered: boolean;
  nextRef: RefObject<HTMLButtonElement | null>;
  onChoose: (i: number) => void;
  onNext: () => void;
}) {
  const { lang } = useI18n();
  const panelRef = useRef<HTMLDivElement>(null);
  // While showing a result, the event on screen is the one just answered.
  const shownIndex = answered ? run.choices.length - 1 : run.round;
  const eventId = answered ? run.events[shownIndex]! : currentEvent(run);
  const ev = events[eventId];
  const lastChoice = run.choices[run.choices.length - 1];
  const won = run.won[shownIndex];
  const roundLabel = fmt(t(copy.round, lang), { n: num(shownIndex + 1, lang), total: num(ROUNDS, lang) });

  useEffect(() => {
    if (answered || prefersReducedMotion()) return;
    panelRef.current?.animate(
      [
        { opacity: 0, transform: "translateX(28px) rotate(0.8deg)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 240, easing: "cubic-bezier(.2,.9,.3,1.2)" },
    );
  }, [shownIndex, answered]);

  return (
    <section aria-label={roundLabel} className="grid gap-3">
      <div className="grid grid-cols-3 gap-2" aria-live="polite">
        <Tile label={t(copy.ahead, lang)} warn={run.ahead > 10}>
          👥 {num(run.ahead, lang)}
        </Tile>
        <Tile label={t(copy.waited, lang)} warn={run.time > 45}>
          {fmt(t(copy.min, lang), { n: num(run.time, lang) })}
        </Tile>
        <Tile label={t(copy.patience, lang)} warn={run.patience < 30}>
          🔥 {num(run.patience, lang)}%
        </Tile>
      </div>
      <QueueStrip ahead={run.ahead} counters={run.counters} lang={lang} />

      <div ref={panelRef} className={`${card} p-5`}>
        <p className="text-xs font-extrabold uppercase tracking-wider text-ink-muted">
          {roundLabel} · {places[q.place].emoji} {t(places[q.place].name, lang)}
        </p>
        <p className="mt-2 flex gap-3 text-lg font-bold leading-snug">
          <span aria-hidden className="text-4xl leading-none">
            {ev.emoji}
          </span>
          <span lang={lang}>{fill(ev.text, q, lang)}</span>
        </p>

        {!answered ? (
          <div className="mt-5 grid gap-2">
            {ev.choices.map((c, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onChoose(i)}
                className="min-h-14 rounded-2xl border-2 border-ink bg-surface px-4 py-3 text-left font-extrabold shadow-pop transition-all duration-100 hover:-translate-y-0.5 hover:bg-surface-2 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                <span lang={lang}>{fill(c.label, q, lang)}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-5 grid gap-3">
            {won !== undefined && (
              <p className={`mx-auto -rotate-2 rounded-pill border-2 border-ink px-3 py-0.5 text-sm font-extrabold shadow-pop ${won ? "bg-lime" : "bg-chili"}`}>
                {t(won ? copy.luckyWin : copy.luckyLose, lang)}
              </p>
            )}
            <p lang={lang} className="rounded-2xl border-2 border-ink bg-surface-2 p-3 text-center font-bold" aria-live="polite">
              {lastChoice !== undefined && fill(resultText(ev.choices[lastChoice as 0 | 1 | 2], won), q, lang)}
            </p>
            {run.last && (
              <ul className="flex flex-wrap justify-center gap-2 text-sm font-extrabold">
                {run.last.ahead !== 0 && <Delta good={run.last.ahead < 0}>👥 {signed(run.last.ahead, lang)}</Delta>}
                {run.last.served > 0 && <Delta good>{fmt(t(copy.served, lang), { n: num(run.last.served, lang) })}</Delta>}
                <Delta good={false}>⏱️ {fmt(t(copy.min, lang), { n: signed(run.last.time, lang) })}</Delta>
                {run.last.patience !== 0 && <Delta good={run.last.patience > 0}>🔥 {signed(run.last.patience, lang)}</Delta>}
              </ul>
            )}
            <button ref={nextRef} type="button" onClick={onNext} className={`${btnPrimary} ${accentBg.marigold}`}>
              {run.done ? t(copy.finish, lang) : t(copy.next, lang)}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function signed(n: number, lang: Lang, prefix = ""): string {
  return `${n > 0 ? "+" : "−"}${prefix}${num(Math.abs(n), lang)}`;
}

function Delta({ good, children }: { good: boolean; children: ReactNode }) {
  return <li className={`rounded-pill border-2 border-ink px-3 py-1 ${good ? "bg-lime" : "bg-chili"}`}>{children}</li>;
}

function Tile({ label, warn, children }: { label: string; warn: boolean; children: ReactNode }) {
  return (
    <div className={`rounded-2xl border-2 border-ink px-1.5 py-1.5 text-center shadow-pop ${warn ? accentBg.chili : "bg-surface"}`}>
      <p className="text-[10px] font-extrabold uppercase tracking-wider text-ink-muted">{label}</p>
      <p className="font-display text-base font-extrabold tabular-nums leading-tight sm:text-lg">{children}</p>
    </div>
  );
}

const noSubscribe = () => () => {};
function useOrigin(): string {
  return useSyncExternalStore(noSubscribe, () => window.location.origin, () => "");
}

function ResultView({
  queue: q,
  result,
  challenge,
  headingRef,
  onRetry,
  onNew,
}: {
  queue: Queue;
  result: Result;
  challenge: Challenge;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onRetry: () => void;
  onNew: () => void;
}) {
  const { lang } = useI18n();
  const origin = useOrigin();
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const r = result.run;
  const ending = endings[result.ending];
  const rankId = rankOf(q, r);
  const rank = ranks[rankId];
  const legendary = LEGENDARY_ENDINGS.includes(result.ending);
  const message = fmt(t(copy.shareText, lang), {
    place: t(places[q.place].name, lang),
    min: num(r.time, lang),
    survived: num(r.outlasted, lang),
    score: num(result.score, lang),
    title: t(rank.title, lang),
    emoji: rank.emoji,
  });

  async function shareResult() {
    const url = `${origin}/games/${GAME_SLUG}`;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ text: message, url });
        track("game_share", { game: GAME_SLUG, method: "native-result", rank: rankId });
      } catch {
        // dismissed
      }
      return;
    }
    if (await copyText(`${message} ${url}`)) {
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
      track("game_share", { game: GAME_SLUG, method: "copy-result", rank: rankId });
    }
  }

  const stats = [
    { key: "time", label: copy.statTime, value: fmt(t(copy.min, lang), { n: num(r.time, lang) }) },
    { key: "survived", label: copy.statSurvived, value: num(r.outlasted, lang) },
    { key: "patience", label: copy.statPatience, value: `${num(r.patience, lang)}%` },
    { key: "caught", label: copy.statCaught, value: num(r.detected, lang) },
  ];

  return (
    <section className="grid gap-3" aria-labelledby="qs-result">
      <div className={`${card} overflow-hidden`}>
        <div className={`${accentBg[ending.accent]} border-b-2 border-ink px-5 py-6 text-center`}>
          {legendary && (
            <span className="inline-block rotate-[-2deg] rounded-pill border-2 border-ink bg-surface px-3 py-0.5 text-sm font-extrabold shadow-pop">
              {t(copy.legendary, lang)}
            </span>
          )}
          <p aria-hidden className="mt-2 text-7xl drop-shadow-[3px_3px_0_rgb(26_19_37)] motion-safe:animate-wiggle">
            {ending.emoji}
          </p>
          <h2 id="qs-result" ref={headingRef} tabIndex={-1} className="mt-2 font-display text-3xl font-extrabold leading-tight outline-none sm:text-4xl">
            {t(ending.title, lang)}
          </h2>
          <p className="mt-3 text-xs font-extrabold uppercase tracking-wider">{t(copy.score, lang)}</p>
          <p className="font-display text-5xl font-black tabular-nums">
            {num(result.score, lang)} <span className="text-lg font-bold">{t(copy.pts, lang)}</span>
          </p>
          <p className="mt-2 text-xs font-extrabold uppercase tracking-wider">{t(copy.rankLabel, lang)}</p>
          <p className="font-display text-xl font-extrabold">
            {rank.emoji} {t(rank.title, lang)}
          </p>
        </div>
        <div className="p-5">
          <p lang={lang} className="text-center text-ink-muted">
            {t(ending.blurb, lang)}
          </p>
          {result.newBest && <p className="mt-3 text-center font-extrabold text-cng-deep">{t(copy.newBest, lang)}</p>}
          <ChallengeOutcome challenge={challenge} seed={q.seed} score={result.score} />
          <dl className="mt-4 grid grid-cols-2 gap-2 text-center">
            {stats.map((st) => (
              <div key={st.key} className="rounded-xl border-2 border-ink bg-surface-2 px-1 py-2">
                <dt className="text-[11px] font-extrabold uppercase leading-tight tracking-wide text-ink-muted sm:text-xs">{t(st.label, lang)}</dt>
                <dd className="font-display text-xl font-extrabold tabular-nums">{st.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4">
            <QueueCard queue={q} compact />
          </div>
          <p className="mt-3 text-center text-xs font-bold text-ink-muted">
            {t(copy.queueCode, lang)}: <code className="font-mono">{encodeSeed(q.seed)}</code>
          </p>
        </div>
        <ResultStamp game={GAME_SLUG} />
      </div>

      <button type="button" onClick={shareResult} className={`${btnPrimary} bg-surface`}>
        {copied ? "✅" : "📋"} {t(copy.shareResult, lang)}
      </button>
      <ShareActions game={GAME_SLUG} seed={q.seed} score={result.score} text={message} accent={ending.accent} rank={rankId} />
      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={onRetry} className={`${btnPrimary} bg-surface px-3 text-base`}>
          {t(copy.retry, lang)}
        </button>
        <button type="button" onClick={onNew} className={`${btnPrimary} ${accentBg.sky} px-3 text-base`}>
          {t(copy.newRun, lang)}
        </button>
      </div>
      <Link href="/experiences" className={btnGhost}>
        {t(copy.anotherExp, lang)}
      </Link>
    </section>
  );
}
