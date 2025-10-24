import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Banner, Head, Search } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";
import { Analytics } from "@vercel/analytics/next";
import type { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  // Define your metadata here
  // For more information on metadata API, see: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
  title: {
    default: "Instructions",
    template: "%s | Instructions",
  },
};
const banner = (
  <Banner storageKey="some-key" dismissible={false}>
    WORK IN PROGRESS PAGE
  </Banner>
);
const navbar = (
  <Navbar
    logo={<b>Alexander Prechtel's Instructions</b>}
    // ... Your additional navbar options
    projectLink={"https://github.com/alexandernc0043/Nextra"}
  >
    <a
      href="https://docs.google.com/document/d/1ojjgZa6BVw2T2nQk-azxsbzoSEYKUilMcKHhWgWY9uo/edit?tab=t.0"
      target="_blank"
    >
      Agenda
    </a>
  </Navbar>
);
const footer = (
  <Footer>MIT {new Date().getFullYear()} © Alexander Prechtel.</Footer>
);

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      // Not required, but good for SEO
      lang="en"
      // Required to be set
      dir="ltr"
      // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
    >
      <Head
      // ... Your additional head options
      >
        <Analytics />
        {/* Your additional tags should be passed as `children` of `<Head>` element */}
      </Head>
      <body data-pagefind-body>
        <Layout
          banner={banner}
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/alexandernc0043/Nextra/tree/main"
          footer={footer}
          search={<Search placeholder={"Search Instructions"} />}
          // ... Your additional layout options
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
