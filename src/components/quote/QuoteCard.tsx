import type QuoteType from "@/types/quote.type";

/**
 * `lg` is the single quote on the home page and in the welcome dialog; `md` is
 * a card in the two-column grid on /quotes, where the type steps down so a
 * long quote still fits the column.
 */
type QuoteSize = "md" | "lg";

const SIZES: Record<QuoteSize, { quote: string; lineHeight: string; author: string }> = {
  md: { quote: "text-lg mb-4", lineHeight: "1.75rem", author: "text-base" },
  lg: { quote: "text-xl mb-5", lineHeight: "2rem", author: "text-lg" },
};

interface QuoteCardProps {
  quote: QuoteType;
  size?: QuoteSize;
  /** Centres the quote and its attribution. */
  centered?: boolean;
  /** Lifts the card on hover. */
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
}

/** A quotation and its author in a bordered card. */
const QuoteCard = ({
  quote,
  size = "lg",
  centered = false,
  interactive = false,
  onClick,
  className = "",
}: QuoteCardProps) => {
  const style = SIZES[size];

  return (
    <div
      className={`border border-gray-300 p-6 rounded-xl shadow-md ${
        centered ? "text-center" : ""
      } ${interactive ? "hover:shadow-lg transition-shadow" : ""} ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      onClick={onClick}
    >
      <p
        className={`font-normal leading-relaxed ${style.quote}`}
        style={{ lineHeight: style.lineHeight }}
      >
        &ldquo;{quote.quote}&rdquo;
      </p>
      <p
        className={`text-brand-active font-semibold tracking-wide ${style.author}`}
      >
        &mdash; {quote.author}
      </p>
    </div>
  );
};

export default QuoteCard;
