import { createFileRoute } from "@tanstack/react-router";

import WeddingPage from "@/pages/WeddingPage";

import { weddingHead } from "./-wedding";

export const Route = createFileRoute("/nr")({
  head: weddingHead,
  component: WeddingPage,
});
