import NavbarElement from "@/types/navbar-element.type";
import SocialMediaLink from "@/types/social-media-link";
import {
  faLinkedin,
  faTwitter,
  faInstagram,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

const NAVBAR_ELEMENTS: NavbarElement[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "About Me",
    href: "/about-me",
  },
  {
    title: "Blog",
    href: "/blog",
  },
  {
    title: "Contact",
    href: "/contact",
  },
];

const SOCIAL_MEDIA: SocialMediaLink[] = [
  {
    title: "LinkedIn",
    href: "https://www.linkedin.com/in/kulcsarrudolf/",
    icon: faLinkedin,
  },
  {
    title: "Twitter",
    href: "https://twitter.com/kulcsar_rudolf",
    icon: faTwitter,
  },
  {
    title: "Instagram",
    href: "https://www.instagram.com/rudolf0k/",
    icon: faInstagram,
  },
  {
    title: "GitHub",
    href: "https://www.github.com/kulcsarrudolf",
    icon: faGithub,
  },
];

export { NAVBAR_ELEMENTS, SOCIAL_MEDIA };
