import type { Metadata } from "next";
import Link from "next/link";
import { ActivityCard } from "@/components/experience/activity-card";
import { ChaosRoulette } from "@/components/experience/chaos-roulette";
import { btnPrimary, card, chip } from "@/components/ui/styles";
import { GUIDE_SLUGS, guides } from "@/data/guides";
import { listActivities, type Activity } from "@/lib/activities";
import { t, type Lang } from "@/lib/i18n/core";
import { getI18n } from "@/lib/i18n/server";
import { absoluteUrl } from "@/lib/site";

const title = "Bored? Free Fun Things to Do Online in 30 Seconds to 5 Minutes";
const description =
  "Bored right now? Play free 30-second reaction games, 1-minute funny simulators and quick quizzes about Dhaka chaos. No sign-up, no downloads, nothing productive.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/bored" },
  openGraph: { type: "website", url: "/bored", title, description },
  twitter: { card: "summary_large_image", title, description },
};

const QUICK_MAX_SEC = 45;

/** Split every registered activity into exactly one time bucket. */
function bucket(all: readonly Activity[]) {
  const quick: Activity[] = [];
  const minute: Activity[] = [];
  const long: Activity[] = [];
  for (const a of all) {
    if (a.kind === "experience") minute.push(a);
    else if (a.kind === "game" && a.durationSec !== undefined && a.durationSec <= QUICK_MAX_SEC) quick.push(a);
    else long.push(a);
  }
  return { quick, minute, long };
}

function Section({
  id,
  emoji,
  heading,
  sub,
  items,
  lang,
}: {
  id: string;
  emoji: string;
  heading: string;
  sub: string;
  items: readonly Activity[];
  lang: Lang;
}) {
  if (items.length === 0) return null;
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-4 pt-12">
      <h2 id={`${id}-title`} className="font-display text-3xl font-extrabold sm:text-4xl">
        <span aria-hidden>{emoji}</span> {heading}
      </h2>
      <p className="mt-1 text-ink-muted">{sub}</p>
      <ul className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {items.map((a, i) => (
          <li key={a.key}>
            <ActivityCard activity={a} lang={lang} index={i} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function BoredPage() {
  const { lang, d } = await getI18n();
  const all = listActivities(lang);
  const { quick, minute, long } = bucket(all);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: absoluteUrl("/bored"),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [...quick, ...minute, ...long].map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: a.title,
        url: absoluteUrl(a.href),
      })),
    },
  };

  const more = [
    { href: "/daily", label: d.footerDaily },
    { href: "/boss", label: d.footerBoss },
    { href: "/games", label: d.footerGames },
    { href: "/experiences", label: d.footerAll },
    { href: "/world", label: d.footerWorld },
    { href: "/excuses", label: d.footerExcuses },
    { href: "/dhaka-person", label: d.footerPerson },
    ...GUIDE_SLUGS.map((s) => ({ href: `/${s}`, label: t(guides[s].name, lang) })),
  ];

  return (
    <main className="mx-auto w-full max-w-5xl px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative pb-4 pt-8 text-center sm:pt-14">
        <span aria-hidden className="pointer-events-none absolute left-[2%] top-[8%] animate-float text-4xl sm:text-5xl" style={{ ["--r" as string]: "-10deg" }}>
          🥱
        </span>
        <span aria-hidden className="pointer-events-none absolute right-[3%] top-[2%] animate-float text-4xl sm:text-5xl" style={{ ["--r" as string]: "8deg", animationDelay: "-2s" }}>
          🛋️
        </span>
        <h1 className="relative mx-auto font-display text-6xl font-extrabold leading-none tracking-tight sm:text-8xl">
          <span className="inline-block -rotate-2 rounded-2xl border-2 border-ink bg-lime px-4 py-1 shadow-pop">{d.boredTitle}</span>
        </h1>
        <p className="relative mx-auto mt-6 max-w-xl text-lg font-bold sm:text-xl">{d.boredSub}</p>
        <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ChaosRoulette activities={all} label={d.boredCta} className="w-full sm:w-auto" />
          <Link href="#quick" className={`${btnPrimary} w-full bg-surface sm:w-auto`}>
            {d.boredJump}
          </Link>
        </div>
      </section>

      <Section id="quick" emoji="⚡" heading={d.boredQuickTitle} sub={d.boredQuickSub} items={quick} lang={lang} />
      <Section id="one-minute" emoji="😂" heading={d.boredMinuteTitle} sub={d.boredMinuteSub} items={minute} lang={lang} />
      <Section id="five-minutes" emoji="🧠" heading={d.boredLongTitle} sub={d.boredLongSub} items={long} lang={lang} />

      {/* I don't know */}
      <section id="surprise" aria-labelledby="surprise-title" className="scroll-mt-4 pt-12">
        <div className={`${card} rotate-[0.5deg] bg-sky p-8 text-center sm:p-12`}>
          <h2 id="surprise-title" className="font-display text-4xl font-extrabold sm:text-5xl">
            <span aria-hidden>🎲</span> {d.boredIdkTitle}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-lg">{d.boredIdkSub}</p>
          <ChaosRoulette activities={all} label={d.boredSurprise} className="mt-6" />
          <p className="mt-4">
            <Link href="/#mood" className="font-bold underline underline-offset-4">
              {d.boredMood}
            </Link>
          </p>
        </div>
      </section>

      {/* Internal links */}
      <nav aria-labelledby="more-title" className="pt-12">
        <h2 id="more-title" className="font-display text-2xl font-extrabold sm:text-3xl">
          {d.boredMoreTitle}
        </h2>
        <ul className="mt-4 flex flex-wrap gap-3">
          {more.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={chip}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
