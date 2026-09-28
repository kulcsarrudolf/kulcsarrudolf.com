import { type UnitLabel } from "./countdown";

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
  /** The word between the two names, set on its own line under the photo. */
  and: string;
  subtitle: string;
  date: string;
  weddingDay: string;
  labels: {
    days: UnitLabel;
    hours: UnitLabel;
    minutes: UnitLabel;
    seconds: UnitLabel;
  };
  quote: string;
  quoteReference: string;
  /** The control that ends the loving atmosphere the terminal puts over the page. */
  stopAtmosphere: string;
}

export const nrTranslations: Record<NrLanguage, NrContent> = {
  hu: {
    names: "Rudolf és Nóra",
    and: "és",
    subtitle: "menyegző",
    date: "2026. november 28. · 13:00",
    weddingDay: "Eljött a nagy nap! ♥",
    labels: {
      days: { one: "nap", other: "nap" },
      hours: { one: "óra", other: "óra" },
      minutes: { one: "perc", other: "perc" },
      seconds: { one: "mp", other: "mp" },
    },
    quote: "„…ha szeretjük egymást, Isten lakik bennünk, és az ő szeretete lett teljessé bennünk.”",
    quoteReference: "1János 4:12",
    stopAtmosphere: "esc a leállításhoz",
  },
  ro: {
    names: "Rudolf și Nóra",
    and: "și",
    subtitle: "nuntă",
    date: "28 noiembrie 2026 · 13:00",
    weddingDay: "A sosit ziua cea mare! ♥",
    labels: {
      days: { one: "zi", other: "zile" },
      hours: { one: "oră", other: "ore" },
      minutes: { one: "min", other: "min" },
      seconds: { one: "sec", other: "sec" },
    },
    quote:
      "„…dacă ne iubim unii pe alții, Dumnezeu rămâne în noi și dragostea Lui a ajuns desăvârșită în noi.”",
    quoteReference: "1 Ioan 4:12",
    stopAtmosphere: "esc pentru oprire",
  },
  en: {
    names: "Rudolf and Nóra",
    and: "and",
    subtitle: "wedding",
    date: "November 28, 2026 · 1:00 PM",
    weddingDay: "The big day is here! ♥",
    labels: {
      days: { one: "day", other: "days" },
      hours: { one: "hour", other: "hours" },
      minutes: { one: "min", other: "min" },
      seconds: { one: "sec", other: "sec" },
    },
    quote:
      "“…if we love each other, God lives in us, and his love is brought to full expression in us.”",
    quoteReference: "1 John 4:12 (NLT)",
    stopAtmosphere: "esc to stop",
  },
};

export function getNrContent(lang: NrLanguage): NrContent {
  return nrTranslations[lang];
}
