"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useTranslation } from "@/i18n/useTranslation";
import { languages, type Language } from "@/i18n";
import { setStoredLanguage } from "@/i18n/languageStorage";

const Footer = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { lang } = useTranslation();

  const changeLanguage = (newLang: Language) => {
    if (newLang === lang) return;

    setStoredLanguage(newLang);
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", newLang);
    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    router.push(newUrl);
  };

  return (
    <footer className="mt-8 pt-2 border-t border-gray-300">
      <div className="flex items-center justify-center gap-3 text-sm">
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
    </footer>
  );
};

export default Footer;
