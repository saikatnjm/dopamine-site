"use client";

import { useEffect, useEffectEvent, useRef, useState, useSyncExternalStore, type ReactNode, type RefObject } from "react";
import { ChallengeBanner, ChallengeOutcome, ShareActions } from "@/components/games/challenge-ui";
import { ResultCard } from "@/components/share/result-card";
import { ResultShareKit, useHost, useOrigin } from "@/components/share/result-share-kit";
import { useI18n } from "@/components/providers/lang-provider";
import { accentBg, btnGhost, btnPrimary, card } from "@/components/ui/styles";
import {
  busRoutes,
  eventBanners,
  honkWords,
  nearMissLines,
  obstacleLooks,
  trafficDodgeCopy as copy,
  trafficRanks,
} from "@/data/games/traffic-dodge";
import { track } from "@/lib/analytics";
import { getGame } from "@/data/games";
import { challengePath, type FriendChallenge } from "@/lib/challenge";
import type { ResultCardData } from "@/lib/result-card";
import { createBestStore, encodeSeed, prefersReducedMotion, type DailyMode } from "@/lib/games/shared";
import {
  GAME_SLUG,
  LANES,
  PLAYER,
  STEP_MS,
  createSim,
  kmh,
  move,
  multiplier,
  pickLine,
  rankFor,
  score,
  step,
  type Obstacle,
  type ObstacleKind,
  type StepResult,
} from "@/lib/games/traffic-dodge";
import { fmt, num, t, type Text } from "@/lib/i18n/core";
import { newSeed } from "@/lib/random";

const bestStore = createBestStore(`hottogol:${GAME_SLUG}:best`);
const gameInfo = getGame(GAME_SLUG)!;

/** Max obstacles on screen at once (≈6 rows × 3). DOM nodes are reused. */
const POOL = 24;
const COUNTDOWN_MS = 1500;
const CRASH_MS = 900;
const BANNER_MS = 2200;
/** Dash period of the lane markings, in px. */
const DASH = 36;

type Phase = "idle" | "playing" | "over";
type Result = {
  score: number;
  seconds: number;
  nearMisses: number;
  maxCombo: number;
  topKmh: number;
  crashKind: ObstacleKind;
  seed: number;
  newBest: boolean;
};
type Challenge = FriendChallenge | null;

export function TrafficDodgeGame({
  challenge,
  daily,
}: {
  challenge: Challenge;
  /** Daily Hottogol mode (fixed seed, results reported to the daily page). */
  daily?: DailyMode;
}) {
  const { lang } = useI18n();
  const best = useSyncExternalStore(bestStore.subscribe, bestStore.read, () => 0);

  const [phase, setPhase] = useState<Phase>("idle");
  const [seed, setSeed] = useState<number | null>(daily?.seed ?? challenge?.seed ?? null);
  // Stable across renders, so passing a new `daily` object never restarts a run.
  const reportDaily = useEffectEvent((points: number) => daily?.onComplete(points));
  const [count, setCount] = useState<number | null>(0);
  const [combo, setCombo] = useState(0);
  const [banner, setBanner] = useState<{ id: number; text: Text } | null>(null);
  const [fx, setFx] = useState<{ id: number; text: Text; x: number } | null>(null);
  const [line, setLine] = useState<Text | null>(null);
  const [rain, setRain] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLSpanElement>(null);
  const dashRef = useRef<HTMLSpanElement>(null);
  const poolRef = useRef<(HTMLSpanElement | null)[]>([]);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const speedRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moveRef = useRef<((dir: -1 | 1) => void) | null>(null);
  const swipeRef = useRef<{ x: number; moved: boolean } | null>(null);

  // ----- Game loop -----
  useEffect(() => {
    if (phase !== "playing" || seed === null) return;
    const stage = stageRef.current;
    const player = playerRef.current;
    const dash = dashRef.current;
    const scoreEl = scoreRef.current;
    const timeEl = timeRef.current;
    const speedEl = speedRef.current;
    const pool = poolRef.current;
    if (!stage || !player || !dash || !scoreEl || !timeEl || !speedEl) return;

    const reduce = prefersReducedMotion();
    const sim = createSim(seed);
    const slots = new Map<number, number>();
    const free = Array.from({ length: POOL }, (_, i) => POOL - 1 - i);
    const timers: number[] = [];
    let u = stage.clientWidth / LANES; // px per world unit
    let fxId = 0;
    let bannerId = 0;

    const hud = () => {
      scoreEl.textContent = num(score(sim), lang);
      timeEl.textContent = fmt(t(copy.seconds, lang), { n: num(Math.floor(sim.t / 1000), lang) });
      speedEl.textContent = fmt(t(copy.kmh, lang), { n: num(kmh(sim.v), lang) });
    };

    const sizeObstacle = (el: HTMLSpanElement, o: Obstacle) => {
      el.style.width = `${o.w * u}px`;
      el.style.height = `${o.h * u}px`;
      el.style.fontSize = `${(o.kind === "bus" ? 0.62 : 0.46) * u}px`;
    };

    const sizeAll = () => {
      player.style.width = `${0.62 * u}px`;
      player.style.height = `${0.9 * u}px`;
      player.style.fontSize = `${0.46 * u}px`;
      for (const o of sim.obstacles) {
        const slot = slots.get(o.id);
        const el = slot === undefined ? null : pool[slot];
        if (el) sizeObstacle(el, o);
      }
    };

    const render = () => {
      // Player sticker is slightly larger than its hitbox, centred on it.
      player.style.transform = `translate3d(${(sim.x - 0.31) * u}px,${(PLAYER.y + PLAYER.h / 2 - 0.45) * u}px,0)`;
      for (const o of sim.obstacles) {
        const slot = slots.get(o.id);
        const el = slot === undefined ? null : pool[slot];
        if (el) el.style.transform = `translate3d(${(o.x - o.w / 2) * u}px,${o.y * u}px,0)`;
      }
      dash.style.transform = `translate3d(0,${((sim.dist * u) % DASH) - DASH}px,0)`;
    };

    const spawn = (o: Obstacle) => {
      const slot = free.pop();
      if (slot === undefined) return;
      const el = pool[slot];
      if (!el) return;
      slots.set(o.id, slot);
      const look = obstacleLooks[o.kind];
      const tile = document.createElement("span");
      tile.className = `flex h-full w-full flex-col items-center justify-center leading-none ${look.className} ${
        look.className.includes("border-ink") ? "shadow-pop" : ""
      }`;
      const emoji = document.createElement("span");
      emoji.textContent = look.emoji;
      tile.append(emoji);
      if (o.kind === "bus") {
        const sign = document.createElement("span");
        sign.className = "mt-1 rounded bg-surface px-1 text-[0.32em] font-extrabold";
        sign.textContent = pickLine(busRoutes, seed, `bus-${o.id}`);
        tile.append(sign);
      }
      el.replaceChildren(tile);
      sizeObstacle(el, o);
      el.style.display = "block";
    };

    const despawn = (id: number) => {
      const slot = slots.get(id);
      if (slot === undefined) return;
      const el = pool[slot];
      if (el) {
        el.style.display = "none";
        el.replaceChildren();
      }
      slots.delete(id);
      free.push(slot);
    };

    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));

    const handle = (r: StepResult) => {
      r.spawned.forEach(spawn);
      r.removed.forEach(despawn);
      if (r.nearMiss) {
        fxId += 1;
        setCombo(r.nearMiss.combo);
        setFx({ id: fxId, text: pickLine(honkWords, seed, `honk-${fxId}`), x: sim.x / LANES });
        setLine(pickLine(nearMissLines, seed, `near-${sim.nearMisses}`));
        if (!reduce) player.animate([{ scale: 1 }, { scale: 1.18 }, { scale: 1 }], { duration: 220 });
      }
      if (r.comboReset) setCombo(0);
      if (r.event) {
        const id = ++bannerId;
        const text = eventBanners[r.event];
        setBanner({ id, text });
        setLine(text);
        if (r.event === "rain") setRain(true);
        later(() => setBanner((b) => (b?.id === id ? null : b)), BANNER_MS);
      }
      if (r.rainEnded) setRain(false);
      if (r.crash) {
        setCrashed(true);
        setLine({
          en: fmt(copy.crashedInto.en, { what: t(obstacleLooks[r.crash.kind].name, "en") }),
          bn: fmt(copy.crashedInto.bn, { what: t(obstacleLooks[r.crash.kind].name, "bn") }),
        });
        if (!reduce) {
          stage.animate(
            [{ translate: "0 0" }, { translate: "-8px 2px" }, { translate: "7px -2px" }, { translate: "-4px 0" }, { translate: "0 0" }],
            { duration: 320 },
          );
        }
        try {
          navigator.vibrate?.(90);
        } catch {
          // vibration unsupported
        }
      }
    };

    const finish = () => {
      const points = score(sim);
      const prev = bestStore.read();
      if (points > prev) bestStore.write(points);
      const crashKind = sim.crashed?.kind ?? "car";
      setResult({
        score: points,
        seconds: Math.floor(sim.t / 1000),
        nearMisses: sim.nearMisses,
        maxCombo: sim.maxCombo,
        topKmh: kmh(sim.topV),
        crashKind,
        seed,
        newBest: points > prev,
      });
      setPhase("over");
      track("game_complete", { game: GAME_SLUG, score: points, rank: rankFor(points), seconds: Math.floor(sim.t / 1000), crash: crashKind });
      reportDaily(points);
    };

    let pre = COUNTDOWN_MS;
    let lastCount: number | null = 0;

    moveRef.current = (dir) => {
      if (pre > 0) return;
      move(sim, dir);
    };

    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const dir = k === "arrowleft" || k === "a" ? -1 : k === "arrowright" || k === "d" ? 1 : 0;
      if (dir === 0) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select")) return;
      e.preventDefault();
      if (!e.repeat) moveRef.current?.(dir);
    };
    window.addEventListener("keydown", onKey);

    const ro = new ResizeObserver(() => {
      u = stage.clientWidth / LANES;
      sizeAll();
      render();
    });
    ro.observe(stage);

    sizeAll();
    render();
    hud();
    stage.focus({ preventScroll: true });

    let raf = 0;
    let acc = 0;
    let crashT = 0;
    let lastHud = 0;
    let last = performance.now();

    const tick = (now: number) => {
      // Clamp dt so a backgrounded tab pauses instead of fast-forwarding.
      const dt = Math.min(50, now - last);
      last = now;

      if (pre > 0) {
        pre -= dt;
        const c = pre > 0 ? Math.min(2, Math.floor((COUNTDOWN_MS - pre) / (COUNTDOWN_MS / 3))) : null;
        if (c !== lastCount) {
          lastCount = c;
          setCount(c);
        }
        raf = requestAnimationFrame(tick);
        return;
      }

      if (sim.crashed) {
        crashT += dt;
        if (crashT >= CRASH_MS) return finish();
        raf = requestAnimationFrame(tick);
        return;
      }

      // Fixed-step simulation keeps the traffic identical on every device.
      acc += dt;
      let steps = 0;
      while (acc >= STEP_MS && steps < 4) {
        acc -= STEP_MS;
        steps += 1;
        handle(step(sim));
        if (sim.crashed) break;
      }
      if (steps === 4) acc = 0;
      render();
      if (now - lastHud > 100 || sim.crashed) {
        lastHud = now;
        hud();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("keydown", onKey);
      timers.forEach((id) => window.clearTimeout(id));
      moveRef.current = null;
      for (const el of pool) {
        if (!el) continue;
        el.style.display = "none";
        el.replaceChildren();
      }
    };
  }, [phase, seed, lang]);

  useEffect(() => {
    if (phase === "over") headingRef.current?.focus();
  }, [phase]);

  function start(nextSeed: number, kind: "first" | "retry" | "replay") {
    setSeed(nextSeed);
    setCount(0);
    setCombo(0);
    setBanner(null);
    setFx(null);
    setLine(null);
    setRain(false);
    setCrashed(false);
    setResult(null);
    setPhase("playing");
    track(kind === "first" ? "game_start" : "game_retry", { game: GAME_SLUG, mode: kind });
    rootRef.current?.scrollIntoView({ block: "start", behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }

  /** Shared "Challenge a friend" actions for a finished round. */
  function shareActions(r: Result) {
    const rank = trafficRanks[rankFor(r.score)];
    const text = fmt(t(copy.shareText, lang), {
      title: t(rank.title, lang),
      score: num(r.score, lang),
      time: num(r.seconds, lang),
    });
    return <ShareActions game={GAME_SLUG} seed={r.seed} score={r.score} text={text} accent={rank.accent} rank={rank.id} />;
  }

  const isChallenge = challenge !== null && seed === challenge.seed;
  const mult = multiplier(combo);
  const moveButton = (dir: -1 | 1) => (
    <button
      type="button"
      aria-label={t(dir === -1 ? copy.left : copy.right, lang)}
      onPointerDown={(e) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        e.preventDefault();
        moveRef.current?.(dir);
      }}
      onClick={(e) => {
        if (e.detail === 0) moveRef.current?.(dir); // keyboard / assistive tech
      }}
      className={`${btnPrimary} min-h-14 touch-manipulation select-none bg-surface text-2xl`}
    >
      <span aria-hidden>{dir === -1 ? "◀" : "▶"}</span>
    </button>
  );

  return (
    <div ref={rootRef} className="scroll-mt-4">
      {phase === "idle" && (
        <section className={`${card} p-5 sm:p-6`} aria-labelledby="td-how">
          {isChallenge && <ChallengeBanner game={GAME_SLUG} challenge={challenge} onAccept={() => start(seed ?? newSeed(), "first")} />}
          <h2 id="td-how" className="font-display text-2xl font-extrabold">
            {t(copy.howTitle, lang)}
          </h2>
          <ol className="mt-3 grid gap-2">
            {copy.how.map((item, i) => (
              <li key={i} className="flex gap-3">
                <span aria-hidden className="grid size-7 shrink-0 place-items-center rounded-full border-2 border-ink bg-lime text-sm font-extrabold">
                  {num(i + 1, lang)}
                </span>
                <span className="text-ink-muted">{t(item, lang)}</span>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <p className="text-sm font-bold text-ink-muted">
              🏆 {t(copy.best, lang)}: <span className="text-ink">{num(best, lang)}</span>
            </p>
            <button type="button" onClick={() => start(seed ?? newSeed(), "first")} className={`${btnPrimary} ${accentBg.violet} w-full sm:w-auto`}>
              🛵 {t(copy.start, lang)}
            </button>
          </div>
        </section>
      )}

      {phase === "playing" && (
        <section aria-label={t(copy.roadLabel, lang)}>
          <div className="grid grid-cols-4 gap-1.5">
            <HudTile label={t(copy.score, lang)}>
              <span ref={scoreRef} className="tabular-nums" />
            </HudTile>
            <HudTile label={t(copy.combo, lang)} highlight={mult > 1}>
              <span className="tabular-nums">×{num(mult, lang)}</span>
            </HudTile>
            <HudTile label={t(copy.speed, lang)} small>
              <span ref={speedRef} className="tabular-nums" />
            </HudTile>
            <HudTile label={t(copy.time, lang)}>
              <span ref={timeRef} className="tabular-nums" />
            </HudTile>
          </div>

          <div
            ref={stageRef}
            role="application"
            aria-label={t(copy.roadLabel, lang)}
            tabIndex={0}
            onPointerDown={(e) => {
              if (e.pointerType === "mouse" && e.button !== 0) return;
              swipeRef.current = { x: e.clientX, moved: false };
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              const s = swipeRef.current;
              if (!s) return;
              const dx = e.clientX - s.x;
              if (Math.abs(dx) > 22) {
                moveRef.current?.(dx < 0 ? -1 : 1);
                s.x = e.clientX;
                s.moved = true;
              }
            }}
            onPointerUp={(e) => {
              const s = swipeRef.current;
              swipeRef.current = null;
              if (!s || s.moved) return;
              // A plain tap moves toward the tapped side.
              const rect = e.currentTarget.getBoundingClientRect();
              moveRef.current?.(e.clientX < rect.left + rect.width / 2 ? -1 : 1);
            }}
            onPointerCancel={() => {
              swipeRef.current = null;
            }}
            className="relative mx-auto mt-3 aspect-[2/3] w-full max-w-[calc(58dvh*2/3)] cursor-pointer touch-none select-none overflow-hidden rounded-card border-2 border-ink bg-[#3b3548] shadow-pop"
          >
            {/* Lane markings (scrolled via transform) */}
            <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 block h-[calc(100%+36px)]" ref={dashRef}>
              {[25, 50, 75].map((left) => (
                <span
                  key={left}
                  style={{ left: `${left}%` }}
                  className="absolute top-0 block h-full w-1 -translate-x-1/2 bg-[repeating-linear-gradient(180deg,#fff3d6_0_18px,transparent_18px_36px)] opacity-60"
                />
              ))}
            </span>
            {rain && (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 block bg-sky/25 bg-[repeating-linear-gradient(105deg,transparent_0_14px,rgb(255_255_255/0.25)_14px_16px)]"
              />
            )}
            {/* Traffic pool: nodes are reused and positioned by the loop */}
            {Array.from({ length: POOL }, (_, i) => (
              <span
                key={i}
                aria-hidden
                ref={(el) => {
                  poolRef.current[i] = el;
                }}
                style={{ display: "none" }}
                className="pointer-events-none absolute left-0 top-0 will-change-transform"
              />
            ))}
            {/* Player */}
            <span
              ref={playerRef}
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 grid place-items-center rounded-xl border-2 border-ink bg-violet leading-none shadow-pop will-change-transform"
            >
              {crashed ? "💥" : "🛵"}
            </span>
            {fx && <HonkPop key={fx.id} x={fx.x} text={t(fx.text, lang)} />}
            {banner && (
              <span className="pointer-events-none absolute inset-x-3 top-3 block rotate-[-1.5deg] rounded-xl border-2 border-ink bg-marigold px-3 py-1.5 text-center text-sm font-extrabold shadow-pop">
                {t(banner.text, lang)}
              </span>
            )}
            {crashed && (
              <span className="pointer-events-none absolute inset-0 grid place-items-center bg-ink/30">
                <span className="rotate-[-4deg] rounded-2xl border-2 border-ink bg-chili px-6 py-2 font-display text-4xl font-black shadow-pop-lg">
                  {t(copy.crashed, lang)}
                </span>
              </span>
            )}
            {count !== null && (
              <span className="pointer-events-none absolute inset-0 grid place-items-center bg-ink/30">
                <span className="rotate-[-3deg] rounded-2xl border-2 border-ink bg-marigold px-6 py-2 font-display text-5xl font-black shadow-pop-lg">
                  {t(copy.countdown[count] ?? copy.nearMiss, lang)}
                </span>
              </span>
            )}
          </div>

          <div className="mx-auto mt-3 grid max-w-[calc(58dvh*2/3)] grid-cols-2 gap-3">
            {moveButton(-1)}
            {moveButton(1)}
          </div>

          <p className="mt-3 min-h-8 text-center font-bold" aria-live="polite">
            {line ? t(line, lang) : " "}
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

/** Sticker "honk" that pops once on mount (skipped with reduced motion). */
function HonkPop({ x, text }: { x: number; text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const anim = el.animate(
      [
        { opacity: 0, scale: 0.6, translate: "-50% 8px" },
        { opacity: 1, scale: 1.1, translate: "-50% -6px", offset: 0.3 },
        { opacity: 0, scale: 1, translate: "-50% -28px" },
      ],
      { duration: 650, easing: "ease-out", fill: "forwards" },
    );
    return () => anim.cancel();
  }, []);
  return (
    <span
      ref={ref}
      aria-hidden
      style={{ left: `${Math.min(0.8, Math.max(0.2, x)) * 100}%` }}
      className="pointer-events-none absolute bottom-[22%] -translate-x-1/2 -rotate-6 whitespace-nowrap rounded-xl border-2 border-ink bg-lime px-3 py-1 font-display text-lg font-black shadow-pop"
    >
      {text}
    </span>
  );
}

function HudTile({ label, highlight = false, small = false, children }: { label: string; highlight?: boolean; small?: boolean; children: ReactNode }) {
  return (
    <div className={`rounded-2xl border-2 border-ink px-1 py-1.5 text-center shadow-pop ${highlight ? accentBg.marigold : "bg-surface"}`}>
      <p className="text-[10px] font-extrabold uppercase tracking-wider text-ink-muted">{label}</p>
      <p className={`font-display font-extrabold leading-tight ${small ? "text-base" : "text-xl"}`}>{children}</p>
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
  challenge: Challenge;
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
  const rank = trafficRanks[rankFor(result.score)];
  const stats = [
    { key: "time", label: copy.statTime, value: fmt(t(copy.seconds, lang), { n: num(result.seconds, lang) }) },
    { key: "near", label: copy.statNear, value: num(result.nearMisses, lang) },
    { key: "combo", label: copy.statCombo, value: num(result.maxCombo, lang) },
    { key: "speed", label: copy.statSpeed, value: fmt(t(copy.kmh, lang), { n: num(result.topKmh, lang) }) },
  ];

  const card: ResultCardData = {
    game: t(gameInfo.title, lang),
    emoji: gameInfo.emoji,
    accent: rank.accent,
    headline: `${num(result.score, lang)} ${t(copy.pts, lang)}`,
    title: t(rank.title, lang),
    titleEmoji: rank.emoji,
    blurb: t(rank.blurb, lang),
    headlineLabel: `${fmt(t(copy.crashedInto, lang), { what: t(obstacleLooks[result.crashKind].name, lang) })} ${obstacleLooks[result.crashKind].emoji}`,
    stats: stats.map((s) => ({ label: t(s.label, lang), value: s.value })),
    path: `/games/${GAME_SLUG}`,
  };
  const url = isDaily
    ? `${origin}/daily`
    : `${origin}${challengePath({ game: GAME_SLUG, seed: result.seed, score: result.score }) ?? `/games/${GAME_SLUG}`}`;

  return (
    <section className="grid gap-3" aria-labelledby="td-result">
      <ResultCard data={card} host={host} headingId="td-result" headingRef={headingRef}>
        {result.newBest && <p className="text-center font-extrabold text-cng-deep">{t(copy.newBest, lang)}</p>}
        <ChallengeOutcome game={GAME_SLUG} challenge={challenge} seed={result.seed} score={result.score} />
        <p className="text-center text-xs font-bold text-ink-muted">
          {t(copy.trafficCode, lang)}: <code className="font-mono">{encodeSeed(result.seed)}</code>
        </p>
      </ResultCard>
      {share}
      <ResultShareKit primary={false}
        data={card}
        url={url}
        fileName={`${GAME_SLUG}-result`}
        onShared={(method) => track("game_share", { game: GAME_SLUG, method, rank: rankFor(result.score) })}
      />
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
