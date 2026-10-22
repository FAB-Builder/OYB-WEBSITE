"use client";

import { useEffect, useState } from "react";

type FabToolFrameProps = {
  tool: string;
};

export default function FabToolFrame({ tool }: FabToolFrameProps) {
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const jwt = window.localStorage.getItem("jwt");
      const tenantId = window.localStorage.getItem("tenantId");

      setIframeSrc(`https://cs.fabbuilder.com/tools/${tool}/?authToken=${jwt}&tid=${tenantId}&theme=dark`);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [tool]);

  return (
    <>{iframeSrc && <iframe src={iframeSrc} className="block w-full h-[calc(100dvh-4rem)]" />}</>
  );
}
