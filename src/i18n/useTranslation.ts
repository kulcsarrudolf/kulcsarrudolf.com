import { useSearch } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import { getLanguageFromString, getTranslation, type Language } from "./index";
import { type TranslationParams, interpolate } from "./interpolate";
import { getStoredLanguage } from "./languageStorage";

const isLanguage = (value: unknown): value is Language => value === "en" || value === "hu";

export function useTranslation() {
  const queryLang = useSearch({
    strict: false,
    select: (search) => search.lang,
  });

  // localStorage is only read after hydration so the server and the first
  // client render agree. Priority: query param > localStorage > default (en).
  const [storedLang, setStoredLang] = useState<Language | null>(null);

  useEffect(() => {
    setStoredLang(getStoredLanguage());
  }, []);

  const lang = useMemo<Language>(() => {
    if (isLanguage(queryLang)) {
      return queryLang;
    }

    return storedLang ?? getLanguageFromString(undefined);
  }, [queryLang, storedLang]);

  const t = getTranslation(lang);

  const translate = (key: string, params?: TranslationParams): string | ReactNode[] => {
    const keys = key.split(".");
    let value: any = t;

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

    return interpolate(value, params);
  };

  return {
    t: translate,
    lang,
  };
}
