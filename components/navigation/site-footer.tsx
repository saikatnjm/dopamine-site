import Link from "@/components/i18n/link";
import { GUIDE_SLUGS, guides } from "@/data/guides";
import { t } from "@/lib/i18n/core";
import { getI18n } from "@/lib/i18n/server";
import { siteConfig } from "@/lib/site";

export async function SiteFooter() {
  const { lang, d } = await getI18n();
  // Grouped so the footer reads as a few short lists instead of one long wrap.
  const groups = [
    {
      title: d.footerExplore,
      links: [
        { href: "/experiences", label: d.footerAll },
        { href: "/world", label: d.footerWorld },
        { href: "/games", label: d.footerGames },
      ],
    },
    {
      title: d.footerChallenges,
      links: [
        { href: "/daily", label: d.footerDaily },
        { href: "/boss", label: d.footerBoss },
        { href: "/achievements", label: d.footerAchievements },
      ],
    },
    {
      title: d.footerFun,
      links: [
        { href: "/bored", label: d.footerBored },
        { href: "/excuses", label: d.footerExcuses },
        { href: "/dhaka-person", label: d.footerPerson },
        { href: "/games/personality", label: d.footerPersonality },
        { href: "/games/ancholik-quiz", label: d.footerDialect },
        { href: "/games/word-map", label: d.footerWords },
        { href: "/games/which-region", label: d.footerWhichRegion },
      ],
    },
    {
      title: d.footerGuides,
      links: GUIDE_SLUGS.map((s) => ({ href: `/${s}`, label: t(guides[s].name, lang) })),
    },
    {
      title: d.footerSite,
      links: [
        { href: "/about", label: d.footerAbout },
        { href: "/about#contact", label: d.footerContact },
        { href: "/privacy", label: d.footerPrivacy },
        { href: "/terms", label: d.footerTerms },
      ],
    },
  ];
  return (
    <footer className="mt-16 border-t-2 border-ink bg-ink text-bg">
      <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-10 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <p className="font-display text-2xl font-extrabold">🧠 {siteConfig.name}</p>
          <p className="mt-1 max-w-xs text-sm opacity-80">{d.tagline}</p>
          <p className="mt-3 max-w-xs text-xs opacity-60">{d.footerNote}</p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 xl:grid-cols-5">
          {groups.map((g) => (
            <div key={g.title}>
              <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-lime">{g.title}</p>
              <ul className="grid gap-1 text-sm font-semibold">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="inline-flex min-h-9 items-center underline-offset-4 opacity-90 hover:underline hover:opacity-100">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="border-t border-bg/15">
        <div className="mx-auto flex w-full max-w-5xl justify-center px-4 py-5 text-center text-xs sm:justify-start sm:text-left">
          <p className="opacity-60">© {siteConfig.name}</p>
        </div>
      </div>
    </footer>
  );
}
