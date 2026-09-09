import CardGrid from "@/components/ui/CardGrid";
import { Paragraph, Title } from "@/components/ui/typography";
import QuoteCard from "@/features/quotes/QuoteCard";
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
