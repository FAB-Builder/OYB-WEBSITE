"use client";

import { useState } from "react";
import Image from "next/image";
import { LeadFormDialog } from "@/components/LeadFormDialog";
import { useTranslations, useLocale } from "@/i18n/client";
import { ctaEvent, linkEvent } from "@/lib/analytics";
import { TrackedButton, TrackedLink } from "@/components/analytics/withTracking";

interface FooterProps {
  localeOverride?: string;
}

const Footer = ({ localeOverride }: FooterProps) => {
  const t = useTranslations();
  const contextLocale = useLocale();
  const locale = localeOverride ?? contextLocale ?? "en";
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);

  return (
    <footer className="py-12 border-t border-border-subtle">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <TrackedLink href={`/${locale}/`} aria-label="OYB – Own Your Brand" tracking={linkEvent('logo', 'footer', `/${locale}/`)}>
            <Image src="/logo.svg" alt="OYB – Own Your Brand" width={112} height={48} className="h-12 w-auto" />
          </TrackedLink>

          {/* Links */}
          <nav className="flex items-center gap-6">
            <TrackedLink
              href={`/${locale}/privacy`}
              tracking={linkEvent('privacy', 'footer', `/${locale}/privacy`)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t('footer.privacy')}
            </TrackedLink>
            <TrackedLink
              href={`/${locale}/terms`}
              tracking={linkEvent('terms', 'footer', `/${locale}/terms`)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t('footer.terms')}
            </TrackedLink>
            <TrackedButton
              variant="nav"
              className="h-auto p-0 text-sm text-muted-foreground hover:text-foreground transition-colors"
              tracking={ctaEvent('contact_sales', 'footer', t('footer.contact'))}
              onClick={() => setIsFormDialogOpen(true)}
            >
              {t('footer.contact')}
            </TrackedButton>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
      <LeadFormDialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen} />
    </footer>
  );
};

export default Footer;
