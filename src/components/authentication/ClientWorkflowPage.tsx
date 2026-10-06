"use client";

import dynamic from "next/dynamic";

const WorkspaceSelectionPage = dynamic(
  () => import("@/components/authentication/WorkspaceSelectionPage"),
  { ssr: false },
);
const ToolSelectionPage = dynamic(
  () => import("@/components/pages/ToolSelectionPage"),
  { ssr: false },
);
const ToolPage = dynamic(() => import("@/components/pages/ToolPage"), { ssr: false });

export default function ClientWorkflowPage({
  page,
  slug,
}: {
  page: "workspaces" | "tools" | "tool";
  slug?: string;
}) {
  if (page === "workspaces") {
    return <WorkspaceSelectionPage />;
  }

  if (page === "tools") {
    return <ToolSelectionPage />;
  }

  return <ToolPage slug={slug ?? ""} />;
}