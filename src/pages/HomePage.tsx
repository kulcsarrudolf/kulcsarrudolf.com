"use client";

import Age from "@/components/general/Age";
import Paragraph from "@/components/general/typography/Paragraph";
import Title from "@/components/general/typography/Title";
import HighlightP from "@/components/general/typography/HighlightP";
import Link from "@/components/general/typography/Link";
import { useTranslation } from "@/i18n/useTranslation";
import BlogPostListClient from "@/components/blog/BlogPostListClient";
import BlogPost from "@/types/blog-post.type";
import CurrentFocus from "@/components/general/current-focus/CurrentFocus";

interface HomePageContentProps {
  posts: BlogPost[];
}

export default function HomePageContent({ posts }: HomePageContentProps) {
  const { t } = useTranslation();

  const CVLink = () => <Link href="https://cv.kulcsarrudolf.com">CV</Link>;
  const GitHubLink = () => (
    <Link href="https://github.com/kulcsarrudolf">GitHub</Link>
  );

  const ClujNapocaLink = () => (
    <Link href="https://en.wikipedia.org/wiki/Cluj-Napoca">
      {t("home.clujNapoca")}
    </Link>
  );

  return (
    <div>
      <Title>{t("home.title")}</Title>
      <Paragraph>
        {t("home.paragraph1_part1", { age: <Age /> })}{" "}
        <HighlightP>{t("home.paragraph1_part2")}</HighlightP>{" "}
        {t("home.paragraph1_part3", { clujLink: <ClujNapocaLink /> })}{" "}
        <HighlightP>{t("home.paragraph1_part4")}</HighlightP>
        {t("home.paragraph1_part5")}
      </Paragraph>

      <Paragraph>{t("home.paragraph2")}</Paragraph>

      <Paragraph>
        {t("home.paragraph3_part1", { githubLink: <GitHubLink /> })}{" "}
        {t("home.paragraph3_part2", { cvLink: <CVLink /> })}{" "}
        {t("home.paragraph3_part3")}
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
