import { createFileRoute } from "@tanstack/react-router";

import { NrPage, nrHead } from "@/components/nr/nrRoute";

export const Route = createFileRoute("/rudolf-and-nora")({
  head: nrHead,
  component: NrPage,
});
