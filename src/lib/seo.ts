import type { Metadata } from "next";
import enText from "../../public/locales/en.json";
import svText from "../../public/locales/sv.json";

export const SITE_URL = "https://oyb.app";

const seoByLocale = {
  en: { ...enText.home.seo, ogLocale: "en_US" },
  sv: { ...svText.home.seo, ogLocale: "sv_SE" },
};

export function homeMetadata(locale: keyof typeof seoByLocale, canonicalPath = `/${locale}`): Metadata {
  const seo = seoByLocale[locale];
  return {
    title: { absolute: seo.title },
    description: seo.description,
    keywords: seo.keywords.split(",").map((k) => k.trim()),
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: "/en",
        sv: "/sv",
        "x-default": "/en",
      },
    },
    openGraph: {
      type: "website",
      url: canonicalPath,
      siteName: "OYB – Own Your Brand",
      title: seo.title,
      description: seo.description,
      locale: seo.ogLocale,
      alternateLocale: Object.values(seoByLocale)
        .map((s) => s.ogLocale)
        .filter((l) => l !== seo.ogLocale),
    },
    twitter: {
      card: "summary",
      title: seo.title,
      description: seo.description,
    },
  };
}
