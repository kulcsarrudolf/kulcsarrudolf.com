import { Title, Paragraph } from "@/components/general/typography";
import { getMyAge } from "@/utils/getMyAge";

const AboutMe = () => {
  const myAge = getMyAge();

  return (
    <>
      <Title>About Me</Title>
      <Paragraph>
        I am a {myAge} year-old software developer living in Cluj-Napoca. Since
        I remember of my first experience, I have been a big fan of technology,
        and I try to keep up with all the news of its. The most groundbreaking
        experience of my life with coding was when I was 12 years old. I got my
        first professional full-time job as a software developer in 2017.
      </Paragraph>
      <Paragraph>
        I have constantly been trying to improve my skills and I don’t hesitate
        when I realize that there is still a lot to learn, so I am always open
        to new challenges.
      </Paragraph>
      <Paragraph>
        Besides my profession I also love to relax and recharge my batteries
        with my friends and family and of course by doing my favourite hobbies.
      </Paragraph>
    </>
  );
};

export default AboutMe;
