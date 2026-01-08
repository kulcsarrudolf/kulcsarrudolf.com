"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useTranslation } from "@/i18n/useTranslation";
import { languages, type Language } from "@/i18n";
import { setStoredLanguage } from "@/i18n/languageStorage";

const LangSelector = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { lang } = useTranslation();

  const changeLanguage = (newLang: Language) => {
    if (newLang === lang) return;

    setStoredLanguage(newLang);
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("lang", newLang);
    const currentPath = pathname || "/";
    const newUrl = params.toString()
      ? `${currentPath}?${params.toString()}`
      : currentPath;
    router.push(newUrl);
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
