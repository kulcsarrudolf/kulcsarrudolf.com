"use client";

import { useEffect, useState } from "react";
import getRandomQuote from "./getRandomQuote";
import type Quote from "@/types/quote.type";
import { usePathname } from "next/navigation";

const Quote = () => {
  const [quote, setQuote] = useState<Quote | null>(null);

  const pathname = usePathname();

  useEffect(() => {
    const currentQuote = getRandomQuote();
    setQuote(currentQuote);
  }, []);

  if (!quote || pathname !== "/") {
    return null;
  }

  return (
    <div
      className="border border-black-500 p-4 rounded-xl shadow-md mb-4 text-center"
      onClick={() => {
        window.location.href = "/quotes";
      }}
    >
      <p className="text-xl font-medium	italic mb-4">{quote.quote}</p>
      <p className="text-[#3b64b8] font-bold">{quote.author}</p>
    </div>
  );
};

export default Quote;
