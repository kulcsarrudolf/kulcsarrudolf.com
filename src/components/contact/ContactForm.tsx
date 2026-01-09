"use client";

import { useContactForm } from "./useContactForm";

export default function ContactForm() {
  const { result, isSubmitting, onSubmit, t } = useContactForm();

  return (
    <form onSubmit={onSubmit} className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 md:items-stretch">
        <div className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("contact.form.name")}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder={t("contact.form.namePlaceholder") as string}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("contact.form.email")}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder={t("contact.form.emailPlaceholder") as string}
            />
          </div>

          <div>
            <label
              htmlFor="website"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("contact.form.website")}{" "}
              <span className="text-gray-500 font-normal">
                ({t("contact.form.websiteOptional")})
              </span>
            </label>
            <input
              type="text"
              id="website"
              name="website"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder={t("contact.form.websitePlaceholder") as string}
            />
          </div>
        </div>

        <div className="flex flex-col h-full">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("contact.form.message")}
          </label>
          <textarea
            id="message"
            name="message"
            required
            className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
            placeholder={t("contact.form.messagePlaceholder") as string}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full max-w-md mx-auto block bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isSubmitting ? t("contact.form.submitting") : t("contact.form.submit")}
      </button>

      {result && (
        <div
          className={`mt-4 p-4 rounded-lg text-center ${
            result === t("contact.form.success")
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {result}
        </div>
      )}
    </form>
  );
}
