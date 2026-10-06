"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Briefcase,
  Building2,
  Check,
  ChevronDown,
  CircleCheck,
  Languages,
  LayoutGrid,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
  Store,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadFormDialog } from "@/components/LeadFormDialog";
import { CalendlyDialog } from "@/components/CalendlyDialog";
import DemoStatusSection from "@/components/pages/DemoStatusSection";
import FeatureVisual, { type FeatureVisualKind } from "@/components/home/FeatureVisual";

import { useLocale, useTranslations } from "@/i18n/client";
import Header from "../Header";
import Footer from "../Footer";

const SITE_URL = "https://oyb.app";

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

const featureKeys: FeatureVisualKind[] = ["gbp", "reviews", "instagram", "voice", "insights"];

const moreItems = [
  { key: "workspaces", Icon: LayoutGrid },
  { key: "alerts", Icon: Bell },
  { key: "approvals", Icon: CircleCheck },
  { key: "languages", Icon: Languages },
  { key: "security", Icon: ShieldCheck },
  { key: "support", Icon: Users },
] as const;

const whoItems = [
  { key: "local", Icon: Store },
  { key: "multi", Icon: Building2 },
  { key: "agencies", Icon: Briefcase },
  { key: "creators", Icon: ShoppingBag },
] as const;

const PLATFORM_COUNT = 5;
const PAIN_COUNT = 4;
const BULLET_COUNT = 4;
const STEP_COUNT = 3;
const COMPARE_ROW_COUNT = 5;
const FAQ_COUNT = 7;

const SectionHeading = ({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) => (
  <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
    <p className="mb-3 text-sm font-medium uppercase tracking-[0.12em] text-primary">{eyebrow}</p>
    <h2 className="text-balance text-foreground">{title}</h2>
    {subtitle && <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>}
  </div>
);

const HomePage = () => {
  const t = useTranslations();
  const locale = useLocale();
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

  const signupHref = `/${locale}/auth/signup`;

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "OYB – Own Your Brand",
        alternateName: "OYB",
        legalName: "Univise AB",
        url: SITE_URL,
        logo: `${SITE_URL}/favicon.svg`,
        email: "support@oyb.app",
        address: { "@type": "PostalAddress", addressCountry: "SE" },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "OYB – Own Your Brand",
        inLanguage: locale,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "SoftwareApplication",
        name: "OYB – Own Your Brand",
        applicationCategory: "BusinessApplication",
        applicationSubCategory: "Google Business Profile and Instagram automation",
        operatingSystem: "Web",
        url: `${SITE_URL}/${locale}`,
        description: t("home.seo.description"),
        inLanguage: locale,
        publisher: { "@id": `${SITE_URL}/#organization` },
        featureList: featureKeys.map((key) => t(`home.features.${key}.eyebrow`)),
      },
      {
        "@type": "FAQPage",
        inLanguage: locale,
        mainEntity: range(FAQ_COUNT).map((i) => ({
          "@type": "Question",
          name: t(`home.faq.items.${i}.q`),
          acceptedAnswer: { "@type": "Answer", text: t(`home.faq.items.${i}.a`) },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="section-padding pt-32 md:pt-40">
          <div className="container-wide text-center">
            <p className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface-subtle px-4 py-1.5 text-sm text-muted-foreground animate-fade-in">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              {t("home.hero.eyebrow")}
            </p>
            <h1 className="mx-auto max-w-4xl text-balance text-foreground mb-6 animate-fade-in">
              {t("home.hero.title")}
            </h1>
            <p
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              {t("home.hero.subtitle")}
            </p>
            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <Button variant="hero" size="lg" asChild>
                <Link href={signupHref}>
                  {t("home.hero.primaryCta")}
                  <ArrowRight />
                </Link>
              </Button>
              <Button variant="hero-secondary" size="lg" onClick={() => setIsFormDialogOpen(true)}>
                {t("home.hero.secondaryCta")}
              </Button>
            </div>
            <p className="mt-5 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.3s" }}>
              {t("home.hero.note")}
            </p>

            <div className="mt-16 md:mt-20">
              <p className="mb-5 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                {t("home.hero.worksWith")}
              </p>
              <ul className="flex flex-wrap items-center justify-center gap-3">
                {range(PLATFORM_COUNT).map((i) => (
                  <li
                    key={i}
                    className="rounded-md border border-border-subtle bg-background px-4 py-2 text-sm font-medium text-secondary-foreground"
                  >
                    {t(`home.platforms.${i}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <DemoStatusSection
          title={t("watch.title")}
          desc={t("watch.desc")}
          iframeSrc="https://pagepilot-demo-viewer-prod.web.app//?tid=694b38d3eb30f6c0435ac461&did=6a186da79e47067dfe4e305a&type=demo&status=live"
        />

        {/* Problem → solution */}
        <section className="section-padding bg-surface-subtle">
          <div className="container-wide">
            <SectionHeading eyebrow={t("home.problem.eyebrow")} title={t("home.problem.title")} />
            <ul className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
              {range(PAIN_COUNT).map((i) => (
                <li key={i} className="flex gap-3 rounded-lg border border-border bg-card p-5 shadow-card">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary">
                    <X className="h-3.5 w-3.5 text-muted-foreground" />
                  </span>
                  <p className="text-foreground">{t(`home.problem.pains.${i}`)}</p>
                </li>
              ))}
            </ul>
            <div className="mx-auto mt-12 max-w-2xl text-center">
              <h3 className="text-foreground">{t("home.problem.resolutionTitle")}</h3>
              <p className="mt-3 text-lg text-muted-foreground">{t("home.problem.resolution")}</p>
            </div>
          </div>
        </section>

        {/* Feature modules */}
        <section id="features" className="section-padding scroll-mt-16">
          <div className="container-wide">
            <SectionHeading
              eyebrow={t("home.features.eyebrow")}
              title={t("home.features.title")}
              subtitle={t("home.features.subtitle")}
            />
            <div className="space-y-20 md:space-y-28">
              {featureKeys.map((key, index) => (
                <article key={key} className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
                  <div className={index % 2 === 1 ? "md:order-2" : undefined}>
                    <p className="mb-3 text-sm font-medium uppercase tracking-[0.12em] text-primary">
                      {t(`home.features.${key}.eyebrow`)}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-foreground">
                      {t(`home.features.${key}.title`)}
                    </h3>
                    <p className="mt-4 text-lg text-muted-foreground">{t(`home.features.${key}.desc`)}</p>
                    <ul className="mt-6 space-y-3">
                      {range(BULLET_COUNT).map((i) => (
                        <li key={i} className="flex gap-3 text-foreground">
                          <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                          <span>{t(`home.features.${key}.bullets.${i}`)}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-6 text-sm text-muted-foreground">
                      <span className="font-medium text-secondary-foreground">{t("home.features.alternativeLabel")}:</span>{" "}
                      {t(`home.features.${key}.alternatives`)}
                    </p>
                    <Button variant="link" className="mt-2 h-auto px-0" asChild>
                      <Link href={signupHref}>
                        {t("home.hero.primaryCta")}
                        <ArrowRight />
                      </Link>
                    </Button>
                  </div>
                  <div className={index % 2 === 1 ? "md:order-1" : undefined}>
                    <FeatureVisual kind={key} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* More features */}
        <section className="section-padding bg-surface-subtle">
          <div className="container-wide">
            <SectionHeading eyebrow={t("home.more.eyebrow")} title={t("home.more.title")} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {moreItems.map(({ key, Icon }) => (
                <div key={key} className="rounded-lg border border-border bg-card p-6 shadow-card">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground">{t(`home.more.items.${key}.title`)}</h3>
                  <p className="mt-2 text-muted-foreground">{t(`home.more.items.${key}.desc`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="section-padding scroll-mt-16">
          <div className="container-wide">
            <SectionHeading eyebrow={t("home.how.eyebrow")} title={t("home.how.title")} />
            <ol className="grid gap-8 md:grid-cols-3">
              {range(STEP_COUNT).map((i) => (
                <li key={i} className="relative">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-primary/5 text-sm font-semibold text-primary">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 text-lg font-medium text-foreground">{t(`home.how.steps.${i}.title`)}</h3>
                  <p className="mt-2 text-muted-foreground">{t(`home.how.steps.${i}.desc`)}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Who it's for */}
        <section id="who" className="section-padding scroll-mt-16 bg-surface-subtle">
          <div className="container-wide">
            <SectionHeading eyebrow={t("home.who.eyebrow")} title={t("home.who.title")} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {whoItems.map(({ key, Icon }) => (
                <div key={key} className="rounded-lg border border-border bg-card p-6 shadow-card">
                  <Icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-4 text-lg font-medium text-foreground">{t(`home.who.items.${key}.title`)}</h3>
                  <p className="mt-2 text-muted-foreground">{t(`home.who.items.${key}.desc`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section id="why" className="section-padding scroll-mt-16">
          <div className="container-wide">
            <SectionHeading
              eyebrow={t("home.compare.eyebrow")}
              title={t("home.compare.title")}
              subtitle={t("home.compare.subtitle")}
            />
            <div className="mx-auto max-w-4xl overflow-hidden rounded-lg border border-border bg-card shadow-card">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-subtle text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-medium sm:px-6">{t("home.compare.colTask")}</th>
                    <th scope="col" className="hidden px-4 py-3 font-medium sm:table-cell sm:px-6">{t("home.compare.colUsual")}</th>
                    <th scope="col" className="px-4 py-3 font-medium text-primary sm:px-6">{t("home.compare.colOyb")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {range(COMPARE_ROW_COUNT).map((i) => (
                    <tr key={i}>
                      <td className="px-4 py-4 font-medium text-foreground sm:px-6">{t(`home.compare.rows.${i}.task`)}</td>
                      <td className="hidden px-4 py-4 text-muted-foreground sm:table-cell sm:px-6">{t(`home.compare.rows.${i}.usual`)}</td>
                      <td className="px-4 py-4 sm:px-6">
                        <span className="inline-flex items-center gap-1.5 font-medium text-primary">
                          <Check className="h-4 w-4" />
                          {t("home.compare.included")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="section-padding scroll-mt-16 bg-surface-subtle">
          <div className="container-wide">
            <SectionHeading eyebrow={t("home.faq.eyebrow")} title={t("home.faq.title")} />
            <div className="mx-auto max-w-3xl divide-y divide-border rounded-lg border border-border bg-card shadow-card">
              {range(FAQ_COUNT).map((i) => (
                <details key={i} className="group px-6 py-5" open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-foreground [&::-webkit-details-marker]:hidden">
                    <h3 className="text-base font-medium">{t(`home.faq.items.${i}.q`)}</h3>
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-muted-foreground">{t(`home.faq.items.${i}.a`)}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section id="get-started" className="py-20 w-full bg-primary/5">
          <div className="container mx-auto px-6 text-center">
            <MessageCircle className="mx-auto mb-6 h-8 w-8 text-primary" />
            <h2 className="text-foreground mb-6">{t("home.cta.title")}</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">{t("home.cta.desc")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href={signupHref}>{t("home.cta.primary")}</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-input bg-background hover:bg-muted text-foreground"
                onClick={() => setIsCalendlyOpen(true)}
              >
                {t("home.cta.secondary")}
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <LeadFormDialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen} />
      <CalendlyDialog open={isCalendlyOpen} onOpenChange={setIsCalendlyOpen} />
    </div>
  );
};

export default HomePage;
