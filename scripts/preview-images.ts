// Writes the social preview cards into public/og/: one per post, and the
// site-wide default every other page falls back to. `yarn dev` and
// `yarn build` run it first, so the folder exists wherever the site is built
// and never has to be committed.

import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import matter from "gray-matter";

import { AUTHOR_NAME, OG_SITE_IMAGE_PATH, postImagePath } from "../src/config/site.ts";
import { slugFromPath, toPost } from "../src/server/frontmatter.ts";
import { type PreviewCard, renderPreviewCard } from "./preview-card.ts";

const POSTS_DIR = fileURLToPath(new URL("../src/content/posts/", import.meta.url));
const PUBLIC_DIR = fileURLToPath(new URL("../public", import.meta.url));

const SITE_CARD: PreviewCard = {
  title: AUTHOR_NAME,
  subtitle:
    "Full-stack software engineer. Articles about software development, side projects, and the tools and ideas I work with every day.",
  meta: "Blog and portfolio",
};

// Only the top level of the folder is published, so only that is drawn.
const readPostCards = async (): Promise<Array<{ path: string; card: PreviewCard }>> => {
  const names = (await readdir(POSTS_DIR)).filter((name) => name.endsWith(".md")).sort();

  return Promise.all(
    names.map(async (name) => {
      const { data } = matter(await readFile(`${POSTS_DIR}${name}`, "utf8"));
      const post = toPost(slugFromPath(name), data);

      return {
        path: postImagePath(post.slug),
        card: {
          title: post.title,
          subtitle: post.subtitle,
          meta: post.lang === "hu" ? `${post.date} · [HU]` : post.date,
        },
      };
    }),
  );
};

const writeCard = async (path: string, card: PreviewCard): Promise<void> => {
  const file = `${PUBLIC_DIR}${path}`;
  await mkdir(file.slice(0, file.lastIndexOf("/")), { recursive: true });
  await writeFile(file, await renderPreviewCard(card));
};

const cards = [{ path: OG_SITE_IMAGE_PATH, card: SITE_CARD }, ...(await readPostCards())];

for (const { path, card } of cards) {
  await writeCard(path, card);
}

console.log(`Rendered ${cards.length} preview cards into public/og/`);
