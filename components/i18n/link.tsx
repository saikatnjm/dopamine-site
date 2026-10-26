"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { useI18n } from "@/components/providers/lang-provider";
import { localePath } from "@/lib/i18n/paths";

/**
 * next/link that keeps the reader in their language: on Bangla pages internal
 * paths get the /bn prefix ("/games" → "/bn/games"). Use it instead of next/link.
 */
export default function Link({ href, ...rest }: ComponentProps<typeof NextLink>) {
  const { lang } = useI18n();
  const localized =
    typeof href === "string"
      ? localePath(href, lang)
      : href.pathname
        ? { ...href, pathname: localePath(href.pathname, lang) }
        : href;
  return <NextLink href={localized} {...rest} />;
}
