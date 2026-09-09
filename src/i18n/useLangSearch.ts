import { useTranslation } from "./useTranslation";

/**
 * The `?lang` an internal router <Link> has to carry so the visitor's language
 * survives navigation. English is the default, so it is left off the URL
 * rather than spelled out.
 *
 * Spread the result into `search`: `<Link to="/contact" search={langSearch} />`.
 */
export function useLangSearch() {
  const { lang } = useTranslation();
  return { lang: lang !== "en" ? lang : undefined };
}

export default useLangSearch;
