"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { CalendlyDialog } from "@/components/CalendlyDialog";
import { useTranslations, useLocale } from "@/i18n/client";
import localeManifest from "../../public/locales/manifest.json";
import Link from "next/link";

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
      window.location.href = `/${locale}/#${sectionId}`;
    }
  };

  const handleNavigate = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('preferredLocale', locale);
      window.location.href = `/${locale}/auth/signin`;
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
    window.location.href = `${newPath}${window.location.search}${window.location.hash}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border-subtle">
      <div className="container-wide">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}/`} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-sm">O</span>
            </div>
            <span className="text-xl font-semibold text-foreground tracking-tight">OYB</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a 
              href="#why" 
              onClick={(e) => handleNavClick(e, 'why')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('header.why')}
            </a>
            <a 
              href="#how" 
              onClick={(e) => handleNavClick(e, 'how')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('header.how')}
            </a>
            <a 
              href="#who" 
              onClick={(e) => handleNavClick(e, 'who')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('header.who')}
            </a>
            <a 
              href="#methodology" 
              onClick={(e) => handleNavClick(e, 'methodology')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('header.methodology')}
            </a>
            <a 
              href="#pricing" 
              onClick={(e) => handleNavClick(e, 'pricing')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('header.pricing')}
            </a>
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
            <Button size="sm" onClick={() => setIsCalendlyOpen(true)}>
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
