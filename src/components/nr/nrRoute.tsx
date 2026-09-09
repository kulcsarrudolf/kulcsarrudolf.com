import { useSearch } from "@tanstack/react-router";

import { pageHead } from "@/lib/seo";

import WeddingCountdown from "./WeddingCountdown";
import { getNrContent, getNrLanguage } from "./translations";

// The wedding countdown lives at /nr and is also reachable under a few
// friendlier aliases. Each alias route file reuses these options so the URL
// the visitor typed stays in the address bar while rendering the same page.

export const nrHead = ({ match }: { match: { search: { lang?: string } } }) => {
  const content = getNrContent(getNrLanguage(match.search.lang));

  return pageHead({
    title: content.names,
    absoluteTitle: true,
    description: `${content.names} · ${content.subtitle} · ${content.date}`,
    path: "/nr",
    noindex: true,
  });
};

export function NrPage() {
  const lang = useSearch({ strict: false, select: (search) => search.lang });
  return <WeddingCountdown lang={getNrLanguage(lang)} />;
}
