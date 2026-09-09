import { createFileRoute } from "@tanstack/react-router";

import { buildSitemapXml } from "@/server/sitemap";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () =>
        new Response(buildSitemapXml(), {
          headers: { "Content-Type": "application/xml; charset=utf-8" },
        }),
    },
  },
});
