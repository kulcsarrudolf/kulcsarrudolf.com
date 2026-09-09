import { faGithub, faInstagram, faLinkedin, faXTwitter } from "@fortawesome/free-brands-svg-icons";

import type { NavbarElement } from "./types";
import type { SocialMediaLink } from "./types";

const NAVBAR_ELEMENTS: NavbarElement[] = [
  {
    labelKey: "nav.home",
    href: "/",
  },
  {
    labelKey: "nav.blog",
    href: "/blog",
    matchPrefixes: ["/posts"],
  },
  {
    labelKey: "nav.projects",
    href: "/projects",
  },
  // {
  //   labelKey: "nav.resume",
  //   href: "https://cv.kulcsarrudolf.com",
  //   openInNewTab: true,
  // },
  {
    labelKey: "nav.contact",
    href: "/contact",
    cta: true,
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
