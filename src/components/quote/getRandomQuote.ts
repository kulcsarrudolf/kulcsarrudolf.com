import Quote from "@/types/quote.type";
import quotes from "./quotes";

const getRandomQuote = (): Quote => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
};

export default getRandomQuote;
