import { expect, it } from "vitest";

import { SITE_URL } from "@/config/site";

import { getPostMetadata, getProjectMetadata } from "./content";
import { buildLlmsTxt } from "./llms";

it("links every visible post and project to its markdown twin", () => {
  const text = buildLlmsTxt();

  for (const post of getPostMetadata()) {
    expect(text).toContain(`](${SITE_URL}/posts/${post.slug}.md)`);
  }
  for (const project of getProjectMetadata()) {
    expect(text).toContain(`](${SITE_URL}/projects/${project.slug}.md)`);
  }
});

it("has the sections an agent expects", () => {
  const text = buildLlmsTxt();

  expect(text.startsWith("# ")).toBe(true);
  expect(text).toContain("\n## Blog\n");
  expect(text).toContain("\n## Projects\n");
  expect(text).toContain("\n## Pages\n");
  expect(text).toContain("\n## Social\n");
});
