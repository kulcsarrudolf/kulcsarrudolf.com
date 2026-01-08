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

    // Store form reference before async operations
    const form = event.currentTarget;
    const formData = new FormData(form);

    // Normalize website URL if provided (add https:// if protocol is missing)
    const website = formData.get("website") as string;
    if (website && website.trim()) {
      const trimmedWebsite = website.trim();
      // Check if it already has a protocol
      if (!trimmedWebsite.match(/^https?:\/\//i)) {
        // Add https:// if it looks like a domain
        if (trimmedWebsite.includes(".") || trimmedWebsite.includes("/")) {
          formData.set("website", `https://${trimmedWebsite}`);
        }
      }
    }

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
        form.reset();
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
