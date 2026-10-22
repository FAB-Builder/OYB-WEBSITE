"use client";

import { useEffect, useState } from "react";

export default function GBPToolRoute() {
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const jwt = window.localStorage.getItem("jwt");
      const tenantId = window.localStorage.getItem("tenantId");

      setIframeSrc(
        `https://cs.fabbuilder.com/cs-app/gbp/?tenantId=${tenantId}&theme=polar-green&mode=light&showInApp=true&page=logs&jwt=${jwt}`,
      );
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <>{iframeSrc && <iframe src={iframeSrc} className="block w-full h-[calc(100dvh-4rem)]" />}</>
  );
}