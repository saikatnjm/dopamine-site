"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type PointerEvent as ReactPointerEvent, type ReactNode, type RefObject } from "react";
import { ChallengeBanner, ChallengeOutcome, ResultStamp, ShareActions } from "@/components/games/challenge-ui";
import { useI18n } from "@/components/providers/lang-provider";
import { accentBg, btnGhost, btnPrimary, card } from "@/components/ui/styles";
import { eventBanners, hazardLooks, teaCopy as copy, teaRanks } from "@/data/games/tea-balance";
import { track } from "@/lib/analytics";
import type { FriendChallenge } from "@/lib/challenge";
import { createBestStore, encodeSeed, prefersReducedMotion } from "@/lib/games/shared";
import {
  CART,
  DELIVER_MS,
  GAME_SLUG,
  SPILL_ANGLE,
  STEP_MS,
  createSim,
  nudge,
  pickLine,
  rankFor,
  score,
  setTarget,
  step,
  type Hazard,
  type StepResult,
} from "@/lib/games/tea-balance";
import { fmt, num, t, type Text } from "@/lib/i18n/core";
import { newSeed } from "@/lib/random";

const bestStore = createBestStore(`hottogol:${GAME_SLUG}:best`);

/** Max hazards on screen at once. DOM nodes are reused. */
const POOL = 16;
const DROPS = 8;
const COUNTDOWN_MS = 1500;
const END_MS = 900;
const BANNER_MS = 2200;
const DASH = 40;
/** Wobble meter spans ±this angle. */
const METER_RANGE = 0.7;

type Phase = "idle" | "playing" | "over";
type Challenge = FriendChallenge | null;
type Result = { score: number; seconds: number; tea: number; hits: number; delivered: boolean; seed: number; newBest: boolean };

export function TeaBalanceGame({ challenge }: { challenge: Challenge }) {
  const { lang } = useI18n();
  const best = useSyncExternalStore(bestStore.subscribe, bestStore.read, () => 0);

  const [phase, setPhase] = useState<Phase>("idle");
  const [seed, setSeed] = useState<number | null>(challenge?.seed ?? null);
  const [count, setCount] = useState<number | null>(0);
  const [banner, setBanner] = useState<{ id: number; text: Text } | null>(null);
  const [fx, setFx] = useState<{ id: number; text: Text; x: number } | null>(null);
  const [line, setLine] = useState<Text | null>(null);
  const [ending, setEnding] = useState<"spilled" | "delivered" | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLSpanElement>(null);
  const cupRef = useRef<HTMLSpanElement>(null);
  const dashRef = useRef<HTMLSpanElement>(null);
  const meterRef = useRef<HTMLSpanElement>(null);
  const teaBarRef = useRef<HTMLSpanElement>(null);
  const teaTextRef = useRef<HTMLSpanElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const poolRef = useRef<(HTMLSpanElement | null)[]>([]);
  const dropRef = useRef<(HTMLSpanElement | null)[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  /** Input shared with the loop: pointer target (0–1) and held direction. */
  const inputRef = useRef<{ pointer: number | null; keyDir: number; buttonDir: number }>({ pointer: null, keyDir: 0, buttonDir: 0 });

  // ----- Game loop -----
  useEffect(() => {
    if (phase !== "playing" || seed === null) return;
    const stage = stageRef.current;
    const cart = cartRef.current;
    const cup = cupRef.current;
    const dash = dashRef.current;
    const meter = meterRef.current;
    const teaBar = teaBarRef.current;
    const teaText = teaTextRef.current;
    const timeEl = timeRef.current;
    const pool = poolRef.current;
    const drops = dropRef.current;
    if (!stage || !cart || !cup || !dash || !meter || !teaBar || !teaText || !timeEl) return;

    const reduce = prefersReducedMotion();
    const sim = createSim(seed);
    const input = inputRef.current;
    input.pointer = null;
    input.keyDir = 0;
    input.buttonDir = 0;
    const slots = new Map<number, number>();
    const free = Array.from({ length: POOL }, (_, i) => POOL - 1 - i);
    const timers: number[] = [];
    let W = stage.clientWidth;
    let H = stage.clientHeight;
    let fxId = 0;
    let bannerId = 0;
    let dropIdx = 0;
    let lastDrop = 0;

    const hud = () => {
      const tea = Math.round(sim.tea);
      teaText.textContent = `${num(tea, lang)}%`;
      teaBar.style.transform = `scaleX(${sim.tea / 100})`;
      teaBar.style.backgroundColor = sim.tea > 50 ? "var(--marigold)" : sim.tea > 25 ? "var(--tangerine)" : "var(--chili)";
      timeEl.textContent = fmt(t(copy.seconds, lang), { n: num(Math.floor(sim.t / 1000), lang) });
    };

    const sizeHazard = (el: HTMLSpanElement, h: Hazard) => {
      el.style.width = `${h.w * W}px`;
      el.style.height = `${h.h * H}px`;
      el.style.fontSize = `${Math.min(h.w * W, h.h * H) * 0.8}px`;
    };

    const sizeAll = () => {
      cart.style.width = `${CART.w * W}px`;
      cart.style.height = `${CART.h * H}px`;
      cart.style.fontSize = `${CART.h * H * 0.62}px`;
      for (const h of sim.hazards) {
        const slot = slots.get(h.id);
        const el = slot === undefined ? null : pool[slot];
        if (el) sizeHazard(el, h);
      }
    };

    const render = () => {
      cart.style.transform = `translate3d(${(sim.x - CART.w / 2) * W}px,${CART.y * H}px,0)`;
      cup.style.transform = `rotate(${sim.angle * 55}deg)`;
      const m = Math.max(-1, Math.min(1, sim.angle / METER_RANGE));
      // Wrapper spans the meter's width, so ±50% = the meter's edges.
      meter.style.transform = `translateX(${m * 50}%)`;
      const dot = meter.firstElementChild as HTMLElement | null;
      if (dot) dot.style.backgroundColor = Math.abs(sim.angle) > SPILL_ANGLE ? "var(--chili-deep)" : "var(--ink)";
      for (const h of sim.hazards) {
        const slot = slots.get(h.id);
        const el = slot === undefined ? null : pool[slot];
        if (el) el.style.transform = `translate3d(${(h.x - h.w / 2) * W}px,${h.y * H}px,0)`;
      }
      if (!reduce) dash.style.transform = `translate3d(0,${((sim.dist * H) % DASH) - DASH}px,0)`;
    };

    const spawn = (h: Hazard) => {
      const slot = free.pop();
      if (slot === undefined) return;
      const el = pool[slot];
      if (!el) return;
      slots.set(h.id, slot);
      const look = hazardLooks[h.kind];
      const tile = document.createElement("span");
      tile.className = `flex h-full w-full items-center justify-center leading-none ${look.className}`;
      tile.textContent = look.emoji;
      el.replaceChildren(tile);
      sizeHazard(el, h);
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

    const splash = () => {
      if (reduce || sim.t - lastDrop < 70) return;
      lastDrop = sim.t;
      const el = drops[dropIdx % DROPS];
      dropIdx += 1;
      if (!el) return;
      const side = sim.angle > 0 ? 1 : -1;
      const x0 = sim.x * W;
      const y0 = (CART.y + 0.02) * H;
      const dx = side * (18 + (dropIdx % 3) * 10);
      el.animate(
        [
          { opacity: 1, transform: `translate3d(${x0}px,${y0}px,0) scale(1)` },
          { opacity: 0, transform: `translate3d(${x0 + dx}px,${y0 + 28}px,0) scale(0.6)` },
        ],
        { duration: 420, easing: "ease-out" },
      );
    };

    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));

    const handle = (r: StepResult) => {
      r.spawned.forEach(spawn);
      r.removed.forEach(despawn);
      if (r.hit) {
        fxId += 1;
        const look = hazardLooks[r.hit.kind];
        setFx({ id: fxId, text: look.sound, x: sim.x });
        setLine(look.line);
        if (!reduce) {
          stage.animate([{ translate: "0 0" }, { translate: "0 4px" }, { translate: "0 -2px" }, { translate: "0 0" }], { duration: 220 });
        }
      }
      if (r.event) {
        const id = ++bannerId;
        const text = eventBanners[r.event];
        setBanner({ id, text });
        setLine(text);
        later(() => setBanner((b) => (b?.id === id ? null : b)), BANNER_MS);
      }
      if (r.spill > 0) splash();
      if (r.over) {
        setEnding(sim.delivered ? "delivered" : "spilled");
        if (!sim.delivered) {
          try {
            navigator.vibrate?.(80);
          } catch {
            // vibration unsupported
          }
        }
      }
    };

    const finish = () => {
      const points = score(sim);
      const prev = bestStore.read();
      if (points > prev) bestStore.write(points);
      setResult({
        score: points,
        seconds: Math.floor(sim.t / 1000),
        tea: Math.round(sim.tea),
        hits: sim.hits,
        delivered: sim.delivered,
        seed,
        newBest: points > prev,
      });
      setPhase("over");
      track("game_complete", { game: GAME_SLUG, score: points, rank: rankFor(points), seconds: Math.floor(sim.t / 1000), delivered: sim.delivered });
    };

    // Keyboard: hold ← → / A D.
    const pressed = new Set<number>();
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const dir = k === "arrowleft" || k === "a" ? -1 : k === "arrowright" || k === "d" ? 1 : 0;
      if (dir === 0) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select")) return;
      e.preventDefault();
      if (e.type === "keydown") pressed.add(dir);
      else pressed.delete(dir);
      input.keyDir = (pressed.has(1) ? 1 : 0) - (pressed.has(-1) ? 1 : 0);
      if (input.keyDir !== 0) input.pointer = null; // keys take over from the pointer
    };
    const onBlur = () => {
      pressed.clear();
      input.keyDir = 0;
      input.buttonDir = 0;
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    window.addEventListener("blur", onBlur);

    const ro = new ResizeObserver(() => {
      W = stage.clientWidth;
      H = stage.clientHeight;
      sizeAll();
      render();
    });
    ro.observe(stage);

    sizeAll();
    render();
    hud();
    stage.focus({ preventScroll: true });

    let pre = COUNTDOWN_MS;
    let lastCount: number | null = 0;
    let raf = 0;
    let acc = 0;
    let endT = 0;
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

      if (sim.over) {
        endT += dt;
        if (endT >= END_MS) return finish();
        raf = requestAnimationFrame(tick);
        return;
      }

      // Fixed-step simulation keeps the road identical on every device.
      acc += dt;
      let steps = 0;
      while (acc >= STEP_MS && steps < 4) {
        acc -= STEP_MS;
        steps += 1;
        if (input.pointer !== null) setTarget(sim, input.pointer);
        nudge(sim, input.keyDir || input.buttonDir);
        handle(step(sim));
        if (sim.over) break;
      }
      if (steps === 4) acc = 0;
      render();
      if (now - lastHud > 100 || sim.over) {
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
      window.removeEventListener("keyup", onKey);
      window.removeEventListener("blur", onBlur);
      timers.forEach((id) => window.clearTimeout(id));
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
    setBanner(null);
    setFx(null);
    setLine(null);
    setEnding(null);
    setResult(null);
    setPhase("playing");
    track(kind === "first" ? "game_start" : "game_retry", { game: GAME_SLUG, mode: kind });
    rootRef.current?.scrollIntoView({ block: "start", behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }

  /** Shared "Challenge a friend" actions for a finished round. */
  function shareActions(r: Result) {
    const rank = teaRanks[rankFor(r.score)];
    const text = fmt(t(copy.shareText, lang), { title: t(rank.title, lang), score: num(r.score, lang), time: num(r.seconds, lang) });
    return <ShareActions game={GAME_SLUG} seed={r.seed} score={r.score} text={text} accent={rank.accent} rank={rank.id} />;
  }

  /** Pointer x over the stage → target (0–1). */
  function pointTo(e: ReactPointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    inputRef.current.pointer = (e.clientX - rect.left) / rect.width;
  }

  const holdButton = (dir: -1 | 1) => (
    <button
      type="button"
      aria-label={t(dir === -1 ? copy.left : copy.right, lang)}
      onPointerDown={(e) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        inputRef.current.pointer = null;
        inputRef.current.buttonDir = dir;
      }}
      onPointerUp={() => {
        inputRef.current.buttonDir = 0;
      }}
      onPointerCancel={() => {
        inputRef.current.buttonDir = 0;
      }}
      onContextMenu={(e) => e.preventDefault()}
      className={`${btnPrimary} min-h-14 touch-none select-none bg-surface text-2xl`}
    >
      <span aria-hidden>{dir === -1 ? "◀" : "▶"}</span>
    </button>
  );

  const isChallenge = challenge !== null && seed === challenge.seed;

  return (
    <div ref={rootRef} className="scroll-mt-4">
      {phase === "idle" && (
        <section className={`${card} p-5 sm:p-6`} aria-labelledby="tea-how">
          {isChallenge && <ChallengeBanner challenge={challenge} />}
          <h2 id="tea-how" className="font-display text-2xl font-extrabold">
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
            <button type="button" onClick={() => start(seed ?? newSeed(), "first")} className={`${btnPrimary} ${accentBg.marigold} w-full sm:w-auto`}>
              ☕ {t(copy.start, lang)}
            </button>
          </div>
        </section>
      )}

      {phase === "playing" && (
        <section aria-label={t(copy.roadLabel, lang)}>
          <div className="grid grid-cols-2 gap-2">
            <HudTile label={t(copy.time, lang)}>
              <span ref={timeRef} className="tabular-nums" />
              <span className="text-sm font-bold text-ink-muted"> / {num(DELIVER_MS / 1000, lang)}</span>
            </HudTile>
            <HudTile label={t(copy.tea, lang)}>
              <span ref={teaTextRef} className="tabular-nums" />
              <span className="mt-1 block h-2.5 overflow-hidden rounded-pill border-2 border-ink bg-surface">
                <span ref={teaBarRef} className="block h-full origin-left" />
              </span>
            </HudTile>
          </div>

          {/* Wobble meter: marker must stay in the middle (safe) zone. */}
          <div className="mx-auto mt-3 max-w-[calc(56dvh*3/4)]">
            <p className="mb-1 text-center text-[11px] font-extrabold uppercase tracking-wider text-ink-muted">{t(copy.wobble, lang)}</p>
            <div aria-hidden className="relative h-4 overflow-hidden rounded-pill border-2 border-ink bg-chili/60">
              <span
                className="absolute inset-y-0 left-1/2 block -translate-x-1/2 bg-lime"
                style={{ width: `${(SPILL_ANGLE / METER_RANGE) * 100}%` }}
              />
              <span ref={meterRef} className="absolute inset-y-0 left-1/2 block w-full">
                <span className="absolute inset-y-0 -left-1 block w-2 rounded-pill bg-ink" />
              </span>
            </div>
          </div>

          <div
            ref={stageRef}
            role="application"
            aria-label={t(copy.roadLabel, lang)}
            tabIndex={0}
            onPointerDown={(e) => {
              if (e.pointerType === "mouse" && e.button !== 0) return;
              e.currentTarget.setPointerCapture(e.pointerId);
              pointTo(e);
            }}
            onPointerMove={(e) => {
              // Mouse steers on hover; touch/pen steer while pressed.
              if (e.pointerType === "mouse" || e.buttons > 0) pointTo(e);
            }}
            className="relative mx-auto mt-2 aspect-[3/4] w-full max-w-[calc(56dvh*3/4)] cursor-ew-resize touch-none select-none overflow-hidden rounded-card border-2 border-ink bg-[#5b5566] shadow-pop"
          >
            {/* Kerbs + centre line (scrolled via transform) */}
            <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 block w-2 bg-[repeating-linear-gradient(180deg,#fff3d6_0_20px,#ff5c93_20px_40px)]" />
            <span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 block w-2 bg-[repeating-linear-gradient(180deg,#fff3d6_0_20px,#ff5c93_20px_40px)]" />
            <span ref={dashRef} aria-hidden className="pointer-events-none absolute inset-x-0 top-0 block h-[calc(100%+40px)]">
              <span className="absolute left-1/2 top-0 block h-full w-1 -translate-x-1/2 bg-[repeating-linear-gradient(180deg,#fff3d6_0_20px,transparent_20px_40px)] opacity-50" />
            </span>
            {/* Hazard pool */}
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
            {/* Splash drops */}
            {Array.from({ length: DROPS }, (_, i) => (
              <span
                key={`d${i}`}
                aria-hidden
                ref={(el) => {
                  dropRef.current[i] = el;
                }}
                className="pointer-events-none absolute left-0 top-0 block size-2.5 rounded-full bg-[#b5651d] opacity-0"
              />
            ))}
            {/* Cart with the cup */}
            <span
              ref={cartRef}
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 grid place-items-center rounded-xl border-2 border-ink bg-marigold shadow-pop will-change-transform"
            >
              <span ref={cupRef} className="block origin-bottom leading-none">
                {ending === "spilled" ? "💦" : "☕"}
              </span>
            </span>
            {fx && <SoundPop key={fx.id} x={fx.x} text={t(fx.text, lang)} />}
            {banner && (
              <span className="pointer-events-none absolute inset-x-3 top-3 block rotate-[-1.5deg] rounded-xl border-2 border-ink bg-marigold px-3 py-1.5 text-center text-sm font-extrabold shadow-pop">
                {t(banner.text, lang)}
              </span>
            )}
            {ending && (
              <span className="pointer-events-none absolute inset-0 grid place-items-center bg-ink/30">
                <span
                  className={`rotate-[-4deg] rounded-2xl border-2 border-ink px-6 py-2 font-display text-3xl font-black shadow-pop-lg ${
                    ending === "delivered" ? "bg-lime" : "bg-chili"
                  }`}
                >
                  {t(ending === "delivered" ? copy.delivered : copy.spillBanner, lang)}
                </span>
              </span>
            )}
            {count !== null && (
              <span className="pointer-events-none absolute inset-0 grid place-items-center bg-ink/30">
                <span className="rotate-[-3deg] rounded-2xl border-2 border-ink bg-marigold px-6 py-2 font-display text-4xl font-black shadow-pop-lg">
                  {t(copy.countdown[count] ?? copy.start, lang)}
                </span>
              </span>
            )}
          </div>

          <div className="mx-auto mt-3 grid max-w-[calc(56dvh*3/4)] grid-cols-2 gap-3">
            {holdButton(-1)}
            {holdButton(1)}
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
          onRetry={() => start(newSeed(), "retry")}
          onReplay={() => start(result.seed, "replay")}
          share={shareActions(result)}
        />
      )}
    </div>
  );
}

/** Sticker "sound" that pops once on mount (skipped with reduced motion). */
function SoundPop({ x, text }: { x: number; text: string }) {
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
      className="pointer-events-none absolute bottom-[26%] -translate-x-1/2 -rotate-6 whitespace-nowrap rounded-xl border-2 border-ink bg-chili px-3 py-1 font-display text-lg font-black shadow-pop"
    >
      {text}
    </span>
  );
}

function HudTile({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-ink bg-surface px-2 py-1.5 text-center shadow-pop">
      <p className="text-[11px] font-extrabold uppercase tracking-wider text-ink-muted">{label}</p>
      <p className="font-display text-2xl font-extrabold leading-tight">{children}</p>
    </div>
  );
}

function ResultView({
  result,
  challenge,
  headingRef,
  onRetry,
  onReplay,
  share,
}: {
  result: Result;
  challenge: Challenge;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onRetry: () => void;
  onReplay: () => void;
  /** Share buttons (challenge link). */
  share: ReactNode;
}) {
  const { lang } = useI18n();
  const rank = teaRanks[rankFor(result.score)];
  const stats = [
    { key: "time", label: copy.statTime, value: fmt(t(copy.seconds, lang), { n: num(result.seconds, lang) }) },
    { key: "tea", label: copy.statTea, value: `${num(result.tea, lang)}%` },
    { key: "hits", label: copy.statHits, value: num(result.hits, lang) },
  ];

  return (
    <section className="grid gap-3" aria-labelledby="tea-result">
      <div className={`${card} overflow-hidden`}>
        <div className={`${accentBg[rank.accent]} border-b-2 border-ink px-5 py-6 text-center`}>
          <p className="text-sm font-extrabold uppercase tracking-wider">
            {result.delivered ? t(copy.delivered, lang) : fmt(t(copy.spilledAt, lang), { n: num(result.seconds, lang) })}
          </p>
          <p aria-hidden className="mt-2 text-7xl drop-shadow-[3px_3px_0_rgb(26_19_37)] motion-safe:animate-wiggle">
            {rank.emoji}
          </p>
          <h2 id="tea-result" ref={headingRef} tabIndex={-1} className="mt-2 font-display text-4xl font-extrabold leading-tight outline-none">
            {t(rank.title, lang)}
          </h2>
          <p className="mt-1 font-display text-5xl font-black tabular-nums">
            {num(result.score, lang)} <span className="text-lg font-bold">{t(copy.pts, lang)}</span>
          </p>
        </div>
        <div className="p-5">
          <p className="text-center text-ink-muted">{t(rank.blurb, lang)}</p>
          {result.newBest && <p className="mt-3 text-center font-extrabold text-cng-deep">{t(copy.newBest, lang)}</p>}
          <ChallengeOutcome challenge={challenge} seed={result.seed} score={result.score} />
          <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
            {stats.map((s) => (
              <div key={s.key} className="rounded-xl border-2 border-ink bg-surface-2 px-1 py-2">
                <dt className="text-[10px] font-extrabold uppercase leading-tight tracking-wide text-ink-muted sm:text-xs">{t(s.label, lang)}</dt>
                <dd className="font-display text-xl font-extrabold tabular-nums">{s.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-center text-xs font-bold text-ink-muted">
            {t(copy.roadCode, lang)}: <code className="font-mono">{encodeSeed(result.seed)}</code>
          </p>
        </div>
        <ResultStamp game={GAME_SLUG} />
      </div>
      {share}
      <button type="button" onClick={onRetry} className={`${btnPrimary} bg-surface`}>
        {t(copy.retry, lang)}
      </button>
      <button type="button" onClick={onReplay} className={btnGhost}>
        {t(copy.replay, lang)}
      </button>
    </section>
  );
}
