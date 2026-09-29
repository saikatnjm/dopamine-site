// Single source of truth for site-wide config.

/**
 * Public site URL. Order: NEXT_PUBLIC_SITE_URL → Vercel's production domain
 * (system env, so share links never point at localhost on Vercel) → localhost.
 * Only used in server code (pages, metadata, OG images, sitemap).
 */
function resolveSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
  ];
  for (const raw of candidates) {
    if (!raw) continue;
    try {
      return new URL(raw).origin;
    } catch {
      // try the next candidate
    }
  }
  return "http://localhost:3000";
}

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();

export const siteConfig = {
  name: "Hottogol",
  author: { name: "saikatnjm", url: "https://github.com/saikatnjm" },
  tagline: "Tiny simulators for everyday chaos.",
  description:
    "Free one-minute simulators about everyday chaos — hail a Dhaka CNG, haggle, lose, and share the ending with friends. No sign-up.",
  url: resolveSiteUrl(),
  locale: "en_US",
  /** Optional; shown on About/Privacy when set. */
  contactEmail: contactEmail && contactEmail.includes("@") ? contactEmail : null,
} as const;

export function absoluteUrl(path = "/"): string {
  return new URL(path, siteConfig.url).toString();
}
