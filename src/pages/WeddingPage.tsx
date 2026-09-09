import { useSearch } from "@tanstack/react-router";

import WeddingCountdown from "@/features/wedding/WeddingCountdown";
import { getNrLanguage } from "@/features/wedding/translations";

// The countdown has its own three-language copy (en, hu, ro), so it reads
// `?lang` directly instead of going through useTranslation().
export default function WeddingPage() {
  const lang = useSearch({ strict: false, select: (search) => search.lang });
  return <WeddingCountdown lang={getNrLanguage(lang)} />;
}
