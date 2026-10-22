"use client";

import { usePathname } from "next/navigation";
import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";
import WorkflowLocaleProvider from "@/components/WorkflowLocaleProvider";

// AppHeader is fixed (h-16), so offset content by pt-16.
// Individual tool pages (/tools/<tool>) are full-height iframes, so they skip the
// footer to keep a single scrollbar (the iframe's own).
export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isToolPage = /^\/tools\/[^/]+/.test(pathname ?? "");

  return (
    <WorkflowLocaleProvider>
      <AppHeader />
      <div className="pt-16">{children}</div>
      {!isToolPage && <AppFooter />}
    </WorkflowLocaleProvider>
  );
}
