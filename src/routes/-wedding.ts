import { getNrContent, getNrLanguage } from "@/features/wedding/translations";
import { pageHead } from "@/lib/seo";

// The wedding countdown lives at /nr and is also reachable under a few
// friendlier aliases. Each alias route reuses this head so the URL the visitor
// typed stays in the address bar while rendering the same page. The leading
// dash keeps this file out of the generated route tree.

export const weddingHead = ({ match }: { match: { search: { lang?: string } } }) => {
  const content = getNrContent(getNrLanguage(match.search.lang));

  return pageHead({
    title: content.names,
    absoluteTitle: true,
    description: `${content.names} · ${content.subtitle} · ${content.date}`,
    path: "/nr",
    noindex: true,
  });
};
