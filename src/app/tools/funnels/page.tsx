"use client";

import { useEffect, useState } from "react";
import WorkflowLocaleProvider from "@/components/WorkflowLocaleProvider";

export default function FunnelsToolRoute() {
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const jwt = window.localStorage.getItem("jwt");
      const tenantId = window.localStorage.getItem("tenantId");

      setIframeSrc(`https://cs.fabbuilder.com/tools/funnel/?authToken=${jwt}&tid=${tenantId}&theme=dark`);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <WorkflowLocaleProvider>
      {iframeSrc && <iframe src={iframeSrc} className="w-full h-screen" />}
    </WorkflowLocaleProvider>
  );
}
