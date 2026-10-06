"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { LeadFormDialog } from "@/components/LeadFormDialog";
import { CalendlyDialog } from "@/components/CalendlyDialog";
import DemoStatusSection from "@/components/pages/DemoStatusSection";

import { useTranslations } from "@/i18n/client";
import Header from "../Header";

const HomePage = () => {
  const t = useTranslations();
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const [currency, setCurrency] = useState<'usd' | 'sek'>('usd');


  const handleSignIn = (planId: string) => {
    const params = new URLSearchParams();
    params.set('planId', planId);
    params.set('teams', '0');
    params.set('members', '0');
    params.set('currency', currency);

    const baseUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:5173'
      : 'https://oyb.app';

    if (typeof window !== 'undefined') {
      window.open(`${baseUrl}/?${params.toString()}`, "_blank");
    }
  };




  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center section-padding">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-foreground mb-6 animate-fade-in">
            {t('hero.title')}
          </h1>
          <p
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            {t('hero.description')}
          </p>
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <Button
              variant="hero"
              size="lg"
              onClick={() => setIsFormDialogOpen(true)}
            >
              {t('hero.bookDemo')}
            </Button>
            <Button
              variant="hero-secondary"
              size="lg"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = "https://oyb.app/";
                }
              }}
            >
              {t('hero.whatWeOffer')}
            </Button>
          </div>
        </div>


      </main>

      <DemoStatusSection
        title={t('watch.title')}
        desc={t('watch.desc')}
        iframeSrc="https://pagepilot-demo-viewer-prod.web.app//?tid=694b38d3eb30f6c0435ac461&did=6a186da79e47067dfe4e305a&type=demo&status=live"
      />

      <section id="pricing">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('pricing.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('pricing.subtitle')}
            </p>
            <div className="inline-flex items-center gap-3 mt-6 p-1 bg-secondary/50 rounded-full border border-border">
              <button
                type="button"
                onClick={() => setCurrency('usd')}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                  currency === 'usd'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                USD ($)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('sek')}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                  currency === 'sek'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                SEK (kr)
              </button>
            </div>
          </div>

        </div>
      </section>
      

      <section className="py-20 w-full bg-primary/5">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            {t('pricing.readyTitle')}
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('pricing.readyDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = "https://oyb.app/";
                }
              }}
            >
              {t('pricing.startJourney')}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-input bg-background hover:bg-muted text-foreground"
              onClick={() => setIsCalendlyOpen(true)}
            >
              {t('pricing.contactSales')}
            </Button>
          </div>
        </div>
      </section>

      <LeadFormDialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen} />
      <CalendlyDialog open={isCalendlyOpen} onOpenChange={setIsCalendlyOpen} />
    </div>
  );
};

export default HomePage;
