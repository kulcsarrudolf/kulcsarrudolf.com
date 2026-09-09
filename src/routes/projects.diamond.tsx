import { createFileRoute, redirect } from "@tanstack/react-router";

// /projects/diamond was a placeholder page that has been removed. Send
// anything that already crawled it to the projects list instead of a 404.
export const Route = createFileRoute("/projects/diamond")({
  beforeLoad: () => {
    throw redirect({ to: "/projects", statusCode: 301 });
  },
});
