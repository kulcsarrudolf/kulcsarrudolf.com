import enTranslations from "./translations/en.json";
import huTranslations from "./translations/hu.json";

export type Language = "en" | "hu";

export const languages: Language[] = ["en", "hu"];

export const defaultLanguage: Language = "en";

export const translations = {
  en: enTranslations,
  hu: huTranslations,
};

export function getTranslation(lang: Language) {
  return translations[lang] || translations[defaultLanguage];
}

export function getLanguageFromQuery(searchParams: URLSearchParams | null): Language {
  if (!searchParams) {
    return defaultLanguage;
  }
  const lang = searchParams.get("lang");
  if (lang === "hu" || lang === "en") {
    return lang;
  }
  return defaultLanguage;
}

export function getLanguageFromString(lang: string | null | undefined): Language {
  if (lang === "hu" || lang === "en") {
    return lang;
  }
  return defaultLanguage;
}

