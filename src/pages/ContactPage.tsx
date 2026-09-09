import ContactCallout from "@/features/contact/ContactCallout";
import ContactForm from "@/features/contact/ContactForm";
import Divider from "@/components/ui/Divider";
import { Link, Paragraph, Title } from "@/components/ui/typography";
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
