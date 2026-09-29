"use client";

import { AnimatePresence, m } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/providers/lang-provider";
import { accentBg, btnGhost, btnPrimary, card } from "@/components/ui/styles";
import { track } from "@/lib/analytics";
import { resolveBeats, runExperience } from "@/lib/experience/engine";
import { getExperience } from "@/lib/experience/registry";
import { encodeResultToken } from "@/lib/experience/result-token";
import type { BeatStep, ChoiceStep, Experience } from "@/lib/experience/types";
import { fmt, num, t } from "@/lib/i18n/core";
import { newSeed } from "@/lib/random";

type Run = { seed: number; index: number; choices: Record<string, string> };

// The experience is looked up by slug on the client because its data holds
// weight functions, which can't be passed from a Server Component.
export function ExperiencePlayer({ slug }: { slug: string }) {
  const experience = getExperience(slug);
  const router = useRouter();
  const { lang, d } = useI18n();
  const [run, setRun] = useState<Run | null>(null);
  const [finishing, setFinishing] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  // On small screens, keep the active step in view after each move.
  const index = run?.index;
  useEffect(() => {
    const el = topRef.current;
    if (index === undefined || !el) return;
    const top = el.getBoundingClientRect().top;
    if (top < 0 || top > window.innerHeight * 0.35) {
      el.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, [index]);

  if (!experience) return null;
  const total = experience.steps.length;

  function start() {
    setRun({ seed: newSeed(), index: 0, choices: {} });
    setFinishing(false);
    track("experience_start", { experience: slug });
  }

  function advance(next: Run) {
    if (!experience) return;
    if (next.index < total) {
      setRun(next);
      return;
    }
    // Last step done: compute the outcome and go to the shareable result.
    const { outcome } = runExperience(experience, next.choices, next.seed);
    const token = encodeResultToken({ experience, choices: next.choices, seed: next.seed, outcomeId: outcome.id });
    const url = `/result/${token}?me=1`;
    setFinishing(true);
    track("experience_complete", { experience: slug, outcome: outcome.id });
    router.prefetch(url);
    window.setTimeout(() => router.push(url), 1100);
  }

  if (!run) {
    return (
      <div className={`${card} p-6 text-center`}>
        <p className="text-6xl" aria-hidden>{experience.emoji}</p>
        <p className="mt-3 text-ink-muted">
          {fmt(d.introMeta, { steps: num(total, lang), min: num(Math.max(1, Math.round(experience.durationSec / 60)), lang) })}
        </p>
        <button type="button" onClick={start} className={`${btnPrimary} ${accentBg[experience.accent]} mt-5 w-full`}>
          {t(experience.startLabel, lang)}
        </button>
      </div>
    );
  }

  const step = experience.steps[run.index];
  const progress = finishing ? 100 : Math.round((run.index / total) * 100);

  return (
    <div ref={topRef} className="scroll-mt-4">
      <div className="mb-4 flex items-center gap-3">
        <div
          className="h-3 flex-1 overflow-hidden rounded-pill border-2 border-ink bg-surface"
          role="progressbar"
          aria-label={d.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div
            className={`h-full ${accentBg[experience.accent]} transition-[width] duration-300`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <button type="button" onClick={start} className={`${btnGhost} min-h-9 px-2 text-sm`}>
          {d.restart}
        </button>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={finishing ? "finishing" : `${run.seed}-${run.index}`}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.18 }}
        >
          {finishing ? (
            <Finishing />
          ) : step?.kind === "choice" ? (
            <ChoiceView
              step={step}
              onPick={(optionId) =>
                advance({ ...run, index: run.index + 1, choices: { ...run.choices, [step.id]: optionId } })
              }
            />
          ) : step?.kind === "beat" ? (
            <BeatView
              experience={experience}
              step={step}
              run={run}
              onNext={() => advance({ ...run, index: run.index + 1 })}
            />
          ) : null}
        </m.div>
      </AnimatePresence>
    </div>
  );
}

function ChoiceView({ step, onPick }: { step: ChoiceStep; onPick: (optionId: string) => void }) {
  const { lang } = useI18n();
  return (
    <fieldset>
      <legend className="font-display text-2xl font-extrabold leading-tight">{t(step.prompt, lang)}</legend>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {step.options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onPick(option.id)}
            className={`${card} flex min-h-14 items-center gap-3 px-4 py-3 text-left transition-transform duration-100 hover:-translate-y-0.5 active:translate-y-1 active:shadow-none`}
          >
            {option.emoji && <span className="text-2xl" aria-hidden>{option.emoji}</span>}
            <span>
              <span className="block font-bold">{t(option.label, lang)}</span>
              {option.hint && <span className="block text-sm text-ink-muted">{t(option.hint, lang)}</span>}
            </span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function BeatView({
  experience,
  step,
  run,
  onNext,
}: {
  experience: Experience;
  step: BeatStep;
  run: Run;
  onNext: () => void;
}) {
  // Remounted per step (keyed parent), so "typing" restarts for every beat.
  const { lang, d } = useI18n();
  const [typing, setTyping] = useState(true);
  useEffect(() => {
    const id = window.setTimeout(() => setTyping(false), 900);
    return () => window.clearTimeout(id);
  }, []);

  const beat = resolveBeats(experience, run.choices, run.seed).beats[step.id];

  return (
    <section aria-live="polite">
      <h2 className="font-display text-2xl font-extrabold">{t(step.title, lang)}</h2>
      <div className={`${card} mt-4 min-h-28 p-5`}>
        {typing || !beat ? (
          <TypingDots label={beat?.speaker ? fmt(d.typing, { speaker: t(beat.speaker, lang) }) : d.happening} />
        ) : (
          <div className="flex items-start gap-3">
            <span className="text-3xl" aria-hidden>
              {beat.emoji ?? (beat.speaker ? "🧔" : "💬")}
            </span>
            <p className="text-xl font-semibold leading-snug">
              {beat.speaker && (
                <span className="block text-sm font-bold uppercase tracking-wide text-ink-muted">{t(beat.speaker, lang)}</span>
              )}
              {beat.speaker ? `“${t(beat.text, lang)}”` : t(beat.text, lang)}
            </p>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={onNext}
        disabled={typing}
        className={`${btnPrimary} ${accentBg[experience.accent]} mt-5 w-full`}
      >
        {d.next}
      </button>
    </section>
  );
}

function TypingDots({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 text-ink-muted">
      <span className="flex gap-1" aria-hidden>
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="size-2.5 animate-bounce rounded-full bg-ink-muted"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </span>
      <span className="text-sm">{label}…</span>
    </div>
  );
}

function Finishing() {
  const { d } = useI18n();
  return (
    <div className={`${card} p-8 text-center`} role="status">
      <p className="animate-pulse text-5xl" aria-hidden>🔮</p>
      <p className="mt-3 font-display text-xl font-bold">{d.calculating}</p>
    </div>
  );
}
