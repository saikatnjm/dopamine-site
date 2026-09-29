import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Noto_Sans_Bengali } from "next/font/google";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { SiteFooter } from "@/components/navigation/site-footer";
import { SiteHeader } from "@/components/navigation/site-header";
import { LangProvider } from "@/components/providers/lang-provider";
import { MotionProvider } from "@/components/providers/motion-provider";
import { getI18n } from "@/lib/i18n/server";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
});

// Bangla glyphs fall through to this font via the font-family stack.
const bangla = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-bangla",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    url: "/",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fff3d6",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { lang, d } = await getI18n();
  return (
    <html lang={lang} className={`${bricolage.variable} ${bangla.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-pill bg-ink px-4 py-2 font-bold text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          {d.skip}
        </a>
        <LangProvider lang={lang}>
          <SiteHeader />
          <div id="main" className="flex-1">
            <MotionProvider>{children}</MotionProvider>
          </div>
          <SiteFooter />
        </LangProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
