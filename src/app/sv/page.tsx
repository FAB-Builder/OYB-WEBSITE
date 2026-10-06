"use client";

import { NextIntlClientProvider } from '@/i18n/client';
import svText from '../../../public/locales/sv.json';
import HomePage from '@/components/pages/HomePage';

export default function SvPage() {

  return (
    <NextIntlClientProvider locale="sv" localizedText={svText}>
      <HomePage />
    </NextIntlClientProvider>
  );
}
