export const GA_MEASUREMENT_ID = "G-HS3DF6VTL7";

/** Only production builds report to GA; `next dev` logs events to the console instead. */
export const ANALYTICS_ENABLED = process.env.NODE_ENV === "production";

export type GtagParams = Record<string, string | number | boolean | undefined>;

export interface TrackingEvent {
  name: string;
  params?: GtagParams;
}

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Sends a GA4 event. When `onDone` is passed (e.g. a full-page navigation),
 * it runs once GA confirms the hit, or after a short timeout so a blocked
 * tracker never stalls the user.
 */
export const trackEvent = (name: string, params: GtagParams = {}, onDone?: () => void) => {
  if (typeof window === "undefined") return;

  if (!ANALYTICS_ENABLED) {
    console.debug("[analytics]", name, params);
    onDone?.();
    return;
  }

  if (!window.gtag) {
    onDone?.();
    return;
  }

  if (!onDone) {
    window.gtag("event", name, params);
    return;
  }

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    onDone();
  };
  window.setTimeout(finish, 800);
  window.gtag("event", name, { ...params, transport_type: "beacon", event_callback: finish });
};

export type CtaName = "start_free" | "book_demo" | "contact_sales" | "sign_in";

/** Primary conversion buttons: sign up, book demo, contact sales. */
export const ctaEvent = (cta: CtaName, location: string, label: string): TrackingEvent => ({
  name: "cta_click",
  params: { cta_name: cta, cta_location: location, cta_text: label },
});

/** Secondary navigation: header nav, footer links, logo. */
export const linkEvent = (linkName: string, location: string, destination: string): TrackingEvent => ({
  name: "link_click",
  params: { link_name: linkName, link_location: location, link_url: destination },
});

const send = ({ name, params }: TrackingEvent, onDone?: () => void) => trackEvent(name, params, onDone);

export const trackCtaClick = (cta: CtaName, location: string, label: string, onDone?: () => void) =>
  send(ctaEvent(cta, location, label), onDone);

export const trackLanguageChange = (fromLocale: string, toLocale: string, onDone?: () => void) =>
  trackEvent("language_change", { from_language: fromLocale, to_language: toLocale }, onDone);

export const trackLinkClick = (linkName: string, location: string, destination: string, onDone?: () => void) =>
  send(linkEvent(linkName, location, destination), onDone);

export const trackLeadSubmit = (status: "success" | "error") =>
  trackEvent(status === "success" ? "generate_lead" : "lead_form_error", { form_name: "lead_form" });
