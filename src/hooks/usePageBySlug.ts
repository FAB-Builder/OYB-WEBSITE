import { fetchPageBySlug, PageData } from "@/lib/utils";
import { useEffect, useState } from "react";

interface UsePageBySlugResult {
  data: PageData | null;
  loading: boolean;
  error: boolean;
}

export function usePageBySlug(
  slugPath: string,
  isReady: boolean,
): UsePageBySlugResult {
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isReady || !slugPath) return;

    async function loadPage() {
      setLoading(true);
      setError(false);

      try {
        const pageData = await fetchPageBySlug(slugPath);
        setData(pageData);
      } catch (err) {
        console.error("Error loading page:", err);
        setError(true);
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    loadPage();
  }, [isReady, slugPath]);

  return { data, loading, error };
}
