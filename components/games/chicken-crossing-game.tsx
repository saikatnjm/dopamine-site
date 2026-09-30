"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode, type RefObject } from "react";
import { ChallengeBanner, ChallengeOutcome, ShareActions } from "@/components/games/challenge-ui";
import { ResultCard } from "@/components/share/result-card";
import { ResultShareKit, useHost, useOrigin } from "@/components/share/result-share-kit";
import { useI18n } from "@/components/providers/lang-provider";
import { accentBg, btnGhost, btnPrimary, card } from "@/components/ui/styles";
import { chickenCopy as copy, crashLines, eventBanners, levelName, looks, nearMissWords, ranks } from "@/data/games/chicken-crossing";
import { track } from "@/lib/analytics";
import { challengePath, type FriendChallenge } from "@/lib/challenge";
import { getGame } from "@/data/games";
import type { ResultCardData } from "@/lib/result-card";
import {
  COLS,
  GAME_SLUG,
  STEP_MS,
  VIEW,
  createSim,
  distanceMetres,
  levelOf,
  move,
  multiplier,
  pickLine,
  rankFor,
  score,
  step,
  type CrashKind,
  type Dir,
  type Lane,
  type StepResult,
  type Vehicle,
} from "@/lib/games/chicken-crossing";
import { createBestStore, encodeSeed, prefersReducedMotion } from "@/lib/games/shared";
import { fmt, num, t, type Text } from "@/lib/i18n/core";
import { newSeed } from "@/lib/random";

const bestStore = createBestStore(`hottogol:${GAME_SLUG}:best`);
const gameInfo = getGame(GAME_SLUG)!;

/** Reused DOM nodes (rows on screen ≈ VIEW + 3; ≤ 4 vehicles per row + event extras). */
const ROW_POOL = VIEW + 6;
const VEH_POOL = 80;
const COUNTDOWN_MS = 1500;
const CRASH_MS = 900;
const BANNER_MS = 2200;
const HOP_MS = 90;

const ROW_CLASS: Record<Lane["plan"]["kind"], string> = {
  road: "bg-[#3b3548] border-t-2 border-dashed border-[#fff3d6]/35",
  footpath: "bg-[#d9c7a3] bg-[repeating-linear-gradient(90deg,transparent_0_22px,rgb(26_19_37/0.12)_22px_24px)]",
  divider: "bg-lime/80 border-y-2 border-ink/30",
};

type Phase = "idle" | "playing" | "over";
type Challenge = FriendChallenge | null;
type Result = { score: number; metres: number; nearMisses: number; maxCombo: number; level: number; crash: CrashKind; seed: number; newBest: boolean };

export function ChickenCrossingGame({ challenge }: { challenge: Challenge }) {
  const { lang } = useI18n();
  const best = useSyncExternalStore(bestStore.subscribe, bestStore.read, () => 0);

  const [phase, setPhase] = useState<Phase>("idle");
  const [seed, setSeed] = useState<number | null>(challenge?.seed ?? null);
  const [count, setCount] = useState<number | null>(0);
  const [combo, setCombo] = useState(0);
  const [level, setLevel] = useState(0);
  const [banner, setBanner] = useState<{ id: number; text: string } | null>(null);
  const [pop, setPop] = useState<{ id: number; text: Text; x: number; y: number } | null>(null);
  const [rain, setRain] = useState(false);
  const [dhaka, setDhaka] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const chickenRef = useRef<HTMLSpanElement>(null);
  const rowPoolRef = useRef<(HTMLSpanElement | null)[]>([]);
  const vehPoolRef = useRef<(HTMLSpanElement | null)[]>([]);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const distRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moveRef = useRef<((dir: Dir) => void) | null>(null);
  const swipeRef = useRef<{ x: number; y: number } | null>(null);

  // ----- Game loop -----
  useEffect(() => {
    if (phase !== "playing" || seed === null) return;
    const stage = stageRef.current;
    const chicken = chickenRef.current;
    const scoreEl = scoreRef.current;
    const distEl = distRef.current;
    const rowPool = rowPoolRef.current;
    const vehPool = vehPoolRef.current;
    if (!stage || !chicken || !scoreEl || !distEl) return;

    const reduce = prefersReducedMotion();
    const sim = createSim(seed);
    const rowSlots = new Map<number, number>();
    const rowFree = Array.from({ length: ROW_POOL }, (_, i) => ROW_POOL - 1 - i);
    const vehSlots = new Map<number, number>();
    const vehFree = Array.from({ length: VEH_POOL }, (_, i) => VEH_POOL - 1 - i);
    const vehicles = new Map<number, Vehicle>();
    const timers: number[] = [];
    let u = stage.clientWidth / COLS;
    let popId = 0;
    let bannerId = 0;
    // Hop tween (visual only; the sim moves instantly on the grid).
    let hopFrom = { col: sim.col, row: sim.row };
    let hopAt = -Infinity;

    const yOf = (row: number) => (VIEW - 1 - (row - sim.camY)) * u;

    const hud = () => {
      scoreEl.textContent = num(score(sim), lang);
      distEl.textContent = fmt(t(copy.metres, lang), { n: num(distanceMetres(sim), lang) });
    };

    const sizeVeh = (el: HTMLSpanElement, v: Vehicle) => {
      el.style.width = `${v.w * u}px`;
      el.style.height = `${0.78 * u}px`;
      el.style.fontSize = `${(v.kind === "bus" ? 0.62 : v.kind === "pedestrian" || v.kind === "dog" ? 0.66 : 0.52) * u}px`;
    };
    const sizeAll = () => {
      chicken.style.width = `${u}px`;
      chicken.style.height = `${u}px`;
      chicken.style.fontSize = `${0.68 * u}px`;
      for (const slot of rowSlots.values()) {
        const el = rowPool[slot];
        if (el) el.style.height = `${u + 1}px`;
      }
      for (const [id, slot] of vehSlots) {
        const el = vehPool[slot];
        const v = vehicles.get(id);
        if (el && v) sizeVeh(el, v);
      }
    };

    const addLane = (lane: Lane) => {
      const slot = rowFree.pop();
      if (slot === undefined) return;
      const el = rowPool[slot];
      if (!el) return;
      rowSlots.set(lane.row, slot);
      el.className = `pointer-events-none absolute inset-x-0 top-0 block will-change-transform ${ROW_CLASS[lane.plan.kind]}`;
      el.style.height = `${u + 1}px`;
      el.style.display = "block";
    };
    const removeLane = (row: number) => {
      const slot = rowSlots.get(row);
      if (slot === undefined) return;
      const el = rowPool[slot];
      if (el) el.style.display = "none";
      rowSlots.delete(row);
      rowFree.push(slot);
    };
    const spawn = (v: Vehicle) => {
      const slot = vehFree.pop();
      if (slot === undefined) return;
      const el = vehPool[slot];
      if (!el) return;
      vehSlots.set(v.id, slot);
      vehicles.set(v.id, v);
      const look = looks[v.kind];
      const tile = document.createElement("span");
      tile.className = `flex h-full w-full items-center justify-center leading-none ${look.className} ${look.className ? "shadow-pop" : ""}`;
      const emoji = document.createElement("span");
      emoji.textContent = look.emoji;
      // Emoji face left; mirror the ones heading right.
      if (v.v > 0) emoji.style.transform = "scaleX(-1)";
      tile.append(emoji);
      el.replaceChildren(tile);
      sizeVeh(el, v);
      el.style.display = "block";
    };
    const despawn = (id: number) => {
      const slot = vehSlots.get(id);
      if (slot === undefined) return;
      const el = vehPool[slot];
      if (el) {
        el.style.display = "none";
        el.replaceChildren();
      }
      vehSlots.delete(id);
      vehicles.delete(id);
      vehFree.push(slot);
    };

    const render = (now: number) => {
      for (const [row, slot] of rowSlots) {
        const el = rowPool[slot];
        if (el) el.style.transform = `translate3d(0,${yOf(row)}px,0)`;
      }
      for (const [id, slot] of vehSlots) {
        const el = vehPool[slot];
        const v = vehicles.get(id);
        if (el && v) el.style.transform = `translate3d(${v.x * u}px,${yOf(v.row) + 0.11 * u}px,0)`;
      }
      const k = reduce ? 1 : Math.min(1, (now - hopAt) / HOP_MS);
      const col = hopFrom.col + (sim.col - hopFrom.col) * k;
      const row = hopFrom.row + (sim.row - hopFrom.row) * k;
      const lift = reduce ? 0 : Math.sin(k * Math.PI) * 0.22 * u;
      chicken.style.transform = `translate3d(${col * u}px,${yOf(row) - lift}px,0)`;
    };

    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));
    const showBanner = (text: string) => {
      const id = ++bannerId;
      setBanner({ id, text });
      later(() => setBanner((b) => (b?.id === id ? null : b)), BANNER_MS);
    };

    const handle = (r: StepResult) => {
      r.lanesAdded.forEach(addLane);
      r.lanesRemoved.forEach(removeLane);
      r.spawned.forEach(spawn);
      r.removed.forEach(despawn);
      if (r.nearMiss) {
        popId += 1;
        setCombo(r.nearMiss.combo);
        setPop({ id: popId, text: pickLine(nearMissWords, seed, `near-${popId}`), x: (sim.col + 0.5) / COLS, y: yOf(sim.row) / (VIEW * u) });
      }
      if (r.comboReset) setCombo(0);
      if (r.event) {
        showBanner(t(eventBanners[r.event], lang));
        if (r.event === "rain") setRain(true);
        if (r.event === "dhaka-mode") setDhaka(true);
      }
      if (r.rainEnded) setRain(false);
      if (r.dhakaEnded) setDhaka(false);
      if (r.levelUp !== null) {
        const n = r.levelUp;
        setLevel(n);
        showBanner(fmt(t(copy.levelUp, lang), { n: num(n + 1, lang), name: t(levelName(n), lang) }));
      }
      if (r.crash) {
        setCrashed(true);
        if (!reduce) {
          stage.animate([{ translate: "0 0" }, { translate: "-7px 2px" }, { translate: "6px -2px" }, { translate: "-3px 0" }, { translate: "0 0" }], {
            duration: 300,
          });
        }
        try {
          navigator.vibrate?.(80);
        } catch {
          // vibration unsupported
        }
      }
    };

    const finish = () => {
      const points = score(sim);
      const prev = bestStore.read();
      if (points > prev) bestStore.write(points);
      const crash = sim.crashed?.kind ?? "left-behind";
      const lv = levelOf(sim.maxRow);
      setResult({ score: points, metres: distanceMetres(sim), nearMisses: sim.nearMisses, maxCombo: sim.maxCombo, level: lv, crash, seed, newBest: points > prev });
      setPhase("over");
      track("game_complete", { game: GAME_SLUG, score: points, rank: rankFor(points), level: lv + 1, near: sim.nearMisses, crash });
    };

    let pre = COUNTDOWN_MS;
    let lastCount: number | null = 0;

    moveRef.current = (dir) => {
      if (pre > 0) return;
      const from = { col: sim.col, row: sim.row };
      if (move(sim, dir)) {
        hopFrom = from;
        hopAt = performance.now();
      }
    };

    const KEYS: Record<string, Dir> = {
      arrowup: "up",
      w: "up",
      " ": "up",
      arrowdown: "down",
      s: "down",
      arrowleft: "left",
      a: "left",
      arrowright: "right",
      d: "right",
    };
    const onKey = (e: KeyboardEvent) => {
      const dir = KEYS[e.key.toLowerCase()];
      if (!dir) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, a, button:not([data-hop])")) return;
      e.preventDefault();
      if (!e.repeat) moveRef.current?.(dir);
    };
    window.addEventListener("keydown", onKey);

    const ro = new ResizeObserver(() => {
      u = stage.clientWidth / COLS;
      sizeAll();
      render(performance.now());
    });
    ro.observe(stage);

    for (const lane of sim.lanes.values()) {
      addLane(lane);
      lane.vehicles.forEach(spawn);
    }
    sizeAll();
    render(performance.now());
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

      // Fixed-step simulation: identical traffic on every device.
      acc += dt;
      let steps = 0;
      while (acc >= STEP_MS && steps < 4) {
        acc -= STEP_MS;
        steps += 1;
        handle(step(sim));
        if (sim.crashed) break;
      }
      if (steps === 4) acc = 0;
      render(now);
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
      for (const el of [...rowPool, ...vehPool]) {
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
    setLevel(0);
    setBanner(null);
    setPop(null);
    setRain(false);
    setDhaka(false);
    setCrashed(false);
    setResult(null);
    setPhase("playing");
    track(kind === "first" ? "game_start" : "game_retry", { game: GAME_SLUG, mode: kind });
    rootRef.current?.scrollIntoView({ block: "start", behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }

  const isChallenge = challenge !== null && seed === challenge.seed;
  const mult = multiplier(combo);

  const hopButton = (dir: Dir, glyph: string, label: Text, extra = "") => (
    <button
      type="button"
      data-hop
      aria-label={t(label, lang)}
      onPointerDown={(e) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        e.preventDefault();
        moveRef.current?.(dir);
      }}
      onClick={(e) => {
        if (e.detail === 0) moveRef.current?.(dir); // keyboard / assistive tech
      }}
      className={`${btnPrimary} min-h-14 touch-manipulation select-none px-0 text-2xl ${extra}`}
    >
      <span aria-hidden>{glyph}</span>
    </button>
  );

  return (
    <div ref={rootRef} className="scroll-mt-4">
      {phase === "idle" && (
        <section className={`${card} p-5 sm:p-6`} aria-labelledby="cc-how">
          {isChallenge && <ChallengeBanner challenge={challenge} />}
          <p aria-hidden className="text-center text-6xl motion-safe:animate-wiggle">
            🐔
          </p>
          <h2 id="cc-how" className="mt-2 font-display text-2xl font-extrabold">
            {t(copy.howTitle, lang)}
          </h2>
          <ol className="mt-3 grid gap-2">
            {copy.how.map((item, i) => (
              <li key={i} className="flex gap-3">
                <span aria-hidden className="grid size-7 shrink-0 place-items-center rounded-full border-2 border-ink bg-marigold text-sm font-extrabold">
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
            <button type="button" onClick={() => start(seed ?? newSeed(), "first")} className={`${btnPrimary} ${accentBg.marigold} w-full sm:w-auto`}>
              🐔 {t(copy.start, lang)}
            </button>
          </div>
        </section>
      )}

      {phase === "playing" && (
        <section aria-label={t(copy.stageLabel, lang)}>
          <div className="grid grid-cols-4 gap-1.5">
            <HudTile label={t(copy.score, lang)}>
              <span ref={scoreRef} className="tabular-nums" />
            </HudTile>
            <HudTile label={t(copy.distance, lang)} small>
              <span ref={distRef} className="tabular-nums" />
            </HudTile>
            <HudTile label={t(copy.combo, lang)} highlight={mult > 1}>
              <span className="tabular-nums">×{num(mult, lang)}</span>
            </HudTile>
            <HudTile label={t(copy.level, lang)} highlight={dhaka}>
              <span className="tabular-nums">{num(level + 1, lang)}</span>
            </HudTile>
          </div>
          <p className="mt-2 text-center text-sm font-extrabold" aria-live="polite">
            🗺️ {t(levelName(level), lang)}
          </p>

          <div
            ref={stageRef}
            role="application"
            aria-label={t(copy.stageLabel, lang)}
            tabIndex={0}
            onPointerDown={(e) => {
              if (e.pointerType === "mouse" && e.button !== 0) return;
              swipeRef.current = { x: e.clientX, y: e.clientY };
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerUp={(e) => {
              const s = swipeRef.current;
              swipeRef.current = null;
              if (!s) return;
              const dx = e.clientX - s.x;
              const dy = e.clientY - s.y;
              // A tap hops forward; a swipe hops in its main direction.
              if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return moveRef.current?.("up");
              if (Math.abs(dx) > Math.abs(dy)) moveRef.current?.(dx < 0 ? "left" : "right");
              else moveRef.current?.(dy < 0 ? "up" : "down");
            }}
            onPointerCancel={() => {
              swipeRef.current = null;
            }}
            className={`relative mx-auto mt-2 aspect-[7/11] w-full max-w-[calc(58dvh*7/11)] cursor-pointer touch-none select-none overflow-hidden rounded-card border-2 bg-[#3b3548] shadow-pop outline-none focus-visible:outline-3 focus-visible:outline-offset-2 ${
              dhaka ? "border-chili ring-4 ring-chili/60" : "border-ink"
            }`}
          >
            {Array.from({ length: ROW_POOL }, (_, i) => (
              <span
                key={`r${i}`}
                aria-hidden
                ref={(el) => {
                  rowPoolRef.current[i] = el;
                }}
                style={{ display: "none" }}
              />
            ))}
            {Array.from({ length: VEH_POOL }, (_, i) => (
              <span
                key={`v${i}`}
                aria-hidden
                ref={(el) => {
                  vehPoolRef.current[i] = el;
                }}
                style={{ display: "none" }}
                className="pointer-events-none absolute left-0 top-0 will-change-transform"
              />
            ))}
            <span ref={chickenRef} aria-hidden className="pointer-events-none absolute left-0 top-0 grid place-items-center leading-none will-change-transform">
              <span className="drop-shadow-[2px_2px_0_rgb(26_19_37)]">{crashed ? "💥" : "🐔"}</span>
            </span>
            {rain && (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 block bg-sky/20 bg-[repeating-linear-gradient(105deg,transparent_0_14px,rgb(255_255_255/0.22)_14px_16px)]"
              />
            )}
            {pop && <NearPop key={pop.id} x={pop.x} y={pop.y} text={t(pop.text, lang)} />}
            {banner && (
              <span className="pointer-events-none absolute inset-x-3 top-3 block rotate-[-1.5deg] rounded-xl border-2 border-ink bg-marigold px-3 py-1.5 text-center text-sm font-extrabold shadow-pop">
                {banner.text}
              </span>
            )}
            {crashed && (
              <span className="pointer-events-none absolute inset-0 grid place-items-center bg-ink/30">
                <span className="rotate-[-4deg] rounded-2xl border-2 border-ink bg-chili px-6 py-2 font-display text-4xl font-black shadow-pop-lg">
                  {t(copy.splat, lang)}
                </span>
              </span>
            )}
            {count !== null && (
              <span className="pointer-events-none absolute inset-0 grid place-items-center bg-ink/30">
                <span className="rotate-[-3deg] rounded-2xl border-2 border-ink bg-marigold px-6 py-2 font-display text-5xl font-black shadow-pop-lg">
                  {t(copy.countdown[count] ?? copy.splat, lang)}
                </span>
              </span>
            )}
          </div>

          {/* D-pad: ◀ ▲ ▶ with ▼ under ▲ */}
          <div className="mx-auto mt-3 grid max-w-[calc(58dvh*7/11)] grid-cols-3 gap-2">
            {hopButton("left", "◀", copy.left, "bg-surface")}
            {hopButton("up", "▲", copy.up, accentBg.marigold)}
            {hopButton("right", "▶", copy.right, "bg-surface")}
            <span />
            {hopButton("down", "▼", copy.down, "bg-surface min-h-11 text-lg")}
            <span />
          </div>
        </section>
      )}

      {phase === "over" && result && (
        <ResultView result={result} challenge={challenge} headingRef={headingRef} onRetry={() => start(newSeed(), "retry")} onReplay={() => start(result.seed, "replay")} />
      )}
    </div>
  );
}

/** "PHEW!" sticker that pops once at the chicken (skipped with reduced motion). */
function NearPop({ x, y, text }: { x: number; y: number; text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const anim = el.animate(
      [
        { opacity: 0, scale: 0.6, translate: "-50% 6px" },
        { opacity: 1, scale: 1.1, translate: "-50% -6px", offset: 0.3 },
        { opacity: 0, scale: 1, translate: "-50% -26px" },
      ],
      { duration: 650, easing: "ease-out", fill: "forwards" },
    );
    return () => anim.cancel();
  }, []);
  return (
    <span
      ref={ref}
      aria-hidden
      style={{ left: `${Math.min(0.8, Math.max(0.2, x)) * 100}%`, top: `${Math.max(0.05, y - 0.08) * 100}%` }}
      className="pointer-events-none absolute -translate-x-1/2 -rotate-6 whitespace-nowrap rounded-xl border-2 border-ink bg-lime px-3 py-1 font-display text-lg font-black shadow-pop"
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
  onRetry,
  onReplay,
}: {
  result: Result;
  challenge: Challenge;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onRetry: () => void;
  onReplay: () => void;
}) {
  const { lang } = useI18n();
  const origin = useOrigin();
  const host = useHost();

  const rankId = rankFor(result.score);
  const rank = ranks[rankId];
  const message = fmt(t(copy.shareText, lang), {
    m: num(result.metres, lang),
    score: num(result.score, lang),
    near: num(result.nearMisses, lang),
    title: t(rank.title, lang),
    emoji: rank.emoji,
  });

  const stats = [
    { key: "score", label: copy.statScore, value: num(result.score, lang) },
    { key: "dist", label: copy.statDistance, value: fmt(t(copy.metres, lang), { n: num(result.metres, lang) }) },
    { key: "near", label: copy.statNear, value: num(result.nearMisses, lang) },
    { key: "level", label: copy.statLevel, value: `${num(result.level + 1, lang)} · ${t(levelName(result.level), lang)}` },
  ];

  const card: ResultCardData = {
    game: t(gameInfo.title, lang),
    emoji: gameInfo.emoji,
    accent: rank.accent,
    headline: `${num(result.score, lang)} ${t(copy.pts, lang)}`,
    title: t(rank.title, lang),
    titleEmoji: rank.emoji,
    blurb: t(rank.blurb, lang),
    quote: t(crashLines[result.crash], lang),
    stats: stats.map((st) => ({ label: t(st.label, lang), value: st.value })),
    path: `/games/${GAME_SLUG}`,
  };
  const url = `${origin}${challengePath({ game: GAME_SLUG, seed: result.seed, score: result.score }) ?? `/games/${GAME_SLUG}`}`;

  return (
    <section className="grid gap-3" aria-labelledby="cc-result">
      <ResultCard data={card} host={host} headingId="cc-result" headingRef={headingRef}>
        {result.newBest && <p className="text-center font-extrabold text-cng-deep">{t(copy.newBest, lang)}</p>}
        <ChallengeOutcome challenge={challenge} seed={result.seed} score={result.score} />
        <p className="text-center text-xs font-bold text-ink-muted">
          {t(copy.roadCode, lang)}: <code className="font-mono">{encodeSeed(result.seed)}</code>
        </p>
      </ResultCard>
      <ResultShareKit data={card} url={url} fileName={`${GAME_SLUG}-result`} onShared={(method) => track("game_share", { game: GAME_SLUG, method, rank: rankId })} />
      <ShareActions game={GAME_SLUG} seed={result.seed} score={result.score} text={message} accent={rank.accent} rank={rankId} />
      <button type="button" onClick={onRetry} className={`${btnPrimary} ${accentBg.marigold}`}>
        {t(copy.retry, lang)}
      </button>
      <button type="button" onClick={onReplay} className={btnGhost}>
        {t(copy.replay, lang)}
      </button>
    </section>
  );
}
