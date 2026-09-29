import Script from "next/script";
import { getGaId } from "@/lib/analytics";

// Loads GA4 after the page is interactive. Renders nothing when
// NEXT_PUBLIC_GA_ID is empty or malformed.
//
// Consent Mode v2 defaults: analytics allowed, all ad-related storage denied.
// When ads (AdSense) are added, a certified consent banner must update these
// for EEA/UK/CH visitors before ad storage is granted.
export function GoogleAnalytics() {
  const gaId = getGaId();
  if (!gaId) return null;

  return (
    <>
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  analytics_storage: 'granted',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied'
});
gtag('js', new Date());
gtag('config', '${gaId}');`}
      </Script>
      <Script
        id="ga-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
    </>
  );
}
