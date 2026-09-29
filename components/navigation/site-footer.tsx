import Link from "next/link";
import { getI18n } from "@/lib/i18n/server";
import { siteConfig } from "@/lib/site";

export async function SiteFooter() {
  const { d } = await getI18n();
  const links = [
    { href: "/experiences", label: d.footerAll },
    { href: "/about", label: d.footerAbout },
    { href: "/privacy", label: d.footerPrivacy },
    { href: "/terms", label: d.footerTerms },
    { href: "/about#contact", label: d.footerContact },
  ];
  return (
    <footer className="mt-16 border-t-2 border-ink bg-ink text-bg">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-lg font-extrabold">
          🧠 {siteConfig.name} <span className="font-normal opacity-80">— {d.tagline}</span>
        </p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-8 items-center underline-offset-4 hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="px-4 pb-6 text-center text-xs opacity-70">{d.footerNote}</p>
    </footer>
  );
}
