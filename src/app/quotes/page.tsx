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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quotes.map((quote: Quote) => (
          <div
            className="border border-black-500 p-3 rounded-l shadow-md mb-4"
            key={quote.id}
          >
            <p className="text-l font-medium mb-2">{quote.quote}</p>
            <p className="text-[#3b64b8] font-bold text-sm">{quote.author}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Quotes;
