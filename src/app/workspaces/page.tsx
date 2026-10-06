"use client";

import ClientWorkflowPage from "@/components/authentication/ClientWorkflowPage";
import WorkflowLocaleProvider from "@/components/WorkflowLocaleProvider";

export default function WorkspacesRoute() {
  return (
    <WorkflowLocaleProvider>
      <ClientWorkflowPage page="workspaces" />
    </WorkflowLocaleProvider>
  );
}