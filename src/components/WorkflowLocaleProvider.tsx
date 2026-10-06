"use client";

import { useEffect, useState } from "react";
import { NextIntlClientProvider } from "@/i18n/client";
import localeManifest from "../../public/locales/manifest.json";

type WorkflowTranslations = {
  locale: string;
  messages: Record<string, unknown>;
};

async function fetchLocaleMessages(locale: string): Promise<Record<string, unknown>> {
  const response = await fetch(`/locales/${encodeURIComponent(locale)}.json`);
  if (!response.ok) {
    throw new Error(`Could not load locale: ${locale}`);
  }

  const messages: unknown = await response.json();
  if (typeof messages !== "object" || messages === null || Array.isArray(messages)) {
    throw new Error(`Invalid locale catalog: ${locale}`);
  }

  return messages as Record<string, unknown>;
}

export default function WorkflowLocaleProvider({ children }: { children: React.ReactNode }) {
  const [translations, setTranslations] = useState<WorkflowTranslations | null>(null);

  useEffect(() => {
    let cancelled = false;
    const timeoutId = window.setTimeout(() => {
      const preferredLocale = window.localStorage.getItem("preferredLocale");
      const registeredLocale = localeManifest.locales.find(({ code }) => code === preferredLocale);
      const requestedLocale = registeredLocale?.code ?? localeManifest.defaultLocale;

      fetchLocaleMessages(requestedLocale)
        .then((messages) => ({ locale: requestedLocale, messages }))
        .catch(async () => ({
          locale: localeManifest.defaultLocale,
          messages: await fetchLocaleMessages(localeManifest.defaultLocale),
        }))
        .then((result) => {
          if (!cancelled) {
            setTranslations(result);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setTranslations({ locale: localeManifest.defaultLocale, messages: {} });
          }
        });
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  if (!translations) {
    return <main className="min-h-screen bg-[#f3f5f0]" aria-busy="true" />;
  }

  return (
    <NextIntlClientProvider
      locale={translations.locale}
      localizedText={translations.messages}
    >
      {children}
    </NextIntlClientProvider>
  );
}