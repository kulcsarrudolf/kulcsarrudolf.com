import { Suspense } from "react";
import type { Metadata } from "next";
import DiamondPage from "@/pages/DiamondPage";

const DIAMOND_TITLE = "Diamond";
const DIAMOND_DESCRIPTION =
  "Diamond, a project by Kulcsar Rudolf.";
const DIAMOND_KEYWORDS = [
  "Kulcsar Rudolf projects",
  "diamond",
  "personal project",
];

export const metadata: Metadata = {
  title: DIAMOND_TITLE,
  description: DIAMOND_DESCRIPTION,
  keywords: DIAMOND_KEYWORDS,
  alternates: {
    canonical: "/projects/diamond",
  },
  openGraph: {
    type: "website",
    url: "https://kulcsarrudolf.com/projects/diamond",
    title: `${DIAMOND_TITLE} | Kulcsar Rudolf`,
    description: DIAMOND_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${DIAMOND_TITLE} | Kulcsar Rudolf`,
    description: DIAMOND_DESCRIPTION,
  },
};

const Diamond = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DiamondPage />
    </Suspense>
  );
};

export default Diamond;
