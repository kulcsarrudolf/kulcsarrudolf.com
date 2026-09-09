import { useSearch } from "@tanstack/react-router";
import React, { useEffect, useMemo, useState } from "react";

import { getLanguageFromString, getTranslation, type Language } from "./index";
import { getStoredLanguage } from "./languageStorage";

const isLanguage = (value: unknown): value is Language =>
  value === "en" || value === "hu";

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

  const translate = (
    key: string,
    params?: Record<string, string | React.ReactNode>
  ): string | React.ReactNode[] => {
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

    // Replace placeholders with params
    const result: (string | React.ReactNode)[] = [];
    let i = 0;
    let elementIndex = 0;

    while (i < value.length) {
      const openTag = value.indexOf("{", i);
      if (openTag === -1) {
        const remaining = value.substring(i);
        if (remaining) result.push(remaining);
        break;
      }

      if (openTag > i) {
        result.push(value.substring(i, openTag));
      }

      const closeTag = value.indexOf("}", openTag);
      if (closeTag === -1) {
        result.push(value.substring(openTag));
        break;
      }

      const placeholder = value.substring(openTag + 1, closeTag);

      if (placeholder.startsWith("/")) {
        // Closing tag, skip
        i = closeTag + 1;
        continue;
      }

      // Check if it's a tag like {highlight}...{/highlight}
      const tagMatch = placeholder.match(/^(\w+)\//);
      if (tagMatch) {
        const tagName = tagMatch[1];
        const closingTagPattern = `{/${tagName}}`;
        const closingTagIndex = value.indexOf(closingTagPattern, closeTag);

        if (closingTagIndex !== -1) {
          const content = value.substring(closeTag + 1, closingTagIndex);
          const paramValue = params?.[tagName];

          if (paramValue !== undefined) {
            // Add key to React elements
            const elementWithKey = React.isValidElement(paramValue)
              ? React.cloneElement(paramValue, {
                  key: `translation-${elementIndex++}`,
                })
              : paramValue;
            result.push(elementWithKey);
          } else {
            result.push(content);
          }

          i = closingTagIndex + closingTagPattern.length;
        } else {
          i = closeTag + 1;
        }
      } else {
        // Simple placeholder
        const paramValue = params[placeholder];
        if (paramValue !== undefined) {
          // Add key to React elements
          const elementWithKey = React.isValidElement(paramValue)
            ? React.cloneElement(paramValue, {
                key: `translation-${elementIndex++}`,
              })
            : paramValue;
          result.push(elementWithKey);
        } else {
          result.push(`{${placeholder}}`);
        }
        i = closeTag + 1;
      }
    }

    // Add keys to string elements in arrays that will be rendered as children
    if (result.length > 1) {
      return result.map((item, idx) => {
        if (typeof item === "string") {
          return item;
        }
        if (React.isValidElement(item) && !item.key) {
          return React.cloneElement(item, { key: `translation-${idx}` });
        }
        return item;
      });
    }

    return result.length === 1 && typeof result[0] === "string"
      ? result[0]
      : result;
  };

  return {
    t: translate,
    lang,
  };
}
