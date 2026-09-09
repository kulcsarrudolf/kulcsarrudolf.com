import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";

import type QuoteType from "@/types/quote.type";

import getRandomQuote from "./getRandomQuote";
import QuoteCard from "./QuoteCard";

interface QuoteProps {
  quote?: QuoteType;
  clickable?: boolean;
  className?: string;
}

const Quote = ({
  quote: propQuote,
  clickable = true,
  className = "",
}: QuoteProps) => {
  const [quote, setQuote] = useState<QuoteType | null>(propQuote || null);
  const pathname = useLocation({ select: (location) => location.pathname });
  const navigate = useNavigate();

  useEffect(() => {
    if (!propQuote) {
      setQuote(getRandomQuote());
    }
  }, [propQuote]);

  // Only apply homepage restriction when no quote prop is passed (original behavior)
  if (!quote || (!propQuote && pathname !== "/")) {
    return null;
  }

  return (
    <QuoteCard
      quote={quote}
      centered
      interactive={clickable}
      onClick={clickable ? () => navigate({ to: "/quotes" }) : undefined}
      className={className}
    />
  );
};

export default Quote;
