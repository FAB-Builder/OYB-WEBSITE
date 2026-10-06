import Link from "next/link";

const toolMeta: Record<string, { title: string; description: string }> = {
  "google-business-profile": {
    title: "Google Business Profile",
    description: "Manage and optimize your Google Business Profile workflow in this workspace.",
  },
  "instagram-auto-responder": {
    title: "Instagram Auto Responder",
    description: "Configure automated Instagram responses for your team and campaigns.",
  },
};

type ToolPageProps = {
  slug: string;
};

export default function ToolPage({ slug }: ToolPageProps) {
  const tool = toolMeta[slug] ?? {
    title: "Unknown tool",
    description: "This tool is not available yet or the selected slug is invalid.",
  };

  return (
    <main className="min-h-screen bg-[#f3f5f0] px-5 py-16 sm:py-20">
      <section className="mx-auto w-full max-w-3xl rounded-2xl border border-black/10 bg-white p-8 shadow-[0_12px_36px_rgba(35,49,39,0.06)]">
        <Link href="/tools" className="text-sm font-semibold tracking-[0.12em] text-primary">
          OYB
        </Link>

        <h1 className="mt-8 text-3xl font-semibold text-[#202820]">{tool.title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{tool.description}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/tools"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Back to tools
          </Link>
          <span className="inline-flex items-center rounded-md border border-black/10 px-4 py-2 text-sm text-muted-foreground">
            {slug}
          </span>
        </div>
      </section>
    </main>
  );
}
