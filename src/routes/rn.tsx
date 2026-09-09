import { createFileRoute } from "@tanstack/react-router";

import { NrPage, nrHead } from "@/components/nr/nrRoute";

export const Route = createFileRoute("/rn")({
  head: nrHead,
  component: NrPage,
});
