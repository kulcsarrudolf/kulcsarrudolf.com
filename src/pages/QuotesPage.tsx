import CardGrid from "@/components/general/CardGrid";
import { Paragraph, Title } from "@/components/general/typography";
import QuoteCard from "@/components/quote/QuoteCard";
import quotes from "@/content/quotes";
import { useTranslation } from "@/i18n/useTranslation";
import type { Quote } from "@/types/quote";

export default function QuotesPage() {
  const { t } = useTranslation();

  return (
    <>
      <Title>{t("quotes.title")}</Title>
      <Paragraph>{t("quotes.description")}</Paragraph>
      <CardGrid>
        {quotes.map((quote: Quote) => (
          <QuoteCard key={quote.id} quote={quote} size="md" interactive />
        ))}
      </CardGrid>
    </>
  );
}
