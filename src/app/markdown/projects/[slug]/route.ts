import {
  getProjectBySlug,
  getProjectContent,
  getProjectMetadata,
} from "@/utils/getProjectMetadata";
import { SITE_URL } from "@/config/site";

export const dynamic = "force-static";

export const generateStaticParams = () => {
  return getProjectMetadata().map((project) => ({ slug: project.slug }));
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Only slugs of published projects are served; this also rejects
  // private projects and any path-traversal attempts.
  const project = getProjectBySlug(slug);
  const file = getProjectContent(slug);

  if (!project || !file) {
    return new Response("Not found", { status: 404 });
  }

  // The fact lines are the point of this route: they turn a prose page
  // into something an agent can read without parsing the body.
  const facts = [
    `Canonical URL: ${SITE_URL}/projects/${slug}`,
    ...(project.github ? [`GitHub: ${project.github}`] : []),
    ...(project.npm ? [`npm: ${project.npm}`] : []),
    ...(project.website ? [`Website: ${project.website}`] : []),
    ...(project.tech?.length ? [`Tech: ${project.tech.join(", ")}`] : []),
    ...(project.date ? [`Published: ${project.date}`] : []),
  ];

  const body = [
    `# ${project.title}`,
    "",
    ...(project.subtitle ? [`> ${project.subtitle}`, ""] : []),
    ...facts,
    "",
    file.content.trim(),
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
