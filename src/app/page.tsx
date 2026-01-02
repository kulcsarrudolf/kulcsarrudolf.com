import { getPostMetadata } from "@/utils/getPostMetadata";
import HomePageContent from "@/pages/HomePage";

export default function Home() {
  const posts = getPostMetadata();

  return <HomePageContent posts={posts} />;
}
