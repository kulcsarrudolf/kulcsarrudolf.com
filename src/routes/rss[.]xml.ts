import { createFileRoute } from "@tanstack/react-router";

import { buildRssXml } from "@/server/rss";

export const Route = createFileRoute("/rss.xml")({
  server: {
    handlers: {
      GET: () =>
        new Response(buildRssXml(), {
          headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
        }),
    },
  },
});
