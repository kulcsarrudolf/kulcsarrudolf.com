import Link from "next/link";
import { getPostMetadata } from "@/components/getPostMetadata";

export default function Home() {
  const slugs = getPostMetadata();

  return (
    <div>
      <h1>Posts</h1>
      {slugs.map((slug) => (
        <div key={slug.title}>
          <Link href={`/posts/${slug.slug}`}>
            <p>{slug.title}</p>
          </Link>
        </div>
      ))}
    </div>
  );
}
