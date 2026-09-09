import { Paragraph, Title } from "@/components/general/typography";
import QuoteCard from "@/components/quote/QuoteCard";
import quotes from "@/components/quote/quotes";
import { useTranslation } from "@/i18n/useTranslation";
import type Quote from "@/types/quote.type";

export default function QuotesPage() {
  const { t } = useTranslation();

  return (
    <>
      <Title>{t("quotes.title")}</Title>
      <Paragraph>{t("quotes.description")}</Paragraph>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quotes.map((quote: Quote) => (
          <QuoteCard
            key={quote.id}
            quote={quote}
            size="md"
            interactive
            className="mb-4"
          />
        ))}
      </div>
    </>
  );
}
