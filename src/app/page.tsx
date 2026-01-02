import { getPostMetadata } from "@/utils/getPostMetadata";
import HomePageContent from "@/components/pages/HomePageContent";

export default function Home() {
  const posts = getPostMetadata();

  return <HomePageContent posts={posts} />;
}
