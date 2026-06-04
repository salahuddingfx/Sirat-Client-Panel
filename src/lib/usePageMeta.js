import { useEffect } from "react";

const FAVICON_ID = "sirat-page-meta-favicon";
const THEME_COLOR_ID = "sirat-page-meta-theme-color";

/**
 * Per-page browser tab customization.
 * On mount: overrides document.title, the favicon, and the meta theme-color.
 * On unmount: restores whatever the page had before.
 *
 * @param {object} opts
 * @param {string} [opts.title]          Tab title (set via document.title).
 * @param {string} [opts.faviconHref]    Absolute URL or data: URI for the favicon.
 * @param {string} [opts.themeColor]     CSS color for the mobile browser chrome (Android taskbar, etc.).
 * @param {string} [opts.faviconType]    MIME type of the favicon (e.g. "image/svg+xml" or "image/png").
 */
export function usePageMeta({ title, faviconHref, faviconType, themeColor } = {}) {
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const previousTitle = document.title;
    if (title) document.title = title;

    let previousFavicon = null;
    let faviconEl = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
    if (faviconHref) {
      if (faviconEl) {
        previousFavicon = { href: faviconEl.getAttribute("href"), type: faviconEl.getAttribute("type") };
        faviconEl.setAttribute("href", faviconHref);
        if (faviconType) faviconEl.setAttribute("type", faviconType);
        else faviconEl.removeAttribute("type");
        faviconEl.setAttribute("id", FAVICON_ID);
      } else {
        faviconEl = document.createElement("link");
        faviconEl.rel = "icon";
        faviconEl.id = FAVICON_ID;
        if (faviconType) faviconEl.type = faviconType;
        faviconEl.href = faviconHref;
        document.head.appendChild(faviconEl);
      }
    }

    let previousThemeColor = null;
    let themeEl = document.querySelector(`meta[name="theme-color"]#${THEME_COLOR_ID}`)
      || document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      if (themeEl) {
        previousThemeColor = themeEl.getAttribute("content");
        themeEl.setAttribute("content", themeColor);
        themeEl.setAttribute("id", THEME_COLOR_ID);
      } else {
        themeEl = document.createElement("meta");
        themeEl.name = "theme-color";
        themeEl.id = THEME_COLOR_ID;
        themeEl.content = themeColor;
        document.head.appendChild(themeEl);
      }
    }

    return () => {
      document.title = previousTitle;

      if (faviconEl && faviconHref) {
        if (previousFavicon) {
          faviconEl.setAttribute("href", previousFavicon.href || "");
          if (previousFavicon.type) faviconEl.setAttribute("type", previousFavicon.type);
          else faviconEl.removeAttribute("type");
        } else if (faviconEl.parentNode) {
          faviconEl.parentNode.removeChild(faviconEl);
        }
      }

      if (themeEl && themeColor) {
        if (previousThemeColor !== null) {
          themeEl.setAttribute("content", previousThemeColor);
        } else if (themeEl.parentNode) {
          themeEl.parentNode.removeChild(themeEl);
        }
      }
    };
  }, [title, faviconHref, faviconType, themeColor]);
}

/**
 * Build a data: URI favicon from a small inline SVG string.
 */
export function svgFavicon(svg) {
  const encoded = encodeURIComponent(svg).replace(/'/g, "%27").replace(/"/g, "%22");
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}
