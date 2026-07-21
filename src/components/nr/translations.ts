export type NrLanguage = "hu" | "ro" | "en";

export const NR_LANGUAGES: NrLanguage[] = ["hu", "ro", "en"];

export const NR_DEFAULT_LANGUAGE: NrLanguage = "hu";

export function getNrLanguage(lang: string | string[] | undefined): NrLanguage {
  const value = Array.isArray(lang) ? lang[0] : lang;
  if (value === "hu" || value === "ro" || value === "en") {
    return value;
  }
  return NR_DEFAULT_LANGUAGE;
}

interface NrContent {
  /** Used for the document title and the photo alt text. */
  names: string;
  subtitle: string;
  date: string;
  weddingDay: string;
  labels: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  quote: string;
  quoteReference: string;
}

export const nrTranslations: Record<NrLanguage, NrContent> = {
  hu: {
    names: "Rudolf és Nóra",
    subtitle: "menyegző",
    date: "2026. november 28. · 10:00",
    weddingDay: "Eljött a nagy nap! ♥",
    labels: {
      days: "nap",
      hours: "óra",
      minutes: "perc",
      seconds: "mp",
    },
    quote: "„Megtaláltam azt, akit szeret a lelkem.”",
    quoteReference: "Énekek éneke 3:4",
  },
  ro: {
    names: "Rudolf și Nóra",
    subtitle: "nuntă",
    date: "28 noiembrie 2026 · 10:00",
    weddingDay: "A sosit ziua cea mare! ♥",
    labels: {
      days: "zile",
      hours: "ore",
      minutes: "min",
      seconds: "sec",
    },
    quote: "„Am găsit pe cel ce-l iubește sufletul meu.”",
    quoteReference: "Cântarea Cântărilor 3:4",
  },
  en: {
    names: "Rudolf and Nóra",
    subtitle: "wedding",
    date: "November 28, 2026 · 10:00",
    weddingDay: "The big day is here! ♥",
    labels: {
      days: "days",
      hours: "hours",
      minutes: "min",
      seconds: "sec",
    },
    quote: "“I have found the one whom my soul loves.”",
    quoteReference: "Song of Songs 3:4",
  },
};

export function getNrContent(lang: NrLanguage): NrContent {
  return nrTranslations[lang];
}
