import { useNavigate } from "@tanstack/react-router";

import { languages, type Language } from "@/i18n";
import { setStoredLanguage } from "@/i18n/languageStorage";
import { useTranslation } from "@/i18n/useTranslation";

const LangSelector = () => {
  const navigate = useNavigate();
  const { lang } = useTranslation();

  const changeLanguage = (newLang: Language) => {
    if (newLang === lang) return;

    setStoredLanguage(newLang);
    // Stay on the current page and only swap the lang query param.
    navigate({
      to: ".",
      search: (prev) => ({ ...prev, lang: newLang }),
    });
  };

  return (
    <div className="flex items-center gap-3">
      {languages.map((language) => (
        <span key={language}>
          <button
            onClick={() => changeLanguage(language)}
            className={`hover:underline ${
              lang === language
                ? "font-semibold text-blue-600"
                : "text-gray-600"
            }`}
          >
            {language === "en" ? "English" : "Magyar"}
          </button>
        </span>
      ))}
    </div>
  );
};

export default LangSelector;
