"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode, type RefObject } from "react";
import { ChallengeBanner, ChallengeOutcome, ShareActions } from "@/components/games/challenge-ui";
import { ResultCard } from "@/components/share/result-card";
import { ResultShareKit, useHost, useOrigin } from "@/components/share/result-share-kit";
import { useI18n } from "@/components/providers/lang-provider";
import { accentBg, btnGhost, btnPrimary, card } from "@/components/ui/styles";
import { actions, causes, endings, events, rageCopy as copy, ranks } from "@/data/games/programmer-rage";
import { track } from "@/lib/analytics";
import { challengePath, type FriendChallenge } from "@/lib/challenge";
import { getGame } from "@/data/games";
import type { ResultCardData } from "@/lib/result-card";
import {
  GAME_SLUG,
  LEGENDARY_ENDINGS,
  TURNS,
  act,
  clockAt,
  createIncident,
  debuggingSkill,
  offered,
  rageScore,
  rankFor,
  startRun,
  type ActionId,
  type EndingId,
  type Incident,
  type RunState,
} from "@/lib/games/programmer-rage";
import { createBestStore, encodeSeed, prefersReducedMotion } from "@/lib/games/shared";
import { fmt, num, t, type Lang, type Text } from "@/lib/i18n/core";
import { newSeed } from "@/lib/random";

const bestStore = createBestStore(`hottogol:${GAME_SLUG}:best`);
const gameInfo = getGame(GAME_SLUG)!;

type Phase = "idle" | "preview" | "playing" | "over";
type Challenge = FriendChallenge | null;
type Result = { score: number; ending: EndingId; run: RunState; newBest: boolean };

const GAMBLES: readonly ActionId[] = ["ask-ai", "deploy-again"];

function formatClock(minutes: number, lang: Lang): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${num(h, lang).padStart(2, lang === "bn" ? "০" : "0")}:${num(m, lang).padStart(2, lang === "bn" ? "০" : "0")}`;
}

function formatDuration(minutes: number, lang: Lang): string {
  return fmt(t(copy.hm, lang), { h: num(Math.floor(minutes / 60), lang), m: num(minutes % 60, lang) });
}

/** Which line to show after an action. */
function resultLine(action: ActionId, st: RunState, turn: number): Text {
  const a = actions[action];
  const won = st.won[turn];
  if (GAMBLES.includes(action)) return won ? a.good : a.bad;
  if (action === "works-on-my-machine") return st.ending === "success" || st.ending === "legendary-3am" ? a.good : a.bad;
  if (action === "blame-frontend" || action === "blame-backend") return (st.last?.rage ?? 0) < 0 ? a.good : a.bad;
  return (st.last?.gain ?? 0) > 0 ? a.good : a.bad;
}

export function ProgrammerRageGame({ challenge }: { challenge: Challenge }) {
  const { lang } = useI18n();
  const best = useSyncExternalStore(bestStore.subscribe, bestStore.read, () => 0);

  const [seed, setSeed] = useState<number | null>(challenge?.seed ?? null);
  const [phase, setPhase] = useState<Phase>(challenge ? "preview" : "idle");
  const [run, setRun] = useState<RunState | null>(null);
  const [answered, setAnswered] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const incident = useMemo(() => (seed === null ? null : createIncident(seed)), [seed]);
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

  function newIncident() {
    setSeed(newSeed());
    setRun(null);
    setResult(null);
    setPhase("preview");
    scrollTop();
  }

  function begin(kind: "first" | "retry") {
    if (!incident) return;
    setRun(startRun(incident));
    setAnswered(false);
    setResult(null);
    setPhase("playing");
    track(kind === "first" ? "game_start" : "game_retry", { game: GAME_SLUG, mode: kind });
    scrollTop();
  }

  function pick(a: ActionId) {
    if (!incident || !run || answered) return;
    const next = act(incident, run, a);
    if (next === run) return;
    setRun(next);
    setAnswered(true);
  }

  function advance() {
    if (!incident || !run) return;
    setAnswered(false);
    if (!run.ending) return;
    const score = rageScore(incident, run);
    const prev = bestStore.read();
    if (score > prev) bestStore.write(score);
    setResult({ score, ending: run.ending, run, newBest: score > prev });
    setPhase("over");
    track("game_complete", { game: GAME_SLUG, score, rank: rankFor(score), outcome: run.ending, coffees: run.coffees, friday: incident.friday });
  }

  const isChallenge = challenge !== null && seed === challenge.seed;

  return (
    <div ref={rootRef} className="scroll-mt-4">
      {phase === "idle" && (
        <section className={`${card} p-6 text-center`} aria-labelledby="pr-intro">
          <p aria-hidden className="text-6xl motion-safe:animate-wiggle">
            🧑‍💻
          </p>
          <p id="pr-intro" className="mx-auto mt-3 max-w-sm text-lg font-bold">
            {t(copy.intro, lang)}
          </p>
          <button type="button" onClick={newIncident} className={`${btnPrimary} ${accentBg.violet} mt-6 min-h-16 w-full text-2xl`}>
            {t(copy.newIncident, lang)}
          </button>
          <p className="mt-4 text-sm font-bold text-ink-muted">
            🏆 {t(copy.best, lang)}: <span className="text-ink">{num(best, lang)}</span>
          </p>
          <p className="mt-2 text-xs font-bold text-ink-muted">{t(copy.disclaimer, lang)}</p>
        </section>
      )}

      {phase === "preview" && incident && (
        <section aria-labelledby="pr-ticket">
          {isChallenge && <ChallengeBanner game={GAME_SLUG} challenge={challenge} onAccept={() => begin("first")} />}
          <Ticket incident={incident} />
          <div className="mt-4 grid gap-3">
            <button type="button" onClick={() => begin("first")} className={`${btnPrimary} ${accentBg.chili} min-h-16 text-2xl`}>
              {t(copy.start, lang)}
            </button>
            <button type="button" onClick={newIncident} className={btnGhost}>
              {t(copy.another, lang)}
            </button>
          </div>
        </section>
      )}

      {phase === "playing" && incident && run && (
        <Turn incident={incident} run={run} answered={answered} nextRef={nextRef} onPick={pick} onNext={advance} />
      )}

      {phase === "over" && incident && result && (
        <ResultView incident={incident} result={result} challenge={challenge} headingRef={headingRef} onRetry={() => begin("retry")} onNew={newIncident} />
      )}
    </div>
  );
}

function Ticket({ incident: inc, compact = false }: { incident: Incident; compact?: boolean }) {
  const { lang } = useI18n();
  const rows = [
    { key: "day", emoji: "📅", label: copy.day, value: t(inc.friday ? copy.friday : copy.weekday, lang) },
    { key: "clock", emoji: "🕓", label: copy.clock, value: formatClock(inc.start % 1440, lang) },
    { key: "status", emoji: "🚦", label: copy.status, value: t(copy.statusBroken, lang) },
  ];
  return (
    <div className={`${card} overflow-hidden`}>
      {!compact && (
        <div className={`${accentBg.violet} flex items-center justify-between border-b-2 border-ink px-4 py-3`}>
          <h2 id="pr-ticket" className="font-display text-2xl font-extrabold">
            🎫 {t(copy.ticketTitle, lang)}
          </h2>
          <span aria-hidden className="text-2xl">
            {inc.friday ? "😬" : "🙂"}
          </span>
        </div>
      )}
      <dl className={compact ? "grid grid-cols-1 gap-1 p-3 text-sm sm:grid-cols-3" : "divide-y-2 divide-dashed divide-ink/15"}>
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

function Meter({ label, value, color, children }: { label: string; value: number; color: string; children?: ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs font-extrabold uppercase tracking-wider">
        <span>{label}</span>
        <span className="font-display text-base tabular-nums">{children}</span>
      </div>
      <div role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} className="mt-1 h-3.5 overflow-hidden rounded-pill border-2 border-ink bg-surface">
        <span className={`block h-full ${color} transition-[width] duration-300 motion-reduce:transition-none`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Turn({
  incident: inc,
  run,
  answered,
  nextRef,
  onPick,
  onNext,
}: {
  incident: Incident;
  run: RunState;
  answered: boolean;
  nextRef: RefObject<HTMLButtonElement | null>;
  onPick: (a: ActionId) => void;
  onNext: () => void;
}) {
  const { lang } = useI18n();
  const panelRef = useRef<HTMLDivElement>(null);
  const shownTurn = answered ? run.turn - 1 : run.turn;
  const label = fmt(t(copy.turn, lang), { n: num(shownTurn + 1, lang), total: num(TURNS, lang) });
  const lastAction = run.actions[run.actions.length - 1];
  const lastEvent = run.events[run.events.length - 1] ?? null;
  const won = run.won[shownTurn];
  const cause = causes[inc.cause];

  useEffect(() => {
    if (answered || prefersReducedMotion()) return;
    panelRef.current?.animate(
      [
        { opacity: 0, transform: "translateY(10px)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 220, easing: "ease-out" },
    );
  }, [shownTurn, answered]);

  return (
    <section aria-label={label} className="grid gap-3">
      <div className={`${card} grid gap-2 p-3`} aria-live="polite">
        <Meter label={t(copy.progress, lang)} value={run.progress} color="bg-lime">
          {num(run.progress, lang)}%
        </Meter>
        <Meter label={t(copy.rage, lang)} value={run.rage} color={run.rage >= 70 ? "bg-chili" : "bg-tangerine"}>
          🔥 {num(run.rage, lang)}%
        </Meter>
        <div className="flex justify-between text-sm font-extrabold">
          <span>
            🕓 {formatClock(clockAt(inc, run.minutes), lang)} {inc.friday && "· 😬"}
          </span>
          <span>☕ {num(run.coffees, lang)}</span>
        </div>
      </div>

      {/* Terminal */}
      <div className="rounded-card border-2 border-ink bg-ink p-4 font-mono text-sm text-bg shadow-pop">
        <p className="text-lime">$ deploy --prod</p>
        <p className="text-chili">✖ {t(copy.statusBroken, lang)}</p>
        <p className="mt-1 text-bg/80">
          {run.revealed ? `${cause.emoji} ${fmt(t(copy.rootCause, lang), { cause: t(cause.name, lang) })}` : `? ${t(copy.unknown, lang)}`}
        </p>
        {run.revealed && <p className="mt-1 text-marigold">{t(cause.log, lang)}</p>}
      </div>

      <div ref={panelRef} className={`${card} p-5`}>
        <p className="text-xs font-extrabold uppercase tracking-wider text-ink-muted">{label}</p>
        {!answered ? (
          <>
            <p className="mt-1 font-display text-2xl font-extrabold">{t(copy.whatNow, lang)}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {offered(inc, run).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => onPick(a)}
                  className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-ink px-2 py-2 text-center text-sm font-extrabold shadow-pop transition-all duration-100 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
                    a === "deploy-again" ? accentBg.lime : a === "rollback" ? accentBg.sky : "bg-surface hover:bg-surface-2"
                  }`}
                >
                  <span aria-hidden className="text-2xl leading-none">
                    {actions[a].emoji}
                  </span>
                  <span lang={lang}>{t(actions[a].label, lang)}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="mt-2 grid gap-3">
            {lastAction && (
              <p className="font-display text-xl font-extrabold">
                {actions[lastAction].emoji} {t(actions[lastAction].label, lang)}
              </p>
            )}
            {won !== undefined && (
              <p className={`mx-auto -rotate-2 rounded-pill border-2 border-ink px-3 py-0.5 text-sm font-extrabold shadow-pop ${won ? "bg-lime" : "bg-chili"}`}>
                {t(won ? copy.luckyWin : copy.luckyLose, lang)}
              </p>
            )}
            <p lang={lang} className="rounded-2xl border-2 border-ink bg-surface-2 p-3 text-center font-bold" aria-live="polite">
              {lastAction && t(resultLine(lastAction, run, shownTurn), lang)}
            </p>
            {lastEvent && (
              <p className="rotate-[-1deg] rounded-xl border-2 border-ink bg-marigold px-3 py-2 text-center text-sm font-extrabold shadow-pop">
                {t(events[lastEvent], lang)}
              </p>
            )}
            {run.last && (
              <ul className="flex flex-wrap justify-center gap-2 text-sm font-extrabold">
                {run.last.progress !== 0 && <Delta good={run.last.progress > 0}>🛠️ {signed(run.last.progress, lang)}%</Delta>}
                {run.last.rage !== 0 && <Delta good={run.last.rage < 0}>🔥 {signed(run.last.rage, lang)}</Delta>}
                <Delta good={false}>⏱️ {formatDuration(run.last.minutes, lang)}</Delta>
                <Delta good>☕ +{num(run.last.coffee, lang)}</Delta>
              </ul>
            )}
            <button ref={nextRef} type="button" onClick={onNext} className={`${btnPrimary} ${accentBg.marigold}`}>
              {run.ending ? t(copy.finish, lang) : t(copy.next, lang)}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function signed(n: number, lang: Lang): string {
  return `${n > 0 ? "+" : "−"}${num(Math.abs(n), lang)}`;
}

function Delta({ good, children }: { good: boolean; children: ReactNode }) {
  return <li className={`rounded-pill border-2 border-ink px-3 py-1 ${good ? "bg-lime" : "bg-chili"}`}>{children}</li>;
}

function ResultView({
  incident: inc,
  result,
  challenge,
  headingRef,
  onRetry,
  onNew,
}: {
  incident: Incident;
  result: Result;
  challenge: Challenge;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onRetry: () => void;
  onNew: () => void;
}) {
  const { lang } = useI18n();
  const origin = useOrigin();
  const host = useHost();

  const r = result.run;
  const ending = endings[result.ending];
  const rankId = rankFor(result.score);
  const rank = ranks[rankId];
  const legendary = LEGENDARY_ENDINGS.includes(result.ending);
  const message = fmt(t(copy.shareText, lang), {
    ending: t(ending.title, lang),
    rage: num(r.rage, lang),
    coffee: num(r.coffees, lang),
    score: num(result.score, lang),
    title: t(rank.title, lang),
    emoji: rank.emoji,
  });

  const stats = [
    { key: "rage", label: copy.statRage, value: `${num(r.rage, lang)}%` },
    { key: "skill", label: copy.statSkill, value: `${num(debuggingSkill(r), lang)}%` },
    { key: "time", label: copy.statTime, value: formatDuration(r.minutes, lang) },
    { key: "coffee", label: copy.statCoffee, value: num(r.coffees, lang) },
  ];

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
    blurb: t(ending.blurb, lang),
    stats: stats.map((st) => ({ label: t(st.label, lang), value: st.value })),
    path: `/games/${GAME_SLUG}`,
  };
  const url = `${origin}${challengePath({ game: GAME_SLUG, seed: inc.seed, score: result.score }) ?? `/games/${GAME_SLUG}`}`;

  return (
    <section className="grid gap-3" aria-labelledby="pr-result">
      <ResultCard data={card} host={host} headingId="pr-result" headingRef={headingRef}>
        <p className="text-center text-sm font-bold">
          {causes[inc.cause].emoji} {fmt(t(copy.cause, lang), { cause: t(causes[inc.cause].name, lang) })}
        </p>
        {result.newBest && <p className="text-center font-extrabold text-cng-deep">{t(copy.newBest, lang)}</p>}
        <ChallengeOutcome game={GAME_SLUG} challenge={challenge} seed={inc.seed} score={result.score} />
        <Ticket incident={inc} compact />
        <p className="text-center text-xs font-bold text-ink-muted">
          {t(copy.code, lang)}: <code className="font-mono">{encodeSeed(inc.seed)}</code>
        </p>
      </ResultCard>
      <ResultShareKit data={card} url={url} fileName={`${GAME_SLUG}-result`} onShared={(method) => track("game_share", { game: GAME_SLUG, method, rank: rankId })} />
      <ShareActions game={GAME_SLUG} seed={inc.seed} score={result.score} text={message} accent={ending.accent} rank={rankId} />
      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={onRetry} className={`${btnPrimary} bg-surface px-3 text-base`}>
          {t(copy.retry, lang)}
        </button>
        <button type="button" onClick={onNew} className={`${btnPrimary} ${accentBg.violet} px-3 text-base`}>
          {t(copy.newRun, lang)}
        </button>
      </div>
      <Link href="/experiences" className={btnGhost}>
        {t(copy.anotherExp, lang)}
      </Link>
    </section>
  );
}
