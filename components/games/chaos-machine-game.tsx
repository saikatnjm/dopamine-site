"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode, type RefObject } from "react";
import { ChallengeBanner, ChallengeOutcome, ShareActions } from "@/components/games/challenge-ui";
import { ResultCard } from "@/components/share/result-card";
import { ResultShareKit, useHost, useOrigin } from "@/components/share/result-share-kit";
import { useI18n } from "@/components/providers/lang-provider";
import { accentBg, btnGhost, btnPrimary, card } from "@/components/ui/styles";
import {
  chaosCopy as copy,
  chaosRanks,
  events,
  formatClock,
  missions,
  modifiers,
  moods,
  outcomes,
  places,
  traffics,
  vehicles,
  weathers,
} from "@/data/games/chaos-machine";
import { track } from "@/lib/analytics";
import { challengePath, type FriendChallenge } from "@/lib/challenge";
import { getGame } from "@/data/games";
import type { ResultCardData } from "@/lib/result-card";
import {
  GAME_SLUG,
  LEGENDARY_OUTCOMES,
  STEPS,
  canAfford,
  chaosScore,
  choose,
  createScenario,
  isDone,
  missionMet,
  outcomeOf,
  rankFor,
  startRun,
  type OutcomeId,
  type RunState,
  type Scenario,
} from "@/lib/games/chaos-machine";
import { createBestStore, encodeSeed, prefersReducedMotion } from "@/lib/games/shared";
import { fmt, num, t, type Lang, type Text } from "@/lib/i18n/core";
import { newSeed } from "@/lib/random";

const bestStore = createBestStore(`hottogol:${GAME_SLUG}:best`);
const gameInfo = getGame(GAME_SLUG)!;

type Phase = "idle" | "preview" | "playing" | "over";
type Challenge = FriendChallenge | null;
type Result = { score: number; outcome: OutcomeId; run: RunState; newBest: boolean };

/** Fill {dest} / {vehicle} placeholders. */
function fill(text: Text, s: Scenario, lang: Lang): string {
  return fmt(t(text, lang), { dest: t(places[s.destination], lang), vehicle: t(vehicles[s.vehicle].name, lang) });
}

export function ChaosMachineGame({ challenge }: { challenge: Challenge }) {
  const { lang } = useI18n();
  const best = useSyncExternalStore(bestStore.subscribe, bestStore.read, () => 0);

  const [seed, setSeed] = useState<number | null>(challenge?.seed ?? null);
  const [phase, setPhase] = useState<Phase>(challenge ? "preview" : "idle");
  const [run, setRun] = useState<RunState | null>(null);
  const [answered, setAnswered] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const scenario = useMemo(() => (seed === null ? null : createScenario(seed)), [seed]);
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

  function create() {
    setSeed(newSeed());
    setRun(null);
    setResult(null);
    setPhase("preview");
    scrollTop();
  }

  function begin(kind: "first" | "retry") {
    if (!scenario) return;
    setRun(startRun(scenario));
    setAnswered(false);
    setResult(null);
    setPhase("playing");
    track(kind === "first" ? "game_start" : "game_retry", { game: GAME_SLUG, mode: kind });
    scrollTop();
  }

  function pickChoice(i: number) {
    if (!scenario || !run || answered) return;
    const next = choose(scenario, run, i);
    if (next === run) return;
    setRun(next);
    setAnswered(true);
  }

  function advance() {
    if (!scenario || !run) return;
    setAnswered(false);
    if (!isDone(run)) return;
    const score = chaosScore(scenario, run);
    const outcome = outcomeOf(scenario, run);
    const prev = bestStore.read();
    if (score > prev) bestStore.write(score);
    setResult({ score, outcome, run, newBest: score > prev });
    setPhase("over");
    track("game_complete", { game: GAME_SLUG, score, rank: rankFor(score), outcome, mission: missionMet(scenario, run) });
  }

  /** Shared "Challenge a friend" actions for a finished run. */
  function shareActions(s: Scenario, r: Result) {
    const rank = chaosRanks[rankFor(r.score)];
    const text = fmt(t(copy.shareText, lang), {
      vehicle: t(vehicles[s.vehicle].name, lang),
      dest: t(places[s.destination], lang),
      weather: t(weathers[s.weather].name, lang),
      title: t(rank.title, lang),
      score: num(r.score, lang),
    });
    return <ShareActions game={GAME_SLUG} seed={s.seed} score={r.score} text={text} accent={outcomes[r.outcome].accent} rank={rankFor(r.score)} />;
  }

  const isChallenge = challenge !== null && seed === challenge.seed;

  return (
    <div ref={rootRef} className="scroll-mt-4">
      {phase === "idle" && (
        <section className={`${card} p-6 text-center`} aria-labelledby="cm-intro">
          <p id="cm-intro" className="mx-auto max-w-sm text-lg font-bold">
            {t(copy.intro, lang)}
          </p>
          <button type="button" onClick={create} className={`${btnPrimary} ${accentBg.tangerine} mt-6 min-h-16 w-full text-2xl`}>
            {t(copy.create, lang)}
          </button>
          <p className="mt-4 text-sm font-bold text-ink-muted">
            🏆 {t(copy.best, lang)}: <span className="text-ink">{num(best, lang)}</span>
          </p>
        </section>
      )}

      {phase === "preview" && scenario && (
        <section aria-labelledby="cm-scenario">
          {isChallenge && <ChallengeBanner game={GAME_SLUG} challenge={challenge} onAccept={() => begin("first")} />}
          <ScenarioCard key={scenario.seed} scenario={scenario} />
          <div className="mt-4 grid gap-3">
            <button type="button" onClick={() => begin("first")} className={`${btnPrimary} ${accentBg.chili} min-h-16 text-2xl`}>
              {t(copy.start, lang)}
            </button>
            <button type="button" onClick={create} className={btnGhost}>
              {t(copy.reroll, lang)}
            </button>
          </div>
        </section>
      )}

      {phase === "playing" && scenario && run && (
        <Trip scenario={scenario} run={run} answered={answered} nextRef={nextRef} onChoose={pickChoice} onNext={advance} />
      )}

      {phase === "over" && scenario && result && (
        <ResultView
          scenario={scenario}
          result={result}
          challenge={challenge}
          headingRef={headingRef}
          share={shareActions(scenario, result)}
          onRetry={() => begin("retry")}
          onCreate={create}
        />
      )}
    </div>
  );
}

/** The 9 rolled ingredients, revealed one by one (instant with reduced motion). */
function ScenarioCard({ scenario: s, compact = false }: { scenario: Scenario; compact?: boolean }) {
  const { lang } = useI18n();
  const listRef = useRef<HTMLDListElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (compact || !el || prefersReducedMotion()) return;
    const anims = Array.from(el.children).map((row, i) =>
      row.animate(
        [
          { opacity: 0, transform: "translateY(8px) rotate(-1deg)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 260, delay: i * 90, easing: "ease-out", fill: "backwards" },
      ),
    );
    return () => anims.forEach((a) => a.cancel());
  }, [compact]);

  const moodLabel = s.vehicle === "walk" ? copy.yourMood : s.vehicle === "bus" || s.vehicle === "leguna" ? copy.helperMood : copy.driverMood;
  const rows: { key: string; emoji: string; label: Text; value: string }[] = [
    { key: "vehicle", emoji: vehicles[s.vehicle].emoji, label: copy.vehicle, value: t(vehicles[s.vehicle].name, lang) },
    { key: "dest", emoji: "📍", label: copy.destination, value: t(places[s.destination], lang) },
    { key: "budget", emoji: "💰", label: copy.budget, value: `৳${num(s.budget, lang)}` },
    { key: "weather", emoji: weathers[s.weather].emoji, label: copy.weather, value: t(weathers[s.weather].name, lang) },
    { key: "time", emoji: "⏰", label: copy.time, value: formatClock(s.time, lang) },
    { key: "mood", emoji: moods[s.mood].emoji, label: moodLabel, value: t(moods[s.mood].name, lang) },
    { key: "traffic", emoji: traffics[s.traffic].emoji, label: copy.traffic, value: t(traffics[s.traffic].name, lang) },
    { key: "mission", emoji: missions[s.mission].emoji, label: copy.mission, value: fmt(t(missions[s.mission].name, lang), { min: num(s.deadline, lang) }) },
    { key: "mod", emoji: modifiers[s.modifier].emoji, label: copy.modifier, value: t(modifiers[s.modifier].name, lang) },
  ];

  return (
    <div className={`${card} overflow-hidden`}>
      {!compact && (
        <div className={`${accentBg.marigold} flex items-center justify-between border-b-2 border-ink px-4 py-3`}>
          <h2 id="cm-scenario" className="font-display text-2xl font-extrabold">
            🔥 {t(copy.scenarioTitle, lang)}
          </h2>
          <span className="rounded-pill border-2 border-ink bg-surface px-2.5 py-0.5 text-xs font-extrabold">
            {fmt(t(copy.chaosLevel, lang), { n: num(s.chaos, lang) })}
          </span>
        </div>
      )}
      <dl ref={listRef} className={compact ? "grid grid-cols-1 gap-1 p-3 text-sm sm:grid-cols-2" : "divide-y-2 divide-dashed divide-ink/15"}>
        {rows.map((r) => (
          <div key={r.key} className={compact ? "flex items-baseline gap-1.5" : "flex items-center gap-3 px-4 py-2.5"}>
            <span aria-hidden className={compact ? "" : "grid size-10 shrink-0 place-items-center rounded-xl border-2 border-ink bg-surface-2 text-xl"}>
              {r.emoji}
            </span>
            <dt className={compact ? "font-bold text-ink-muted" : "w-24 shrink-0 text-xs font-extrabold uppercase tracking-wide text-ink-muted sm:w-28"}>
              {t(r.label, lang)}
              {compact && ":"}
            </dt>
            <dd className={compact ? "font-extrabold" : "font-display text-lg font-extrabold leading-tight"}>{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Trip({
  scenario: s,
  run,
  answered,
  nextRef,
  onChoose,
  onNext,
}: {
  scenario: Scenario;
  run: RunState;
  answered: boolean;
  nextRef: RefObject<HTMLButtonElement | null>;
  onChoose: (i: number) => void;
  onNext: () => void;
}) {
  const { lang } = useI18n();
  // While showing a result, the event on screen is the one just answered.
  const stepShown = answered ? run.step - 1 : run.step;
  const eventId = s.events[Math.min(stepShown, STEPS - 1)]!;
  const ev = events[eventId];
  const text = eventId === "mood" ? moods[s.mood].line : ev.text;
  const lastChoice = run.choices[run.choices.length - 1];
  const done = isDone(run);

  const late = run.timeLeft < 0;
  const tiles: { key: string; label: Text; value: string; warn: boolean }[] = [
    {
      key: "time",
      label: copy.minutesLeft,
      value: late ? fmt(t(copy.late, lang), { n: num(-run.timeLeft, lang) }) : fmt(t(copy.min, lang), { n: num(run.timeLeft, lang) }),
      warn: late,
    },
    { key: "money", label: copy.money, value: `৳${num(run.money, lang)}`, warn: run.money < s.budget * 0.2 },
    { key: "sanity", label: copy.sanity, value: `${num(run.sanity, lang)}%`, warn: run.sanity < 30 },
  ];

  return (
    <section aria-label={fmt(t(copy.step, lang), { n: num(stepShown + 1, lang), total: num(STEPS, lang) })}>
      <div className="grid grid-cols-3 gap-2" aria-live="polite">
        {tiles.map((tile) => (
          <Tile key={tile.key} label={t(tile.label, lang)} warn={tile.warn}>
            {tile.value}
          </Tile>
        ))}
      </div>
      <p className="mt-3 rounded-xl border-2 border-dashed border-ink/40 px-3 py-2 text-center text-sm font-bold">
        {missions[s.mission].emoji} {fmt(t(missions[s.mission].name, lang), { min: num(s.deadline, lang) })}
        {s.mission === "eggs" && <span className="ml-2">🥚 {num(run.eggs, lang)}/12</span>}
        {s.mission === "stay-dry" && <span className="ml-2">{run.wet ? "💦" : "☂️"}</span>}
      </p>

      <ol className="mt-3 flex justify-center gap-2" aria-hidden>
        {Array.from({ length: STEPS }, (_, i) => (
          <li key={i} className={`size-3 rounded-full border-2 border-ink ${i < run.step ? "bg-ink" : i === stepShown ? "bg-marigold" : "bg-surface"}`} />
        ))}
      </ol>

      <div className={`${card} mt-3 p-5`}>
        <p className="text-xs font-extrabold uppercase tracking-wider text-ink-muted">
          {fmt(t(copy.step, lang), { n: num(stepShown + 1, lang), total: num(STEPS, lang) })}
        </p>
        <p className="mt-2 flex gap-3 text-lg font-bold leading-snug">
          <span aria-hidden className="text-4xl leading-none">
            {ev.emoji}
          </span>
          <span>{fill(text, s, lang)}</span>
        </p>

        {!answered ? (
          <div className="mt-5 grid gap-2">
            {ev.choices.map((c, i) => {
              const ok = canAfford(s, run, i);
              return (
                <button
                  key={i}
                  type="button"
                  disabled={!ok}
                  onClick={() => onChoose(i)}
                  className="min-h-14 rounded-2xl border-2 border-ink bg-surface px-4 py-3 text-left font-extrabold shadow-pop transition-all duration-100 hover:-translate-y-0.5 hover:bg-surface-2 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-40 disabled:shadow-none"
                >
                  {fill(c.label, s, lang)}
                  {!ok && <span className="block text-xs font-bold text-chili-deep">{t(copy.cantAfford, lang)}</span>}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-5 grid gap-3">
            <p className="rounded-2xl border-2 border-ink bg-surface-2 p-3 text-center font-bold" aria-live="polite">
              {lastChoice !== undefined && fill(ev.choices[lastChoice as 0 | 1 | 2].result, s, lang)}
            </p>
            {run.last && (
              <ul className="flex flex-wrap justify-center gap-2 text-sm font-extrabold">
                {run.last.time !== 0 && <Delta good={run.last.time > 0}>⏰ {fmt(t(copy.min, lang), { n: signed(run.last.time, lang) })}</Delta>}
                {run.last.money !== 0 && <Delta good={run.last.money > 0}>💰 {signed(run.last.money, lang, "৳")}</Delta>}
                {run.last.sanity !== 0 && <Delta good={run.last.sanity > 0}>🧠 {signed(run.last.sanity, lang)}</Delta>}
              </ul>
            )}
            <button ref={nextRef} type="button" onClick={onNext} className={`${btnPrimary} ${accentBg.marigold}`}>
              {done ? t(copy.finish, lang) : t(copy.next, lang)}
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
      <p className="font-display text-lg font-extrabold tabular-nums leading-tight sm:text-xl">{children}</p>
    </div>
  );
}

function ResultView({
  scenario: s,
  result,
  challenge,
  headingRef,
  share,
  onRetry,
  onCreate,
}: {
  scenario: Scenario;
  result: Result;
  challenge: Challenge;
  headingRef: RefObject<HTMLHeadingElement | null>;
  share: ReactNode;
  onRetry: () => void;
  onCreate: () => void;
}) {
  const { lang } = useI18n();
  const host = useHost();
  const origin = useOrigin();
  const outcome = outcomes[result.outcome];
  const rank = chaosRanks[rankFor(result.score)];
  const legendary = LEGENDARY_OUTCOMES.includes(result.outcome);
  const met = missionMet(s, result.run) && result.outcome !== "went-home" && result.outcome !== "wrong-destination";
  const r = result.run;
  const stats = [
    {
      key: "time",
      label: copy.statTime,
      value: r.timeLeft < 0 ? fmt(t(copy.late, lang), { n: num(-r.timeLeft, lang) }) : fmt(t(copy.min, lang), { n: num(r.timeLeft, lang) }),
    },
    { key: "money", label: copy.statMoney, value: `৳${num(r.money, lang)}` },
    { key: "sanity", label: copy.statSanity, value: `${num(r.sanity, lang)}%` },
  ];

  const card: ResultCardData = {
    game: t(gameInfo.title, lang),
    emoji: gameInfo.emoji,
    accent: outcome.accent,
    badge: legendary ? t(copy.legendary, lang) : undefined,
    titleEmoji: outcome.emoji,
    headlineLabel: t(copy.chaosScore, lang),
    headline: `${num(result.score, lang)} ${t(copy.pts, lang)}`,
    title: t(outcome.title, lang),
    rank: `${rank.emoji} ${t(rank.title, lang)}`,
    blurb: fill(outcome.blurb, s, lang),
    stats: [...stats.map((st) => ({ label: t(st.label, lang), value: st.value })), { label: t(copy.mission, lang), value: t(met ? copy.missionOk : copy.missionFail, lang) }],
    path: `/games/${GAME_SLUG}`,
  };
  const url = `${origin}${challengePath({ game: GAME_SLUG, seed: s.seed, score: result.score }) ?? `/games/${GAME_SLUG}`}`;

  return (
    <section className="grid gap-3" aria-labelledby="cm-result">
      <ResultCard data={card} host={host} headingId="cm-result" headingRef={headingRef}>
        {result.newBest && <p className="text-center font-extrabold text-cng-deep">{t(copy.newBest, lang)}</p>}
        <ChallengeOutcome game={GAME_SLUG} challenge={challenge} seed={s.seed} score={result.score} />
        <ScenarioCard scenario={s} compact />
        <p className="text-center text-xs font-bold text-ink-muted">
          {t(copy.chaosCode, lang)}: <code className="font-mono">{encodeSeed(s.seed)}</code>
        </p>
      </ResultCard>
      <ResultShareKit data={card} url={url} fileName={`${GAME_SLUG}-result`} onShared={(method) => track("game_share", { game: GAME_SLUG, method, rank: rankFor(result.score) })} />
      {share}
      <button type="button" onClick={onRetry} className={`${btnPrimary} bg-surface`}>
        {t(copy.retry, lang)}
      </button>
      <button type="button" onClick={onCreate} className={`${btnPrimary} ${accentBg.tangerine}`}>
        {t(copy.createNew, lang)}
      </button>
    </section>
  );
}
