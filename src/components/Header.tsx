"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { CalendlyDialog } from "@/components/CalendlyDialog";
import { useTranslations, useLocale } from "@/i18n/client";
import localeManifest from "../../public/locales/manifest.json";
import Link from "next/link";
import Image from "next/image";
import { trackCtaClick, trackLanguageChange, trackLinkClick } from "@/lib/analytics";

const navItems = ["features", "how", "who", "why", "faq"] as const;

interface HeaderProps {
  onNavClick?: (sectionId: string) => void;
  localeOverride?: string;
}

const Header = ({ onNavClick, localeOverride }: HeaderProps) => {
  const t = useTranslations();
  const contextLocale = useLocale();
  const locale = localeOverride ?? contextLocale ?? "en";
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

  // Handle scroll on mount if hash is present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.slice(1);
      if (hash) {
        const element = document.getElementById(hash);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    }
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();

    if (typeof window === 'undefined') return;
    
    // Check if the section element exists on current page
    const element = document.getElementById(sectionId);
    
    if (element) {
      trackLinkClick(sectionId, 'header_nav', `#${sectionId}`);
      // Element exists on current page, scroll to it
      if (onNavClick) {
        onNavClick(sectionId);
      } else {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      if (window.location.hash !== `#${sectionId}`) {
        window.history.pushState(null, '', `#${sectionId}`);
      }
    } else {
      // Element doesn't exist on current page, navigate to home with hash
      trackLinkClick(sectionId, 'header_nav', `/${locale}/#${sectionId}`, () => {
        window.location.href = `/${locale}/#${sectionId}`;
      });
    }
  };

  const handleNavigate = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('preferredLocale', locale);
      trackCtaClick('sign_in', 'header', t('header.signIn'), () => {
        window.location.href = `/${locale}/auth/signin`;
      });
    }
  };

  const languages = localeManifest.locales;

  const handleChangeLanguage = (lang: string) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('preferredLocale', lang);
    const segments = window.location.pathname.split('/');
    if (localeManifest.locales.some(({ code }) => code === segments[1])) {
      segments[1] = lang;
    } else {
      segments.splice(1, 0, lang);
    }
    const newPath = segments.join('/');
    trackLanguageChange(locale, lang, () => {
      window.location.href = `${newPath}${window.location.search}${window.location.hash}`;
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border-subtle">
      <div className="container-wide">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={`/${locale}/`}
            className="flex items-center"
            aria-label="OYB – Own Your Brand"
            onClick={() => trackLinkClick('logo', 'header', `/${locale}/`)}
          >
            <Image src="/logo-mark.svg" alt="OYB – Own Your Brand" width={88} height={30} className="h-7 w-auto" priority />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((id) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => handleNavClick(e, id)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t(`header.${id}`)}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <label className="sr-only" htmlFor="language-select">{t('header.language.selectAria')}</label>
            <select
              id="language-select"
              value={locale}
              onChange={(e) => handleChangeLanguage(e.target.value)}
              className="rounded-md border border-border-subtle bg-background px-3 py-1 text-sm text-foreground outline-none transition-colors hover:border-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={handleNavigate}>
              {t('header.signIn')}
            </Button>
            <Button variant="cta" size="sm" onClick={() => {
                trackCtaClick('book_demo', 'header', t('header.bookDemo'));
                setIsCalendlyOpen(true);
              }}
            >
              {t('header.bookDemo')}
            </Button>
          </div>
        </div>
      </div>
      <CalendlyDialog open={isCalendlyOpen} onOpenChange={setIsCalendlyOpen} />
    </header>
  );
};

export default Header;
