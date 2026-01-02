"use client";

import { type Language, defaultLanguage } from "./index";

const LANGUAGE_STORAGE_KEY = "kulcsarrudolf-language";

export function getStoredLanguage(): Language | null {
  if (typeof window === "undefined") {
    return null;
  }
  
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === "hu" || stored === "en") {
      return stored;
    }
  } catch (error) {
    // localStorage might not be available (e.g., in SSR)
    console.warn("Failed to read language from localStorage:", error);
  }
  
  return null;
}

export function setStoredLanguage(lang: Language): void {
  if (typeof window === "undefined") {
    return;
  }
  
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch (error) {
    console.warn("Failed to save language to localStorage:", error);
  }
}

export function getLanguage(): Language {
  const stored = getStoredLanguage();
  return stored || defaultLanguage;
}

