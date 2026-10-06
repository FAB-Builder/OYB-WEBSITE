import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { AHD_HOST } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export interface PageData {
  [key: string]: any;
}

export async function fetchPageBySlug(slugPath: string): Promise<PageData> {
  const url = `${AHD_HOST}/pagebyslug/${slugPath}`;
  console.log("URL: "+ url);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: {
        includes: [],
        pageSelect: {
          select: {
            title: 1,
            metaDescription: 1,
            metaTitle: 1,
            editor: 1,
            metaImageUrl: 1,
            bodyBottom: 1,
            head: 1,
          },
          sectionSelect: { content: 1 },
          authorSelect: { email: 1 },
        },
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch page "${slugPath}": ${res.status}`);
  }

  return res.json();
}