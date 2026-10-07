"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, MessageCircle, MapPin } from "lucide-react";
import { useLocale, useTranslations } from "@/i18n/client";

const tools = [
  {
    slug: "google-business-profile",
    translationKey: "googleBusinessProfile",
    Icon: MapPin,
  },
  {
    slug: "instagram-auto-responder",
    translationKey: "instagramAutoResponder",
    Icon: MessageCircle,
  },
] as const;

function getRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : null;
}

function getTenantName(tenant: unknown): string {
  const record = getRecord(tenant);
  const tenantRecord = getRecord(record?.tenant);
  const nestedTenantRecord = getRecord(tenantRecord?.tenant);
  const name = nestedTenantRecord?.name;
  return typeof name === "string" ? name : "";
}

export default function ToolSelectionPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [workspaceName, setWorkspaceName] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const storedTenant = window.localStorage.getItem("selectedTenant");
      if (!storedTenant) {
        router.replace("/workspaces");
        return;
      }

      try {
        setWorkspaceName(getTenantName(JSON.parse(storedTenant)));
      } catch {
        window.localStorage.removeItem("selectedTenant");
        window.localStorage.removeItem("tenantId");
        router.replace("/workspaces");
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [locale, router]);

  return (
    <main className="min-h-screen bg-[#f3f5f0] px-5 py-16 sm:py-20">
      <section className="mx-auto w-full max-w-5xl">
        <Link href={`/${locale}`} className="text-sm font-semibold tracking-[0.12em] text-primary">OYB</Link>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-[#202820]">{t("tools.title")}</h1>
            <p className="mt-3 text-sm text-muted-foreground">{t("tools.description")}</p>
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{t("tools.workspace")}:</span>{" "}
            {workspaceName || t("workspace.title")}{" "}
            <Link className="font-medium text-primary underline-offset-4 hover:underline" href="/workspaces">
              {t("tools.changeWorkspace")}
            </Link>
          </div>
        </div>

        <div className="mt-9 grid gap-4 sm:grid-cols-2">
          {tools.map(({ slug, translationKey, Icon }) => (
            <Link
              key={slug}
              href={`/tools/${slug}`}
              className="group flex min-h-48 flex-col border border-black/10 bg-white p-6 shadow-[0_12px_36px_rgba(35,49,39,0.06)] transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="flex h-11 w-11 items-center justify-center bg-primary/10 text-primary">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <span className="mt-5 flex items-center justify-between gap-4">
                <span className="text-lg font-semibold text-[#202820]">{t(`tools.${translationKey}.title`)}</span>
                <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
              </span>
              <span className="mt-2 text-sm text-muted-foreground">{t(`tools.${translationKey}.description`)}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}