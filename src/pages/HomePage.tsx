import { Link, Paragraph, Title } from "@/components/ui/typography";
import { useTranslation } from "@/i18n/useTranslation";
import BlogPostList from "@/features/blog/BlogPostList";
import SectionStack from "@/components/ui/SectionStack";
import type { BlogPost } from "@/types/blog-post";
import CurrentFocus from "@/features/home/current-focus/CurrentFocus";
import LetsTalk from "@/features/home/lets-talk/LetsTalk";
import TerminalIntro from "@/features/home/terminal-intro/TerminalIntro";

interface HomePageContentProps {
  posts: BlogPost[];
}

// Static links are plain elements: the translation helper clones them into
// the sentence, so nothing here needs to be a component.
const cvLink = <Link href="https://cv.kulcsarrudolf.com">CV</Link>;
const gitHubLink = <Link href="https://github.com/kulcsarrudolf">GitHub</Link>;
const innovatorSparkLink = <Link href="https://innovatorspark.com/">InnovatorSpark</Link>;

export default function HomePageContent({ posts }: HomePageContentProps) {
  const { t } = useTranslation();

  return (
    <SectionStack>
      <TerminalIntro />

      <div>
        <Title>{t("home.title")}</Title>
        <Paragraph>
          {t("home.paragraph1", {
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
      </div>

      {/* No rules between the sections: Let's Talk is a solid band of brand
          blue and separates itself, so a hairline against its edge only reads
          as a second, weaker border. SectionStack carries the rhythm. */}
      <LetsTalk />
      <CurrentFocus />
      <BlogPostList
        title={String(t("home.latestBlogs")) as string}
        posts={posts}
        noOfElements={3}
        compact
      />
    </SectionStack>
  );
}
