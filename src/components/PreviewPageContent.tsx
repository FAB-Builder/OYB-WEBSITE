"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { PageMetadata } from "@/components/PageMetadata";
import { SectionContent } from "@/components/SectionContent";
import { fetchPageBySlug, type PageData } from "@/lib/utils";

interface PreviewPageContentProps {
  initialPageData: PageData;
  slugPath: string;
  footer: ReactNode;
}

export function PreviewPageContent({
  initialPageData,
  slugPath,
  footer,
}: PreviewPageContentProps) {
  const [pageData, setPageData] = useState(initialPageData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("mode") !== "preview") {
      return;
    }

    let isActive = true;

    const refreshPage = async () => {
      await Promise.resolve();
      if (!isActive) return;
      setIsLoading(true);

      try {
        const response = await fetchPageBySlug(slugPath);
        if (isActive && response.page) {
          setPageData(response.page);
        }
      } catch (error) {
        console.error("Failed to refresh preview page:", error);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void refreshPage();

    return () => {
      isActive = false;
    };
  }, [slugPath]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-sm font-medium text-muted-foreground">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMetadata
        title={pageData?.metaTitle}
        description={pageData?.metaDescription}
        imageUrl={pageData?.metaImageUrl}
      />
      <div className="pt-20">
        <SectionContent
          editor={pageData?.editor}
          sections={pageData?.sections || []}
        />
      </div>
      {footer}
      {pageData?.bodyBottom && (
        <div dangerouslySetInnerHTML={{ __html: pageData.bodyBottom }} />
      )}
    </>
  );
}