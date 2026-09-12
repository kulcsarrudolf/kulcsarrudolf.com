import Button from "@/components/ui/Button";

import FormField, { FIELD_CONTROL } from "./FormField";
import { useContactForm } from "./useContactForm";

export default function ContactForm() {
  const { result, isSubmitting, onSubmit, t } = useContactForm();

  return (
    <form onSubmit={onSubmit} className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 md:items-stretch">
        <div className="space-y-6">
          <FormField
            id="name"
            label={t("contact.form.name")}
            required
            placeholder={t("contact.form.namePlaceholder") as string}
          />
          <FormField
            id="email"
            type="email"
            label={t("contact.form.email")}
            required
            placeholder={t("contact.form.emailPlaceholder") as string}
          />
          <FormField
            id="website"
            label={t("contact.form.website")}
            optionalNote={t("contact.form.websiteOptional")}
            placeholder={t("contact.form.websitePlaceholder") as string}
          />
        </div>

        <div className="flex flex-col h-full">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300"
          >
            {t("contact.form.message")}
          </label>
          <textarea
            id="message"
            name="message"
            required
            className={`${FIELD_CONTROL} flex-1 resize-none`}
            placeholder={t("contact.form.messagePlaceholder") as string}
          />
        </div>
      </div>

      {/* Button is inline-flex, so the centring lives on a wrapper rather than
          on a margin the button's own display would ignore. */}
      <div className="mx-auto w-full max-w-md">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full focus:outline-hidden focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-brand-dark-accent dark:focus:ring-offset-surface-dark"
        >
          {isSubmitting ? t("contact.form.submitting") : t("contact.form.submit")}
        </Button>
      </div>

      {result && (
        <div
          className={`mt-4 p-4 rounded-lg text-center ${
            result === t("contact.form.success")
              ? "bg-green-50 text-green-800 border border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-900"
              : "bg-red-50 text-red-800 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900"
          }`}
        >
          {result}
        </div>
      )}
    </form>
  );
}
