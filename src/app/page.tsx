"use client";

import { NextIntlClientProvider } from '@/i18n/client';
import enText from '../../public/locales/en.json';
import svText from '../../public/locales/sv.json';
import HomePage from "@/components/pages/HomePage";
import DynamicSlugPage from "@/components/DynamicSlugPage";
import { usePathname } from "next/navigation";

const textMap = {
  en: enText,
  sv: svText,
};

export default function RootPage() {
  const pathname = usePathname();

  const segments = pathname?.split('?')[0].split('/').filter(Boolean) || [];

  const locale: keyof typeof textMap = segments[0] === 'sv' ? 'sv' : 'en';
  const segmentsWithoutLocale = segments.slice(1);
  const slug = segmentsWithoutLocale.join('/');

  const localizedText = textMap[locale];

  return (
    <NextIntlClientProvider locale={locale} localizedText={localizedText}>
      {!slug ? <HomePage /> : <DynamicSlugPage slug={slug} />}
    </NextIntlClientProvider>
  );
}
