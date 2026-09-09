import { createFileRoute } from "@tanstack/react-router";

import { buildLlmsTxt } from "@/server/llms";
import { MARKDOWN_HEADERS } from "@/server/markdown";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: () => new Response(buildLlmsTxt(), { headers: MARKDOWN_HEADERS }),
    },
  },
});
