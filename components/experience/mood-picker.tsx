"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useI18n } from "@/components/providers/lang-provider";
import { accentBg, btnGhost, card, cardHover } from "@/components/ui/styles";
import { track } from "@/lib/analytics";
import type { Activity } from "@/lib/activities";
import { t } from "@/lib/i18n/core";
import { MOOD_PICKS, moods, recommendForMood, type MoodId } from "@/lib/moods";
import { createRng, newSeed } from "@/lib/random";

type Props = {
  /** Every playable activity, resolved on the server (lib/activities.ts). */
  activities: readonly Activity[];
};

type Selection = MoodId | "surprise";

function surprisePicks(all: readonly Activity[], rand: () => number): Activity[] {
  const pool = [...all];
  const out: Activity[] = [];
  while (out.length < MOOD_PICKS && pool.length > 0) {
    const [hit] = pool.splice(Math.floor(rand() * pool.length), 1);
    if (hit) out.push(hit);
  }
  return out;
}

const chipBase =
  "inline-flex min-h-12 items-center gap-2 rounded-pill border-2 border-ink px-4 py-2 text-left text-base font-extrabold shadow-pop transition-all duration-100 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none";

/** Homepage discovery: pick a mood, get 3 registry activities. */
export function MoodPicker({ activities }: Props) {
  const { lang, d } = useI18n();
  const [selected, setSelected] = useState<Selection | null>(null);
  const [picks, setPicks] = useState<Activity[]>([]);
  const [round, setRound] = useState(0);
  const lastKeys = useRef<string>("");

  function choose(sel: Selection) {
    // Re-roll (up to a few times) so the same mood twice in a row shows a different trio.
    let next: Activity[] = [];
    for (let attempt = 0; attempt < 4; attempt++) {
      const rand = createRng(newSeed());
      next = sel === "surprise" ? surprisePicks(activities, rand) : recommendForMood(sel, activities, rand);
      const sig = next.map((a) => a.key).sort().join(",");
      if (sig !== lastKeys.current) break;
    }
    lastKeys.current = next.map((a) => a.key).sort().join(",");
    track("mood_selection", { mood: sel, again: sel === selected });
    if (sel === "surprise") track("surprise_me_click", { source: "mood" });
    setSelected(sel);
    setPicks(next);
    setRound((r) => r + 1);
  }

  const selectedMood = moods.find((m) => m.id === selected);
  const heading = selected === "surprise" ? d.moodSurpriseHeading : selectedMood ? `${selectedMood.emoji} ${t(selectedMood.label, lang)}` : "";

  return (
    <section aria-labelledby="mood-title" className={`${card} rotate-[0.3deg] p-6 sm:p-8`}>
      <h2 id="mood-title" className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">
        {d.moodTitle} <span aria-hidden>🤔</span>
      </h2>
      <p className="mt-1 text-ink-muted">{d.moodSub}</p>

      <div role="group" aria-label={d.moodTitle} className="mt-5 flex flex-wrap gap-2.5">
        {moods.map((m) => {
          const on = selected === m.id;
          return (
            <button
              key={m.id}
              type="button"
              aria-pressed={on}
              onClick={() => choose(m.id)}
              className={`${chipBase} ${on ? "bg-lime" : "bg-surface"}`}
            >
              <span aria-hidden className="text-xl">{m.emoji}</span>
              {t(m.label, lang)}
            </button>
          );
        })}
        <button
          type="button"
          aria-pressed={selected === "surprise"}
          onClick={() => choose("surprise")}
          className={`${chipBase} ${selected === "surprise" ? "bg-lime" : "bg-marigold"}`}
        >
          <span aria-hidden className="text-xl">🎲</span>
          {d.surpriseMe}
        </button>
      </div>

      <p aria-live="polite" className="sr-only">
        {selected && picks.length > 0 ? `${d.moodPicksFor} ${heading}: ${picks.map((a) => a.title).join(", ")}` : ""}
      </p>

      <div>
        {selected && picks.length > 0 ? (
          <div className="mt-6">
            <p className="text-sm font-extrabold uppercase tracking-wide">
              {d.moodPicksFor} <span className="normal-case">{heading}</span>
            </p>
            <ul key={round} className="mt-3 grid gap-3 sm:grid-cols-3">
              {picks.map((a, i) => (
                <li
                  key={a.key}
                  className="motion-safe:animate-pop-in"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <Link
                    href={a.href}
                    onClick={() => track("recommendation_click", { mood: selected ?? undefined, activity: a.key, position: i + 1 })}
                    className={`${accentBg[a.accent]} ${cardHover} flex h-full min-h-24 items-center gap-3 rounded-card border-2 border-ink p-4 shadow-pop`}
                  >
                    <span aria-hidden className="text-4xl leading-none">{a.emoji}</span>
                    <span className="min-w-0">
                      <span className="block text-xs font-extrabold uppercase">{a.kindLabel}</span>
                      <span className="block font-display text-lg font-extrabold leading-tight">{a.title}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => choose(selected)} className={`${btnGhost} mt-2`}>
              <span aria-hidden>🔁</span>
              {d.moodShuffle}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
