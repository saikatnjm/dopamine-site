import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActivityCard } from "@/components/experience/activity-card";
import { ChaosRoulette } from "@/components/experience/chaos-roulette";
import { accentBg, btnPrimary, card, chip } from "@/components/ui/styles";
import { ViralTracker } from "@/components/viral/viral-tracker";
import { guides } from "@/data/guides";
import { listActivities } from "@/lib/activities";
import { fmt, num, t } from "@/lib/i18n/core";
import { getI18n } from "@/lib/i18n/server";
import { viralView } from "@/lib/viral";

// Landing page for social-video traffic. Data: data/viral.ts.
// Deep link: /viral?play=<slug> features that activity. Canonical stays /viral.

const title = "You saw the video. Now try it yourself.";
const description = "Play the Dhaka chaos from the video — traffic dodging, chicken crossing, CNG catching. Free, in your browser, no sign-up.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/viral" },
  // Social landing page, deliberately minimal: keep it out of search results.
  robots: { index: false, follow: true },
  openGraph: { type: "website", url: "/viral", title, description },
  twitter: { card: "summary_large_image", title, description },
};

type Props = { searchParams: Promise<{ play?: string | string[] }> };

export default async function ViralPage({ searchParams }: Props) {
  const [{ play }, { lang, d }] = await Promise.all([searchParams, getI18n()]);
  const view = viralView(lang, Array.isArray(play) ? play[0] : play);
  if (!view) notFound();
  const { featured: f, rest } = view;
  const time =
    f.durationSec === undefined
      ? null
      : f.durationSec >= 90
        ? fmt(d.minutes, { n: num(Math.round(f.durationSec / 60), lang) })
        : fmt(d.gameSeconds, { n: num(f.durationSec, lang) });

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-4">
      <ViralTracker featured={f.key} deepLink={view.deepLink} />

      <header className="text-center">
        <h1 className="font-display text-5xl font-black leading-none tracking-tight sm:text-7xl">
          <span className="inline-block -rotate-2 rounded-2xl border-2 border-ink bg-chili px-3 py-1 shadow-pop">{d.viralTitle}</span>
        </h1>
        <p className="mt-4 text-xl font-extrabold sm:text-2xl">{d.viralSub}</p>
      </header>

      <div data-viral-links>
        <article className={`${card} mt-6 overflow-hidden`} aria-labelledby="viral-featured">
          <div className={`${accentBg[f.accent]} flex items-center gap-4 border-b-2 border-ink px-5 py-4`}>
            <span aria-hidden className="text-6xl leading-none drop-shadow-[3px_3px_0_rgb(26_19_37)]">
              {f.emoji}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-wider">
                {view.deepLink ? d.viralFromVideo : f.kindLabel}
                {time ? ` · ⏱️ ${time}` : ""}
              </p>
              <h2 id="viral-featured" className="font-display text-3xl font-extrabold leading-tight">
                {f.title}
              </h2>
            </div>
          </div>
          <div className="grid gap-3 p-5">
            <p className="font-bold">{f.tagline}</p>
            <Link href={f.href} className={`${btnPrimary} ${accentBg[f.accent]} min-h-16 w-full text-2xl`}>
              {d.viralPlay}
            </Link>
          </div>
        </article>

        {rest.length > 0 && (
          <section aria-labelledby="viral-more" className="mt-8">
            <h2 id="viral-more" className="font-display text-2xl font-extrabold">
              {d.viralMore}
            </h2>
            <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {rest.map((a, i) => (
                <li key={a.key}>
                  <ActivityCard activity={a} lang={lang} index={i} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <nav aria-label={d.guideOther} className="mt-8 flex flex-wrap items-center gap-3">
          <ChaosRoulette activities={listActivities(lang)} label={d.boredSurprise} />
          <Link href="/bored" className={chip}>
            {d.footerBored}
          </Link>
          {(["funny-online-games", "one-minute-games"] as const).map((s) => (
            <Link key={s} href={`/${s}`} className={chip}>
              <span aria-hidden>{guides[s].emoji}</span> {t(guides[s].name, lang)}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
