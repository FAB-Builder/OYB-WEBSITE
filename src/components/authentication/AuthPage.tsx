"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useLocale, useTranslations } from "@/i18n/client";
import { API_HOST } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthMode = "sign-in" | "sign-up";

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

export default function AuthPage({ mode }: { mode: AuthMode }) {
  const t = useTranslations();
  const activeLocale = useLocale();
  const router = useRouter();
  const pageKey = `auth.${mode}`;
  const otherMode: AuthMode = mode === "sign-in" ? "sign-up" : "sign-in";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const authResponse = await axios.post<string>(
        `${API_HOST}/api/auth/${mode}`,
        { email, password },
        { responseType: "text" },
      );
      const jwt = authResponse.data.trim();

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
    } catch (submitError) {
      setError(getRequestError(submitError, t("auth.requestError")));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f5f0] px-5 py-10">
      <section className="w-full max-w-md border border-black/10 bg-white px-6 py-8 shadow-[0_18px_60px_rgba(35,49,39,0.08)] sm:px-10 sm:py-10">
        <Link href={`/${activeLocale}`} className="text-sm font-semibold tracking-[0.12em] text-primary">
          OYB
        </Link>
        <h1 className="mt-10 text-3xl font-semibold text-[#202820]">{t(`${pageKey}.title`)}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{t(`${pageKey}.description`)}</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
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
              autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? t("auth.submitting") : t(`${pageKey}.action`)}
          </Button>
        </form>

        <p className="mt-7 text-center text-sm text-muted-foreground">
          {t(`${pageKey}.switchPrompt`)}{" "}
          <Link className="font-medium text-primary underline-offset-4 hover:underline" href={`/${activeLocale}/auth/${otherMode === "sign-in" ? "signin" : "signup"}`}>
            {t(`${pageKey}.switchAction`)}
          </Link>
        </p>
      </section>
    </main>
  );
}