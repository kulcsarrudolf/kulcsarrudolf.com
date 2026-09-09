import { createFileRoute } from "@tanstack/react-router";

import { pageHead } from "@/lib/seo";
import QuotesPage from "@/pages/QuotesPage";

const QUOTES_TITLE = "Quotes";
const QUOTES_DESCRIPTION =
  "A personal collection of quotes about software development, engineering, learning, and life, curated by Kulcsar Rudolf.";
const QUOTES_KEYWORDS = [
  "software development quotes",
  "programming quotes",
  "engineering quotes",
  "developer inspiration",
  "learning quotes",
  "Kulcsar Rudolf",
];

export const Route = createFileRoute("/quotes")({
  head: () =>
    pageHead({
      title: QUOTES_TITLE,
      description: QUOTES_DESCRIPTION,
      keywords: QUOTES_KEYWORDS,
      path: "/quotes",
    }),
  component: QuotesPage,
});
