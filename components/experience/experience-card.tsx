import Link from "next/link";
import { accentBg, card, cardHover } from "@/components/ui/styles";
import type { UpcomingExperience } from "@/data/upcoming";
import { getCategory } from "@/lib/experience/registry";
import type { Experience } from "@/lib/experience/types";
import { fmt, num, t, type Lang } from "@/lib/i18n/core";
import { getDictionary } from "@/lib/i18n/dictionary";

const tilts = ["-rotate-1", "rotate-1", "rotate-0", "-rotate-[0.5deg]"] as const;

export function ExperienceCard({ experience, lang, index = 0 }: { experience: Experience; lang: Lang; index?: number }) {
  const d = getDictionary(lang);
  const category = getCategory(experience.category);
  const minutes = fmt(d.minutes, { n: num(Math.max(1, Math.round(experience.durationSec / 60)), lang) });
  return (
    <Link
      href={`/experiences/${experience.slug}`}
      className={`${card} ${cardHover} ${tilts[index % tilts.length]} group flex flex-col overflow-hidden hover:rotate-0`}
    >
      <div className={`${accentBg[experience.accent]} flex h-32 items-center justify-center border-b-2 border-ink`}>
        <span aria-hidden className="text-7xl drop-shadow-[3px_3px_0_rgb(26_19_37)] group-hover:animate-wiggle">
          {experience.emoji}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-extrabold uppercase tracking-wider text-ink-muted">
          {category?.emoji} {category && t(category.title, lang)} · {minutes}
        </p>
        <h3 className="mt-1 font-display text-2xl font-extrabold leading-tight">{t(experience.title, lang)}</h3>
        <p className="mt-1 text-ink-muted">{t(experience.tagline, lang)}</p>
        <span className="mt-4 inline-flex w-fit items-center rounded-pill border-2 border-ink bg-ink px-4 py-1.5 font-bold text-bg">
          {d.cardPlay}
        </span>
      </div>
    </Link>
  );
}

export function ComingSoonCard({ item, lang }: { item: UpcomingExperience; lang: Lang }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-card border-2 border-dashed border-ink/60 bg-surface/60">
      <div className={`${accentBg[item.accent]} flex h-24 items-center justify-center border-b-2 border-dashed border-ink/60 opacity-70`}>
        <span aria-hidden className="text-5xl grayscale-[40%]">{item.emoji}</span>
      </div>
      <div className="p-4">
        <p className="text-xs font-extrabold uppercase tracking-wider text-ink-muted">{getDictionary(lang).cooking}</p>
        <h3 className="mt-1 font-display text-lg font-extrabold leading-tight">{t(item.title, lang)}</h3>
        <p className="mt-1 text-sm text-ink-muted">{t(item.teaser, lang)}</p>
      </div>
    </div>
  );
}
