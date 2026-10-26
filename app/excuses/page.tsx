import { ExcuseGenerator } from "@/components/excuses/excuse-generator";
import { excuseCopy as copy } from "@/data/excuses";
import { isCategory } from "@/lib/excuses";
import { decodeSeed } from "@/lib/games/shared";
import { t } from "@/lib/i18n/core";
import { getI18n } from "@/lib/i18n/server";
import { newSeed } from "@/lib/random";
import { RelatedLinks } from "@/components/related/related-links";
import { staticPageMetadata } from "@/lib/seo-pages";
import { PAGE_SEO } from "@/data/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { activityLd } from "@/lib/seo";

type Props = { searchParams: Promise<{ c?: string | string[]; s?: string | string[]; go?: string | string[] }> };

export const metadata = staticPageMetadata("excuses", "/excuses");

export default async function ExcusesPage({ searchParams }: Props) {
  const [params, { lang }] = await Promise.all([searchParams, getI18n()]);

  // Shared link (?c=<category>&s=<seed36>) reproduces an excuse exactly.
  // ?go=1 (homepage button) starts with a fresh excuse. Anything invalid is ignored.
  const seed = decodeSeed(params.s);
  const category = isCategory(params.c) ? params.c : null;
  const shared = seed !== null && category !== null;
  const initial = shared ? { requested: category, seed } : params.go === "1" ? { requested: category ?? "random", seed: newSeed() } : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Hottogol Excuse Generator",
    description: PAGE_SEO["excuses"].description,
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "Any (web browser)",
    isAccessibleForFree: true,
    inLanguage: ["en", "bn"],
  };

  return (
    <main className="mx-auto w-full max-w-xl px-4 pb-16 pt-6">
      <JsonLd ld={activityLd("/excuses", jsonLd)} />
      <Breadcrumbs items={[{ name: t(copy.title, lang) }]} />
      <header className="mb-6 mt-4">
        <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight">
          😂 {t(copy.title, lang)}
        </h1>
        <p className="mt-2 text-lg text-ink-muted">{t(copy.lead, lang)}</p>
      </header>
      <ExcuseGenerator initial={initial} shared={shared} />
      <RelatedLinks current="p:excuses" />
    </main>
  );
}
