import { useState, type FormEvent } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import { CONTACT_SUBJECT, submitContact } from "@/lib/contact";

export function useContactForm() {
  const { t } = useTranslation();
  const [result, setResult] = useState<string | React.ReactNode>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResult(t("contact.form.sending"));

    // Store form reference before async operations
    const form = event.currentTarget;
    const formData = new FormData(form);
    const field = (name: string) => String(formData.get(name) ?? "");

    const sent = await submitContact({
      name: field("name"),
      email: field("email"),
      website: field("website"),
      message: field("message"),
      subject: CONTACT_SUBJECT,
    });

    setResult(t(sent ? "contact.form.success" : "contact.form.error"));
    if (sent) form.reset();
    setIsSubmitting(false);
  };

  return {
    result,
    isSubmitting,
    onSubmit,
    t,
  };
}
