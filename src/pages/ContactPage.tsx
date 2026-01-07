"use client";

import { Title, Paragraph } from "@/components/general/typography";
import { useTranslation } from "@/i18n/useTranslation";
import ContactForm from "@/components/contact/ContactForm";

export default function ContactPage() {
  const { t } = useTranslation();
  const email = t("contact.email");

  return (
    <>
      <Title>{t("contact.title")}</Title>
      <Paragraph>
        {t("contact.description", { email: <span className="font-bold">{email}</span> })}
      </Paragraph>
      <ContactForm />
    </>
  );
}

