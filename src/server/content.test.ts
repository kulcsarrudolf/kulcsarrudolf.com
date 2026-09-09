import { readdirSync } from "node:fs";

import { describe, expect, it, vi } from "vitest";

import {
  getPostContent,
  getPostMetadata,
  getProjectContent,
  getProjectMetadata,
  getRecentPosts,
} from "./content";

// Vitest runs with DEV=true, the same as the local dev server, so private
// content is visible unless a test stubs the flag.

const markdownSlugs = (dir: string): string[] =>
  readdirSync(dir)
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.replace(/\.md$/, ""))
    .sort();

describe("posts", () => {
  it("derives the slug from the file name and reads every top-level file", () => {
    const slugs = getPostMetadata()
      .map((post) => post.slug)
      .sort();

    expect(slugs).toEqual(markdownSlugs("src/content/posts"));
  });

  it("leaves the drafts folder out", () => {
    const slugs = getPostMetadata().map((post) => post.slug);

    for (const draft of markdownSlugs("src/content/posts/drafts")) {
      expect(slugs).not.toContain(draft);
    }
  });

  it("strips the body from the metadata and keeps it on the content", () => {
    const [first] = getPostMetadata();
    const full = getPostContent(first.slug);

    expect(first).not.toHaveProperty("content");
    expect(full?.content.length).toBeGreaterThan(0);
    expect(full?.title).toBe(first.title);
  });

  it("returns null for an unknown slug", () => {
    expect(getPostContent("does-not-exist")).toBeNull();
  });

  it("orders recent posts newest first and honours the limit", () => {
    const recent = getRecentPosts(3);

    expect(recent).toHaveLength(3);
    expect(recent[0].date >= recent[1].date).toBe(true);
    expect(recent[1].date >= recent[2].date).toBe(true);
  });

  it("hides private posts outside the dev server", () => {
    const privateSlugs = getPostMetadata()
      .filter((post) => post.private)
      .map((post) => post.slug);
    expect(privateSlugs.length).toBeGreaterThan(0);

    vi.stubEnv("DEV", false);

    const visible = getPostMetadata().map((post) => post.slug);
    for (const slug of privateSlugs) {
      expect(visible).not.toContain(slug);
      expect(getPostContent(slug)).toBeNull();
    }
  });
});

describe("projects", () => {
  it("derives the slug from the file name and reads every top-level file", () => {
    const slugs = getProjectMetadata()
      .map((project) => project.slug)
      .sort();

    expect(slugs).toEqual(markdownSlugs("src/content/projects"));
  });

  it("sorts by order, then newest first", () => {
    const projects = getProjectMetadata();

    for (let i = 1; i < projects.length; i++) {
      const previous = projects[i - 1];
      const current = projects[i];
      const inOrder =
        previous.order < current.order ||
        (previous.order === current.order && (previous.date ?? "") >= (current.date ?? ""));

      expect(inOrder, `${previous.slug} should come before ${current.slug}`).toBe(true);
    }
  });

  it("defaults the order and turns an empty date into undefined", () => {
    for (const project of getProjectMetadata()) {
      expect(typeof project.order).toBe("number");
      expect(project.date === undefined || project.date.length > 0).toBe(true);
    }
  });

  it("returns null for an unknown slug", () => {
    expect(getProjectContent("does-not-exist")).toBeNull();
  });
});
