import Paragraph from "@/components/general/typography/Paragraph";
import Title from "@/components/general/typography/Title";
import Link from "@/components/general/typography/Link";
import { useTranslation } from "@/i18n/useTranslation";
import BlogPostListClient from "@/components/blog/BlogPostListClient";
import type BlogPost from "@/types/blog-post.type";
import CurrentFocus from "@/components/general/current-focus/CurrentFocus";

interface HomePageContentProps {
  posts: BlogPost[];
}

// Static links are plain elements: the translation helper clones them into
// the sentence, so nothing here needs to be a component.
const cvLink = <Link href="https://cv.kulcsarrudolf.com">CV</Link>;
const gitHubLink = <Link href="https://github.com/kulcsarrudolf">GitHub</Link>;
const innovatorSparkLink = (
  <Link href="https://innovatorspark.com/">InnovatorSpark</Link>
);

export default function HomePageContent({ posts }: HomePageContentProps) {
  const { t } = useTranslation();

  const clujLink = (
    <Link href="https://en.wikipedia.org/wiki/Cluj-Napoca">
      {t("home.clujNapoca")}
    </Link>
  );

  return (
    <div>
      <Title>{t("home.title")}</Title>
      <Paragraph>
        {t("home.paragraph1", {
          clujLink,
          innovatorSparkLink,
        })}
      </Paragraph>

      <Paragraph>{t("home.paragraph2")}</Paragraph>

      <Paragraph>
        {t("home.paragraph3", {
          githubLink: gitHubLink,
          cvLink,
        })}
      </Paragraph>

      <Paragraph>{t("home.paragraph4")}</Paragraph>

      <hr className="my-4" />
      <CurrentFocus />
      <hr className="my-4" />
      <BlogPostListClient
        title={String(t("home.latestBlogs")) as string}
        posts={posts}
        noOfElements={3}
        compact
      />
    </div>
  );
}
