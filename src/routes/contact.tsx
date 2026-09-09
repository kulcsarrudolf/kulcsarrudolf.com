import { createFileRoute } from "@tanstack/react-router";

import { pageHead } from "@/lib/seo";
import ContactPage from "@/pages/ContactPage";

const CONTACT_TITLE = "Contact";
const CONTACT_DESCRIPTION =
  "Get in touch with Kulcsar Rudolf. Send a message through the contact form or connect on LinkedIn for collaboration, questions, or project inquiries.";
const CONTACT_KEYWORDS = [
  "contact Kulcsar Rudolf",
  "hire software developer",
  "full-stack developer contact",
  "linkedin",
  "collaboration",
  "software developer Cluj-Napoca",
];

export const Route = createFileRoute("/contact")({
  head: () =>
    pageHead({
      title: CONTACT_TITLE,
      description: CONTACT_DESCRIPTION,
      keywords: CONTACT_KEYWORDS,
      path: "/contact",
    }),
  component: ContactPage,
});
