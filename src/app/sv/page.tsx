import { NextIntlClientProvider } from '@/i18n/client';
import svText from '../../../public/locales/sv.json';
import HomePage from '@/components/pages/HomePage';
import { homeMetadata } from '@/lib/seo';

export const metadata = homeMetadata("sv");

export default function SvPage() {

  return (
    <NextIntlClientProvider locale="sv" localizedText={svText}>
      <HomePage />
    </NextIntlClientProvider>
  );
}
