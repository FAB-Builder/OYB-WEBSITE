import ClientWorkflowPage from "@/components/authentication/ClientWorkflowPage";
import WorkflowLocaleProvider from "@/components/WorkflowLocaleProvider";

const toolSlugs = ["google-business-profile", "instagram-auto-responder"];

export function generateStaticParams() {
  return toolSlugs.map((tool) => ({ tool }));
}

type PageProps = {
  params: Promise<{ tool: string }>;
};

export default async function ToolRoute({ params }: PageProps) {
  const { tool } = await params;

  return (
    <WorkflowLocaleProvider>
      <ClientWorkflowPage page="tool" slug={tool} />
    </WorkflowLocaleProvider>
  );
}