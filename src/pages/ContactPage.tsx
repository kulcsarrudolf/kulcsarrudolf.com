"use client";

import { Title, Paragraph } from "@/components/general/typography";
import { useTranslation } from "@/i18n/useTranslation";
import ContactForm from "@/components/contact/ContactForm";

export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <>
      <Title>{t("contact.title")}</Title>
      <Paragraph>{t("contact.description")}</Paragraph>
      <ContactForm />
    </>
  );
}
