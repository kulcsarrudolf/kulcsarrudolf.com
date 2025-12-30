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
      className="border border-gray-300 p-6 rounded-xl shadow-md mb-4 text-center cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => {
        window.location.href = "/quotes";
      }}
    >
      <p
        className="text-xl font-normal mb-5 leading-relaxed"
        style={{ lineHeight: "2rem" }}
      >
        &ldquo;{quote.quote}&rdquo;
      </p>
      <p className="text-[#3b64b8] font-semibold text-lg tracking-wide">
        — {quote.author}
      </p>
    </div>
  );
};

export default Quote;
