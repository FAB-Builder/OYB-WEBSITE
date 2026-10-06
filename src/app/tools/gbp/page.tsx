"use client";

import { useParams } from "next/navigation";
import ClientWorkflowPage from "@/components/authentication/ClientWorkflowPage";
import WorkflowLocaleProvider from "@/components/WorkflowLocaleProvider";

export default function ToolRoute() {
  const { tool } = useParams<{ tool: string }>();

  return (
    <WorkflowLocaleProvider>
      <ClientWorkflowPage page="tool" slug={tool} />
    </WorkflowLocaleProvider>
  );
}