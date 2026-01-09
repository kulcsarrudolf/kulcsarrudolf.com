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
  const { t, lang } = useTranslation();

  const CVLink = () => <Link href="https://cv.kulcsarrudolf.com">CV</Link>;
  const GitHubLink = () => (
    <Link href="https://github.com/kulcsarrudolf">GitHub</Link>
  );

  const ClujNapocaLink = () => (
    <Link href="https://en.wikipedia.org/wiki/Cluj-Napoca">
      {t("home.clujNapoca")}
    </Link>
  );

  const FullStackDeveloper = () => {
    return lang === "hu" ? (
      " "
    ) : (
      <HighlightP>full-stack software developer</HighlightP>
    );
  };

  const Experience = () => {
    return lang === "hu" ? (
      <HighlightP> 8 éve dolgozom software fejlesztőként</HighlightP>
    ) : (
      <HighlightP>over 8 years of experience in the industry</HighlightP>
    );
  };

  return (
    <div>
      <Title>{t("home.title")}</Title>
      <Paragraph>
        {t("home.paragraph1", {
          age: <Age />,
          fullStackDeveloper: <FullStackDeveloper />,
          clujLink: <ClujNapocaLink />,
          experience: <Experience />,
        })}
      </Paragraph>

      <Paragraph>{t("home.paragraph2")}</Paragraph>

      <Paragraph>
        {t("home.paragraph3", {
          githubLink: <GitHubLink />,
          cvLink: <CVLink />,
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
