import { createFileRoute } from "@tanstack/react-router";

import { MARKDOWN_HEADERS, buildLlmsTxt } from "@/server/markdown";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: () => new Response(buildLlmsTxt(), { headers: MARKDOWN_HEADERS }),
    },
  },
});
