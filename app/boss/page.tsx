import type { Metadata } from "next";
import Link from "next/link";
import { BossArena } from "@/components/boss/boss-arena";
import { bossCopy as copy } from "@/data/bosses";
import { t } from "@/lib/i18n/core";
import { getI18n } from "@/lib/i18n/server";
import { absoluteUrl } from "@/lib/site";

const TITLE = "Weekly Boss — 👹 Dhaka Traffic Boss | Hottogol";
const DESCRIPTION =
  "A new boss every week, the same for everyone. Beat the Dhaka Traffic Boss, chase your best score and challenge a friend. Free, in your browser.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/boss" },
  openGraph: { type: "website", url: "/boss", title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default async function BossPage() {
  const { lang, d } = await getI18n();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: "Hottogol Weekly Boss",
    description: DESCRIPTION,
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="text-sm text-ink-muted">
        <Link href="/" className="hover:text-ink">
          {t(copy.home, lang)}
        </Link>
      </nav>
      <header className="mb-6 mt-4">
        <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight">👹 {t(copy.weeklyBoss, lang)}</h1>
        <p className="mt-2 text-lg text-ink-muted">{t(copy.localNote, lang)}</p>
      </header>
      <BossArena mode={{ kind: "weekly" }} />
    </main>
  );
}
