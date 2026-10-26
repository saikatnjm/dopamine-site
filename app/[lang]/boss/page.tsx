import { BossArena } from "@/components/boss/boss-arena";
import { bossCopy as copy } from "@/data/bosses";
import { t } from "@/lib/i18n/core";
import { getI18n } from "@/lib/i18n/server";
import { absoluteUrl } from "@/lib/site";
import { RelatedLinks } from "@/components/related/related-links";
import { staticPageMetadata } from "@/lib/seo-pages";
import { pageSeo } from "@/lib/seo-text";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { activityLd } from "@/lib/seo";
import { HowToPlay } from "@/components/seo/how-to";
export const generateMetadata = () => staticPageMetadata("boss", "/boss");

export default async function BossPage() {
  const { lang } = await getI18n();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: "Hottogol Weekly Boss",
    description: pageSeo("boss", lang).description,
    url: absoluteUrl("/boss"),
    genre: "Party",
    playMode: "SinglePlayer",
    applicationCategory: "Game",
    operatingSystem: "Any (web browser)",
    isAccessibleForFree: true,
    inLanguage: ["en", "bn"],
  };

  return (
    <main className="mx-auto w-full max-w-xl px-4 pb-16 pt-6">
      <JsonLd ld={activityLd("/boss", jsonLd, lang)} />
      <Breadcrumbs items={[{ name: t(copy.weeklyBoss, lang) }]} />
      <header className="mb-6 mt-4">
        <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight">👹 {t(copy.weeklyBoss, lang)}</h1>
        <p className="mt-2 text-lg text-ink-muted">{t(copy.localNote, lang)}</p>
      </header>
      <BossArena mode={{ kind: "weekly" }} />
      <HowToPlay activity="g:traffic-boss" name={t(copy.weeklyBoss, lang)} />
      <RelatedLinks current="g:traffic-boss" />
    </main>
  );
}
