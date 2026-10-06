import RootPageClient from "@/components/RootPageClient";
import { homeMetadata } from "@/lib/seo";

export const metadata = homeMetadata("en", "/en");

export default function RootPage() {
  return <RootPageClient />;
}
