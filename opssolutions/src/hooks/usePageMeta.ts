import { useEffect } from "react";

interface PageMeta {
  title: string;
  description: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
}

const DEFAULT_IMAGE =
  "https://readdy.ai/api/search-image?query=dark%20cinematic%20abstract%20technology%20background%20with%20digital%20code%20streams%20glowing%20green%20neon%20grid%20lines%20DevCraft%20Studio%20software%20development%20agency%20brand%20image%20premium%20dark%20tech%20aesthetic&width=1200&height=630&seq=og_default_v3&orientation=landscape";

export function usePageMeta({ title, description, ogImage, ogType = "website", canonical }: PageMeta) {
  useEffect(() => {
    const fullTitle = title.includes("Solutions") ? title : `${title} | Solutions Studio`;
    const img = ogImage ?? DEFAULT_IMAGE;
    const url = canonical ?? window.location.href;

    document.title = fullTitle;

    const setMeta = (sel: string, val: string) => {
      let el = document.querySelector(sel) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        const attr = sel.includes("property=") ? "property" : "name";
        el.setAttribute(attr, sel.replace(/.*["']([^"']+)["'].*/, "$1"));
        document.head.appendChild(el);
      }
      el.setAttribute("content", val);
    };

    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', fullTitle);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:image"]', img);
    setMeta('meta[property="og:url"]', url);
    setMeta('meta[property="og:type"]', ogType);
    setMeta('meta[name="twitter:title"]', fullTitle);
    setMeta('meta[name="twitter:description"]', description);
    setMeta('meta[name="twitter:image"]', img);

    // Canonical
    let canonEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonEl) {
      canonEl = document.createElement("link");
      canonEl.rel = "canonical";
      document.head.appendChild(canonEl);
    }
    canonEl.href = url;

    return () => {
      document.title = "Solutions Studio – Software Development, Web & Mobile Apps, Cloud Solutions";
    };
  }, [title, description, ogImage, ogType, canonical]);
}