import { createFileRoute } from "@tanstack/react-router";

import { NrPage, nrHead } from "@/components/nr/nrRoute";

export const Route = createFileRoute("/nr")({
  head: nrHead,
  component: NrPage,
});
