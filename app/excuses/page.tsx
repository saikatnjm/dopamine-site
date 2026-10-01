import type { Metadata } from "next";
import Link from "next/link";
import { ExcuseGenerator } from "@/components/excuses/excuse-generator";
import { excuseCopy as copy } from "@/data/excuses";
import { isCategory } from "@/lib/excuses";
import { decodeSeed } from "@/lib/games/shared";
import { t } from "@/lib/i18n/core";
import { getI18n } from "@/lib/i18n/server";
import { newSeed } from "@/lib/random";
import { absoluteUrl } from "@/lib/site";
import { RelatedLinks } from "@/components/related/related-links";

type Props = { searchParams: Promise<{ c?: string | string[]; s?: string | string[]; go?: string | string[] }> };

const title = "Excuse Generator — Funny Bangla & English Excuses";
const description =
  "Need an excuse for office, university, being late, friends, family or a date? Generate a funny Dhaka-style excuse with a credibility score. Free, no sign-up.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/excuses" },
  openGraph: { type: "website", url: "/excuses", title, description },
  twitter: { card: "summary_large_image", title, description },
};

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
    url: absoluteUrl("/excuses"),
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "Any (web browser)",
    isAccessibleForFree: true,
    inLanguage: ["en", "bn"],
  };

  return (
    <main className="mx-auto w-full max-w-xl px-4 pb-16 pt-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="text-sm text-ink-muted">
        <Link href="/" className="hover:text-ink">
          {t(copy.back, lang)}
        </Link>
      </nav>
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
