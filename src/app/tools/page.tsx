"use client";

import ClientWorkflowPage from "@/components/authentication/ClientWorkflowPage";
import WorkflowLocaleProvider from "@/components/WorkflowLocaleProvider";

export default function ToolsRoute() {
  return (
    <WorkflowLocaleProvider>
      <ClientWorkflowPage page="tools" />
    </WorkflowLocaleProvider>
  );
}