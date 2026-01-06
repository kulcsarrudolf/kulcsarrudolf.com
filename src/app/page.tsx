import { Suspense } from "react";
import { getPostMetadata } from "@/utils/getPostMetadata";
import HomePageContent from "@/pages/HomePage";

export default function Home() {
  const posts = getPostMetadata();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent posts={posts} />
    </Suspense>
  );
}
