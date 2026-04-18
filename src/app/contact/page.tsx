import { Suspense } from "react";
import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: CONTACT_TITLE,
  description: CONTACT_DESCRIPTION,
  keywords: CONTACT_KEYWORDS,
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    type: "website",
    url: "https://kulcsarrudolf.com/contact",
    title: `${CONTACT_TITLE} | Kulcsar Rudolf`,
    description: CONTACT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${CONTACT_TITLE} | Kulcsar Rudolf`,
    description: CONTACT_DESCRIPTION,
  },
};

const Contact = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContactPage />
    </Suspense>
  );
};

export default Contact;
