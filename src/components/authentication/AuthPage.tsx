"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Check, Mail, MessageCircle, X } from "lucide-react";
import { useLocale, useTranslations } from "@/i18n/client";
import { API_HOST } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthMode = "sign-in" | "sign-up";
type AuthMethod = "email" | "whatsapp";
type OtpStep = "phone" | "code";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// E.164: "+" then country code and number, 8-15 digits in total.
const PHONE_REGEX = /^\+[1-9]\d{7,14}$/;
const OTP_LENGTH = 6;
const TERMS_PATH = "/pages/terms";
const PRIVACY_PATH = "/pages/privacy";

// Same rules customer-messenger enforces on sign-up.
const PASSWORD_RULES = [
  { key: "length", test: (value: string) => value.length >= 8 },
  { key: "uppercase", test: (value: string) => /[A-Z]/.test(value) },
  { key: "lowercase", test: (value: string) => /[a-z]/.test(value) },
  { key: "number", test: (value: string) => /[0-9]/.test(value) },
  { key: "symbol", test: (value: string) => /[!@#$%^&*(),.?":{}|<>]/.test(value) },
] as const;

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : null;
}

function getRequestError(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data;
    if (typeof payload === "string" && payload.length > 0) {
      return payload;
    }

    const record = asRecord(payload);
    const nested = asRecord(record?.error);
    const message = record?.message ?? nested?.message ?? record?.error;
    if (typeof message === "string" && message.length > 0) {
      return message;
    }
  }

  return error instanceof Error ? error.message : fallback;
}

// The OTP verify endpoint returns the token, either bare or wrapped.
function extractToken(data: unknown): string {
  if (typeof data === "string") {
    const text = data.trim();
    try {
      const parsed: unknown = JSON.parse(text);
      if (parsed !== data) return extractToken(parsed);
    } catch {
      // Plain token text.
    }
    return text;
  }
  const record = asRecord(data);
  const token = record?.token ?? record?.accessToken ?? asRecord(record?.data)?.token;
  return typeof token === "string" ? token.trim() : "";
}

function normalizePhone(value: string): string {
  return value.replace(/[\s\-().]/g, "");
}

function formatTimer(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

export default function AuthPage({ mode }: { mode: AuthMode }) {
  const t = useTranslations();
  const activeLocale = useLocale();
  const router = useRouter();
  const pageKey = `auth.${mode}`;
  const isSignUp = mode === "sign-up";
  const otherMode: AuthMode = isSignUp ? "sign-in" : "sign-up";

  const [method, setMethod] = useState<AuthMethod>("email");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState<OtpStep>("phone");
  const [resendIn, setResendIn] = useState(0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = window.setTimeout(() => setResendIn((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [resendIn]);

  function switchMethod(next: AuthMethod) {
    setMethod(next);
    setError("");
    setOtp("");
    setOtpStep("phone");
  }

  async function completeAuth(jwt: string) {
    if (!jwt) {
      throw new Error(t("auth.tokenError"));
    }

    window.localStorage.setItem("jwt", jwt);
    window.localStorage.removeItem("profile");

    const profileResponse = await axios.get<unknown>(`${API_HOST}/api/auth/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    const profile = profileResponse.data;

    if (profile === null || profile === undefined) {
      throw new Error(t("auth.profileError"));
    }

    window.localStorage.setItem("profile", JSON.stringify(profile));
    window.localStorage.setItem("preferredLocale", activeLocale);
    router.push("/workspaces");
  }

  function validateEmailSignUp(): string {
    if (!firstName.trim()) return t("auth.firstNameRequired");
    if (!EMAIL_REGEX.test(email.trim())) return t("auth.emailInvalid");
    if (!PASSWORD_RULES.every((rule) => rule.test(password))) return t("auth.passwordWeak");
    if (password !== confirmPassword) return t("auth.passwordMismatch");
    if (!acceptedTerms) return t("auth.termsRequired");
    return "";
  }

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (isSignUp) {
      const validationError = validateEmailSignUp();
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setSubmitting(true);
    try {
      const body = isSignUp
        ? {
            email: email.trim(),
            password,
            profile: { firstName: firstName.trim(), lastName: lastName.trim() },
          }
        : { email, password };

      const authResponse = await axios.post<string>(`${API_HOST}/api/auth/${mode}`, body, {
        responseType: "text",
      });
      await completeAuth(authResponse.data.trim());
    } catch (submitError) {
      setError(getRequestError(submitError, t("auth.requestError")));
    } finally {
      setSubmitting(false);
    }
  }

  async function sendOtp() {
    setError("");
    const phoneNumber = normalizePhone(phone);

    if (!PHONE_REGEX.test(phoneNumber)) {
      setError(t("auth.whatsapp.phoneInvalid"));
      return;
    }
    if (isSignUp && !acceptedTerms) {
      setError(t("auth.termsRequired"));
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post<unknown>(`${API_HOST}/api/auth/otp/request`, {
        phoneNumber,
        channel: "whatsapp",
        app: "CRM",
      });
      const resendAfter = asRecord(response.data)?.resendAfterSeconds;
      setResendIn(typeof resendAfter === "number" ? resendAfter : 60);
      setOtp("");
      setOtpStep("code");
    } catch (requestError) {
      setError(getRequestError(requestError, t("auth.requestError")));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleWhatsappSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (otpStep === "phone") {
      await sendOtp();
      return;
    }

    setError("");
    if (otp.length !== OTP_LENGTH) {
      setError(t("auth.whatsapp.codeInvalid"));
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post<string>(
        `${API_HOST}/api/auth/otp/verify`,
        { phoneNumber: normalizePhone(phone), otp, app: "CRM" },
        { responseType: "text" },
      );
      await completeAuth(extractToken(response.data));
    } catch (verifyError) {
      setOtp("");
      setError(getRequestError(verifyError, t("auth.whatsapp.codeInvalid")));
    } finally {
      setSubmitting(false);
    }
  }

  const linkClass = "font-medium text-primary underline-offset-4 hover:underline";

  const termsCheckbox = isSignUp && (
    <label className="flex items-start gap-2.5 text-sm text-muted-foreground">
      <input
        type="checkbox"
        name="acceptTerms"
        className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
        checked={acceptedTerms}
        onChange={(event) => setAcceptedTerms(event.target.checked)}
      />
      <span>
        {t("auth.terms.prefix")}{" "}
        <Link href={TERMS_PATH} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {t("auth.terms.terms")}
        </Link>{" "}
        {t("auth.terms.and")}{" "}
        <Link href={PRIVACY_PATH} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {t("auth.terms.privacy")}
        </Link>
      </span>
    </label>
  );

  const errorMessage = error && (
    <p className="text-sm text-destructive" role="alert">
      {error}
    </p>
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f5f0] px-5 py-10">
      <section className="w-full max-w-md border border-black/10 bg-white px-6 py-8 shadow-[0_18px_60px_rgba(35,49,39,0.08)] sm:px-10 sm:py-10">
        <Link href={`/${activeLocale}`} className="text-sm font-semibold tracking-[0.12em] text-primary">
          OYB
        </Link>
        <h1 className="mt-10 text-3xl font-semibold text-[#202820]">{t(`${pageKey}.title`)}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{t(`${pageKey}.description`)}</p>

        <div role="tablist" aria-label={t("auth.methodLabel")} className="mt-8 grid grid-cols-2 border border-input p-1">
          {(["email", "whatsapp"] as const).map((option) => {
            const Icon = option === "email" ? Mail : MessageCircle;
            const selected = method === option;
            return (
              <button
                key={option}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => switchMethod(option)}
                className={`flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
                  selected ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
                {t(`auth.methods.${option}`)}
              </button>
            );
          })}
        </div>

        {method === "email" ? (
          <form className="mt-6 space-y-5" onSubmit={handleEmailSubmit} noValidate={isSignUp}>
            {isSignUp && (
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t("auth.firstName")}</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    autoComplete="given-name"
                    required
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t("auth.lastName")}</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input
                id="password"
                type="password"
                name="password"
                autoComplete={isSignUp ? "new-password" : "current-password"}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              {isSignUp && password.length > 0 && (
                <ul className="grid gap-1 pt-1 text-xs sm:grid-cols-2">
                  {PASSWORD_RULES.map((rule) => {
                    const met = rule.test(password);
                    const Icon = met ? Check : X;
                    return (
                      <li
                        key={rule.key}
                        className={`flex items-center gap-1.5 ${met ? "text-primary" : "text-muted-foreground"}`}
                      >
                        <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                        {t(`auth.passwordRules.${rule.key}`)}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t("auth.confirmPassword")}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </div>
            )}

            {termsCheckbox}
            {errorMessage}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? t("auth.submitting") : t(`${pageKey}.action`)}
            </Button>
          </form>
        ) : (
          <form className="mt-6 space-y-5" onSubmit={handleWhatsappSubmit} noValidate>
            <div className="space-y-2">
              <Label htmlFor="phone">{t("auth.whatsapp.phone")}</Label>
              <Input
                id="phone"
                type="tel"
                name="phone"
                autoComplete="tel"
                inputMode="tel"
                placeholder="+46 70 123 45 67"
                disabled={otpStep === "code"}
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
              {otpStep === "phone" && (
                <p className="text-xs text-muted-foreground">{t("auth.whatsapp.phoneHint")}</p>
              )}
            </div>

            {otpStep === "code" && (
              <div className="space-y-2">
                <Label htmlFor="otp">{t("auth.whatsapp.code")}</Label>
                <Input
                  id="otp"
                  name="otp"
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  maxLength={OTP_LENGTH}
                  className="tracking-[0.4em]"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH))}
                />
                <p className="text-xs text-muted-foreground">
                  {t("auth.whatsapp.codeSent").replace("{phone}", normalizePhone(phone))}
                </p>
                <div className="flex justify-between text-xs">
                  <button
                    type="button"
                    className={linkClass}
                    onClick={() => {
                      setOtpStep("phone");
                      setOtp("");
                      setError("");
                    }}
                  >
                    {t("auth.whatsapp.changePhone")}
                  </button>
                  {resendIn > 0 ? (
                    <span className="text-muted-foreground">
                      {t("auth.whatsapp.resendIn").replace("{time}", formatTimer(resendIn))}
                    </span>
                  ) : (
                    <button type="button" className={linkClass} disabled={submitting} onClick={() => void sendOtp()}>
                      {t("auth.whatsapp.resend")}
                    </button>
                  )}
                </div>
              </div>
            )}

            {otpStep === "phone" && termsCheckbox}
            {errorMessage}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting
                ? t("auth.submitting")
                : otpStep === "phone"
                  ? t("auth.whatsapp.sendCode")
                  : t(`${pageKey}.action`)}
            </Button>
          </form>
        )}

        <p className="mt-7 text-center text-sm text-muted-foreground">
          {t(`${pageKey}.switchPrompt`)}{" "}
          <Link className={linkClass} href={`/${activeLocale}/auth/${otherMode === "sign-in" ? "signin" : "signup"}`}>
            {t(`${pageKey}.switchAction`)}
          </Link>
        </p>
      </section>
    </main>
  );
}
