import ContactCallout from "@/components/contact/ContactCallout";
import ContactForm from "@/components/contact/ContactForm";
import Divider from "@/components/general/Divider";
import { Paragraph, Title } from "@/components/general/typography";
import Link from "@/components/general/typography/Link";
import { useTranslation } from "@/i18n/useTranslation";

const linkedInLink = <Link href="https://www.linkedin.com/in/kulcsarrudolf">LinkedIn</Link>;

export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <>
      <Title>{t("contact.title")}</Title>
      <Paragraph>{t("contact.description")}</Paragraph>
      <ContactCallout>{t("contact.linkedinText", { linkedInLink })}</ContactCallout>
      <Divider label={t("contact.dividerText")} />
      <ContactForm />
    </>
  );
}
