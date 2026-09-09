import { config } from "@fortawesome/fontawesome-svg-core";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import Footer from "@/components/footer/Footer";
import ConditionalSpeedInsights from "@/components/general/SpeedInsights";
import Navbar from "@/components/navbar/Navbar";
import NotFound from "@/components/NotFound";
import {
  AUTHOR_NAME,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  SOCIAL_PROFILES,
} from "@/config/site";
import { siteHead } from "@/lib/seo";
import { fetchRecentPosts } from "@/server/functions";
import globalsCss from "@/styles/globals.css?url";

// The stylesheet already includes Font Awesome's CSS.
config.autoAddCss = false;

// Every page accepts `?lang=` (en/hu for the UI, plus ro on the wedding
// countdown), so the parameter is validated once here and inherited by all
// routes. Unknown values are kept as strings and narrowed where they are used.
type RootSearch = { lang?: string };

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: AUTHOR_NAME,
      url: SITE_URL,
      jobTitle: "Software Engineer",
      image: `${SITE_URL}/images/me-logo.png`,
      sameAs: SOCIAL_PROFILES,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#person` },
    },
  ],
};

export const Route = createRootRoute({
  validateSearch: (search: Record<string, unknown>): RootSearch =>
    typeof search.lang === "string" ? { lang: search.lang } : {},
  // The 404 page lists recent posts. Loaded once and kept for the session.
  loader: () => fetchRecentPosts({ data: 3 }),
  staleTime: Infinity,
  shouldReload: false,
  head: () => {
    const { meta, links } = siteHead(globalsCss);
    return {
      meta,
      links,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(structuredData),
        },
      ],
    };
  },
  shellComponent: RootDocument,
  component: Outlet,
  notFoundComponent: NotFoundPage,
});

function NotFoundPage() {
  const recentPosts = Route.useLoaderData();
  return <NotFound recentPosts={recentPosts} />;
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html suppressHydrationWarning lang="en" className="bg-surface p-2">
      <head>
        <HeadContent />
      </head>
      {/* Clears the fixed navbar: 20px of top margin plus its 80px bar. */}
      <body suppressHydrationWarning className="mt-28">
        <div className="mx-auto max-w-5xl">
          <Navbar />
          <div className="border border-gray-300 p-4 rounded-xl shadow-md">
            {children}
          </div>
        </div>
        <Footer />
        <ConditionalSpeedInsights />
        <Scripts />
      </body>
    </html>
  );
}
