import { createFileRoute } from "@tanstack/react-router";

import WeddingPage from "@/pages/WeddingPage";

import { weddingHead } from "./-wedding";

export const Route = createFileRoute("/rudolf-and-nora")({
  head: weddingHead,
  component: WeddingPage,
});
