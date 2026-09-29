// Share-target URLs and clipboard helper. No SDKs, no tracking pixels.

export type ShareMethod = "native" | "copy" | "whatsapp" | "facebook" | "x" | "image";

export function shareTargets(url: string, text: string) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(text);
  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    x: `https://x.com/intent/post?text=${t}&url=${u}`,
  } as const;
}

/** Copy text; falls back to a hidden textarea where the Clipboard API is missing. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to legacy path
  }
  try {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    el.remove();
    return ok;
  } catch {
    return false;
  }
}
