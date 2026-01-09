"use client";

import { Title, Paragraph } from "@/components/general/typography";
import Link from "@/components/general/typography/Link";
import { useTranslation } from "@/i18n/useTranslation";
import ContactForm from "@/components/contact/ContactForm";

export default function ContactPage() {
  const { t } = useTranslation();

  const LinkedInLink = () => (
    <Link href="https://www.linkedin.com/in/kulcsarrudolf">LinkedIn</Link>
  );

  return (
    <>
      <Title>{t("contact.title")}</Title>
      <Paragraph>{t("contact.description")}</Paragraph>
      <div className="text-center my-6">
        <p className="text-lg font-semibold text-gray-800">
          {t("contact.linkedinText", { linkedInLink: <LinkedInLink /> })}
        </p>
      </div>
      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-4 text-gray-500 text-sm">
          {t("contact.dividerText")}
        </span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>
      <ContactForm />
    </>
  );
}
