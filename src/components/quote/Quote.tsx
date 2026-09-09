import { useEffect, useState } from "react";
import getRandomQuote from "./getRandomQuote";
import type QuoteType from "@/types/quote.type";
import { useLocation, useNavigate } from "@tanstack/react-router";

interface QuoteProps {
  quote?: QuoteType;
  clickable?: boolean;
  className?: string;
}

const Quote = ({ quote: propQuote, clickable = true, className = "" }: QuoteProps) => {
  const [quote, setQuote] = useState<QuoteType | null>(propQuote || null);
  const pathname = useLocation({ select: (location) => location.pathname });
  const navigate = useNavigate();

  useEffect(() => {
    if (!propQuote) {
      const currentQuote = getRandomQuote();
      setQuote(currentQuote);
    }
  }, [propQuote]);

  // Only apply homepage restriction when no quote prop is passed (original behavior)
  if (!quote || (!propQuote && pathname !== "/")) {
    return null;
  }

  const handleClick = () => {
    if (clickable) {
      navigate({ to: "/quotes" });
    }
  };

  return (
    <div
      className={`border border-gray-300 p-6 rounded-xl shadow-md text-center ${
        clickable ? "cursor-pointer hover:shadow-lg transition-shadow" : ""
      } ${className}`}
      onClick={handleClick}
    >
      <p
        className="text-xl font-normal mb-5 leading-relaxed"
        style={{ lineHeight: "2rem" }}
      >
        &ldquo;{quote.quote}&rdquo;
      </p>
      <p className="text-brand-active font-semibold text-lg tracking-wide">
        — {quote.author}
      </p>
    </div>
  );
};

export default Quote;
