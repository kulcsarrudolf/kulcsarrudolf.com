import { Suspense } from "react";
import type { Metadata } from "next";
import { getPostMetadata } from "@/utils/getPostMetadata";
import HomePageContent from "@/pages/HomePage";

const HOME_TITLE = "Kulcsar Rudolf - Software Developer";
const HOME_DESCRIPTION =
  "I'm Kulcsar Rudolf, a full-stack software developer based in Cluj-Napoca. I write about software engineering, AI agents, and side projects I ship on my own time.";
const HOME_KEYWORDS = [
  "Kulcsar Rudolf",
  "software developer",
  "full-stack developer",
  "web developer",
  "Cluj-Napoca developer",
  "react developer",
  "typescript developer",
  "nextjs developer",
  "ai agents",
  "personal website",
];

export const metadata: Metadata = {
  title: {
    absolute: HOME_TITLE,
  },
  description: HOME_DESCRIPTION,
  keywords: HOME_KEYWORDS,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://kulcsarrudolf.com/",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
};

export default function Home() {
  const posts = getPostMetadata();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent posts={posts} />
    </Suspense>
  );
}
