export const SITE_NAME = "Kulcsar Rudolf - Software Engineer";

export const SITE_URL = "https://kulcsarrudolf.com";

export const SITE_DESCRIPTION =
  "Personal website of Kulcsar Rudolf, a full-stack software engineer. Read articles about software development, explore side projects, and see the tools and ideas I work with every day.";

export const AUTHOR_NAME = "Kulcsar Rudolf";

export const SOCIAL_PROFILES = [
  "https://www.linkedin.com/in/kulcsarrudolf/",
  "https://x.com/kulcsar_rudolf",
  "https://www.instagram.com/rudolf0k/",
  "https://github.com/kulcsarrudolf",
];

// The social preview cards (og:image): one per post plus a site-wide default,
// rendered into public/og/ before every dev server start and build by
// scripts/preview-images.ts, at the 1.91:1 size every network scales from.
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_SITE_IMAGE_PATH = "/og/site.png";
export const postImagePath = (slug: string): string => `/og/posts/${slug}.png`;

// The RSS feed, served by src/routes/rss[.]xml.ts and announced in the <head>.
export const FEED_PATH = "/rss.xml";
