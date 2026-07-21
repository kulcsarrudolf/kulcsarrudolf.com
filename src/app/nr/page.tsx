import type { Metadata } from "next";
import WeddingCountdown from "@/components/nr/WeddingCountdown";
import { getNrContent, getNrLanguage } from "@/components/nr/translations";

type SearchParams = Promise<{ lang?: string | string[] }>;

const NOINDEX = {
  index: false,
  follow: false,
} as const;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { lang } = await searchParams;
  const content = getNrContent(getNrLanguage(lang));

  return {
    title: content.names,
    robots: {
      ...NOINDEX,
      googleBot: NOINDEX,
    },
  };
}

const NrPage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { lang } = await searchParams;
  return <WeddingCountdown lang={getNrLanguage(lang)} />;
};

export default NrPage;
