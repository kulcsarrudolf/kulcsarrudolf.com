import type { Quote } from "@/types/quote";
import quotes from "@/content/quotes";

const getRandomQuote = (): Quote => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
};

export default getRandomQuote;
