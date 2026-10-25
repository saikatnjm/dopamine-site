"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type RefObject } from "react";
import { ChallengeBanner, ChallengeOutcome, ShareActions } from "@/components/games/challenge-ui";
import { useI18n } from "@/components/providers/lang-provider";
import { ResultCard } from "@/components/share/result-card";
import { ResultShareKit, useHost, useOrigin } from "@/components/share/result-share-kit";
import { accentBg, btnGhost, btnPrimary, card } from "@/components/ui/styles";
import { commentary, cricketCopy as copy, endingInfo, rankInfo } from "@/data/games/book-cricket";
import { track } from "@/lib/analytics";
import { challengePath, type FriendChallenge } from "@/lib/challenge";
import {
  ballSymbol,
  createMatch,
  endingOf,
  firstBallOut,
  GAME_SLUG,
  isOver,
  LEGAL_BALLS,
  lineVariant,
  newInnings,
  oversOf,
  pageFor,
  playBall,
  rankFor,
  strikeRate,
  TEACHER_WINDOW_MS,
  teacherCaught,
  teacherDue,
  WICKETS,
  type Ball,
  type Choice,
  type Innings,
  type Match,
} from "@/lib/games/book-cricket";
import { createBestStore, prefersReducedMotion, type DailyMode } from "@/lib/games/shared";
import { fmt, num, t, type Lang } from "@/lib/i18n/core";
import { newSeed } from "@/lib/random";
import type { ResultCardData } from "@/lib/result-card";

const bestStore = createBestStore(`hottogol:${GAME_SLUG}:best`);
const FLIP_MS = 600;

type Phase = "idle" | "preview" | "playing" | "over";
type Result = { innings: Innings; newBest: boolean };

function lineFor(b: Ball, seed: number, lang: Lang): string {
  const key = b.kind === "teacher" ? "teacher" : b.kind;
  const variants = commentary[key];
  const text = t(variants[lineVariant(seed, b.index)] ?? variants[0]!, lang);
  return fmt(text, { page: b.page === null ? "" : num(b.page, lang) });
}

export function BookCricketGame({ challenge, daily }: { challenge: FriendChallenge | null; daily?: DailyMode }) {
  const { lang } = useI18n();
  const best = useSyncExternalStore(bestStore.subscribe, bestStore.read, () => 0);
  const fixedSeed = daily?.seed ?? challenge?.seed ?? null;
  const [seed, setSeed] = useState<number | null>(fixedSeed);
  const [phase, setPhase] = useState<Phase>(fixedSeed !== null ? "preview" : "idle");
  const [innings, setInnings] = useState<Innings>(newInnings);
  const [flipping, setFlipping] = useState(false);
  const [shownPage, setShownPage] = useState<number | null>(null);
  const [alertOn, setAlertOn] = useState(false);
  const alertRef = useRef(false);
  const [hid, setHid] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const match = useMemo<Match | null>(() => (seed === null ? null : createMatch(seed)), [seed]);
  const rootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const played = useRef(0);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((x) => window.clearTimeout(x)), []);
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  const scrollTop = () => rootRef.current?.scrollIntoView({ block: "start", behavior: prefersReducedMotion() ? "auto" : "smooth" });

  function newMatch() {
    setSeed(newSeed());
    setResult(null);
    setPhase("preview");
    scrollTop();
  }

  function begin() {
    if (!match) return;
    setInnings(newInnings());
    setShownPage(null);
    setHid(false);
    alertRef.current = false;
    setAlertOn(false);
    setResult(null);
    setPhase("playing");
    track(played.current > 0 ? "game_retry" : "game_start", { game: GAME_SLUG });
    played.current++;
    scrollTop();
  }

  function finish(final: Innings) {
    if (!match) return;
    const prev = bestStore.read();
    if (final.runs > prev) bestStore.write(final.runs);
    setResult({ innings: final, newBest: final.runs > prev });
    setPhase("over");
    track("game_complete", { game: GAME_SLUG, score: final.runs, outcome: endingOf(final, match), rank: rankFor(final.runs), firstBallOut: firstBallOut(final) });
    daily?.onComplete(final.runs);
    later(() => headingRef.current?.focus(), 50);
  }

  // Innings over (last legal ball, 3rd wicket or Sir's catch) → result, once.
  useEffect(() => {
    if (phase !== "playing" || flipping || !isOver(innings)) return;
    const id = window.setTimeout(() => finish(innings), 700);
    return () => window.clearTimeout(id);
    // finish only reads refs/stores and the innings passed in
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, flipping, innings]);

  // Sir walks in before his ball: a 1.2 s window to hide the book.
  function startAlert() {
    if (!match || alertRef.current) return;
    alertRef.current = true;
    setAlertOn(true);
    later(() => {
      if (!alertRef.current) return; // hidden in time
      alertRef.current = false;
      setAlertOn(false);
      setInnings((s) => teacherCaught(s, match));
    }, TEACHER_WINDOW_MS);
  }

  // He usually bursts in a moment after the previous ball…
  useEffect(() => {
    if (phase !== "playing" || !match || flipping || alertOn || hid || !teacherDue(innings, match)) return;
    const startAt = window.setTimeout(startAlert, 450);
    return () => window.clearTimeout(startAt);
    // startAlert only touches refs/setters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, match, flipping, alertOn, hid, innings]);

  function hide() {
    if (!alertRef.current) return;
    alertRef.current = false;
    setAlertOn(false);
    setHid(true);
  }

  function play(choice: Choice) {
    if (phase !== "playing" || !match || flipping || alertRef.current || isOver(innings)) return;
    // …and nobody gets past him by tapping fast: his ball always starts with the alert.
    if (teacherDue(innings, match) && !hid) return startAlert();
    const next = playBall(innings, match, choice, hid);
    setHid(false);
    const page = pageFor(match.seed, innings.deliveries);
    const reveal = () => {
      setShownPage(page);
      setInnings(next);
      setFlipping(false);
    };
    if (prefersReducedMotion()) return reveal();
    setFlipping(true);
    // Flicker through pages, land on the real one.
    let n = 0;
    const tick = () => {
      n++;
      setShownPage(2 * (1 + ((page * 7 + n * 37) % 200)));
      if (n * 60 < FLIP_MS) later(tick, 60);
      else reveal();
    };
    tick();
  }

  // Keys: D/← defend, S/→ slog, Space/Enter = HIDE during the teacher alert.
  useEffect(() => {
    if (phase !== "playing") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.metaKey || e.ctrlKey || e.altKey) return;
      if (alertRef.current && (e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        hide();
      } else if (e.key === "d" || e.key === "D" || e.key === "ArrowLeft") play("defend");
      else if (e.key === "s" || e.key === "S" || e.key === "ArrowRight") play("slog");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const isChallenge = challenge !== null && seed === challenge.seed;

  return (
    <div ref={rootRef} className="scroll-mt-4">
      {phase === "idle" && (
        <section className={`${card} p-6 text-center`}>
          <p aria-hidden className="text-5xl">
            📖🏏
          </p>
          <p className="mx-auto mt-3 max-w-sm text-lg font-bold">{t(copy.intro, lang)}</p>
          <p className="mt-2 text-sm font-bold text-ink-muted">{t(copy.rules, lang)}</p>
          <button type="button" onClick={newMatch} className={`${btnPrimary} ${accentBg.lime} mt-6 min-h-16 w-full text-2xl`}>
            {t(copy.start, lang)}
          </button>
          <p className="mt-4 text-sm font-bold text-ink-muted">🏆 {fmt(t(copy.best, lang), { n: num(best, lang) })}</p>
        </section>
      )}

      {phase === "preview" && match && (
        <section>
          {isChallenge && challenge && <ChallengeBanner game={GAME_SLUG} challenge={challenge} onAccept={begin} />}
          <div className={`${card} p-5 text-center`}>
            <p className="text-sm font-extrabold uppercase tracking-wider text-ink-muted">{t(copy.opponent, lang)}</p>
            <p className="font-display text-6xl font-black tabular-nums">{num(match.target, lang)}</p>
            <p className="font-extrabold">{fmt(t(copy.toWin, lang), { n: num(match.target + 1, lang) })} · 2 {t(copy.overs, lang)} · {num(WICKETS, lang)} 🏏</p>
            <p className="mt-2 text-sm font-bold text-ink-muted">{t(copy.rules, lang)}</p>
          </div>
          <div className="mt-4 grid gap-3">
            <button type="button" onClick={begin} className={`${btnPrimary} ${accentBg.lime} min-h-16 text-2xl`}>
              {t(copy.start, lang)}
            </button>
            {!daily && (
              <button type="button" onClick={newMatch} className={btnGhost}>
                {t(copy.newMatch, lang)}
              </button>
            )}
          </div>
        </section>
      )}

      {phase === "playing" && match && (
        <Pitch
          match={match}
          innings={innings}
          shownPage={shownPage}
          flipping={flipping}
          alertOn={alertOn}
          onHide={hide}
          onPlay={play}
        />
      )}

      {phase === "over" && match && result && (
        <ResultView match={match} result={result} challenge={challenge} daily={daily} headingRef={headingRef} onRetry={begin} onNew={newMatch} />
      )}
    </div>
  );
}

function Pitch({
  match,
  innings,
  shownPage,
  flipping,
  alertOn,
  onHide,
  onPlay,
}: {
  match: Match;
  innings: Innings;
  shownPage: number | null;
  flipping: boolean;
  alertOn: boolean;
  onHide: () => void;
  onPlay: (c: Choice) => void;
}) {
  const { lang } = useI18n();
  const last = innings.balls[innings.balls.length - 1];
  const need = match.target + 1 - innings.runs;
  const left = LEGAL_BALLS - innings.legal;
  const hideRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (alertOn) hideRef.current?.focus();
  }, [alertOn]);
  const busy = flipping || alertOn || isOver(innings);

  return (
    <section className="grid gap-4" aria-label={t(copy.title, lang)}>
      {/* Scoreboard */}
      <div className="grid grid-cols-3 overflow-hidden rounded-2xl border-2 border-ink bg-ink text-center text-bg shadow-pop">
        <div className="p-2">
          <p className="text-[11px] font-extrabold uppercase opacity-70">{t(copy.runsWkts, lang)}</p>
          <p className="font-display text-3xl font-black tabular-nums">
            {num(innings.runs, lang)}/{num(innings.wickets, lang)}
          </p>
        </div>
        <div className="border-x border-bg/30 p-2">
          <p className="text-[11px] font-extrabold uppercase opacity-70">{t(copy.overs, lang)}</p>
          <p className="font-display text-3xl font-black tabular-nums">{oversOf(innings.legal)}</p>
        </div>
        <div className="p-2">
          <p className="text-[11px] font-extrabold uppercase opacity-70">{t(copy.target, lang)}</p>
          <p className="font-display text-3xl font-black tabular-nums">{num(match.target, lang)}</p>
        </div>
        <p className="col-span-3 border-t border-bg/30 bg-marigold py-1 text-sm font-extrabold text-ink">
          {need > 0 ? `${fmt(t(copy.toWin, lang), { n: num(need, lang) })} · ${num(left, lang)} ⚾` : t(endingInfo["won-chase"].title, lang)}
        </p>
      </div>

      {/* The textbook */}
      <div className="relative mx-auto w-full max-w-xs -rotate-1 rounded-r-2xl rounded-l-md border-[3px] border-ink bg-sky p-4 shadow-pop-lg">
        <p className="text-center text-xs font-extrabold uppercase tracking-widest">{t(copy.cover, lang)}</p>
        <div className="mt-3 grid min-h-32 place-items-center rounded-lg border-2 border-ink bg-surface">
          <p aria-live="polite" className={`font-display text-7xl font-black tabular-nums ${flipping ? "opacity-60" : ""}`}>
            {shownPage === null ? "📖" : num(shownPage, lang)}
          </p>
        </div>
        {innings.freeHit && !flipping && <p className="mt-2 text-center text-sm font-extrabold">⚡ {t(commentary["free-hit"][0]!, lang)}</p>}
      </div>

      {/* Commentary + ball strip */}
      <p className="min-h-12 text-center font-extrabold" role="status">
        {flipping ? t(copy.flipping, lang) : last ? lineFor(last, match.seed, lang) : t(copy.rules, lang)}
      </p>
      <ol className="flex min-h-9 flex-wrap justify-center gap-1.5" aria-label="Balls">
        {innings.balls.map((b) => (
          <li
            key={b.index}
            className={`grid min-w-8 place-items-center rounded-full border-2 border-ink px-1.5 text-sm font-black ${
              b.kind === "out" ? "bg-chili" : b.kind === "six" || b.kind === "four" ? "bg-lime" : b.kind === "no-ball" ? "bg-marigold" : "bg-surface"
            }`}
          >
            {ballSymbol(b)}
          </li>
        ))}
      </ol>

      {/* Teacher alert */}
      {alertOn && (
        <div role="alertdialog" aria-label={t(copy.teacherAlert, lang)} className="motion-safe:animate-pop-in fixed inset-x-4 top-1/3 z-50 mx-auto max-w-sm rotate-[-2deg] rounded-2xl border-[3px] border-ink bg-chili p-4 text-center shadow-pop-lg">
          <p className="text-2xl font-black">{t(copy.teacherAlert, lang)}</p>
          <button ref={hideRef} type="button" onClick={onHide} className={`${btnPrimary} mt-3 w-full bg-ink text-bg`}>
            {t(copy.hide, lang)}
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button type="button" disabled={busy} onClick={() => onPlay("defend")} className={`${btnPrimary} ${accentBg.sky} min-h-14 px-2 text-xl disabled:opacity-60`}>
          {t(copy.defend, lang)}
        </button>
        <button type="button" disabled={busy} onClick={() => onPlay("slog")} className={`${btnPrimary} ${accentBg.chili} min-h-14 px-2 text-xl disabled:opacity-60`}>
          {t(copy.slog, lang)}
        </button>
      </div>
      <p className="text-center text-xs font-bold text-ink-muted">{t(copy.keys, lang)}</p>
    </section>
  );
}

function ResultView({
  match,
  result,
  challenge,
  daily,
  headingRef,
  onRetry,
  onNew,
}: {
  match: Match;
  result: Result;
  challenge: FriendChallenge | null;
  daily?: DailyMode;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onRetry: () => void;
  onNew: () => void;
}) {
  const { lang } = useI18n();
  const host = useHost();
  const origin = useOrigin();
  const s = result.innings;
  const ending = endingOf(s, match);
  const info = endingInfo[ending];
  const rankId = rankFor(s.runs);
  const sixes = s.balls.filter((b) => b.kind === "six").length;
  const strip = s.balls.map(ballSymbol).join(" ");
  const highlight = [...s.balls].reverse().find((b) => b.kind === "six") ?? s.balls[s.balls.length - 1];
  const score = `${num(s.runs, lang)}/${num(s.wickets, lang)}`;
  const message = fmt(t(copy.shareText, lang), { score: num(s.runs, lang), target: num(match.target, lang) });

  const data: ResultCardData = {
    game: t(copy.title, lang),
    emoji: "🏏",
    accent: info.accent,
    headlineLabel: t(copy.scoreLabel, lang),
    headline: score,
    title: t(info.title, lang),
    rank: t(rankInfo[rankId], lang),
    stats: [
      { label: t(copy.runsWkts, lang), value: score },
      { label: t(copy.target, lang), value: num(match.target, lang) },
      { label: t(copy.sixes, lang), value: num(sixes, lang) },
      { label: t(copy.strikeRate, lang), value: num(strikeRate(s), lang) },
      // 5th stat: only in "Copy result" (cards show 4) — the ball-by-ball strip.
      { label: "🏏", value: `${score} (${oversOf(s.legal)} ov) · ${strip}` },
    ],
    ...(highlight ? { quote: lineFor(highlight, match.seed, lang) } : {}),
    path: `/games/${GAME_SLUG}`,
  };
  const url = `${origin}${challengePath({ game: GAME_SLUG, seed: match.seed, score: s.runs }) ?? `/games/${GAME_SLUG}`}`;

  return (
    <div className="grid gap-4">
      <ResultCard data={data} host={host} headingId="bk-result" headingRef={headingRef}>
        {!daily && <ChallengeOutcome game={GAME_SLUG} challenge={challenge} seed={match.seed} score={s.runs} />}
        {result.newBest && <p className="mt-3 text-center text-lg font-black">{t(copy.newBest, lang)}</p>}
      </ResultCard>
      {daily ? (
        <button type="button" onClick={() => daily.onShare(s.runs)} className={`${btnPrimary} ${accentBg[info.accent]}`}>
          📤 {t(copy.title, lang)}
        </button>
      ) : (
        <ShareActions game={GAME_SLUG} seed={match.seed} score={s.runs} text={message} accent={info.accent} rank={rankId} />
      )}
      <ResultShareKit primary={false} data={data} url={url} fileName={`${GAME_SLUG}-result`} onShared={(method) => track("game_share", { game: GAME_SLUG, method, rank: rankId })} />
      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={onRetry} className={`${btnPrimary} ${accentBg.lime} px-3 text-base`}>
          {daily ? daily.retryLabel : t(copy.retry, lang)}
        </button>
        {!daily && (
          <button type="button" onClick={onNew} className={`${btnPrimary} bg-surface px-3 text-base`}>
            {t(copy.newMatch, lang)}
          </button>
        )}
      </div>
    </div>
  );
}
