import NavbarElement from "@/types/navbar-element.type";
import SocialMediaLink from "@/types/social-media-link";
import {
  faLinkedin,
  faXTwitter,
  faInstagram,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

const NAVBAR_ELEMENTS: NavbarElement[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Blog",
    href: "/blog",
  },
  {
    title: "Projects",
    href: "https://www.github.com/kulcsarrudolf",
    openInNewTab: true,
  },
  // {
  //   title: "Résumé",
  //   href: "https://cv.kulcsarrudolf.com",
  //   openInNewTab: true,
  // },
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
    title: "X",
    href: "https://x.com/kulcsar_rudolf",
    icon: faXTwitter,
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
