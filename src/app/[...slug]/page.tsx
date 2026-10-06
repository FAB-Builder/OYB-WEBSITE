import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { PreviewPageContent } from "@/components/PreviewPageContent";
import { NextIntlClientProvider } from "@/i18n/client";
import { AHD_HOST } from "@/lib/constants";
import { fetchPageBySlug } from "@/lib/utils";
import axios from "axios";
import enMessages from "../../../public/locales/en.json";
import svMessages from "../../../public/locales/sv.json";

const TENANT_API = AHD_HOST
type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function CmsPage({ params }: PageProps) {
  const { slug = [] } = await params;
  const pathName = slug.join("/");
  const locale = slug[0] === "sv" || slug[0] === "en" ? slug[0] : "en";
  const messages = locale === "sv" ? svMessages : enMessages;
  console.log("########################################", JSON.stringify(slug))


  console.log("FECTHING FROM SERVER", `${TENANT_API}/pagebypath/${pathName}`)

  // try{
  //    const cc = await axios.get(`${TENANT_API}/pagebypath/docs/${pathName}`);
  //    console.log(cc.data)
  // }catch(ex){
  //   console.log(ex)
  // }

  // fetch from server
  const pageJson: any = await fetchPageBySlug(pathName);
  const pageData: any = pageJson.page;

  return (
    <NextIntlClientProvider locale={locale} localizedText={messages}>
      <link rel="stylesheet" href="https://pagepilot.fabbuilder.com/pagePilotStyles.css" />
      
      <main className="min-h-screen bg-background text-foreground overflow-x-clip">
        <Header localeOverride={locale} />
        <PreviewPageContent
          initialPageData={pageData}
          slugPath={pathName}
          footer={<Footer localeOverride={locale} />}
        />
        {/* {JSON.stringify(pageData)} */}
      </main>
    </NextIntlClientProvider>
    )
  
  
  // <div className="flex items-start gap-10">
  //   <div className="flex-[4.5] pt-10">
  //    {JSON.stringify(pageData)}
  //   </div>
  //   {/* <Toc path={pathName} /> */}
  // </div>


}

export async function generateMetadata({ params }: PageProps) {
  const { slug = [] } = await params;
  console.log(" -------- generateMetadata -------- ");
  const pathName = slug.join("/");

    // fetch from server
  const pageJson: any = await fetchPageBySlug(pathName);
  const pageData: any = pageJson.page;

    return {
      title: pageData.title,
      description: pageData.title,
      openGraph: {
        title: pageData.metaTitle || pageData.title,
      }
    };

}

export async function generateStaticParams() {
  let pagesFromServer = [];
  console.log("--------------------------------------", `${TENANT_API}/page`)
  let pagesResponseFromServer;
  try {
    pagesResponseFromServer = await axios.get(
      `${TENANT_API}/page`, {
      params: {
        filter: {
        //   groups: ["docs"]
        },
        offset: 0,
        limit: 1000
      }
    }
    );
  } catch (ex) {
    // console.log("ERRRRRRROR", ex);
  }
  // console.log(pagesResponseFromServer?.data)
  if (pagesResponseFromServer?.data) {
    pagesFromServer = pagesResponseFromServer.data?.rows.map((p: any) => ({ ...p, href: p.slug }));
  }
  const allPages = [...pagesFromServer];

  console.log("RENDERIN CMS PAGES: " + allPages?.length);

  return allPages.map((item) => {
    const slug = item.href.split("/");
    console.log(slug);
    return {
      slug
    }
  });
}