import { useNavigate } from "@tanstack/react-router";

import { languages, type Language } from "@/i18n";
import { setStoredLanguage } from "@/i18n/languageStorage";
import { useTranslation } from "@/i18n/useTranslation";

interface LangSelectorProps {
  className?: string;
  /** Called after a language is picked, so the mobile menu can close itself. */
  onSelect?: () => void;
}

const LABELS: Record<Language, string> = {
  en: "English",
  hu: "Magyar",
};

const LangSelector = ({ className = "", onSelect }: LangSelectorProps) => {
  const navigate = useNavigate();
  const { lang } = useTranslation();

  const changeLanguage = (newLang: Language) => {
    if (newLang === lang) {
      onSelect?.();
      return;
    }

    setStoredLanguage(newLang);
    // Stay on the current page and only swap the lang query param.
    navigate({
      to: ".",
      search: (prev) => ({ ...prev, lang: newLang }),
    });
    onSelect?.();
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {languages.map((language) => (
        <button
          key={language}
          type="button"
          onClick={() => changeLanguage(language)}
          aria-current={lang === language ? "true" : undefined}
          className={`rounded px-1 hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand dark:focus-visible:ring-brand-dark-accent ${
            lang === language
              ? "font-semibold text-brand dark:text-brand-dark-accent"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          {LABELS[language]}
        </button>
      ))}
    </div>
  );
};

export default LangSelector;
