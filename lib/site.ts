// Single source of truth for site-wide config. Brand name is a placeholder
// until the domain is chosen.

function normalizeUrl(raw: string | undefined): string {
  const fallback = "http://localhost:3000";
  if (!raw) return fallback;
  try {
    return new URL(raw).origin;
  } catch {
    return fallback;
  }
}

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();

export const siteConfig = {
  name: "Dopamine Web",
  tagline: "Tiny simulators for everyday chaos.",
  description:
    "Free one-minute simulators about everyday chaos — hail a Dhaka CNG, haggle, lose, and share the ending with friends. No sign-up.",
  url: normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL),
  locale: "en_US",
  /** Optional; shown on About/Privacy when set. */
  contactEmail: contactEmail && contactEmail.includes("@") ? contactEmail : null,
} as const;

export function absoluteUrl(path = "/"): string {
  return new URL(path, siteConfig.url).toString();
}
