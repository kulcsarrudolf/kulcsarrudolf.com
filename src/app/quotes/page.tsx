import { Title, Paragraph } from "@/components/general/typography";
import quotes from "@/components/quote/quotes";
import Quote from "@/types/quote.type";

const Quotes = () => {
  return (
    <>
      <Title>My Favorite Quotes</Title>

      {quotes.map((quote: Quote) => (
        <div
          className="border border-black-500 p-4 rounded-xl shadow-md mb-4"
          key={quote.id}
        >
          <p className="text-xl font-medium	italic mb-4">{quote.quote}</p>
          <p className="text-[#3b64b8] font-bold">{quote.author}</p>
        </div>
      ))}
    </>
  );
};

export default Quotes;
