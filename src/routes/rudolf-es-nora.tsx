import { createFileRoute } from "@tanstack/react-router";

import { NrPage, nrHead } from "@/components/nr/nrRoute";

export const Route = createFileRoute("/rudolf-es-nora")({
  head: nrHead,
  component: NrPage,
});
