import SigninPage from "@/components/authentication/SigninPage";
import { NextIntlClientProvider } from "@/i18n/client";
import enMessages from "../../../../../public/locales/en.json";

export default function EnSigninRoute() {
  return (
    <NextIntlClientProvider locale="en" localizedText={enMessages}>
      <SigninPage />
    </NextIntlClientProvider>
  );
}