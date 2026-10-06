import SignupPage from "@/components/authentication/SignupPage";
import { NextIntlClientProvider } from "@/i18n/client";
import enMessages from "../../../../../public/locales/en.json";

export default function EnSignupRoute() {
  return (
    <NextIntlClientProvider locale="en" localizedText={enMessages}>
      <SignupPage />
    </NextIntlClientProvider>
  );
}