import {
  AUTHOR_NAME,
  FEED_PATH,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  OG_SITE_IMAGE_PATH,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/config/site";

// Builds the per-page <head> entries. The root route declares the site-wide
// defaults (og:image, icons, robots, ...); the router de-duplicates meta tags
// by name/property, so anything returned here overrides the root value.

const titleTemplate = (title: string) => `${title} | Kulcsar Rudolf`;

const TWITTER_HANDLE = "@kulcsarrudolf";

/** A preview card under public/og/, always at the Open Graph size. */
export type PageImage = {
  path: string;
  alt: string;
};

const imageMeta = (image: PageImage): Array<Record<string, string>> => [
  { property: "og:image", content: `${SITE_URL}${image.path}` },
  { property: "og:image:width", content: String(OG_IMAGE_WIDTH) },
  { property: "og:image:height", content: String(OG_IMAGE_HEIGHT) },
  { property: "og:image:alt", content: image.alt },
  { name: "twitter:image", content: `${SITE_URL}${image.path}` },
  { name: "twitter:image:alt", content: image.alt },
];

type ArticleMeta = {
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
};

export type PageHeadOptions = {
  /** Page title. Suffixed with the site name unless `absoluteTitle` is set. */
  title: string;
  absoluteTitle?: boolean;
  description: string;
  keywords?: string[];
  /** Path used for the canonical URL and og:url, e.g. "/blog". */
  path: string;
  type?: "website" | "article";
  locale?: string;
  author?: string;
  article?: ArticleMeta;
  /** The page's own preview card. Without one, the site-wide card is shown. */
  image?: PageImage;
  /** Serialised as an application/ld+json script in the head. */
  structuredData?: object;
  noindex?: boolean;
};

export const pageHead = ({
  title,
  absoluteTitle = false,
  description,
  keywords,
  path,
  type = "website",
  locale,
  author,
  article,
  image,
  structuredData,
  noindex = false,
}: PageHeadOptions) => {
  const fullTitle = absoluteTitle ? title : titleTemplate(title);
  const url = `${SITE_URL}${path}`;

  const meta: Array<Record<string, string>> = [
    { title: fullTitle },
    { name: "description", content: description },
    ...(keywords?.length ? [{ name: "keywords", content: keywords.join(", ") }] : []),
    ...(author ? [{ name: "author", content: author }] : []),
    { property: "og:type", content: type },
    { property: "og:url", content: url },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    ...(locale ? [{ property: "og:locale", content: locale }] : []),
    ...(article?.publishedTime
      ? [{ property: "article:published_time", content: article.publishedTime }]
      : []),
    ...(article?.modifiedTime
      ? [{ property: "article:modified_time", content: article.modifiedTime }]
      : []),
    ...(article?.authors ?? []).map((name) => ({
      property: "article:author",
      content: name,
    })),
    ...(article?.tags ?? []).map((tag) => ({
      property: "article:tag",
      content: tag,
    })),
    ...(image ? imageMeta(image) : []),
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: description },
    { name: "twitter:creator", content: TWITTER_HANDLE },
    ...(noindex
      ? [
          { name: "robots", content: "noindex, nofollow" },
          { name: "googlebot", content: "noindex, nofollow" },
        ]
      : []),
  ];

  return {
    meta,
    links: [{ rel: "canonical", href: url }],
    scripts: structuredData
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify(structuredData),
          },
        ]
      : [],
  };
};

// Site-wide defaults, declared once on the root route.
export const siteHead = (stylesheetHref: string) => ({
  meta: [
    { charSet: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { title: SITE_NAME },
    { name: "description", content: SITE_DESCRIPTION },
    { name: "application-name", content: SITE_NAME },
    { name: "author", content: AUTHOR_NAME },
    { name: "creator", content: AUTHOR_NAME },
    { name: "publisher", content: AUTHOR_NAME },
    {
      name: "robots",
      content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    },
    {
      name: "googlebot",
      content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:locale", content: "en_US" },
    { property: "og:url", content: SITE_URL },
    { property: "og:title", content: SITE_NAME },
    { property: "og:description", content: SITE_DESCRIPTION },
    ...imageMeta({ path: OG_SITE_IMAGE_PATH, alt: AUTHOR_NAME }),
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: SITE_NAME },
    { name: "twitter:description", content: SITE_DESCRIPTION },
    { name: "twitter:creator", content: TWITTER_HANDLE },
  ],
  links: [
    { rel: "stylesheet", href: stylesheetHref },
    {
      rel: "alternate",
      type: "application/rss+xml",
      title: SITE_NAME,
      href: `${SITE_URL}${FEED_PATH}`,
    },
    {
      rel: "icon",
      href: "/favicon/favicon-16x16.png",
      sizes: "16x16",
      type: "image/png",
    },
    {
      rel: "icon",
      href: "/favicon/favicon-32x32.png",
      sizes: "32x32",
      type: "image/png",
    },
    {
      rel: "apple-touch-icon",
      href: "/favicon/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png",
    },
    {
      rel: "android-chrome-192x192",
      href: "/favicon/android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      rel: "android-chrome-512x512",
      href: "/favicon/android-chrome-512x512.png",
      sizes: "512x512",
      type: "image/png",
    },
    { rel: "manifest", href: "/favicon/site.webmanifest" },
  ],
});
