import { useState, FormEvent } from "react";
import { useTranslation } from "@/i18n/useTranslation";

export function useContactForm() {
  const { t } = useTranslation();
  const [result, setResult] = useState<string | React.ReactNode>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResult(t("contact.form.sending"));

    const formData = new FormData(event.currentTarget);
    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

    if (!accessKey) {
      setResult(t("contact.form.error"));
      setIsSubmitting(false);
      return;
    }

    formData.append("access_key", accessKey);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        setResult(t("contact.form.error"));
        setIsSubmitting(false);
        return;
      }

      const data = await response.json();

      if (data.success) {
        setResult(t("contact.form.success"));
        event.currentTarget.reset();
      } else {
        setResult(t("contact.form.error"));
      }
    } catch (error) {
      setResult(t("contact.form.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    result,
    isSubmitting,
    onSubmit,
    t,
  };
}
