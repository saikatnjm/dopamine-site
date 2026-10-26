import { ldJson } from "@/lib/seo";

/** JSON-LD script tag; several nodes are wrapped in one @graph. */
export function JsonLd({ ld }: { ld: Record<string, unknown> | readonly Record<string, unknown>[] }) {
  const nodes = Array.isArray(ld) ? ld : [ld];
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(...nodes) }} />;
}
