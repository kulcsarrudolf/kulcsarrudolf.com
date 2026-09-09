import { createFileRoute } from "@tanstack/react-router";

import { pageHead } from "@/lib/seo";
import HomePageContent from "@/pages/HomePage";
import { fetchPosts } from "@/server/functions";

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
  "ai agents",
  "personal website",
];

export const Route = createFileRoute("/")({
  loader: () => fetchPosts(),
  head: () =>
    pageHead({
      title: HOME_TITLE,
      absoluteTitle: true,
      description: HOME_DESCRIPTION,
      keywords: HOME_KEYWORDS,
      path: "/",
    }),
  component: Home,
});

function Home() {
  const posts = Route.useLoaderData();
  return <HomePageContent posts={posts} />;
}
