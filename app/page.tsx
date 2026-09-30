import Link from "next/link";
import { ComingSoonCard, ExperienceCard } from "@/components/experience/experience-card";
import { DailyCard } from "@/components/daily/daily-card";
import { DhakaPersonCard } from "@/components/dhaka-person/dhaka-person-card";
import { ExcuseCard } from "@/components/excuses/excuse-card";
import { SurpriseButton } from "@/components/experience/surprise-button";
import { Marquee } from "@/components/ui/marquee";
import { accentBg, btnPrimary, card, chip } from "@/components/ui/styles";
import { upcoming } from "@/data/upcoming";
import { listCategories, listExperiences } from "@/lib/experience/registry";
import { fmt, num, t } from "@/lib/i18n/core";
import { getI18n } from "@/lib/i18n/server";
import { absoluteUrl, siteConfig } from "@/lib/site";

const stickers = [
  { emoji: "🛺", pos: "left-[4%] top-[6%]", r: "-12deg", delay: "0s" },
  { emoji: "🐐", pos: "right-[6%] top-[4%]", r: "10deg", delay: "-1.5s" },
  { emoji: "💸", pos: "left-[10%] bottom-[8%] hidden sm:block", r: "8deg", delay: "-3s" },
  { emoji: "🍔", pos: "right-[10%] bottom-[12%] hidden sm:block", r: "-8deg", delay: "-2s" },
  { emoji: "🚦", pos: "right-[30%] top-[-2%] hidden md:block", r: "6deg", delay: "-4s" },
];

const stepMeta = [
  { emoji: "👆", accent: "sky" },
  { emoji: "🤔", accent: "lime" },
  { emoji: "🤯", accent: "chili" },
  { emoji: "📤", accent: "marigold" },
] as const;

export default async function HomePage() {
  const { lang, d } = await getI18n();
  const experiences = listExperiences();
  const slugs = experiences.map((e) => e.slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: absoluteUrl("/"),
    description: siteConfig.description,
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative mx-auto max-w-5xl px-4 pb-14 pt-8 text-center sm:pt-14">
        {stickers.map((s) => (
          <span
            key={s.emoji}
            aria-hidden
            className={`pointer-events-none absolute ${s.pos} animate-float text-4xl sm:text-5xl`}
            style={{ ["--r" as string]: s.r, animationDelay: s.delay, transform: `rotate(${s.r})` }}
          >
            {s.emoji}
          </span>
        ))}

        <p className="relative mx-auto inline-flex rotate-1 items-center gap-2 rounded-pill border-2 border-ink bg-lime px-4 py-1.5 text-sm font-extrabold shadow-pop">
          {fmt(d.heroBadge, { n: num(experiences.length, lang) })}
        </p>
        <h1 className="relative mx-auto mt-6 max-w-3xl font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl">
          {d.heroA}{" "}
          <span className="inline-block -rotate-2 rounded-2xl border-2 border-ink bg-chili px-3 shadow-pop">{d.heroB}</span>{" "}
          <span className="inline-block rotate-1 rounded-2xl border-2 border-ink bg-sky px-3 shadow-pop">{d.heroC}</span>
        </h1>
        <p className="relative mx-auto mt-6 max-w-xl text-lg text-ink-muted sm:text-xl">
          {d.heroLead}
        </p>
        <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <SurpriseButton slugs={slugs} className="w-full sm:w-auto" />
          <Link href="#play" className={`${btnPrimary} w-full bg-surface sm:w-auto`}>
            {d.explore}
          </Link>
        </div>
      </section>

      {/* Daily challenge */}
      <section className="mx-auto max-w-5xl px-4 pb-12">
        <DailyCard />
      </section>

      {/* Excuse generator teaser */}
      <section className="mx-auto max-w-5xl px-4 pb-12">
        <ExcuseCard />
      </section>

      {/* Dhaka Person quiz teaser */}
      <section className="mx-auto max-w-5xl px-4 pb-12">
        <DhakaPersonCard />
      </section>

      <div className="overflow-hidden py-3">
        <Marquee items={d.ticker} />
      </div>

      {/* Experiences */}
      <section id="play" className="mx-auto max-w-5xl scroll-mt-4 px-4 pt-14">
        <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
          {d.playNow} <span aria-hidden>🔥</span>
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {experiences.map((e, i) => (
            <ExperienceCard key={e.slug} experience={e} lang={lang} index={i} />
          ))}
        </div>

        {upcoming.length > 0 && (
          <>
            <h2 className="mt-14 font-display text-2xl font-extrabold sm:text-3xl">
              {d.oven} <span aria-hidden>🍳</span>
            </h2>
            <p className="mt-1 text-ink-muted">{d.ovenSub}</p>
            <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-3">
              {upcoming.map((item) => (
                <ComingSoonCard key={item.id} item={item} lang={lang} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-4 pt-16">
        <h2 className="font-display text-3xl font-extrabold sm:text-4xl">{d.howTitle}</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stepMeta.map((s, i) => (
            <li key={s.emoji} className={`${card} ${i % 2 ? "rotate-1" : "-rotate-1"} p-5`}>
              <div className="flex items-center gap-3">
                <span className={`${accentBg[s.accent]} grid size-10 place-items-center rounded-full border-2 border-ink font-display text-lg font-extrabold`}>
                  {i + 1}
                </span>
                <span aria-hidden className="text-3xl">{s.emoji}</span>
              </div>
              <h3 className="mt-3 font-display text-xl font-extrabold leading-tight">{d.howTitles[i]}</h3>
              <p className="mt-1 text-ink-muted">{d.howBodies[i]}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-5xl px-4 pt-16">
        <h2 className="font-display text-3xl font-extrabold sm:text-4xl">{d.browse}</h2>
        <ul className="mt-5 flex flex-wrap gap-3">
          {listCategories().map((c) => (
            <li key={c.slug}>
              <Link href={`/categories/${c.slug}`} className={chip}>
                <span aria-hidden>{c.emoji}</span> {t(c.title, lang)}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-5xl px-4 pt-16">
        <div className={`${card} rotate-[0.5deg] bg-violet p-8 text-center sm:p-12`}>
          <p className="font-display text-4xl font-extrabold sm:text-5xl">{d.closingTitle}</p>
          <p className="mx-auto mt-2 max-w-md text-lg">{d.closingBody}</p>
          <SurpriseButton slugs={slugs} className="mt-6" />
        </div>
      </section>
    </main>
  );
}
