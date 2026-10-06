import SignupPage from "@/components/authentication/SignupPage";
import { NextIntlClientProvider } from "@/i18n/client";
import svMessages from "../../../../../public/locales/sv.json";

export default function SvSignupRoute() {
  return (
    <NextIntlClientProvider locale="sv" localizedText={svMessages}>
      <SignupPage />
    </NextIntlClientProvider>
  );
}