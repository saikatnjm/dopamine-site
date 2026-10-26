import { NextResponse, type NextRequest } from "next/server";

// Language routing (Phase 49 step B). Every route lives under app/[lang]/.
//   /bn/…  → served as is (Bangla).
//   /en/…  → 308 to the unprefixed URL, except metadata images (Next builds
//            their URLs from the route, so they really live under /en/…).
//   /…     → rewritten to /en/… (English stays at clean URLs). A visitor who
//            chose Bangla (lang=bn cookie, set by the toggle) is sent to /bn/…
//            first. Crawlers send no cookie, so every URL has one language.

const LANG_COOKIE = "lang"; // keep in sync with lib/i18n/core.ts
const METADATA_ASSET = /\/(opengraph-image|twitter-image|icon|apple-icon)(-[\w-]+)?(\/|$)/;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/bn" || pathname.startsWith("/bn/")) return NextResponse.next();

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    if (METADATA_ASSET.test(pathname)) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  // Only full page loads follow the saved preference (not prefetches or RSC fetches).
  const isPageLoad = request.method === "GET" && !request.headers.has("rsc") && !request.headers.has("next-router-prefetch");
  if (isPageLoad && request.cookies.get(LANG_COOKIE)?.value === "bn" && !METADATA_ASSET.test(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? "/bn" : `/bn${pathname}`;
    return NextResponse.redirect(url, 307);
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/en" : `/en${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip Next internals, root-level metadata files (sitemap, robots, icons) and static files.
  matcher: ["/((?!_next/|api/|sitemap\\.xml|robots\\.txt|favicon\\.ico|icon\\.svg|apple-icon|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|txt|xml|webmanifest|js|css|map)$).*)"],
};
