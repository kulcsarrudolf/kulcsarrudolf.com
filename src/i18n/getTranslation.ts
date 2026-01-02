import { getTranslation, getLanguageFromString, type Language } from "./index";

export function getTranslationServer(searchParams?: { lang?: string | string[] }): {
  t: (key: string, params?: Record<string, string>) => string;
  lang: Language;
} {
  const langParam = searchParams?.lang;
  const langString = Array.isArray(langParam) ? langParam[0] : langParam;
  const lang = getLanguageFromString(langString);
  const translations = getTranslation(lang);

  const translate = (key: string, params?: Record<string, string>): string => {
    const keys = key.split(".");
    let value: any = translations;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        return key;
      }
    }

    if (typeof value !== "string") {
      return key;
    }

    if (!params) {
      return value;
    }

    // Replace simple placeholders
    let result = value;
    for (const [paramKey, paramValue] of Object.entries(params)) {
      result = result.replace(new RegExp(`\\{${paramKey}\\}`, "g"), paramValue);
      // Handle tags like {highlight}...{/highlight}
      result = result.replace(
        new RegExp(`\\{${paramKey}\\}(.*?)\\{/${paramKey}\\}`, "g"),
        paramValue
      );
    }

    return result;
  };

  return {
    t: translate,
    lang,
  };
}

