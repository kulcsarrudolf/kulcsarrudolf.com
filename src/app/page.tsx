import BlogPostList from "@/components/blog/BlogPostList";
import Paragraph from "@/components/general/typography/Paragraph";
import Title from "@/components/general/typography/Title";

export default function Home() {
  return (
    <div>
      <Title>Introduction</Title>
      <Paragraph>
        Welcome to my website. Please feel free to browse it through, I really
        hope you will find something useful.
      </Paragraph>
      <Paragraph>
        I have started to develop this page because web development is one of my
        hobbies and by working on this website I have the possibility to try,
        learn and experiment with new things.
      </Paragraph>
      <Paragraph>
        I’ve experienced many things during my professional career, so I decided
        to share some of my ideas and attempts hoping that some of them can be
        helpful for someone. I hope you will find them beneficial and
        interesting. If you consider that I can help you or if you have
        questions, don’t hesitate to contact me, I will try to answer as soon as
        possible.
      </Paragraph>
      <Paragraph>
        You can find the source code of this website on my GitHub profile. I
        tried to do my best in developing this website according to my current
        experiences and knowledge. But of course in the future, when I will
        learn better solutions for it, I will try to refactor it. If you have
        any suggestions, please share them with me, thank you in advance.
      </Paragraph>
      <hr className="my-4" />
      <BlogPostList title="Latest Blogs" noOfElements={3} compact />
    </div>
  );
}
