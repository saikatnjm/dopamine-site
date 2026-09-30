"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { useI18n } from "@/components/providers/lang-provider";
import { accentBg, btnGhost, btnPrimary, card } from "@/components/ui/styles";
import { track } from "@/lib/analytics";
import type { Activity } from "@/lib/activities";
import { prefersReducedMotion } from "@/lib/games/shared";
import { pickRandom } from "@/lib/random";

type Props = {
  activities: readonly Activity[];
  className?: string;
};

const AUTO_GO_MS = 1200;

/** Crypto-backed integer in [0, n). UI-only. */
function randInt(n: number): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return (buf[0] ?? 0) % n;
}

function shuffled(items: readonly Activity[]): Activity[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = randInt(i + 1);
    const a = out[i];
    const b = out[j];
    if (a && b) {
      out[i] = b;
      out[j] = a;
    }
  }
  return out;
}

/** ~16-20 items cycling through everything in shuffled order, ending on `pick`. */
function buildSequence(items: readonly Activity[], pick: Activity): Activity[] {
  const total = 16 + randInt(5);
  const seq: Activity[] = [];
  while (seq.length < total - 1) seq.push(...shuffled(items));
  seq.length = total - 1;
  // Avoid showing the pick twice in a row right before the reveal.
  const last = seq[seq.length - 1];
  if (last && last.key === pick.key && items.length > 1) {
    const other = items.find((a) => a.key !== pick.key);
    if (other) seq[seq.length - 1] = other;
  }
  seq.push(pick);
  return seq;
}

export function ChaosRoulette({ activities, className = "" }: Props) {
  const router = useRouter();
  const { d } = useI18n();
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [pick, setPick] = useState<Activity | null>(null);
  const [shown, setShown] = useState<Activity | null>(null);
  const [stopped, setStopped] = useState(false);

  const timers = useRef<number[]>([]);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = timers.current;
    return () => {
      list.forEach((id) => window.clearTimeout(id));
      list.length = 0;
    };
  }, []);

  useEffect(() => {
    if (open) dialogRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!stopped) return;
    const el = stampRef.current;
    if (!el || prefersReducedMotion() || typeof el.animate !== "function") return;
    el.animate(
      [
        { transform: "scale(0.4) rotate(-12deg)", opacity: 0 },
        { transform: "scale(1.15) rotate(-4deg)", opacity: 1, offset: 0.65 },
        { transform: "scale(1) rotate(-3deg)", opacity: 1 },
      ],
      { duration: 380, easing: "ease-out" },
    );
  }, [stopped]);

  function clearTimers() {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current.length = 0;
  }

  function later(fn: () => void, ms: number) {
    timers.current.push(window.setTimeout(fn, ms));
  }

  function tick() {
    const el = slotRef.current;
    if (!el || typeof el.animate !== "function") return;
    el.animate([{ transform: "scale(1)" }, { transform: "scale(1.04)" }, { transform: "scale(1)" }], {
      duration: 90,
      easing: "ease-out",
    });
  }

  function spin() {
    const chosen = pickRandom(activities);
    if (!chosen) return;
    clearTimers();
    track("surprise_me_click", { experience: chosen.key, source: "roulette" });
    setOpen(true);
    setPick(chosen);
    setStopped(false);

    const goLater = () => later(() => router.push(chosen.href), AUTO_GO_MS);

    if (prefersReducedMotion()) {
      setShown(chosen);
      setStopped(true);
      goLater();
      return;
    }

    const seq = buildSequence(activities, chosen);
    const n = seq.length;
    setShown(seq[0] ?? chosen);
    let at = 0;
    seq.forEach((item, i) => {
      const t = n > 1 ? i / (n - 1) : 1;
      at += 45 + 175 * t * t * t;
      later(() => {
        setShown(item);
        if (i === n - 1) {
          setStopped(true);
          goLater();
        } else {
          tick();
        }
      }, at);
    });
  }

  function close() {
    clearTimers();
    setOpen(false);
    setStopped(false);
    triggerRef.current?.focus();
  }

  function go() {
    if (!pick) return;
    clearTimers();
    router.push(pick.href);
  }

  const current = shown ?? pick;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={spin}
        className={`${btnPrimary} bg-violet whitespace-nowrap ${className}`}
      >
        <span aria-hidden>🎰</span>
        {d.rouletteCta}
      </button>

      {open && current ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.stopPropagation();
                close();
              }
            }}
            className={`${card} relative w-full max-w-sm -rotate-1 p-5 outline-none`}
          >
            <button
              type="button"
              onClick={close}
              aria-label={d.rouletteClose}
              className="absolute right-2 top-2 grid size-11 place-items-center rounded-pill text-xl font-black text-ink hover:bg-ink/10"
            >
              <span aria-hidden>{"✕"}</span>
            </button>

            <p id={titleId} className="pr-10 text-sm font-extrabold uppercase tracking-wide">
              {stopped ? d.rouletteCta : d.rouletteSpinning}
            </p>

            <div
              ref={slotRef}
              className={`${accentBg[current.accent]} mt-3 flex min-h-48 flex-col items-center justify-center gap-2 rounded-card border-4 border-ink p-4 text-center`}
            >
              <span className="rounded-pill border-2 border-ink bg-surface px-3 py-0.5 text-xs font-extrabold uppercase">
                {current.kindLabel}
              </span>
              <span aria-hidden className="text-6xl leading-none">
                {current.emoji}
              </span>
              <span className="font-display text-2xl font-extrabold leading-tight">{current.title}</span>
            </div>

            <div aria-live="polite" className="sr-only">
              {stopped && pick ? `${d.rouletteDecided} ${pick.title}` : ""}
            </div>

            {stopped ? (
              <div className="mt-4 flex flex-col items-center gap-3">
                <div
                  ref={stampRef}
                  className="-rotate-3 rounded-lg border-2 border-ink bg-marigold px-3 py-1 text-center text-sm font-black shadow-pop"
                >
                  {d.rouletteDecided}
                </div>
                <button type="button" onClick={go} className={`${btnPrimary} w-full bg-violet`}>
                  {d.rouletteGo}
                </button>
                <p className="text-sm font-bold text-ink-muted">{d.rouletteTaking}</p>
                <button type="button" onClick={spin} className={`${btnGhost} min-h-12`}>
                  <span aria-hidden>🔁</span>
                  {d.rouletteAgain}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
