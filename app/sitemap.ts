import type { MetadataRoute } from "next";
import { SITE_URL, LOCALES } from "@/lib/site-config";

const PATHS = ["", "/about", "/events", "/shop"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((path) => ({
    url: `${SITE_URL}/${LOCALES[0]}${path}`,
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((locale) => [locale, `${SITE_URL}/${locale}${path}`])
      ),
    },
  }));
}
