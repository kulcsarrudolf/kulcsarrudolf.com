import { Paragraph, Title } from "@/components/general/typography";
import quotes from "@/components/quote/quotes";
import Quote from "@/types/quote.type";

const Quotes = () => {
  return (
    <>
      <Title>Inspiring Thoughts</Title>
      <Paragraph>
        These quotes offer moments of clarity, encouragement, and perspective
        from voices that resonate. They serve as reminders to stay grounded,
        focused, and purposeful in everyday life.
      </Paragraph>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quotes.map((quote: Quote) => (
          <div
            className="border border-gray-300 p-6 rounded-xl shadow-md mb-4 hover:shadow-lg transition-shadow"
            key={quote.id}
          >
            <p
              className="text-lg font-normal mb-4 leading-relaxed"
              style={{ lineHeight: "1.75rem" }}
            >
              &ldquo;{quote.quote}&rdquo;
            </p>
            <p className="text-[#3b64b8] font-semibold text-base tracking-wide">
              — {quote.author}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Quotes;
