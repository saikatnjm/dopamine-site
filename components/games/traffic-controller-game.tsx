"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode, type RefObject } from "react";
import { ChallengeBanner, ChallengeOutcome, ShareActions } from "@/components/games/challenge-ui";
import { ResultCard } from "@/components/share/result-card";
import { ResultShareKit, useHost, useOrigin } from "@/components/share/result-share-kit";
import { useI18n } from "@/components/providers/lang-provider";
import { accentBg, btnGhost, btnPrimary, card } from "@/components/ui/styles";
import { approachNames, controllerCopy as copy, eventBanners, flowWords, looks, ranks } from "@/data/games/traffic-controller";
import { track } from "@/lib/analytics";
import { challengePath, type FriendChallenge } from "@/lib/challenge";
import { getGame } from "@/data/games";
import type { ResultCardData } from "@/lib/result-card";
import {
  APPROACHES,
  BOX,
  DURATION_MS,
  GAME_SLUG,
  LANE_W,
  STEP_MS,
  W,
  chaosLevel,
  createSim,
  finalScore,
  flipAll,
  isNS,
  multiplier,
  rankFor,
  rectOf,
  step,
  toggle,
  type Approach,
  type Sim,
  type StepResult,
  type Vehicle,
  type VehicleKind,
} from "@/lib/games/traffic-controller";
import { createBestStore, encodeSeed, prefersReducedMotion } from "@/lib/games/shared";
import { fmt, num, t, type Text } from "@/lib/i18n/core";
import { newSeed } from "@/lib/random";

const bestStore = createBestStore(`hottogol:${GAME_SLUG}:best`);
const gameInfo = getGame(GAME_SLUG)!;

const POOL = 48;
const COUNTDOWN_MS = 1500;
const END_MS = 1000;
const BANNER_MS = 2600;

/** Where each light sits (world coords), just before its stop line on the kerb side. */
const LIGHT_POS: Record<Approach, [number, number]> = {
  n: [BOX + 0.75, -(BOX + 0.75)],
  s: [-(BOX + 0.75), BOX + 0.75],
  w: [-(BOX + 0.75), -(BOX + 0.75)],
  e: [BOX + 0.75, BOX + 0.75],
};
/** Emoji face left; turn them to face their heading. */
/** Direction each approach's traffic travels (shown on its light). */
const ARROW: Record<Approach, string> = { n: "↓", s: "↑", w: "→", e: "←" };
const FACING: Record<Approach, string> = { e: "none", w: "scaleX(-1)", n: "rotate(-90deg)", s: "rotate(90deg)" };

type Phase = "idle" | "playing" | "over";
type Challenge = FriendChallenge | null;
type End = "time" | "crash" | "gridlock";
type Result = {
  score: number;
  handled: number;
  maxStreak: number;
  chaos: number;
  seconds: number;
  end: End;
  crash: [VehicleKind, VehicleKind] | null;
  seed: number;
  newBest: boolean;
};

export function TrafficControllerGame({ challenge }: { challenge: Challenge }) {
  const { lang } = useI18n();
  const best = useSyncExternalStore(bestStore.subscribe, bestStore.read, () => 0);

  const [phase, setPhase] = useState<Phase>("idle");
  const [seed, setSeed] = useState<number | null>(challenge?.seed ?? null);
  const [count, setCount] = useState<number | null>(0);
  const [green, setGreen] = useState<Record<Approach, boolean>>({ n: true, s: true, e: false, w: false });
  const [streak, setStreak] = useState(0);
  const [peds, setPeds] = useState<Approach[]>([]);
  const [banner, setBanner] = useState<{ id: number; text: string } | null>(null);
  const [pop, setPop] = useState<{ id: number; text: Text } | null>(null);
  const [rain, setRain] = useState(false);
  const [ending, setEnding] = useState<End | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const poolRef = useRef<(HTMLSpanElement | null)[]>([]);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const trafficRef = useRef<HTMLSpanElement>(null);
  const congRef = useRef<HTMLSpanElement>(null);
  const congBarRef = useRef<HTMLSpanElement>(null);
  const congMeterRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const controlRef = useRef<{ toggle: (a: Approach) => void; flip: () => void } | null>(null);

  // ----- Game loop -----
  useEffect(() => {
    if (phase !== "playing" || seed === null) return;
    const stage = stageRef.current;
    const pool = poolRef.current;
    const scoreEl = scoreRef.current;
    const timeEl = timeRef.current;
    const trafficEl = trafficRef.current;
    const congEl = congRef.current;
    const congBar = congBarRef.current;
    const congMeter = congMeterRef.current;
    if (!stage || !scoreEl || !timeEl || !trafficEl || !congEl || !congBar || !congMeter) return;

    const reduce = prefersReducedMotion();
    const sim: Sim = createSim(seed);
    const slots = new Map<number, number>();
    const free = Array.from({ length: POOL }, (_, i) => POOL - 1 - i);
    const byId = new Map<number, Vehicle>();
    const uturnShown = new Map<number, boolean>();
    const timers: number[] = [];
    let u = stage.clientWidth / (2 * W);
    let bannerId = 0;
    let popId = 0;
    let lastPeds = "";

    const hud = () => {
      scoreEl.textContent = num(sim.points, lang);
      timeEl.textContent = fmt(t(copy.seconds, lang), { n: num(Math.max(0, Math.ceil((DURATION_MS - sim.t) / 1000)), lang) });
      trafficEl.textContent = num(sim.vehicles.length, lang);
      congEl.textContent = `${num(sim.congestion, lang)}%`;
      congBar.style.width = `${sim.congestion}%`;
      congBar.className = `block h-full transition-[width] duration-100 ${sim.congestion >= 80 ? "bg-chili" : sim.congestion >= 50 ? "bg-marigold" : "bg-lime"}`;
      congMeter.setAttribute("aria-valuenow", String(sim.congestion));
      const p = APPROACHES.filter((a) => sim.pedT[a] > 0);
      const key = p.join("");
      if (key !== lastPeds) {
        lastPeds = key;
        setPeds(p);
      }
    };

    const size = (el: HTMLSpanElement, v: Vehicle) => {
      const along = v.len * u;
      const across = LANE_W * u;
      el.style.width = `${isNS(v.from) ? across : along}px`;
      el.style.height = `${isNS(v.from) ? along : across}px`;
      el.style.fontSize = `${(v.kind === "bus" ? 0.6 : 0.5) * u}px`;
    };
    const sizeAll = () => {
      for (const [id, slot] of slots) {
        const el = pool[slot];
        const v = byId.get(id);
        if (el && v) size(el, v);
      }
    };

    const spawn = (v: Vehicle) => {
      const slot = free.pop();
      if (slot === undefined) return;
      const el = pool[slot];
      if (!el) return;
      slots.set(v.id, slot);
      byId.set(v.id, v);
      const look = looks[v.kind];
      const tile = document.createElement("span");
      tile.className = `relative flex h-full w-full items-center justify-center rounded-lg border-2 border-ink leading-none shadow-pop ${look.className}`;
      const emoji = document.createElement("span");
      emoji.textContent = look.emoji;
      emoji.style.transform = FACING[v.from];
      tile.append(emoji);
      if (v.vip) {
        const siren = document.createElement("span");
        siren.className = "absolute -right-1 -top-2 text-[0.7em]";
        siren.textContent = "🚨";
        tile.append(siren);
      }
      el.replaceChildren(tile);
      size(el, v);
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
      byId.delete(id);
      uturnShown.delete(id);
      free.push(slot);
    };

    const render = () => {
      for (const [id, slot] of slots) {
        const el = pool[slot];
        const v = byId.get(id);
        if (!el || !v) continue;
        const [x0, y0] = rectOf(v);
        el.style.transform = `translate3d(${(x0 + W) * u}px,${(y0 + W) * u}px,0)`;
        const turning = v.uTurn === "doing";
        if (uturnShown.get(id) !== turning) {
          uturnShown.set(id, turning);
          el.style.outline = turning ? "3px dashed #ff5a4e" : "";
          el.style.outlineOffset = "2px";
        }
      }
    };

    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));
    const showBanner = (text: string) => {
      const id = ++bannerId;
      setBanner({ id, text });
      later(() => setBanner((b) => (b?.id === id ? null : b)), BANNER_MS);
    };

    const handle = (r: StepResult) => {
      r.spawned.forEach(spawn);
      r.removed.forEach(despawn);
      if (r.exited) {
        setStreak(sim.streak);
        if (sim.streak > 0 && sim.streak % 5 === 0) {
          popId += 1;
          setPop({ id: popId, text: flowWords[popId % flowWords.length]! });
        }
      }
      if (r.streakReset) setStreak(0);
      if (r.event) {
        const from = r.event.from ? t(approachNames[r.event.from], lang) : "";
        showBanner(fmt(t(eventBanners[r.event.id], lang), { from }));
        if (r.event.id === "rain") setRain(true);
      }
      if (r.rainEnded) setRain(false);
      if (r.over) {
        setEnding(r.over.reason);
        if (r.over.reason !== "time" && !reduce) {
          stage.animate([{ translate: "0 0" }, { translate: "-7px 2px" }, { translate: "6px -2px" }, { translate: "-3px 0" }, { translate: "0 0" }], {
            duration: 300,
          });
        }
        if (r.over.reason === "crash") {
          try {
            navigator.vibrate?.(90);
          } catch {
            // vibration unsupported
          }
        }
      }
    };

    const finish = () => {
      const points = finalScore(sim);
      const prev = bestStore.read();
      if (points > prev) bestStore.write(points);
      const end = sim.over?.reason ?? "time";
      setResult({
        score: points,
        handled: sim.handled,
        maxStreak: sim.maxStreak,
        chaos: chaosLevel(sim),
        seconds: Math.min(60, Math.floor(sim.t / 1000)),
        end,
        crash: sim.over?.crash ?? null,
        seed,
        newBest: points > prev,
      });
      setPhase("over");
      track("game_complete", { game: GAME_SLUG, score: points, rank: rankFor(points), handled: sim.handled, survived: end === "time", reason: end });
    };

    let pre = COUNTDOWN_MS;
    let lastCount: number | null = 0;

    controlRef.current = {
      toggle: (a) => {
        if (pre > 0 || sim.over) return;
        toggle(sim, a);
        setGreen({ ...sim.green });
      },
      flip: () => {
        if (pre > 0 || sim.over) return;
        flipAll(sim);
        setGreen({ ...sim.green });
      },
    };

    const KEYS: Record<string, Approach> = { arrowup: "n", w: "n", arrowdown: "s", s: "s", arrowleft: "w", a: "w", arrowright: "e", d: "e" };
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, a")) return;
      if (k === " ") {
        e.preventDefault();
        if (!e.repeat) controlRef.current?.flip();
        return;
      }
      const a = KEYS[k];
      if (!a) return;
      e.preventDefault();
      if (!e.repeat) controlRef.current?.toggle(a);
    };
    window.addEventListener("keydown", onKey);

    const ro = new ResizeObserver(() => {
      u = stage.clientWidth / (2 * W);
      sizeAll();
      render();
    });
    ro.observe(stage);
    render();
    hud();
    stage.focus({ preventScroll: true });

    let raf = 0;
    let acc = 0;
    let endT = 0;
    let lastHud = 0;
    let last = performance.now();

    const tick = (now: number) => {
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
      // Fixed-step simulation: identical traffic on every device.
      acc += dt;
      let steps = 0;
      while (acc >= STEP_MS && steps < 4) {
        acc -= STEP_MS;
        steps += 1;
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
      timers.forEach((id) => window.clearTimeout(id));
      controlRef.current = null;
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
    setGreen({ n: true, s: true, e: false, w: false });
    setStreak(0);
    setPeds([]);
    setBanner(null);
    setPop(null);
    setRain(false);
    setEnding(null);
    setResult(null);
    setPhase("playing");
    track(kind === "first" ? "game_start" : "game_retry", { game: GAME_SLUG, mode: kind });
    rootRef.current?.scrollIntoView({ block: "start", behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }

  const isChallenge = challenge !== null && seed === challenge.seed;
  const mult = multiplier(streak);
  const pct = (world: number) => `${((world + W) / (2 * W)) * 100}%`;
  const roadLo = pct(-BOX);
  const roadSize = `${(BOX / W) * 100}%`;

  return (
    <div ref={rootRef} className="scroll-mt-4">
      {phase === "idle" && (
        <section className={`${card} p-5 sm:p-6`} aria-labelledby="tc-how">
          {isChallenge && <ChallengeBanner game={GAME_SLUG} challenge={challenge} onAccept={() => start(seed ?? newSeed(), "first")} />}
          <p aria-hidden className="text-center text-6xl motion-safe:animate-wiggle">
            🚦
          </p>
          <h2 id="tc-how" className="mt-2 font-display text-2xl font-extrabold">
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
            <button type="button" onClick={() => start(seed ?? newSeed(), "first")} className={`${btnPrimary} ${accentBg.lime} w-full sm:w-auto`}>
              🚦 {t(copy.start, lang)}
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
            <HudTile label={t(copy.time, lang)}>
              <span ref={timeRef} className="tabular-nums" />
            </HudTile>
            <HudTile label={t(copy.traffic, lang)}>
              <span ref={trafficRef} className="tabular-nums" />
            </HudTile>
            <HudTile label={t(copy.flow, lang)} highlight={mult > 1}>
              <span className="tabular-nums">×{num(mult, lang)}</span>
            </HudTile>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider">
            <span className="shrink-0">{t(copy.congestion, lang)}</span>
            <div
              ref={congMeterRef}
              role="meter"
              aria-label={t(copy.congestion, lang)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={0}
              className="h-4 flex-1 overflow-hidden rounded-pill border-2 border-ink bg-surface"
            >
              <span ref={congBarRef} className="block h-full bg-lime" style={{ width: "0%" }} />
            </div>
            <span ref={congRef} className="w-11 shrink-0 text-right tabular-nums" />
          </div>

          <div
            ref={stageRef}
            role="application"
            aria-label={t(copy.stageLabel, lang)}
            tabIndex={0}
            className="relative mx-auto mt-2 aspect-square w-full max-w-[min(100%,60dvh)] select-none overflow-hidden rounded-card border-2 border-ink bg-[#9ccf7a] shadow-pop outline-none focus-visible:outline-3 focus-visible:outline-offset-2"
          >
            {/* Roads */}
            <span aria-hidden className="absolute inset-y-0 block bg-[#3b3548]" style={{ left: roadLo, width: roadSize }} />
            <span aria-hidden className="absolute inset-x-0 block bg-[#3b3548]" style={{ top: roadLo, height: roadSize }} />
            <span aria-hidden className="absolute inset-y-0 left-1/2 block w-0.5 -translate-x-1/2 bg-[repeating-linear-gradient(180deg,#fff3d6_0_10px,transparent_10px_20px)] opacity-50" />
            <span aria-hidden className="absolute inset-x-0 top-1/2 block h-0.5 -translate-y-1/2 bg-[repeating-linear-gradient(90deg,#fff3d6_0_10px,transparent_10px_20px)] opacity-50" />
            {/* Junction box */}
            <span aria-hidden className="absolute block border-2 border-dashed border-marigold/70 bg-[#453e55]" style={{ left: roadLo, top: roadLo, width: roadSize, height: roadSize }} />
            {/* Stop lines + zebra when pedestrians cross */}
            {APPROACHES.map((a) => (
              <StopLine key={a} a={a} red={!green[a]} peds={peds.includes(a)} />
            ))}
            {/* Traffic pool */}
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
            {rain && (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 block bg-sky/20 bg-[repeating-linear-gradient(105deg,transparent_0_14px,rgb(255_255_255/0.22)_14px_16px)]"
              />
            )}
            {/* Lights (the controls) */}
            {APPROACHES.map((a) => {
              const [x, y] = LIGHT_POS[a];
              const on = green[a];
              return (
                <button
                  key={a}
                  type="button"
                  aria-label={fmt(t(copy.light, lang), { side: t(approachNames[a], lang), state: t(on ? copy.green : copy.red, lang) })}
                  aria-pressed={on}
                  onPointerDown={(e) => {
                    if (e.pointerType === "mouse" && e.button !== 0) return;
                    e.preventDefault();
                    controlRef.current?.toggle(a);
                  }}
                  onClick={(e) => {
                    if (e.detail === 0) controlRef.current?.toggle(a);
                  }}
                  style={{ left: pct(x), top: pct(y) }}
                  className="absolute z-10 grid size-12 -translate-x-1/2 -translate-y-1/2 touch-manipulation place-items-center rounded-2xl border-2 border-ink bg-ink shadow-pop"
                >
                  <span aria-hidden className="absolute -top-2.5 rounded-pill border-2 border-ink bg-surface px-1 text-[10px] font-black leading-none">
                    {ARROW[a]}
                  </span>
                  <span aria-hidden className="grid gap-0.5">
                    <span className={`block size-3.5 rounded-full border border-ink ${on ? "bg-ink-muted/40" : "bg-chili shadow-[0_0_8px_#ff5a4e]"}`} />
                    <span className={`block size-3.5 rounded-full border border-ink ${on ? "bg-lime shadow-[0_0_8px_#b5f23d]" : "bg-ink-muted/40"}`} />
                  </span>
                </button>
              );
            })}
            {pop && <FlowPop key={pop.id} text={t(pop.text, lang)} />}
            {banner && (
              <span className="pointer-events-none absolute inset-x-3 top-3 z-20 block rotate-[-1.5deg] rounded-xl border-2 border-ink bg-marigold px-3 py-1.5 text-center text-sm font-extrabold shadow-pop">
                {banner.text}
              </span>
            )}
            {ending && (
              <span className="pointer-events-none absolute inset-0 z-20 grid place-items-center bg-ink/30">
                <span
                  className={`rotate-[-4deg] rounded-2xl border-2 border-ink px-6 py-2 font-display text-4xl font-black shadow-pop-lg ${
                    ending === "time" ? "bg-lime" : "bg-chili"
                  }`}
                >
                  {t(ending === "crash" ? copy.crashed : ending === "gridlock" ? copy.gridlocked : copy.shiftOver, lang)}
                </span>
              </span>
            )}
            {count !== null && (
              <span className="pointer-events-none absolute inset-0 z-20 grid place-items-center bg-ink/30">
                <span className="rotate-[-3deg] rounded-2xl border-2 border-ink bg-marigold px-6 py-2 font-display text-5xl font-black shadow-pop-lg">
                  {t(copy.countdown[count] ?? copy.shiftOver, lang)}
                </span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => controlRef.current?.flip()}
            className={`${btnPrimary} mx-auto mt-3 flex w-full max-w-[min(100%,60dvh)] touch-manipulation bg-surface`}
          >
            {t(copy.flipAll, lang)}
          </button>
        </section>
      )}

      {phase === "over" && result && (
        <ResultView result={result} challenge={challenge} headingRef={headingRef} onRetry={() => start(newSeed(), "retry")} onReplay={() => start(result.seed, "replay")} />
      )}
    </div>
  );
}

/** Stop line for an approach (red when stopped) + zebra stripes during a pedestrian event. */
function StopLine({ a, red, peds }: { a: Approach; red: boolean; peds: boolean }) {
  const lo = ((W - BOX) / (2 * W)) * 100;
  const hi = ((W + BOX) / (2 * W)) * 100;
  const mid = 50;
  const thick = 1.4; // % of stage
  const zebra = 6;
  // Incoming half of the road (left-hand traffic).
  const style: Record<Approach, CSSProperties> = {
    n: { left: `${mid}%`, width: `${hi - mid}%`, top: `${lo - (peds ? zebra : thick)}%`, height: `${peds ? zebra : thick}%` },
    s: { left: `${lo}%`, width: `${mid - lo}%`, top: `${hi}%`, height: `${peds ? zebra : thick}%` },
    w: { top: `${lo}%`, height: `${mid - lo}%`, left: `${lo - (peds ? zebra : thick)}%`, width: `${peds ? zebra : thick}%` },
    e: { top: `${mid}%`, height: `${hi - mid}%`, left: `${hi}%`, width: `${peds ? zebra : thick}%` },
  };
  const stripes = isNS(a)
    ? "bg-[repeating-linear-gradient(90deg,#fff3d6_0_6px,transparent_6px_12px)]"
    : "bg-[repeating-linear-gradient(180deg,#fff3d6_0_6px,transparent_6px_12px)]";
  return (
    <span aria-hidden className={`absolute block ${peds ? stripes : red ? "bg-chili" : "bg-[#fff3d6]/70"}`} style={style[a]}>
      {peds && <span className="absolute inset-0 grid place-items-center text-sm">🚶</span>}
    </span>
  );
}

function FlowPop({ text }: { text: string }) {
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
      { duration: 700, easing: "ease-out", fill: "forwards" },
    );
    return () => anim.cancel();
  }, []);
  return (
    <span
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute bottom-[12%] left-1/2 z-20 -translate-x-1/2 -rotate-6 whitespace-nowrap rounded-xl border-2 border-ink bg-lime px-3 py-1 font-display text-lg font-black shadow-pop"
    >
      {text}
    </span>
  );
}

function HudTile({ label, highlight = false, children }: { label: string; highlight?: boolean; children: ReactNode }) {
  return (
    <div className={`rounded-2xl border-2 border-ink px-1 py-1.5 text-center shadow-pop ${highlight ? accentBg.marigold : "bg-surface"}`}>
      <p className="text-[10px] font-extrabold uppercase tracking-wider text-ink-muted">{label}</p>
      <p className="font-display text-xl font-extrabold leading-tight">{children}</p>
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
  const message = fmt(t(copy.shareText, lang), { handled: num(result.handled, lang), score: num(result.score, lang), title: t(rank.title, lang), emoji: rank.emoji });
  const endLine =
    result.end === "time"
      ? t(copy.endTime, lang)
      : result.end === "gridlock"
        ? t(copy.endGridlock, lang)
        : fmt(t(copy.endCrash, lang), { a: t(looks[result.crash?.[0] ?? "car"].name, lang), b: t(looks[result.crash?.[1] ?? "bus"].name, lang) });

  const stats = [
    { key: "handled", label: copy.statHandled, value: num(result.handled, lang) },
    { key: "flow", label: copy.statFlow, value: num(result.maxStreak, lang) },
    { key: "chaos", label: copy.statChaos, value: `${num(result.chaos, lang)}%` },
    { key: "time", label: copy.statTime, value: fmt(t(copy.seconds, lang), { n: num(result.seconds, lang) }) },
  ];

  const card: ResultCardData = {
    game: t(gameInfo.title, lang),
    emoji: gameInfo.emoji,
    accent: rank.accent,
    headlineLabel: t(copy.scoreLabel, lang),
    headline: `${num(result.score, lang)} ${t(copy.pts, lang)}`,
    title: t(rank.title, lang),
    titleEmoji: rank.emoji,
    blurb: t(rank.blurb, lang),
    quote: endLine,
    stats: stats.map((st) => ({ label: t(st.label, lang), value: st.value })),
    path: `/games/${GAME_SLUG}`,
  };
  const url = `${origin}${challengePath({ game: GAME_SLUG, seed: result.seed, score: result.score }) ?? `/games/${GAME_SLUG}`}`;

  return (
    <section className="grid gap-3" aria-labelledby="tc-result">
      <ResultCard data={card} host={host} headingId="tc-result" headingRef={headingRef}>
        {result.newBest && <p className="text-center font-extrabold text-cng-deep">{t(copy.newBest, lang)}</p>}
        <ChallengeOutcome game={GAME_SLUG} challenge={challenge} seed={result.seed} score={result.score} />
        <p className="text-center text-xs font-bold text-ink-muted">
          {t(copy.shiftCode, lang)}: <code className="font-mono">{encodeSeed(result.seed)}</code>
        </p>
      </ResultCard>
      <ResultShareKit data={card} url={url} fileName={`${GAME_SLUG}-result`} onShared={(method) => track("game_share", { game: GAME_SLUG, method, rank: rankId })} />
      <ShareActions game={GAME_SLUG} seed={result.seed} score={result.score} text={message} accent={rank.accent} rank={rankId} />
      <button type="button" onClick={onRetry} className={`${btnPrimary} ${accentBg.lime}`}>
        {t(copy.retry, lang)}
      </button>
      <button type="button" onClick={onReplay} className={btnGhost}>
        {t(copy.replay, lang)}
      </button>
    </section>
  );
}
