import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/toaster";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { SITE_URL } from "@/lib/seo";
import enText from "../../public/locales/en.json";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: enText.home.seo.title,
    template: "%s | OYB – Own Your Brand",
  },
  description: enText.home.seo.description,
  applicationName: "OYB – Own Your Brand",
  authors: [{ name: "CRSPL", url: SITE_URL }],
  creator: "CRSPL",
  publisher: "CRSPL",
  category: "Business software",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
