import { Suspense } from "react";
import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: QUOTES_TITLE,
  description: QUOTES_DESCRIPTION,
  keywords: QUOTES_KEYWORDS,
  alternates: {
    canonical: "/quotes",
  },
  openGraph: {
    type: "website",
    url: "https://kulcsarrudolf.com/quotes",
    title: `${QUOTES_TITLE} | Kulcsar Rudolf`,
    description: QUOTES_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${QUOTES_TITLE} | Kulcsar Rudolf`,
    description: QUOTES_DESCRIPTION,
  },
};

const Quotes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuotesPage />
    </Suspense>
  );
};

export default Quotes;
