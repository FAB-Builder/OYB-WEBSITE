"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useLocale, useTranslations } from "@/i18n/client";
import { Button } from "@/components/ui/button";
import { trackLinkClick } from "@/lib/analytics";

// Everything the app saves in the browser for a logged-in user.
// "preferredLocale" is kept so the user stays in their language.
const SESSION_KEYS = ["jwt", "profile", "selectedTenant", "tenantId"];

const AppHeader = () => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const handleSignOut = () => {
    for (const key of SESSION_KEYS) {
      window.localStorage.removeItem(key);
    }
    const destination = `/${locale}`;
    trackLinkClick("sign_out", "header", destination);
    router.replace(destination);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border-subtle">
      <div className="container-wide">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/workspaces"
            className="flex items-center"
            aria-label="OYB – Own Your Brand"
            onClick={() => trackLinkClick('logo', 'header', "/workspaces")}
          >
            <Image src="/logo-mark.svg" alt="OYB – Own Your Brand" width={88} height={30} className="h-7 w-auto" priority />
          </Link>

          {/* Sign out */}
          <Button type="button" variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut aria-hidden="true" />
            {t("header.signOut")}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
