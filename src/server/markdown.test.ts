import { describe, expect, it } from "vitest";

import { SITE_URL } from "@/config/site";

import { getPostMetadata, getProjectMetadata } from "./content";
import { MARKDOWN_HEADERS, buildPostMarkdown, buildProjectMarkdown } from "./markdown";

describe("buildPostMarkdown", () => {
  it("starts with the title and names the canonical URL", () => {
    const [post] = getPostMetadata();
    const markdown = buildPostMarkdown(post.slug);

    expect(markdown?.startsWith(`# ${post.title}\n`)).toBe(true);
    expect(markdown).toContain(`Canonical URL: ${SITE_URL}/posts/${post.slug}`);
    expect(markdown).toContain(`By ${post.author}, published on ${post.date}.`);
  });

  it("returns null for an unknown slug", () => {
    expect(buildPostMarkdown("does-not-exist")).toBeNull();
  });
});

describe("buildProjectMarkdown", () => {
  it("lists the facts an agent needs before the body", () => {
    const project = getProjectMetadata().find((candidate) => candidate.github);
    expect(project).toBeDefined();

    const markdown = buildProjectMarkdown(project!.slug);

    expect(markdown?.startsWith(`# ${project!.title}\n`)).toBe(true);
    expect(markdown).toContain(`Canonical URL: ${SITE_URL}/projects/${project!.slug}`);
    expect(markdown).toContain(`GitHub: ${project!.github}`);
  });

  it("returns null for an unknown slug", () => {
    expect(buildProjectMarkdown("does-not-exist")).toBeNull();
  });
});

it("serves markdown as UTF-8 text", () => {
  expect(MARKDOWN_HEADERS["Content-Type"]).toBe("text/markdown; charset=utf-8");
});
