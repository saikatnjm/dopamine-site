"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode, type RefObject } from "react";
import { ChallengeBanner, ChallengeOutcome, ShareActions } from "@/components/games/challenge-ui";
import { ResultCard } from "@/components/share/result-card";
import { ResultShareKit, useHost, useOrigin } from "@/components/share/result-share-kit";
import { useI18n } from "@/components/providers/lang-provider";
import { accentBg, btnGhost, btnPrimary, card } from "@/components/ui/styles";
import { areas, deliveryCopy as copy, endings, events, ranks, restaurants, stages, weathers, type ChoiceCopy } from "@/data/games/delivery-sim";
import { track } from "@/lib/analytics";
import { challengePath, type FriendChallenge } from "@/lib/challenge";
import { getGame } from "@/data/games";
import type { ResultCardData } from "@/lib/result-card";
import {
  GAME_SLUG,
  LEGENDARY_ENDINGS,
  STAGES,
  STEPS,
  choose,
  createOrder,
  deliveryScore,
  earningsOf,
  endingOf,
  isDone,
  rankFor,
  ratingOf,
  startRun,
  type EndingId,
  type Order,
  type RunState,
} from "@/lib/games/delivery-sim";
import { createBestStore, encodeSeed, prefersReducedMotion } from "@/lib/games/shared";
import { fmt, num, t, type Lang, type Text } from "@/lib/i18n/core";
import { newSeed } from "@/lib/random";

const gameInfo = getGame(GAME_SLUG)!;

const bestStore = createBestStore(`hottogol:${GAME_SLUG}:best`);

type Phase = "idle" | "preview" | "playing" | "over";
type Challenge = FriendChallenge | null;
type Result = { score: number; ending: EndingId; run: RunState; newBest: boolean };

/** Fill order placeholders. */
function fill(text: Text, o: Order, lang: Lang): string {
  return fmt(t(text, lang), {
    restaurant: t(restaurants[o.restaurant].name, lang),
    food: t(restaurants[o.restaurant].food, lang),
    area: t(areas[o.area], lang),
    km: num(o.distance, lang),
    pay: num(o.pay, lang),
    bill: num(o.bill, lang),
  });
}

/** Result text of a choice (gambles have win/lose copy). */
function resultText(c: ChoiceCopy, won: boolean | undefined): Text {
  if ("result" in c) return c.result;
  return won === false ? c.lose : c.win;
}

export function DeliverySimGame({ challenge }: { challenge: Challenge }) {
  const { lang } = useI18n();
  const best = useSyncExternalStore(bestStore.subscribe, bestStore.read, () => 0);

  const [seed, setSeed] = useState<number | null>(challenge?.seed ?? null);
  const [phase, setPhase] = useState<Phase>(challenge ? "preview" : "idle");
  const [run, setRun] = useState<RunState | null>(null);
  const [answered, setAnswered] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const order = useMemo(() => (seed === null ? null : createOrder(seed)), [seed]);
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

  function findOrder() {
    setSeed(newSeed());
    setRun(null);
    setResult(null);
    setPhase("preview");
    scrollTop();
  }

  function begin(kind: "first" | "retry") {
    if (!order) return;
    setRun(startRun(order));
    setAnswered(false);
    setResult(null);
    setPhase("playing");
    track(kind === "first" ? "game_start" : "game_retry", { game: GAME_SLUG, mode: kind });
    scrollTop();
  }

  function pickChoice(i: number) {
    if (!order || !run || answered) return;
    const next = choose(order, run, i);
    if (next === run) return;
    setRun(next);
    setAnswered(true);
  }

  function advance() {
    if (!order || !run) return;
    setAnswered(false);
    if (!isDone(run)) return;
    const score = deliveryScore(order, run);
    const ending = endingOf(order, run);
    const prev = bestStore.read();
    if (score > prev) bestStore.write(score);
    setResult({ score, ending, run, newBest: score > prev });
    setPhase("over");
    track("game_complete", { game: GAME_SLUG, score, rank: rankFor(score), outcome: ending, rating: ratingOf(order, run) });
  }

  const isChallenge = challenge !== null && seed === challenge.seed;

  return (
    <div ref={rootRef} className="scroll-mt-4">
      {phase === "idle" && (
        <section className={`${card} p-6 text-center`} aria-labelledby="ds-intro">
          <p aria-hidden className="text-6xl motion-safe:animate-wiggle">
            🏍️
          </p>
          <p id="ds-intro" className="mx-auto mt-3 max-w-sm text-lg font-bold">
            {t(copy.intro, lang)}
          </p>
          <button type="button" onClick={findOrder} className={`${btnPrimary} ${accentBg.lime} mt-6 min-h-16 w-full text-2xl`}>
            {t(copy.newOrder, lang)}
          </button>
          <p className="mt-4 text-sm font-bold text-ink-muted">
            🏆 {t(copy.best, lang)}: <span className="text-ink">{num(best, lang)}</span>
          </p>
        </section>
      )}

      {phase === "preview" && order && (
        <section aria-labelledby="ds-order">
          {isChallenge && <ChallengeBanner challenge={challenge} />}
          <OrderCard order={order} />
          <div className="mt-4 grid gap-3">
            <button type="button" onClick={() => begin("first")} className={`${btnPrimary} ${accentBg.cng} min-h-16 text-2xl`}>
              {t(copy.start, lang)}
            </button>
            <button type="button" onClick={findOrder} className={btnGhost}>
              {t(copy.another, lang)}
            </button>
          </div>
        </section>
      )}

      {phase === "playing" && order && run && (
        <Ride order={order} run={run} answered={answered} nextRef={nextRef} onChoose={pickChoice} onNext={advance} />
      )}

      {phase === "over" && order && result && (
        <ResultView order={order} result={result} challenge={challenge} headingRef={headingRef} onRetry={() => begin("retry")} onNew={findOrder} />
      )}
    </div>
  );
}

function OrderCard({ order: o, compact = false }: { order: Order; compact?: boolean }) {
  const { lang } = useI18n();
  const r = restaurants[o.restaurant];
  const rows = [
    { key: "from", emoji: r.emoji, label: copy.from, value: `${t(r.name, lang)} · ${t(r.food, lang)}` },
    { key: "to", emoji: "📍", label: copy.to, value: t(areas[o.area], lang) },
    { key: "km", emoji: "🛣️", label: copy.distance, value: fmt(t(copy.km, lang), { n: num(o.distance, lang) }) },
    { key: "pay", emoji: "💰", label: copy.pay, value: `৳${num(o.pay, lang)}` },
    { key: "weather", emoji: weathers[o.weather].emoji, label: copy.weather, value: t(weathers[o.weather].name, lang) },
    { key: "promised", emoji: "⏱️", label: copy.promised, value: fmt(t(copy.min, lang), { n: num(o.promised, lang) }) },
  ];
  return (
    <div className={`${card} overflow-hidden`}>
      {!compact && (
        <div className={`${accentBg.lime} flex items-center justify-between border-b-2 border-ink px-4 py-3`}>
          <h2 id="ds-order" className="font-display text-2xl font-extrabold">
            🔔 {t(copy.orderTitle, lang)}
          </h2>
          <span aria-hidden className="text-2xl">
            📲
          </span>
        </div>
      )}
      <dl className={compact ? "grid grid-cols-1 gap-1 p-3 text-sm sm:grid-cols-2" : "divide-y-2 divide-dashed divide-ink/15"}>
        {rows.map((row) => (
          <div key={row.key} className={compact ? "flex items-baseline gap-1.5" : "flex items-center gap-3 px-4 py-2.5"}>
            <span aria-hidden className={compact ? "" : "grid size-10 shrink-0 place-items-center rounded-xl border-2 border-ink bg-surface-2 text-xl"}>
              {row.emoji}
            </span>
            <dt className={compact ? "font-bold text-ink-muted" : "w-24 shrink-0 text-xs font-extrabold uppercase tracking-wide text-ink-muted"}>
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

function Ride({
  order: o,
  run,
  answered,
  nextRef,
  onChoose,
  onNext,
}: {
  order: Order;
  run: RunState;
  answered: boolean;
  nextRef: RefObject<HTMLButtonElement | null>;
  onChoose: (i: number) => void;
  onNext: () => void;
}) {
  const { lang } = useI18n();
  const panelRef = useRef<HTMLDivElement>(null);
  // While showing a result, the stage on screen is the one just answered.
  const stepShown = answered ? run.choices.length - 1 : run.step;
  const stage = STAGES[Math.min(stepShown, STEPS - 1)]!;
  const ev = events[o.events[Math.min(stepShown, STEPS - 1)]!];
  const lastChoice = run.choices[run.choices.length - 1];
  const won = run.won[stepShown];
  const late = run.elapsed > o.promised;
  const stageLabel = fmt(t(copy.stage, lang), { n: num(stepShown + 1, lang), total: num(STEPS, lang) });

  // Slide each new stage in (skipped for reduced motion).
  useEffect(() => {
    if (answered || prefersReducedMotion()) return;
    panelRef.current?.animate(
      [
        { opacity: 0, transform: "translateX(28px) rotate(0.8deg)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 240, easing: "cubic-bezier(.2,.9,.3,1.2)" },
    );
  }, [stepShown, answered]);

  return (
    <section aria-label={stageLabel}>
      <div className="grid grid-cols-3 gap-2" aria-live="polite">
        <Tile label={t(copy.clock, lang)} warn={late}>
          {fmt(t(copy.of, lang), { n: num(run.elapsed, lang), total: num(o.promised, lang) })}
        </Tile>
        <Tile label={t(copy.food, lang)} warn={run.food <= 70}>
          {restaurants[o.restaurant].emoji} {num(run.food, lang)}%
        </Tile>
        <Tile label={t(copy.chaos, lang)} warn={run.chaos >= 50}>
          🔥 {num(run.chaos, lang)}%
        </Tile>
      </div>

      {/* Stage track: 7 stops on the route */}
      <ol className="mt-3 grid grid-cols-7 gap-1" aria-label={stageLabel}>
        {STAGES.map((s, i) => {
          const done = i < stepShown || (answered && i === stepShown);
          const current = i === stepShown;
          return (
            <li key={s} className="flex flex-col items-center gap-0.5 text-center" aria-current={current ? "step" : undefined}>
              <span
                aria-hidden
                className={`grid size-9 place-items-center rounded-full border-2 border-ink text-base ${
                  current ? `${accentBg.marigold} shadow-pop` : done ? "bg-ink" : "bg-surface"
                }`}
              >
                {done && !current ? "✓" : stages[s].emoji}
              </span>
              <span className={`text-[10px] font-extrabold leading-tight ${current ? "" : "text-ink-muted"}`}>{t(stages[s].label, lang)}</span>
            </li>
          );
        })}
      </ol>

      <div ref={panelRef} className={`${card} mt-3 p-5`}>
        <p className="text-xs font-extrabold uppercase tracking-wider text-ink-muted">
          {stageLabel} · {t(stages[stage].label, lang)}
        </p>
        <p className="mt-2 flex gap-3 text-lg font-bold leading-snug">
          <span aria-hidden className="text-4xl leading-none">
            {ev.emoji}
          </span>
          <span lang={lang}>{fill(ev.text, o, lang)}</span>
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
                <span lang={lang}>{fill(c.label, o, lang)}</span>
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
              {lastChoice !== undefined && fill(resultText(ev.choices[lastChoice as 0 | 1 | 2], won), o, lang)}
            </p>
            {run.last && (
              <ul className="flex flex-wrap justify-center gap-2 text-sm font-extrabold">
                {run.last.time !== 0 && <Delta good={run.last.time < 0}>⏱️ {fmt(t(copy.min, lang), { n: signed(run.last.time, lang) })}</Delta>}
                {run.last.money !== 0 && <Delta good={run.last.money > 0}>💰 {signed(run.last.money, lang, "৳")}</Delta>}
                {run.last.food !== 0 && <Delta good={run.last.food > 0}>{restaurants[o.restaurant].emoji} {signed(run.last.food, lang)}</Delta>}
                {run.last.chaos !== 0 && <Delta good={run.last.chaos < 0}>🔥 {signed(run.last.chaos, lang)}</Delta>}
              </ul>
            )}
            <button ref={nextRef} type="button" onClick={onNext} className={`${btnPrimary} ${accentBg.marigold}`}>
              {isDone(run) ? t(copy.finish, lang) : t(copy.next, lang)}
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

function ResultView({
  order: o,
  result,
  challenge,
  headingRef,
  onRetry,
  onNew,
}: {
  order: Order;
  result: Result;
  challenge: Challenge;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onRetry: () => void;
  onNew: () => void;
}) {
  const { lang } = useI18n();
  const host = useHost();
  const origin = useOrigin();

  const r = result.run;
  const ending = endings[result.ending];
  const rankId = rankFor(result.score);
  const rank = ranks[rankId];
  const legendary = LEGENDARY_ENDINGS.includes(result.ending);
  const stars = ratingOf(o, r);
  const { total, tip } = earningsOf(o, r);
  const spare = o.promised - r.elapsed;
  const timeNote =
    spare > 0 ? fmt(t(copy.early, lang), { n: num(spare, lang) }) : spare < 0 ? fmt(t(copy.lateBy, lang), { n: num(-spare, lang) }) : t(copy.onTime, lang);

  const message = fmt(t(copy.shareText, lang), {
    food: t(restaurants[o.restaurant].food, lang),
    area: t(areas[o.area], lang),
    score: num(result.score, lang),
    title: t(rank.title, lang),
    emoji: rank.emoji,
  });

  const card: ResultCardData = {
    game: t(gameInfo.title, lang),
    emoji: gameInfo.emoji,
    accent: ending.accent,
    badge: legendary ? t(copy.legendary, lang) : undefined,
    titleEmoji: ending.emoji,
    headlineLabel: t(copy.score, lang),
    headline: `${num(result.score, lang)} ${t(copy.pts, lang)}`,
    title: t(ending.title, lang),
    rank: `${rank.emoji} ${t(rank.title, lang)}`,
    blurb: fill(ending.blurb, o, lang),
    stats: [
      { label: t(copy.statTime, lang), value: `${fmt(t(copy.min, lang), { n: num(r.elapsed, lang) })} (${timeNote})` },
      { label: t(copy.statEarnings, lang), value: `৳${num(total, lang)}${tip > 0 ? ` (${fmt(t(copy.tip, lang), { n: num(tip, lang) })})` : ""}` },
      { label: t(copy.statChaos, lang), value: `${num(r.chaos, lang)}%` },
      { label: t(copy.statRating, lang), value: `${"★".repeat(stars)}${"☆".repeat(5 - stars)} (${num(stars, lang)}/5)` },
    ],
    path: `/games/${GAME_SLUG}`,
  };
  const url = `${origin}${challengePath({ game: GAME_SLUG, seed: o.seed, score: result.score }) ?? `/games/${GAME_SLUG}`}`;

  return (
    <section className="grid gap-3" aria-labelledby="ds-result">
      <ResultCard data={card} host={host} headingId="ds-result" headingRef={headingRef}>
        {result.newBest && <p className="text-center font-extrabold text-cng-deep">{t(copy.newBest, lang)}</p>}
        <ChallengeOutcome challenge={challenge} seed={o.seed} score={result.score} />
          <div className="mt-4">
            <OrderCard order={o} compact />
          </div>
          <p className="mt-3 text-center text-xs font-bold text-ink-muted">
            {t(copy.orderCode, lang)}: <code className="font-mono">{encodeSeed(o.seed)}</code>
          </p>
      </ResultCard>
      <ResultShareKit data={card} url={url} fileName={`${GAME_SLUG}-result`} onShared={(method) => track("game_share", { game: GAME_SLUG, method, rank: rankId })} />
      <ShareActions game={GAME_SLUG} seed={o.seed} score={result.score} text={message} accent={ending.accent} rank={rankId} />
      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={onRetry} className={`${btnPrimary} bg-surface px-3 text-base`}>
          {t(copy.retry, lang)}
        </button>
        <button type="button" onClick={onNew} className={`${btnPrimary} ${accentBg.lime} px-3 text-base`}>
          {t(copy.newRun, lang)}
        </button>
      </div>
      <Link href="/experiences" className={btnGhost}>
        {t(copy.anotherExp, lang)}
      </Link>
    </section>
  );
}
