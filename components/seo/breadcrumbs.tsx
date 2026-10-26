import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd, type Crumb } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

/**
 * Visible "Hottogol › Games › CNG Catch" trail + matching BreadcrumbList JSON-LD.
 * `items` excludes Home; the last item is the current page (no link).
 */
export function Breadcrumbs({ items }: { items: readonly Crumb[] }) {
  const all: Crumb[] = [{ name: siteConfig.name, path: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-ink-muted">
      <JsonLd ld={breadcrumbLd(all)} />
      <ol className="flex flex-wrap items-center gap-1.5">
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden>›</span>}
              {last || !c.path ? (
                <span aria-current={last ? "page" : undefined} className={last ? "font-bold text-ink" : undefined}>
                  {c.name}
                </span>
              ) : (
                <Link href={c.path} className="hover:text-ink">
                  {c.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
