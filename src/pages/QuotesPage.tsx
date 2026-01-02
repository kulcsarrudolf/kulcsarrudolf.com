"use client";

import { Paragraph, Title } from "@/components/general/typography";
import quotes from "@/components/quote/quotes";
import Quote from "@/types/quote.type";
import { useTranslation } from "@/i18n/useTranslation";

export default function QuotesPage() {
  const { t } = useTranslation();

  return (
    <>
      <Title>{t("quotes.title")}</Title>
      <Paragraph>{t("quotes.description")}</Paragraph>
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
}
