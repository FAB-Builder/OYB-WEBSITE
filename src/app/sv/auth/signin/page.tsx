import SigninPage from "@/components/authentication/SigninPage";
import { NextIntlClientProvider } from "@/i18n/client";
import svMessages from "../../../../../public/locales/sv.json";

export default function SvSigninRoute() {
  return (
    <NextIntlClientProvider locale="sv" localizedText={svMessages}>
      <SigninPage />
    </NextIntlClientProvider>
  );
}