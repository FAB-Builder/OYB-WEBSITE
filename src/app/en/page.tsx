import { NextIntlClientProvider } from '@/i18n/client';
import enText from '../../../public/locales/en.json';
import HomePage from '@/components/pages/HomePage';
import { homeMetadata } from '@/lib/seo';

export const metadata = homeMetadata("en");

export default function EnPage() {

  return (
    <NextIntlClientProvider locale="en" localizedText={enText}>
      <HomePage />
    </NextIntlClientProvider>
  );
}
