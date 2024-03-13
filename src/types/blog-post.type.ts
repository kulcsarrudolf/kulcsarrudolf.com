export interface BlogPost {
  title: string;
  subtitle: string;
  date: string;
  author: string;
  slug: string;
  lang: "hu" | "en";
}

export default BlogPost;
