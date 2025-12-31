import BlogPostList from "@/components/blog/BlogPostList";
import Age from "@/components/general/Age";
import Paragraph from "@/components/general/typography/Paragraph";
import Title from "@/components/general/typography/Title";
import HighlightP from "@/components/general/typography/HighlightP";
import Link from "@/components/general/typography/Link";

const CVLink = () => <Link href="https://cv.kulcsarrudolf.com">CV</Link>;
const GitHubLink = () => (
  <Link href="https://github.com/kulcsarrudolf">GitHub</Link>
);

const ClujNapocaLink = () => (
  <Link href="https://en.wikipedia.org/wiki/Cluj-Napoca">Cluj-Napoca</Link>
);

export default function Home() {
  return (
    <div>
      <Title>About Me</Title>
      <Paragraph>
        I am a <Age />
        -year-old <HighlightP>full-stack software developer</HighlightP> living
        in <ClujNapocaLink />. I love to build software products. I have{" "}
        <HighlightP>over 8 years of experience in the industry</HighlightP>.
        Since I remember of my first experience, I have been a big fan of
        technology, and I try to keep up with all the news of its. The most
        groundbreaking experience of my life with coding was when I was 12 years
        old.
      </Paragraph>

      <Paragraph>
        I have constantly been trying to improve my skills and I don’t hesitate
        when I realize that there is still a lot to learn, so I am always open
        to new challenges. I can show my best skills, when I find a task that
        fires my interest up to a level where I will focus 100% on the task and
        recognize no time nor hungers.
      </Paragraph>

      <Paragraph>
        Check out my <GitHubLink /> to explore my latest projects and my{" "}
        <CVLink /> for a full breakdown of my professional journey.
      </Paragraph>

      <Paragraph>
        Besides my profession I also love to relax and recharge my batteries
        with my friends and family and of course by doing my favourite hobbies.
      </Paragraph>

      <hr className="my-4" />
      <BlogPostList title="Latest Blogs" noOfElements={3} compact />
    </div>
  );
}
