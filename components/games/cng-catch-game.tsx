"use client";

import { useEffect, useEffectEvent, useRef, useState, useSyncExternalStore, type ReactNode, type RefObject } from "react";
import { ChallengeBanner, ChallengeOutcome, ShareActions } from "@/components/games/challenge-ui";
import { ResultCard } from "@/components/share/result-card";
import { ResultShareKit, useHost, useOrigin } from "@/components/share/result-share-kit";
import { useI18n } from "@/components/providers/lang-provider";
import { accentBg, btnGhost, btnPrimary, card } from "@/components/ui/styles";
import { cngCatchCopy as copy, feedbackLines, ranks, soundWords } from "@/data/games/cng-catch";
import { track } from "@/lib/analytics";
import { getGame } from "@/data/games";
import { challengePath, type FriendChallenge } from "@/lib/challenge";
import type { ResultCardData } from "@/lib/result-card";
import type { DailyMode } from "@/lib/games/shared";
import {
  DURATION_MS,
  GAME_SLUG,
  MAX_MISSES,
  PAUSE_MS,
  encodeSeed,
  gradeTap,
  isHit,
  makeRound,
  multiplier,
  pickLine,
  pointsFor,
  positionAt,
  rankFor,
  type Grade,
  type Stats,
} from "@/lib/games/cng-catch";
import { fmt, num, t, type Text } from "@/lib/i18n/core";
import { newSeed } from "@/lib/random";

const gameInfo = getGame(GAME_SLUG)!;

// ---------------------------------------------------------------------------
// Best score in localStorage (external store → no hydration mismatch).
// ---------------------------------------------------------------------------

const BEST_KEY = "hottogol:cng-catch:best";
const bestListeners = new Set<() => void>();

function subscribeBest(cb: () => void) {
  bestListeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    bestListeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function readBest(): number {
  try {
    const n = Number(window.localStorage.getItem(BEST_KEY));
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  } catch {
    return 0; // storage blocked (private mode etc.)
  }
}

function writeBest(n: number) {
  try {
    window.localStorage.setItem(BEST_KEY, String(n));
  } catch {
    // ignore: best score is a nice-to-have
  }
  bestListeners.forEach((l) => l());
}

// ---------------------------------------------------------------------------

type Phase = "idle" | "playing" | "over";
type Hud = { score: number; combo: number; misses: number };
type Fx = { id: number; grade: Grade; line: Text; sound: Text; x: number };
type Result = Stats & { seed: number; end: "time" | "lives"; newBest: boolean };

const COUNTDOWN_MS = 1350;
const EMPTY_HUD: Hud = { score: 0, combo: 0, misses: 0 };

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function CngCatchGame({
  challenge,
  daily,
}: {
  challenge: FriendChallenge | null;
  /** Daily Hottogol mode (fixed seed, results reported to the daily page). */
  daily?: DailyMode;
}) {
  const { lang } = useI18n();
  const best = useSyncExternalStore(subscribeBest, readBest, () => 0);

  const [phase, setPhase] = useState<Phase>("idle");
  const [seed, setSeed] = useState<number | null>(daily?.seed ?? challenge?.seed ?? null);
  // Stable across renders, so passing a new `daily` object never restarts a run.
  const reportDaily = useEffectEvent((points: number) => daily?.onComplete(points));
  const [count, setCount] = useState<number | null>(0);
  const [hud, setHud] = useState<Hud>(EMPTY_HUD);
  const [secondsLeft, setSecondsLeft] = useState(DURATION_MS / 1000);
  const [fx, setFx] = useState<Fx | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLButtonElement>(null);
  const cngRef = useRef<HTMLSpanElement>(null);
  const cngBodyRef = useRef<HTMLSpanElement>(null);
  const zoneRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const comboRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const hailRef = useRef<(() => void) | null>(null);

  // ----- Game loop: all per-frame work writes to the DOM directly. -----
  useEffect(() => {
    if (phase !== "playing" || seed === null) return;
    const stage = stageRef.current;
    const cng = cngRef.current;
    const body = cngBodyRef.current;
    const zone = zoneRef.current;
    const bar = barRef.current;
    if (!stage || !cng || !body || !zone || !bar) return;

    const reduce = prefersReducedMotion();
    let width = stage.clientWidth;
    const ro = new ResizeObserver(() => {
      width = stage.clientWidth;
    });
    ro.observe(stage);

    const s = {
      pre: COUNTDOWN_MS,
      t: 0,
      index: 0,
      round: makeRound(seed, 0),
      rt: 0,
      x: 0,
      status: "moving" as "moving" | "caught" | "missed",
      pauseLeft: 0,
      score: 0,
      combo: 0,
      maxCombo: 0,
      misses: 0,
      catches: 0,
      perfects: 0,
      lastSec: DURATION_MS / 1000,
      lastCount: 0 as number | null,
      fxId: 0,
      ended: false,
    };

    const draw = () => {
      cng.style.transform = `translate3d(${s.x * width}px,0,0)`;
    };

    const place = () => {
      const r = s.round;
      zone.style.left = `${(r.zoneCenter - r.zoneHalf) * 100}%`;
      zone.style.width = `${r.zoneHalf * 200}%`;
      // Emoji faces left; mirror it when driving right.
      body.style.transform = r.dir === 1 ? "scaleX(-1)" : "";
      s.rt = 0;
      s.x = positionAt(r, 0) ?? -1;
      s.status = "moving";
      draw();
    };

    const resolve = (grade: Grade, offset: number) => {
      const hit = isHit(grade);
      if (hit) {
        s.combo += 1;
        s.catches += 1;
        if (grade === "perfect") s.perfects += 1;
        s.maxCombo = Math.max(s.maxCombo, s.combo);
        s.score += pointsFor(grade, offset, s.combo);
        if (!reduce) {
          body.animate([{ rotate: "0deg" }, { rotate: "-10deg" }, { rotate: "4deg" }, { rotate: "0deg" }], { duration: 320 });
          if (s.combo % 3 === 0) comboRef.current?.animate([{ scale: 1 }, { scale: 1.35 }, { scale: 1 }], { duration: 260 });
        }
      } else {
        s.combo = 0;
        s.misses += 1;
        if (!reduce) {
          stage.animate(
            [{ translate: "0 0" }, { translate: "-6px 0" }, { translate: "6px 0" }, { translate: "-3px 0" }, { translate: "0 0" }],
            { duration: 260 },
          );
        }
      }
      s.status = hit ? "caught" : "missed";
      s.pauseLeft = PAUSE_MS + (s.misses >= MAX_MISSES ? 500 : 0);
      s.fxId += 1;
      setHud({ score: s.score, combo: s.combo, misses: s.misses });
      setFx({
        id: s.fxId,
        grade,
        line: pickLine(feedbackLines[grade], seed, `line-${s.index}`),
        sound: pickLine(hit ? soundWords.hit : soundWords.miss, seed, `sound-${s.index}`),
        x: Math.min(0.85, Math.max(0.15, s.x)),
      });
    };

    const finish = (end: Result["end"]) => {
      s.ended = true;
      const prev = readBest();
      const newBest = s.score > prev;
      if (newBest) writeBest(s.score);
      const stats: Stats = {
        score: s.score,
        catches: s.catches,
        perfects: s.perfects,
        maxCombo: s.maxCombo,
        misses: s.misses,
        rounds: s.index + 1,
      };
      setResult({ ...stats, seed, end, newBest });
      setPhase("over");
      track("game_complete", { game: GAME_SLUG, score: s.score, rank: rankFor(s.score), end });
      reportDaily(s.score);
    };

    const hail = () => {
      if (s.ended || s.pre > 0 || s.status !== "moving") return;
      const { grade, offset } = gradeTap(s.round, s.x);
      resolve(grade, offset);
    };
    hailRef.current = hail;

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== " " && e.key !== "Enter") return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("a, input, textarea, select")) return;
      e.preventDefault(); // no page scroll, no double-trigger on the focused button
      if (!e.repeat) hail();
    };
    window.addEventListener("keydown", onKey);

    place();
    stage.focus({ preventScroll: true });

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      // Clamp dt so a backgrounded tab effectively pauses the game.
      const dt = Math.min(50, now - last);
      last = now;

      if (s.pre > 0) {
        s.pre -= dt;
        const step = s.pre > 0 ? Math.min(2, Math.floor((COUNTDOWN_MS - s.pre) / (COUNTDOWN_MS / 3))) : null;
        if (step !== s.lastCount) {
          s.lastCount = step;
          setCount(step);
        }
        raf = requestAnimationFrame(tick);
        return;
      }

      s.t += dt;
      const left = Math.max(0, DURATION_MS - s.t);
      bar.style.transform = `scaleX(${left / DURATION_MS})`;
      const sec = Math.ceil(left / 1000);
      if (sec !== s.lastSec) {
        s.lastSec = sec;
        setSecondsLeft(sec);
      }
      if (left <= 0) return finish("time");

      if (s.status === "moving") {
        s.rt += dt;
        const x = positionAt(s.round, s.rt);
        if (x === null) resolve("passed", 1);
        else {
          s.x = x;
          draw();
        }
      } else {
        s.pauseLeft -= dt;
        if (s.status === "missed") {
          // Missed CNGs speed off.
          s.x += s.round.dir * dt * (3.6 / s.round.passMs);
          draw();
        }
        if (s.pauseLeft <= 0) {
          if (s.misses >= MAX_MISSES) return finish("lives");
          s.index += 1;
          s.round = makeRound(seed, s.index);
          place();
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("keydown", onKey);
      hailRef.current = null;
    };
  }, [phase, seed]);

  // Move focus to the result heading for keyboard and screen-reader users.
  useEffect(() => {
    if (phase === "over") headingRef.current?.focus();
  }, [phase]);

  function start(nextSeed: number, kind: "first" | "retry" | "replay") {
    setSeed(nextSeed);
    setHud(EMPTY_HUD);
    setSecondsLeft(DURATION_MS / 1000);
    setCount(0);
    setFx(null);
    setResult(null);
    setPhase("playing");
    track(kind === "first" ? "game_start" : "game_retry", { game: GAME_SLUG, mode: kind });
    rootRef.current?.scrollIntoView({ block: "start", behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }

  /** Shared "Challenge a friend" actions for a finished round. */
  function shareActions(r: Result) {
    const rank = ranks[rankFor(r.score)];
    const text = fmt(t(copy.shareText, lang), { title: t(rank.title, lang), score: num(r.score, lang) });
    return <ShareActions game={GAME_SLUG} seed={r.seed} score={r.score} text={text} accent={rank.accent} rank={rank.id} />;
  }

  const isChallenge = challenge !== null && seed === challenge.seed;
  const mult = multiplier(hud.combo);

  return (
    <div ref={rootRef} className="scroll-mt-4">
      {phase === "idle" && (
        <section className={`${card} p-5 sm:p-6`} aria-labelledby="cng-how">
          {isChallenge && <ChallengeBanner challenge={challenge} />}
          <h2 id="cng-how" className="font-display text-2xl font-extrabold">
            {t(copy.howTitle, lang)}
          </h2>
          <ol className="mt-3 grid gap-2">
            {copy.how.map((line, i) => (
              <li key={i} className="flex gap-3">
                <span aria-hidden className="grid size-7 shrink-0 place-items-center rounded-full border-2 border-ink bg-lime text-sm font-extrabold">
                  {num(i + 1, lang)}
                </span>
                <span className="text-ink-muted">{t(line, lang)}</span>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <p className="text-sm font-bold text-ink-muted">
              🏆 {t(copy.best, lang)}: <span className="text-ink">{num(best, lang)}</span>
            </p>
            <button
              type="button"
              onClick={() => start(seed ?? newSeed(), "first")}
              className={`${btnPrimary} ${accentBg.cng} w-full sm:w-auto`}
            >
              🛺 {t(copy.start, lang)}
            </button>
          </div>
        </section>
      )}

      {phase === "playing" && (
        <section aria-label={t(copy.hailLabel, lang)}>
          <div className="grid grid-cols-3 gap-2">
            <HudTile label={t(copy.score, lang)} accent="bg-surface">
              <span className="tabular-nums">{num(hud.score, lang)}</span>
            </HudTile>
            <HudTile label={t(copy.combo, lang)} accent={mult > 1 ? accentBg.marigold : "bg-surface"}>
              <span ref={comboRef} className="inline-block tabular-nums">
                ×{num(mult, lang)}
              </span>
              {hud.combo > 0 && <span className="ml-1 text-sm font-bold">🔥{num(hud.combo, lang)}</span>}
            </HudTile>
            <HudTile label={t(copy.misses, lang)} accent="bg-surface">
              <span role="img" aria-label={`${t(copy.misses, lang)}: ${num(hud.misses, lang)} / ${num(MAX_MISSES, lang)}`}>
                {Array.from({ length: MAX_MISSES }, (_, i) => (
                  <span key={i} aria-hidden className={i < hud.misses ? "opacity-100" : "opacity-25 grayscale"}>
                    ❌
                  </span>
                ))}
              </span>
            </HudTile>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <div
              role="progressbar"
              aria-label={t(copy.time, lang)}
              aria-valuemin={0}
              aria-valuemax={DURATION_MS / 1000}
              aria-valuenow={secondsLeft}
              className="h-3.5 flex-1 overflow-hidden rounded-pill border-2 border-ink bg-surface"
            >
              <span ref={barRef} className={`block h-full origin-left ${secondsLeft <= 5 ? "bg-chili" : "bg-marigold"}`} />
            </div>
            <span className="w-12 text-right text-sm font-extrabold tabular-nums">
              {fmt(t(copy.seconds, lang), { n: num(secondsLeft, lang) })}
            </span>
          </div>

          <button
            ref={stageRef}
            type="button"
            aria-label={t(copy.hailLabel, lang)}
            onPointerDown={(e) => {
              if (e.pointerType === "mouse" && e.button !== 0) return;
              e.preventDefault();
              hailRef.current?.();
            }}
            // Keyboard / assistive-tech activation (pointer taps are handled above).
            onClick={(e) => {
              if (e.detail === 0) hailRef.current?.();
            }}
            className="relative mt-3 block h-64 w-full cursor-pointer touch-manipulation select-none overflow-hidden rounded-card border-2 border-ink bg-sky text-left shadow-pop sm:h-72"
          >
            <span aria-hidden className="absolute inset-x-0 top-4 flex justify-around text-3xl opacity-70 sm:text-4xl">
              <span>🏢</span>
              <span>🌳</span>
              <span>🏬</span>
              <span>🏗️</span>
              <span>🏢</span>
            </span>
            {/* Road */}
            <span aria-hidden className="absolute inset-x-0 bottom-0 h-32 border-t-2 border-ink bg-[#3b3548]">
              <span className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 bg-[repeating-linear-gradient(90deg,#fff3d6_0_22px,transparent_22px_44px)] opacity-70" />
            </span>
            {/* Stop zone */}
            <span ref={zoneRef} aria-hidden className="absolute bottom-0 h-32 border-x-2 border-dashed border-ink bg-lime/70">
              <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border-2 border-ink bg-surface px-2 py-0.5 text-xs font-black shadow-pop">
                🙋 {t(copy.stop, lang)}
              </span>
            </span>
            {/* CNG */}
            <span ref={cngRef} aria-hidden className="absolute bottom-7 left-0 block will-change-transform">
              <span className="block -translate-x-1/2">
                <span ref={cngBodyRef} className="block text-6xl leading-none drop-shadow-[3px_3px_0_rgb(26_19_37)]">
                  🛺
                </span>
              </span>
            </span>
            {/* Sound-word pop */}
            {fx && <SoundPop key={fx.id} x={fx.x} hit={isHit(fx.grade)} text={t(fx.sound, lang)} />}
            {/* Countdown */}
            {count !== null && (
              <span className="absolute inset-0 grid place-items-center bg-ink/30">
                <span className="rotate-[-3deg] rounded-2xl border-2 border-ink bg-marigold px-6 py-2 font-display text-4xl font-black shadow-pop-lg">
                  {t(copy.countdown[count] ?? copy.hail, lang)}
                </span>
              </span>
            )}
          </button>

          <p className="mt-3 min-h-14 text-center text-lg font-bold" aria-live="polite">
            {fx ? t(fx.line, lang) : " "}
          </p>
        </section>
      )}

      {phase === "over" && result && (
        <ResultView
          result={result}
          challenge={challenge}
          headingRef={headingRef}
          retryLabel={daily?.retryLabel}
          isDaily={Boolean(daily)}
          onRetry={() => (daily ? start(daily.seed, "replay") : start(newSeed(), "retry"))}
          onReplay={daily ? undefined : () => start(result.seed, "replay")}
          share={
            daily ? (
              <button type="button" onClick={() => daily.onShare(result.score)} className={`${btnPrimary} ${accentBg.marigold}`}>
                {t(copy.share, lang)}
              </button>
            ) : (
              shareActions(result)
            )
          }
        />
      )}
    </div>
  );
}

/** Visual "sound": a sticker word that pops once on mount. */
function SoundPop({ x, hit, text }: { x: number; hit: boolean; text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const anim = el.animate(
      [
        { opacity: 0, scale: 0.6, translate: "-50% 10px" },
        { opacity: 1, scale: 1.1, translate: "-50% -6px", offset: 0.3 },
        { opacity: 0, scale: 1, translate: "-50% -26px" },
      ],
      { duration: 700, easing: "ease-out", fill: "forwards" },
    );
    return () => anim.cancel();
  }, []);
  return (
    <span
      ref={ref}
      aria-hidden
      style={{ left: `${x * 100}%` }}
      className={`pointer-events-none absolute top-16 -translate-x-1/2 -rotate-6 whitespace-nowrap rounded-xl border-2 border-ink px-3 py-1 font-display text-xl font-black shadow-pop ${
        hit ? accentBg.lime : accentBg.chili
      }`}
    >
      {text}
    </span>
  );
}

function HudTile({ label, accent, children }: { label: string; accent: string; children: ReactNode }) {
  return (
    <div className={`rounded-2xl border-2 border-ink px-2 py-1.5 text-center shadow-pop ${accent}`}>
      <p className="text-[11px] font-extrabold uppercase tracking-wider text-ink-muted">{label}</p>
      <p className="font-display text-2xl font-extrabold leading-tight">{children}</p>
    </div>
  );
}

function ResultView({
  result,
  challenge,
  headingRef,
  retryLabel,
  isDaily,
  onRetry,
  onReplay,
  share,
}: {
  result: Result;
  challenge: FriendChallenge | null;
  headingRef: RefObject<HTMLHeadingElement | null>;
  retryLabel?: string;
  isDaily: boolean;
  onRetry: () => void;
  /** Omitted in daily mode (retry already replays the same traffic). */
  onReplay?: () => void;
  /** Share buttons (challenge link, or the daily share). */
  share: ReactNode;
}) {
  const { lang } = useI18n();
  const host = useHost();
  const origin = useOrigin();
  const rank = ranks[rankFor(result.score)];
  const stats = [
    { label: copy.statCatches, value: result.catches },
    { label: copy.statPerfects, value: result.perfects },
    { label: copy.statMaxCombo, value: result.maxCombo },
    { label: copy.statMisses, value: result.misses },
  ];

  const card: ResultCardData = {
    game: t(gameInfo.title, lang),
    emoji: gameInfo.emoji,
    accent: rank.accent,
    headline: `${num(result.score, lang)} ${t(copy.pts, lang)}`,
    title: t(rank.title, lang),
    titleEmoji: rank.emoji,
    blurb: t(rank.blurb, lang),
    headlineLabel: t(result.end === "time" ? copy.timeUp : copy.outOfLives, lang),
    stats: stats.map((s) => ({ label: t(s.label, lang), value: num(s.value, lang) })),
    path: `/games/${GAME_SLUG}`,
  };
  const url = isDaily
    ? `${origin}/daily`
    : `${origin}${challengePath({ game: GAME_SLUG, seed: result.seed, score: result.score }) ?? `/games/${GAME_SLUG}`}`;

  return (
    <section className="grid gap-3" aria-labelledby="cng-result">
      <ResultCard data={card} host={host} headingId="cng-result" headingRef={headingRef}>
        {result.newBest && <p className="text-center font-extrabold text-cng-deep">{t(copy.newBest, lang)}</p>}
        <ChallengeOutcome challenge={challenge} seed={result.seed} score={result.score} />
        <p className="text-center text-xs font-bold text-ink-muted">
          {t(copy.trafficCode, lang)}: <code className="font-mono">{encodeSeed(result.seed)}</code>
        </p>
      </ResultCard>
      <ResultShareKit
        data={card}
        url={url}
        fileName={`${GAME_SLUG}-result`}
        primary={!isDaily}
        onShared={(method) => track("game_share", { game: GAME_SLUG, method, rank: rankFor(result.score) })}
      />
      {share}
      <button type="button" onClick={onRetry} className={`${btnPrimary} bg-surface`}>
        {retryLabel ?? t(copy.retry, lang)}
      </button>
      {onReplay && (
        <button type="button" onClick={onReplay} className={btnGhost}>
          {t(copy.replay, lang)}
        </button>
      )}
    </section>
  );
}
