import Link from "next/link";
import { SurpriseButton } from "@/components/experience/surprise-button";
import { listExperiences } from "@/lib/experience/registry";
import { getI18n } from "@/lib/i18n/server";
import { siteConfig } from "@/lib/site";
import { LangToggle } from "./lang-toggle";

export async function SiteHeader() {
  const { d } = await getI18n();
  const slugs = listExperiences().map((e) => e.slug);
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-2 px-4 py-4">
      <Link
        href="/"
        aria-label={siteConfig.name}
        className="inline-flex -rotate-2 items-center gap-1.5 whitespace-nowrap rounded-xl border-2 border-ink bg-chili px-2.5 py-1.5 font-display text-base font-extrabold shadow-pop transition-transform hover:rotate-0 sm:px-3 sm:text-lg"
      >
        <span aria-hidden>🧠</span>
        <span className="hidden min-[400px]:inline">{siteConfig.name}</span>
      </Link>
      <nav className="flex items-center gap-2" aria-label="Main">
        <Link href="/experiences" className="hidden rounded-pill px-3 py-2 font-bold hover:underline md:inline-flex">
          {d.navExperiences}
        </Link>
        <Link
          href="/world"
          aria-label={d.navWorld}
          className="inline-flex min-h-11 items-center gap-1 rounded-pill px-2 py-2 font-bold hover:underline sm:px-3"
        >
          <span aria-hidden>🗺️</span>
          <span className="hidden sm:inline">{d.navWorld}</span>
        </Link>
        <Link
          href="/games"
          aria-label={d.navGames}
          className="inline-flex min-h-11 items-center gap-1 rounded-pill px-2 py-2 font-bold hover:underline sm:px-3"
        >
          <span aria-hidden>🎮</span>
          <span className="hidden sm:inline">{d.navGames}</span>
        </Link>
        <LangToggle />
        <SurpriseButton slugs={slugs} size="sm" />
      </nav>
    </header>
  );
}
