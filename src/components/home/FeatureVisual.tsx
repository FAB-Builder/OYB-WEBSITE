"use client";

import { Check, Clock, MapPin, MessageCircle, Navigation, Phone, Sparkles, Star, Eye } from "lucide-react";
import { useTranslations } from "@/i18n/client";

export type FeatureVisualKind = "gbp" | "reviews" | "instagram" | "voice" | "insights";

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="relative rounded-xl border border-border bg-surface-subtle p-4 sm:p-6">
    <div className="rounded-lg border border-border bg-card p-5 shadow-card">{children}</div>
  </div>
);

const Stars = ({ count = 5 }: { count?: number }) => (
  <div className="flex gap-0.5" aria-hidden="true">
    {Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-3.5 w-3.5 ${i < count ? "fill-primary text-primary" : "text-border"}`} />
    ))}
  </div>
);

const GbpVisual = () => {
  const t = useTranslations();
  const stats = [
    { Icon: Eye, label: t("home.mock.gbpViews"), value: "2,481" },
    { Icon: Phone, label: t("home.mock.gbpCalls"), value: "164" },
    { Icon: Navigation, label: t("home.mock.gbpDirections"), value: "312" },
  ];
  return (
    <Frame>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <MapPin className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-foreground">{t("home.mock.gbpName")}</p>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <span>4.8</span>
            <Stars />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{t("home.mock.gbpCategory")}</p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        {stats.map(({ Icon, label, value }) => (
          <div key={label} className="rounded-md bg-surface-subtle p-3">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <p className="mt-2 text-lg font-semibold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-md border border-border-subtle px-3 py-2 text-xs text-muted-foreground">
        <Clock className="h-3.5 w-3.5 text-primary" />
        {t("home.mock.gbpPost")}
      </div>
    </Frame>
  );
};

const ReviewsVisual = () => {
  const t = useTranslations();
  return (
    <Frame>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-medium text-secondary-foreground">
          E
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{t("home.mock.reviewAuthor")}</p>
          <Stars />
        </div>
      </div>
      <p className="mt-3 text-sm text-foreground">{t("home.mock.reviewText")}</p>
      <div className="mt-4 rounded-md border border-primary/20 bg-primary/5 p-4">
        <p className="flex items-center gap-1.5 text-xs font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          {t("home.mock.reviewDraftLabel")}
        </p>
        <p className="mt-2 text-sm text-foreground">{t("home.mock.reviewDraft")}</p>
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
          <Check className="h-3.5 w-3.5" />
          {t("home.mock.reviewApprove")}
        </div>
      </div>
    </Frame>
  );
};

const InstagramVisual = () => {
  const t = useTranslations();
  return (
    <Frame>
      <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
        <MessageCircle className="h-4 w-4 text-primary" />
        <p className="text-sm font-medium text-foreground">{t("home.mock.igUser")}</p>
      </div>
      <div className="mt-4 space-y-3">
        <div className="max-w-[80%] rounded-2xl rounded-bl-sm bg-secondary px-4 py-2.5 text-sm text-secondary-foreground">
          {t("home.mock.igQuestion")}
        </div>
        <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
          {t("home.mock.igReply")}
        </div>
        <p className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3 text-primary" />
          {t("home.mock.igAuto")}
        </p>
      </div>
    </Frame>
  );
};

const VoiceVisual = () => {
  const t = useTranslations();
  const rows = [
    [t("home.mock.voiceTone"), t("home.mock.voiceToneValue")],
    [t("home.mock.voiceLanguage"), t("home.mock.voiceLanguageValue")],
    [t("home.mock.voiceSignoff"), t("home.mock.voiceSignoffValue")],
    [t("home.mock.voiceAvoid"), t("home.mock.voiceAvoidValue")],
  ];
  return (
    <Frame>
      <dl className="divide-y divide-border-subtle">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="text-right text-sm font-medium text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    </Frame>
  );
};

const InsightsVisual = () => {
  const t = useTranslations();
  const bars = [38, 52, 47, 61, 58, 72, 80, 88];
  return (
    <Frame>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-xs text-muted-foreground">{t("home.mock.insightsResponse")}</p>
          <p className="mt-1 text-lg font-semibold text-foreground">4 min</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{t("home.mock.insightsRate")}</p>
          <p className="mt-1 text-lg font-semibold text-foreground">98%</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{t("home.mock.insightsRating")}</p>
          <p className="mt-1 text-lg font-semibold text-foreground">4.6 → 4.8</p>
        </div>
      </div>
      <div className="mt-6 flex h-28 items-end gap-2" aria-hidden="true">
        {bars.map((h, i) => (
          <div
            key={i}
            className={`flex-1 rounded-t-sm ${i === bars.length - 1 ? "bg-primary" : "bg-primary/25"}`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{t("home.mock.insightsWeek")}</p>
    </Frame>
  );
};

const visuals: Record<FeatureVisualKind, () => React.JSX.Element> = {
  gbp: GbpVisual,
  reviews: ReviewsVisual,
  instagram: InstagramVisual,
  voice: VoiceVisual,
  insights: InsightsVisual,
};

const FeatureVisual = ({ kind }: { kind: FeatureVisualKind }) => {
  const Visual = visuals[kind];
  return <Visual />;
};

export default FeatureVisual;
