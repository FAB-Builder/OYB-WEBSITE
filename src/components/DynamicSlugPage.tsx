"use client";

import React from "react";
import { usePathname, notFound } from "next/navigation";
import { usePageBySlug } from "@/hooks/usePageBySlug";
import { SectionContent } from "./SectionContent";
import Header from "./Header";
import Footer from "./Footer";
import { PageMetadata } from "./PageMetadata";
import { Loader2 } from "lucide-react";

interface DynamicSlugPageProps {
  slug?: string;
}

const DynamicSlugPage = ({ slug }: DynamicSlugPageProps) => {
  const pathname = usePathname();

  const resolvedSlug = slug !== undefined
    ? slug
    : (pathname
        ? pathname.replace(/^\/(sv|en)/, "").replace(/^\//, "").replace(/\/$/, "").split("?")[0]
        : "");

  const { data, loading, error } = usePageBySlug(resolvedSlug, !!resolvedSlug);

  const pageData = data?.page ?? data;

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-clip">
      <PageMetadata
        title={pageData?.metaTitle}
        description={pageData?.metaDescription}
        imageUrl={pageData?.metaImageUrl}
      />
      <Header />
      <div className="pt-20">
        <SectionContent
          editor={pageData?.editor}
          sections={pageData?.sections || []}
        />
      </div>
      <Footer />
      {pageData?.bodyBottom && (
        <div dangerouslySetInnerHTML={{ __html: pageData.bodyBottom }} />
      )}
    </main>
  );
};

export default DynamicSlugPage;
