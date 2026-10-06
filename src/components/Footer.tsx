"use client";

import { useState } from "react";
import Link from "next/link";
import { LeadFormDialog } from "@/components/LeadFormDialog";
import { useTranslations, useLocale } from "@/i18n/client";

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
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-xs">O</span>
            </div>
            <span className="text-sm font-medium text-foreground">OYB</span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6">
            <Link href={`/${locale}/privacy`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link href={`/${locale}/terms`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t('footer.terms')}
            </Link>
            <button 
              onClick={() => setIsFormDialogOpen(true)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('footer.contact')}
            </button>
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
