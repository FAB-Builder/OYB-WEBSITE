"use client";

import { useEffect, useState } from "react";

export const CS_TOOLS_BASE_URL = "https://cs.fabbuilder.com/tools/";
export const PAGEPILOT_TOOLS_BASE_URL = "https://pagepilot.fabbuilder.com/tools/";

type FabToolFrameProps = {
  tool: string;
  baseUrl?: string;
};

export default function FabToolFrame({ tool, baseUrl = CS_TOOLS_BASE_URL }: FabToolFrameProps) {
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const jwt = window.localStorage.getItem("jwt");
      const tenantId = window.localStorage.getItem("tenantId");

      setIframeSrc(`${baseUrl}${tool}/?authToken=${jwt}&tid=${tenantId}&theme=dark`);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [tool, baseUrl]);

  return (
    <>{iframeSrc && <iframe src={iframeSrc} className="block w-full h-[calc(100dvh-4rem)]" />}</>
  );
}
